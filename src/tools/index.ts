/**
 * Tool registry — aggregates all skill definitions and implements the tool
 * execution dispatcher used by the agent loop.
 */

import { queryProductMetrics, METRICS_TOOL_DEFINITION } from './metrics';
import { analyzeUserFeedback, FEEDBACK_TOOL_DEFINITION } from './feedback';
import { researchMarket, RESEARCH_TOOL_DEFINITION } from './research';
import { generateInsightReport, SYNTHESIS_TOOL_DEFINITION } from './synthesis';

export type { MetricsParams, MetricsResult } from './metrics';
export type { FeedbackParams, FeedbackResult } from './feedback';
export type { ResearchParams, ResearchResult } from './research';
export type { SynthesisParams, InsightReport } from './synthesis';

/** OpenAI-compatible tool definitions sent to the LLM. */
export const TOOLS = [
  METRICS_TOOL_DEFINITION,
  FEEDBACK_TOOL_DEFINITION,
  RESEARCH_TOOL_DEFINITION,
  SYNTHESIS_TOOL_DEFINITION,
];

/**
 * Execute a tool call by name with parsed arguments.
 * Returns a JSON-serialisable result or an error object.
 */
export async function executeTool(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case 'query_product_metrics':
      return queryProductMetrics(args as unknown as Parameters<typeof queryProductMetrics>[0]);

    case 'analyze_user_feedback':
      return analyzeUserFeedback(args as unknown as Parameters<typeof analyzeUserFeedback>[0]);

    case 'research_market':
      return researchMarket(args as unknown as Parameters<typeof researchMarket>[0]);

    case 'generate_insight_report':
      return generateInsightReport(args as unknown as Parameters<typeof generateInsightReport>[0]);

    default:
      return { error: `Unknown tool: ${name}` };
  }
}
