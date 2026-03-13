# Scatter: U.S. Policy Response (Unemployment vs Federal Funds Rate)

## Live Preview

<para-chart manifest="data/manifests/us-policy-scatter.json" style="display:block; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js"></script>

## Scenario

Plot each monthly observation as a point with unemployment on the x-axis and the effective federal funds rate on the y-axis over the last five years. This reveals how tightly or loosely the Fed's policy stance has tracked labor market conditions across different economic regimes.

## Data Source And Refresh

- Sources: BLS series `LNS14000000` (unemployment rate) and FRED series `FEDFUNDS` (effective federal funds rate).
- Refresh cadence: Monthly via GitHub Actions cache update workflow.
- Data continuity: This page will continue updating while BLS and FRED publish compatible data.

## When To Use

Use a scatter chart when the question is about the relationship or clustering between two numeric variables rather than their individual trends over time.

## Manifest

```html
<para-chart manifest="data/manifests/us-policy-scatter.json"></para-chart>
```

Full manifest (JSON):
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/data/manifests/us-policy-scatter.json

## Interpretation Prompts

1. Do the points cluster into distinct zones that suggest different policy regimes?
2. Is there a visible zone where high unemployment coincides with near-zero rates?
3. Where do the most recent observations fall relative to historical clusters?
