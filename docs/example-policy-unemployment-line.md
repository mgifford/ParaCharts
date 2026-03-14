# Multi-Line Policy Rate and Unemployment Example (U.S., Last 6 Years)

## Live Preview

<para-chart manifest="data/manifests/us-policy-unemployment-line.json" style="display:block; width:100%; max-width: 52rem; min-height: 28rem; margin: 0.75rem 0;"></para-chart>


## Scenario

Compare the U.S. federal funds rate and the unemployment rate on a shared monthly timeline across the last six years. Placing both series together lets readers trace how monetary policy responses align with labor market cycles.

## Data Source And Refresh

- Sources: FRED series `FEDFUNDS` (effective federal funds rate) and BLS series `LNS14000000` (unemployment rate).
- Refresh cadence: Monthly via GitHub Actions cache update workflow.
- Data continuity: This page will continue updating while FRED and BLS publish compatible data.

## When To Use

Use a multi-line chart when the question is about how two time series interact or diverge over a shared timeline.

## Manifest

```html
<para-chart manifest="data/manifests/us-policy-unemployment-line.json"></para-chart>
```

Full manifest (JSON):
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/data/manifests/us-policy-unemployment-line.json

## Interpretation Prompts

1. When did the federal funds rate begin rising sharply, and was unemployment already falling at that point?
2. Do the two lines diverge or converge in the most recent months?
3. Is there a visible lag between unemployment changes and policy rate changes?
