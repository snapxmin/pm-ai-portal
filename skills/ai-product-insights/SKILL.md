---
name: ai-product-insights
description: Use when designing, operating, or refining an AI + Agent product insight workflow for PM research, including user feedback aggregation, competitor monitoring, insight synthesis, opportunity discovery, hypothesis validation, and insight report generation.
---

# AI Product Insights

Use this skill to turn fragmented product signals into structured PM insight work. The goal is not to let AI replace product judgment; it is to compress the research loop of information collection, analysis, and early validation so product managers can focus on decisions, trade-offs, and strategy.

## When to Use

Use this skill when the user asks to:

- Build an AI insight agent, PM agent, research agent, or product intelligence workflow
- Aggregate and analyze user feedback from reviews, tickets, communities, or social media
- Monitor competitors and summarize product gaps or market movement
- Discover product opportunities from user pain points, trends, competitor capabilities, or technology changes
- Generate daily or weekly insight reports for PM, growth, CX, or leadership teams
- Evaluate feature priority with ICE, RICE, impact, revenue, or funnel signals
- Simulate users, user journeys, objections, or early feature hypotheses

## Core Principle

Treat AI + Agent as an automated product research system:

```text
Collect signals -> Structure signals -> Analyze patterns -> Validate hypotheses -> Support PM decisions
```

Always make the distinction explicit:

- AI is responsible for large-scale processing, pattern discovery, summarization, initial attribution, and structured recommendations.
- PMs remain responsible for business judgment, strategy, organizational trade-offs, and final product direction.

## Recommended MVP

Start with a narrow, high-value workflow instead of a large platform.

Recommended starting point:

```text
User feedback -> Automated insight daily report
```

Minimum flow:

1. Pull recent reviews, support tickets, in-product feedback, or community posts.
2. Classify feedback into categories such as feature, performance, pricing, usability, onboarding, reliability, and support.
3. Run sentiment analysis and cluster recurring themes.
4. Identify the top 5 pain points and compare them with the previous period.
5. Produce an insight report with trend changes, evidence, risks, and PM follow-up questions.

## System Architecture

Use a four-layer architecture when designing an implementation.

### 1. Data Layer

Agents collect raw signals from:

- App Store or marketplace reviews
- Social media and community sources such as Reddit, X, Xiaohongshu, Zhihu, Discord, Slack, or forums
- Customer support tickets and in-product feedback
- Competitor changelogs, release notes, pricing pages, landing pages, and public announcements
- Internal product analytics, funnel metrics, revenue data, and retention data

Required metadata:

- Source
- Timestamp
- User segment if available
- Product area or feature if available
- Raw text or event payload
- Link or traceable evidence

### 2. Understanding Layer

LLM-powered agents convert raw signals into structured data:

- Classifier Agent: topic, product area, sentiment, urgency, persona, and funnel stage
- Clustering Agent: repeated pain points, emerging themes, duplicate issues, and semantic groups
- Summarizer Agent: daily or weekly summaries with evidence and representative quotes
- Attribution Agent: separate surface complaint, behavior problem, and underlying need
- Trend Agent: compare today vs yesterday, this week vs last week, and current release vs previous release

### 3. Decision Support Layer

Agents support PM reasoning without making final decisions:

- Priority Scoring Agent: ICE, RICE, impact vs effort, or custom scoring
- Opportunity Discovery Agent: unmet needs, new scenarios, overlooked segments, and market gaps
- Risk Agent: false positives, high-frequency low-value complaints, vocal minority bias, data quality gaps, and strategic mismatch
- Experiment Agent: possible MVPs, A/B tests, concierge tests, surveys, or interviews

### 4. Output Layer

Choose outputs that match the decision context:

- Daily insight brief
- Weekly trend report
- Competitor radar
- User pain-point heatmap
- Feature gap list
- Opportunity backlog
- Hypothesis validation memo

## Insight Workflow

Follow this sequence for product insight tasks.

### Step 1: Define Scope

Clarify:

- Product type: ToC, ToB, SaaS, ecommerce, marketplace, developer tool, internal tool, or other
- Target user segment
- Business objective
- Time window
- Available data sources
- Decision the PM needs to make

If the user does not provide scope, state assumptions and keep the first version generic.

### Step 2: Collect Signals

Collect or design collection from multiple sources. Separate user feedback, behavioral data, competitor changes, and market or technology trends. Preserve traceability with links, timestamps, and representative examples.

### Step 3: Structure User Problems

Convert scattered feedback into layers:

```text
Surface complaint -> Behavior problem -> Underlying need -> Product implication
```

Example:

```text
"It is hard to use" -> user drops off during configuration -> reduce decision cost and increase certainty -> simplify setup and add guided defaults
```

### Step 4: Analyze Trends

Look for:

- Top pain points by frequency, sentiment, user value, and business impact
- Fastest-growing themes, not only largest themes
- Segment-specific issues
- Recent release regressions
- Competitor weaknesses that create openings
- Technology changes that enable new product behavior

### Step 5: Prioritize Carefully

Use scoring as a recommendation aid, not an answer.

Inputs may include:

- Feedback volume
- Number of affected users
- User segment value
- Funnel or retention impact
- Revenue impact
- Strategic fit
- Implementation complexity
- Confidence level

Output should include:

- Suggested ICE or RICE score
- Evidence behind the score
- Confidence level
- Risks and caveats
- Data needed before committing

### Step 6: Validate Hypotheses

Use virtual user simulation for early reasoning, then recommend real validation where risk is high.

Useful simulated roles:

- New user
- Power user
- Churned user
- Price-sensitive user
- Admin or buyer
- Frontline operator

Validation outputs:

- Likely comprehension issues
- Expected friction points
- Objections by persona
- Journey drop-off predictions
- Questions for real interviews or experiments

## Report Templates

### Daily Insight Brief

```markdown
# Daily Product Insight Brief

## Executive Summary
- Top change:
- Biggest risk:
- Most promising opportunity:

## Top Pain Points
| Rank | Theme | Change | Sentiment | Evidence | Suggested Action |
| --- | --- | --- | --- | --- | --- |

## Emerging Signals
- Signal:
- Why it matters:
- Evidence:

## Competitor Movement
- Competitor:
- Change:
- Potential implication:

## Recommended PM Follow-ups
1.
2.
3.

## Caveats
- Data quality:
- Bias risk:
- Missing context:
```

### Opportunity Discovery Memo

```markdown
# Product Opportunity Memo

## Opportunity

## Evidence
- User pain:
- Competitor gap:
- Market or technology trend:

## Target Segment

## Why Now

## Possible MVP

## Risks

## Validation Plan

## PM Decision Needed
```

### Competitor Radar

```markdown
# Competitor Radar

| Competitor | New Change | User Reaction | Gap vs Us | Opportunity | Risk |
| --- | --- | --- | --- | --- | --- |
```

## Prompt Patterns

### Feedback Clustering Prompt

```text
You are a product insight analyst. Analyze the feedback below.

Tasks:
1. Classify each item by topic, product area, sentiment, urgency, and user segment if inferable.
2. Cluster repeated themes.
3. Identify the top pain points and fastest-growing themes.
4. Separate surface complaints from underlying needs.
5. Provide representative quotes and evidence IDs.
6. Do not invent missing facts. Mark unknowns explicitly.

Output as structured markdown tables plus a concise PM summary.
```

### Priority Recommendation Prompt

```text
You are assisting a product manager. Given feedback volume, affected users, funnel impact, revenue impact, strategic fit, effort, and confidence, suggest ICE or RICE scores.

Important:
- Do not make the final decision.
- Explain the evidence behind each score.
- Flag high-frequency low-value complaints.
- Flag low-frequency high-severity issues.
- List data needed before committing.
```

### Virtual User Simulation Prompt

```text
Simulate the perspective of the following user persona: {persona}.

Product context: {context}
Feature or hypothesis: {hypothesis}

Evaluate:
1. First impression
2. Motivation to use
3. Likely confusion points
4. Objections
5. Expected journey drop-off points
6. Questions a real interviewer should ask

Keep the output realistic and avoid pretending this replaces real user research.
```

## Guardrails

- Do not present AI analysis as final product truth.
- Do not overfit to the loudest comments or highest-volume complaints.
- Always separate evidence, inference, and recommendation.
- Preserve source traceability for important claims.
- Call out missing data and confidence level.
- Treat virtual user interviews as hypothesis generation, not validation proof.
- Avoid building a broad platform before proving one repeatable insight workflow.

## Completion Checklist

Before handing off an AI product insight plan or skill output, verify that it includes:

- Clear input sources
- A classification and clustering approach
- A trend comparison method
- Traceable evidence
- PM decision-support outputs
- Explicit AI limitations and PM ownership
- A narrow MVP path, preferably "user feedback to automated insight daily report"
