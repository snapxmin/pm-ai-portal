/**
 * Entry point — Express HTTP server implementing the GitHub Copilot Extension protocol.
 *
 * Copilot Extensions communicate via Server-Sent Events (SSE) using the same
 * streaming format as the OpenAI Chat Completions API.
 *
 * Required environment variables:
 *   PORT          — HTTP port to listen on (default: 3000)
 *
 * Optional for production (signature verification):
 *   GITHUB_WEBHOOK_SECRET — GitHub App webhook secret for request validation
 *
 * GitHub App setup:
 *   1. Create a GitHub App at https://github.com/settings/apps/new
 *   2. Enable "Copilot" → "Copilot Chat" permission (read)
 *   3. Set the "Callback URL" to https://<your-host>/
 *   4. Install the app and set it as a Copilot Extension in your org settings
 */

import express, { Request, Response } from 'express';
import { createTextEvent, createDoneEvent, createErrorEvent } from './sse';
import { runInsightAgent } from './agent';

const app = express();
app.use(express.json());

/** Health check — used by load balancers and deployment platforms. */
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'pm-ai-portal' });
});

/**
 * Copilot Extension endpoint.
 *
 * GitHub sends all chat messages here as JSON with the same shape as an
 * OpenAI Chat Completions request. We respond with an SSE stream.
 *
 * TODO (production): Verify the GitHub webhook signature before processing.
 * Use the `@copilot-extensions/preview-sdk` package's `verifyAndParseRequest`
 * helper, or implement HMAC-SHA256 verification against GITHUB_WEBHOOK_SECRET.
 */
app.post('/', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx response buffering

  const copilotToken = req.headers['x-github-token'] as string | undefined;

  if (!copilotToken) {
    res.write(createErrorEvent('Missing x-github-token header. Ensure the GitHub App has Copilot Chat permission.'));
    res.write(createDoneEvent());
    res.end();
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages = (req.body as any)?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    res.write(createErrorEvent('Invalid request: messages array is required.'));
    res.write(createDoneEvent());
    res.end();
    return;
  }

  try {
    await runInsightAgent(messages, copilotToken, (chunk) => {
      res.write(createTextEvent(chunk));
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[pm-ai-portal] Agent error:', message);
    res.write(createErrorEvent(message));
  }

  res.write(createDoneEvent());
  res.end();
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`[pm-ai-portal] PM Insight Agent listening on port ${PORT}`);
  console.log(`[pm-ai-portal] Copilot Extension endpoint: POST http://localhost:${PORT}/`);
});
