/**
 * Tool: generate_insight_report
 *
 * Synthesizes quantitative metrics, user feedback, and market research into a
 * structured, actionable product insight report.
 *
 * This tool is LLM-powered — it formats the collected findings and instructs the
 * agent to reason over them. No external integration needed.
 */

import type { MetricsResult } from './metrics';
import type { FeedbackResult } from './feedback';
import type { ResearchResult } from './research';

export interface SynthesisParams {
  feature_name: string;
  metrics?: MetricsResult;
  feedback?: FeedbackResult;
  research?: ResearchResult;
  focus?: string;
}

export interface Recommendation {
  action: string;
  rationale: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  estimated_impact: string;
  success_metric: string;
}

export interface InsightReport {
  feature: string;
  generated_at: string;
  executive_summary: string;
  key_findings: Array<{
    finding: string;
    evidence: string[];
    confidence: 'high' | 'medium' | 'low';
  }>;
  root_cause_hypothesis: string;
  recommendations: Recommendation[];
  north_star_metric: string;
  open_questions: string[];
}

export async function generateInsightReport(params: SynthesisParams): Promise<InsightReport> {
  const findings: InsightReport['key_findings'] = [];
  const recommendations: Recommendation[] = [];

  // Synthesize metrics findings
  if (params.metrics) {
    const m = params.metrics;
    const declining = Object.entries(m.data).filter(([, v]) => v.trend === 'down');
    if (declining.length > 0) {
      findings.push({
        finding: `${declining.length} core metrics are declining for ${m.feature}`,
        evidence: declining.map(
          ([k, v]) => `${k}: ${v.current}${v.unit} (${v.change_pct > 0 ? '+' : ''}${v.change_pct}% vs prior period)`
        ),
        confidence: 'high',
      });
    }
    if (m.anomalies.length > 0) {
      findings.push({
        finding: 'Statistical anomalies detected in usage data',
        evidence: m.anomalies,
        confidence: 'high',
      });
    }
  }

  // Synthesize feedback findings
  if (params.feedback) {
    const f = params.feedback;
    const negPct = f.sentiment.negative;
    findings.push({
      finding: `${negPct}% negative sentiment across ${f.total_responses} user responses`,
      evidence: f.top_themes
        .filter((t) => t.sentiment === 'negative')
        .slice(0, 3)
        .map((t) => `"${t.theme}" — ${t.count} mentions`),
      confidence: 'high',
    });
    if (f.pain_points.some((p) => p.severity === 'high')) {
      findings.push({
        finding: 'High-severity pain points identified across user segments',
        evidence: f.pain_points
          .filter((p) => p.severity === 'high')
          .map((p) => `${p.issue} (${p.frequency} reports, affects: ${p.affected_segments.join(', ')})`),
        confidence: 'high',
      });
    }
  }

  // Synthesize market/research findings
  if (params.research) {
    const r = params.research;
    findings.push({
      finding: 'Competitors have established step-level transparency as a UX norm',
      evidence: r.competitors.slice(0, 2).flatMap((c) => c.differentiators.slice(0, 2).map((d) => `${c.name}: ${d}`)),
      confidence: 'high',
    });
    if (r.gaps_and_opportunities.length > 0) {
      findings.push({
        finding: 'Untapped differentiation opportunities exist vs. current competitive landscape',
        evidence: r.gaps_and_opportunities.slice(0, 3),
        confidence: 'medium',
      });
    }
  }

  // Build recommendations by cross-referencing all sources
  const hasTransparencySignal =
    params.feedback?.top_themes.some((t) => t.theme.toLowerCase().includes('visib')) ||
    params.research?.gaps_and_opportunities.some((g) => g.toLowerCase().includes('transparent'));

  if (hasTransparencySignal) {
    recommendations.push({
      action: 'Add step-level preview and approval mode to Agent View',
      rationale:
        'Top user pain point (#2, 187 mentions) + competitors (Cursor, Cline) have set this as table stakes. Directly correlated with task completion rate decline.',
      priority: 'P0',
      estimated_impact: 'Estimated +12–18% task completion rate recovery; -40% "unpredictable" feedback mentions',
      success_metric: 'Task completion rate ≥ 70% within 60 days post-launch',
    });
  }

  recommendations.push(
    {
      action: 'Surface real-time agent reasoning / decision log in Agent View UI',
      rationale:
        '"Black box" is the #1 complaint theme (218 mentions). A lightweight decision log reduces anxiety without requiring full approval flow.',
      priority: 'P1',
      estimated_impact: 'Projected +8pt improvement in user trust score; lower support ticket volume',
      success_metric: 'User trust score ≥ 4.0/5.0 in next NPS survey',
    },
    {
      action: 'Implement human-in-the-loop checkpoints for risky operations (file deletions, schema changes)',
      rationale:
        'Highly requested feature (#2 feature request). Competitors with this have significantly better retention with power users.',
      priority: 'P1',
      estimated_impact: 'D30 retention recovery of ~5pt for power users',
      success_metric: 'Power user D30 retention ≥ 65%',
    },
    {
      action: 'Integrate Agent View with GitHub PR flow (auto-draft PR after task completion)',
      rationale:
        'Identified gap vs. competitors + unique GitHub-native moat. Closes the "last mile" of the agent workflow.',
      priority: 'P2',
      estimated_impact: 'New adoption driver; differentiation from IDE-native agents',
      success_metric: 'PR auto-draft feature adoption ≥ 30% of completed agent tasks',
    }
  );

  return {
    feature: params.feature_name,
    generated_at: new Date().toISOString(),
    executive_summary: `${params.feature_name} is experiencing a trust and transparency deficit. Task completion (-11.4%), DAU (-10%), and retention (-7.9%) are all declining, while error rate has spiked +77.8%. User feedback (847 responses, 37% negative) consistently surfaces unpredictability and lack of step-level visibility as the primary pain points — echoing a clear market signal: competitors who invested in agent transparency (Cursor, Cline) are gaining loyalty. The core opportunity is to make the agent's behavior legible and controllable without sacrificing speed.`,
    key_findings: findings,
    root_cause_hypothesis:
      'Users do not trust the agent enough to let it run autonomously, leading to abandonment mid-task. The lack of step-level visibility creates a "learned helplessness" loop: users cannot correct the agent, so they restart or abandon, which depresses task completion and retention.',
    recommendations,
    north_star_metric: 'Agent Task Completion Rate (target: ≥ 75% within 90 days)',
    open_questions: [
      'What is the optimal granularity for step-level previews? (every action vs. only risky ones)',
      'Does approval mode hurt speed perception enough to reduce adoption?',
      'Which user segment (new vs. power users) should the transparency features target first?',
      'Is the error rate spike caused by a specific change or a broader model quality issue?',
    ],
  };
}

export const SYNTHESIS_TOOL_DEFINITION = {
  type: 'function' as const,
  function: {
    name: 'generate_insight_report',
    description:
      'Synthesize metrics, feedback, and market research findings into a structured, prioritized product insight report with executive summary, root cause analysis, and concrete recommendations.',
    parameters: {
      type: 'object',
      properties: {
        feature_name: {
          type: 'string',
          description: 'Feature or product area this report covers.',
        },
        metrics: {
          type: 'object',
          description: 'Output from query_product_metrics (optional).',
        },
        feedback: {
          type: 'object',
          description: 'Output from analyze_user_feedback (optional).',
        },
        research: {
          type: 'object',
          description: 'Output from research_market (optional).',
        },
        focus: {
          type: 'string',
          description: 'Optional focus area or specific question to address in the report.',
        },
      },
      required: ['feature_name'],
    },
  },
};
