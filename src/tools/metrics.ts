/**
 * Tool: query_product_metrics
 *
 * Retrieves quantitative usage metrics for a product feature.
 *
 * Integration: Replace the mock implementation below with real queries to your
 * analytics platform (e.g. BigQuery, Amplitude, Mixpanel, internal data API).
 */

export interface MetricsParams {
  feature_name: string;
  metrics: Array<'dau' | 'task_completion' | 'feature_adoption' | 'error_rate' | 'retention'>;
  time_range: '7d' | '30d' | '90d';
}

export interface MetricValue {
  current: number;
  previous: number;
  change_pct: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
}

export interface MetricsResult {
  feature: string;
  time_range: string;
  data: Partial<Record<MetricsParams['metrics'][number], MetricValue>>;
  anomalies: string[];
  user_segments: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Mock implementation — swap this out for real data-warehouse queries
// ---------------------------------------------------------------------------
export async function queryProductMetrics(params: MetricsParams): Promise<MetricsResult> {
  const allMetrics: MetricsResult['data'] = {
    dau: {
      current: 3420,
      previous: 3800,
      change_pct: -10.0,
      trend: 'down',
      unit: 'users/day',
    },
    task_completion: {
      current: 62,
      previous: 70,
      change_pct: -11.4,
      trend: 'down',
      unit: '%',
    },
    feature_adoption: {
      current: 45,
      previous: 42,
      change_pct: 7.1,
      trend: 'up',
      unit: '%',
    },
    error_rate: {
      current: 3.2,
      previous: 1.8,
      change_pct: 77.8,
      trend: 'up',
      unit: '%',
    },
    retention: {
      current: 58,
      previous: 63,
      change_pct: -7.9,
      trend: 'down',
      unit: '% (D30)',
    },
  };

  const filtered: MetricsResult['data'] = {};
  for (const key of params.metrics) {
    if (allMetrics[key]) filtered[key] = allMetrics[key];
  }

  return {
    feature: params.feature_name,
    time_range: params.time_range,
    data: filtered,
    anomalies: [
      `Error rate spiked +77.8% vs prior period — statistically abnormal (z-score 3.2)`,
      `Task completion declined 11.4% — crossed the 65% warning threshold`,
      `DAU drop correlates with error rate increase (Pearson r = 0.87)`,
    ],
    user_segments: {
      power_users: 890,
      new_users: 1240,
      returning_users: 1290,
    },
  };
}

export const METRICS_TOOL_DEFINITION = {
  type: 'function' as const,
  function: {
    name: 'query_product_metrics',
    description:
      'Retrieve quantitative usage metrics (DAU, task completion, feature adoption, error rate, retention) for a product feature over a given time range.',
    parameters: {
      type: 'object',
      properties: {
        feature_name: {
          type: 'string',
          description: 'Name of the feature to analyze, e.g. "Agent View", "Code Suggestions".',
        },
        metrics: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['dau', 'task_completion', 'feature_adoption', 'error_rate', 'retention'],
          },
          description: 'Which metrics to retrieve.',
        },
        time_range: {
          type: 'string',
          enum: ['7d', '30d', '90d'],
          description: 'Lookback window for the analysis.',
        },
      },
      required: ['feature_name', 'metrics', 'time_range'],
    },
  },
};
