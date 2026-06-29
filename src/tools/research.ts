/**
 * Tool: research_market
 *
 * Researches competitor products and market trends relevant to a feature area.
 *
 * Integration: Replace the mock below with real web-search or competitive
 * intelligence APIs (e.g. Perplexity, Tavily, internal market research DB).
 */

export interface ResearchParams {
  feature_name: string;
  competitors?: string[];
  focus_areas: Array<'features' | 'ux' | 'pricing' | 'positioning' | 'trends'>;
}

export interface CompetitorEntry {
  name: string;
  similar_features: string[];
  differentiators: string[];
  recent_updates: string[];
  user_sentiment: string;
}

export interface ResearchResult {
  feature: string;
  competitors: CompetitorEntry[];
  market_trends: string[];
  gaps_and_opportunities: string[];
  positioning_notes: string;
}

// ---------------------------------------------------------------------------
// Mock implementation — swap with real web search / competitive intel queries
// ---------------------------------------------------------------------------
export async function researchMarket(params: ResearchParams): Promise<ResearchResult> {
  return {
    feature: params.feature_name,
    competitors: [
      {
        name: 'Cursor (Agent Mode)',
        similar_features: [
          'Multi-file autonomous editing',
          'Inline diff preview before applying',
          'Agent task progress panel',
        ],
        differentiators: [
          'Step-by-step plan visible before execution',
          'User can edit the plan inline',
          'Checkpoints: auto-pause on file deletions or risky ops',
        ],
        recent_updates: [
          'v0.42: Added "Shadow Mode" — agent runs in dry-run before committing',
          'v0.41: Introduced per-step undo in the agent view',
        ],
        user_sentiment:
          'Highly praised for transparency and control; "I always know what Cursor is about to do"',
      },
      {
        name: 'Devin (Cognition AI)',
        similar_features: [
          'Full coding agent with planning',
          'Agent timeline showing executed steps',
          'Browser + terminal access',
        ],
        differentiators: [
          'Asynchronous task execution with Slack notifications',
          'Detailed execution log with screenshots',
          'Human escalation when stuck',
        ],
        recent_updates: [
          'Launched "Devin Sessions" — persistent agent memory across tasks',
          'Added PR auto-generation after task completion',
        ],
        user_sentiment: 'Praised for long-horizon tasks; criticized for being a black box mid-run',
      },
      {
        name: 'Cline (open-source)',
        similar_features: [
          'Step-by-step approval mode (every action needs confirmation)',
          'Real-time token usage display',
          'Diff view before applying each change',
        ],
        differentiators: [
          'Full transparency by default — user approves every file write',
          'Open source — customizable approval logic',
        ],
        recent_updates: [
          'Added "Auto-approve trusted operations" whitelist',
          'Improved diff visualization with context collapse',
        ],
        user_sentiment: 'Loved by power users for control; seen as too slow by casual users',
      },
    ],
    market_trends: [
      'Transparency & control are becoming a table-stakes expectation for AI coding agents',
      'Step-level preview (plan → approve → execute) is emerging as the dominant UX pattern',
      'Human-in-the-loop checkpoints are being adopted across all major agents',
      'Users want persistent agent memory across sessions',
      '"Explain your reasoning" features gaining traction (Copilot already has this in chat)',
    ],
    gaps_and_opportunities: [
      'No competitor offers real-time collaboration on an agent\'s live plan (co-pilot the agent)',
      'Opportunity: deep integration with PR review flow — agent creates PR draft after task',
      'Opportunity: Copilot\'s GitHub-native context (Issues, PRs, code graph) is a unique moat',
      'Gap: current Agent View lacks "risky operation" warnings before execution',
    ],
    positioning_notes:
      'Copilot Agent View\'s differentiator should be GitHub-native context depth (Issues, PRs, Actions, code graph) combined with trustworthy step-level transparency. Cursor wins on control UX today; Copilot can win on context richness.',
  };
}

export const RESEARCH_TOOL_DEFINITION = {
  type: 'function' as const,
  function: {
    name: 'research_market',
    description:
      'Research competitor products and market trends for a product feature area. Returns competitor analysis, recent updates, market trends, and positioning gaps.',
    parameters: {
      type: 'object',
      properties: {
        feature_name: {
          type: 'string',
          description: 'Feature or product area to research, e.g. "AI coding agent", "Agent View".',
        },
        competitors: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific competitors to include. Leave empty to use defaults.',
        },
        focus_areas: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['features', 'ux', 'pricing', 'positioning', 'trends'],
          },
          description: 'Aspects to focus the research on.',
        },
      },
      required: ['feature_name', 'focus_areas'],
    },
  },
};
