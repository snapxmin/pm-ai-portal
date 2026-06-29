/**
 * Agent loop — orchestrates tool calling and streaming for the PM Insight Agent.
 *
 * Flow:
 *   1. Non-streaming LLM call with tools to decide what to do
 *   2. Execute any tool calls and append results to the conversation
 *   3. Repeat until no more tool calls (max 6 rounds)
 *   4. Streaming LLM call to produce the final user-facing response
 */

import { SYSTEM_PROMPT } from './system-prompt';
import { TOOLS, executeTool } from './tools';

interface MessageBase {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
}

interface ToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

interface AssistantMessage extends MessageBase {
  role: 'assistant';
  tool_calls?: ToolCall[];
}

interface ToolResultMessage extends MessageBase {
  role: 'tool';
  tool_call_id: string;
}

type Message = MessageBase | AssistantMessage | ToolResultMessage;

const COPILOT_API_URL = 'https://api.githubcopilot.com/chat/completions';
const MAX_TOOL_ROUNDS = 6;

/** Main entry point: runs the full insight agent and streams the response. */
export async function runInsightAgent(
  userMessages: Message[],
  copilotToken: string,
  onChunk: (text: string) => void
): Promise<void> {
  const messages: Message[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...userMessages,
  ];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await callLLM(messages, copilotToken, { stream: false });
    if (!response.ok) {
      throw new Error(`Copilot API error ${response.status}: ${await response.text()}`);
    }

    const json = (await response.json()) as {
      choices: Array<{ message: AssistantMessage; finish_reason: string }>;
    };

    const assistantMsg = json.choices[0].message;
    messages.push(assistantMsg);

    if (!assistantMsg.tool_calls || assistantMsg.tool_calls.length === 0) {
      // No more tool calls — stream the final answer
      break;
    }

    // Execute all tool calls in this round
    for (const tc of assistantMsg.tool_calls) {
      let result: unknown;
      try {
        result = await executeTool(tc.function.name, JSON.parse(tc.function.arguments));
      } catch (err) {
        result = { error: err instanceof Error ? err.message : String(err) };
      }

      const toolMsg: ToolResultMessage = {
        role: 'tool',
        tool_call_id: tc.id,
        content: JSON.stringify(result),
      };
      messages.push(toolMsg);
    }
  }

  // Stream the final response to the caller
  await streamResponse(messages, copilotToken, onChunk);
}

/** Non-streaming or streaming fetch to the Copilot LLM proxy. */
function callLLM(
  messages: Message[],
  token: string,
  options: { stream: boolean }
) {
  return fetch(COPILOT_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      tools: options.stream ? undefined : TOOLS,
      tool_choice: options.stream ? undefined : 'auto',
      stream: options.stream,
    }),
  });
}

/** Reads an SSE stream from the Copilot API and forwards text chunks. */
async function streamResponse(
  messages: Message[],
  token: string,
  onChunk: (text: string) => void
): Promise<void> {
  const response = await callLLM(messages, token, { stream: true });
  if (!response.ok) {
    throw new Error(`Copilot streaming error ${response.status}: ${await response.text()}`);
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const chunk = parsed.choices?.[0]?.delta?.content;
        if (chunk) onChunk(chunk);
      } catch {
        // Ignore malformed SSE lines
      }
    }
  }
}
