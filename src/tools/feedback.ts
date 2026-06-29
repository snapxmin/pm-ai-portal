/**
 * Tool: analyze_user_feedback
 *
 * Processes and clusters qualitative user signals from multiple sources.
 *
 * Integration: Replace the mock below with calls to your feedback platform
 * (e.g. GitHub Issues API, Zendesk, Intercom, UserVoice, survey tools).
 */

export interface FeedbackParams {
  feature_name: string;
  sources: Array<'github_issues' | 'in_app_feedback' | 'user_surveys' | 'community'>;
  time_range: '7d' | '30d' | '90d';
}

export interface FeedbackTheme {
  theme: string;
  count: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  representative_quotes: string[];
}

export interface PainPoint {
  issue: string;
  frequency: number;
  severity: 'high' | 'medium' | 'low';
  affected_segments: string[];
}

export interface FeedbackResult {
  feature: string;
  time_range: string;
  total_responses: number;
  sources_breakdown: Record<string, number>;
  sentiment: { positive: number; neutral: number; negative: number };
  top_themes: FeedbackTheme[];
  pain_points: PainPoint[];
  feature_requests: string[];
}

// ---------------------------------------------------------------------------
// Mock implementation — swap this out for real NLP + feedback platform queries
// ---------------------------------------------------------------------------
export async function analyzeUserFeedback(params: FeedbackParams): Promise<FeedbackResult> {
  return {
    feature: params.feature_name,
    time_range: params.time_range,
    total_responses: 847,
    sources_breakdown: {
      github_issues: 312,
      in_app_feedback: 290,
      user_surveys: 145,
      community: 100,
    },
    sentiment: { positive: 28, neutral: 35, negative: 37 },
    top_themes: [
      {
        theme: 'Unpredictable agent behavior',
        count: 218,
        sentiment: 'negative',
        representative_quotes: [
          '"I never know what the agent will do next — it feels like a black box."',
          '"Sometimes it loops on the same step with no explanation."',
        ],
      },
      {
        theme: 'Lack of step-level visibility',
        count: 187,
        sentiment: 'negative',
        representative_quotes: [
          '"I want to see what the agent is doing at each step before it executes."',
          '"Need a pause/review mode before the agent commits changes."',
        ],
      },
      {
        theme: 'Fast task execution',
        count: 134,
        sentiment: 'positive',
        representative_quotes: [
          '"When it works, it saves me hours of boilerplate."',
          '"Love the speed — just wish I trusted it more."',
        ],
      },
      {
        theme: 'Difficult to interrupt or correct',
        count: 112,
        sentiment: 'negative',
        representative_quotes: [
          '"No way to steer it mid-task once it starts."',
          '"Had to restart from scratch when it went off-track."',
        ],
      },
      {
        theme: 'Context window / memory limitations',
        count: 89,
        sentiment: 'negative',
        representative_quotes: [
          '"Forgets earlier decisions in long tasks."',
          '"Loses context on files it already touched."',
        ],
      },
    ],
    pain_points: [
      {
        issue: 'No step-level transparency or preview before execution',
        frequency: 305,
        severity: 'high',
        affected_segments: ['new_users', 'power_users'],
      },
      {
        issue: 'Unable to intervene or redirect agent mid-task',
        frequency: 198,
        severity: 'high',
        affected_segments: ['power_users'],
      },
      {
        issue: 'Error messages are not actionable',
        frequency: 143,
        severity: 'medium',
        affected_segments: ['new_users'],
      },
    ],
    feature_requests: [
      'Step-by-step preview mode (approve before execute)',
      'Human-in-the-loop checkpoints for risky operations',
      'Agent decision log / explainability panel',
      'Ability to edit the agent\'s plan before it runs',
    ],
  };
}

export const FEEDBACK_TOOL_DEFINITION = {
  type: 'function' as const,
  function: {
    name: 'analyze_user_feedback',
    description:
      'Process and cluster qualitative user signals (GitHub Issues, in-app feedback, surveys, community posts) for a feature. Returns sentiment analysis, top themes, pain points, and feature requests.',
    parameters: {
      type: 'object',
      properties: {
        feature_name: {
          type: 'string',
          description: 'Name of the feature whose feedback to analyze.',
        },
        sources: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['github_issues', 'in_app_feedback', 'user_surveys', 'community'],
          },
          description: 'Feedback sources to include in the analysis.',
        },
        time_range: {
          type: 'string',
          enum: ['7d', '30d', '90d'],
          description: 'Lookback window.',
        },
      },
      required: ['feature_name', 'sources', 'time_range'],
    },
  },
};
