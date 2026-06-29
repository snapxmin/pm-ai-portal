# pm-ai-portal

> **GitHub Copilot Extension** — AI-powered product insight agent for Product Managers.

Use `@pm-insight` in GitHub Copilot Chat to get instant, evidence-based product insights powered by a multi-tool agent workflow.

---

## What It Does

The extension orchestrates a four-skill pipeline that mirrors how a senior PM would approach a product deep-dive:

```
PM: "@pm-insight 洞察一下 Agent View 最近 30 天的核心问题"

Agent flow:
  1. query_product_metrics   → DAU, task completion, error rate, retention
  2. analyze_user_feedback   → NLP clustering of Issues, surveys, in-app feedback
  3. research_market         → Competitor feature gap analysis
  4. generate_insight_report → Cross-source synthesis with prioritised recommendations
```

### Skills / Tools

| Tool | What it does | Real integration point |
|---|---|---|
| `query_product_metrics` | Usage metrics, trends, anomaly detection | BigQuery / Amplitude / Mixpanel |
| `analyze_user_feedback` | Sentiment, theme clustering, pain points | GitHub Issues API / Zendesk / UserVoice |
| `research_market` | Competitor features, market trends, gaps | Web search / competitive intel APIs |
| `generate_insight_report` | Executive summary, root cause, P0–P3 recommendations | LLM-powered synthesis (no external API needed) |

---

## Architecture

```
src/
├── index.ts          # Express server — Copilot Extension endpoint (POST /)
├── agent.ts          # Agent loop: tool calling → streaming response
├── system-prompt.ts  # PM Insight Agent system prompt
├── sse.ts            # SSE event helpers (OpenAI streaming format)
└── tools/
    ├── index.ts      # Tool registry + executeTool dispatcher
    ├── metrics.ts    # Product metrics tool
    ├── feedback.ts   # User feedback NLP tool
    ├── research.ts   # Market/competitor research tool
    └── synthesis.ts  # Insight report synthesis tool
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a GitHub App

1. Go to **Settings → Developer Settings → GitHub Apps → New GitHub App**
2. Set the **Webhook URL** to `https://<your-host>/`
3. Under **Permissions**, enable **Copilot Chat** → Read
4. Install the app on your account or organisation
5. In your org's **Copilot** settings, add the app as a Copilot Extension

### 3. Run locally (with a tunnel)

```bash
npm run dev          # starts on port 3000
npx smee -u <smee-url> --target http://localhost:3000   # forward GitHub webhooks
```

### 4. Deploy to production

```bash
npm run build        # compiles TypeScript → dist/
npm start            # runs the compiled server
```

Set the `PORT` environment variable if needed (default: `3000`).

> **Production note:** Enable webhook signature verification before going live.  
> See the `TODO` in `src/index.ts` and use the `@copilot-extensions/preview-sdk`  
> `verifyAndParseRequest` helper with your `GITHUB_WEBHOOK_SECRET`.

---

## Plugging In Real Data

The tool implementations in `src/tools/` ship with realistic mock data so you can demo immediately. To connect real data sources, replace the mock functions:

| File | Replace with |
|---|---|
| `src/tools/metrics.ts` → `queryProductMetrics` | Query your data warehouse (BigQuery, Redshift, etc.) |
| `src/tools/feedback.ts` → `analyzeUserFeedback` | Call GitHub Issues API, Zendesk, or your NLP service |
| `src/tools/research.ts` → `researchMarket` | Integrate Perplexity / Tavily / internal competitive intel |

The `generate_insight_report` tool is fully LLM-powered and requires no changes.

---

## Usage Examples

```
@pm-insight 帮我洞察 Agent View 最近 30 天的核心问题

@pm-insight What are the top pain points in Agent View based on user feedback?

@pm-insight How does our Agent View compare to Cursor and Cline?

@pm-insight Give me a P0 recommendation for improving task completion rate
```
