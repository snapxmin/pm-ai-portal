/**
 * Server-Sent Events helpers for the GitHub Copilot Extensions protocol.
 * Copilot Extensions use the same SSE streaming format as the OpenAI Chat API.
 */

let chunkId = 0;

/** Emits a text delta chunk in OpenAI streaming format. */
export function createTextEvent(text: string): string {
  const payload = {
    id: `chatcmpl-${++chunkId}`,
    object: 'chat.completion.chunk',
    choices: [
      {
        delta: { content: text },
        index: 0,
        finish_reason: null,
      },
    ],
  };
  return `data: ${JSON.stringify(payload)}\n\n`;
}

/** Emits the terminal [DONE] event. */
export function createDoneEvent(): string {
  return 'data: [DONE]\n\n';
}

/** Emits a structured error chunk that Copilot Chat will surface to the user. */
export function createErrorEvent(message: string): string {
  const payload = {
    id: `chatcmpl-${++chunkId}`,
    object: 'chat.completion.chunk',
    choices: [
      {
        delta: { content: `\n\n⚠️ **Error:** ${message}` },
        index: 0,
        finish_reason: 'stop',
      },
    ],
  };
  return `data: ${JSON.stringify(payload)}\n\n`;
}
