# Single-Line Unemployment Example (United States, 10-Year)

## Live Preview

<para-chart manifest="data/manifests/us-unemployment-decade.json" style="display:block; width:100%; max-width: 52rem; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="assets/paracharts-loader.js"></script>


Concept reference from Fizz Studio demo: [ParaCharts demo single-line chart](https://fizzstudio.github.io/ParaCharts-demo/charts/line-single-2.html)

## Scenario

Track U.S. annual average unemployment rates across the last decade.

## Data Source And Refresh

- Source: BLS public API series `LNS14000000` (annualized from monthly values).
- Refresh cadence: Monthly via GitHub Actions cache update workflow.
- Data continuity: This page will continue updating while BLS publishes compatible data.

## When To Use

Use a single-line chart for one metric over time when trend and turning points are key.

## Manifest

```html
<para-chart manifest="data/manifests/us-unemployment-decade.json"></para-chart>
```

Full manifest (JSON):
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/data/manifests/us-unemployment-decade.json

## Interpretation Prompts

1. Does the decade-long pattern show recovery, deterioration, or a mixed cycle?
2. Which year appears to mark the largest change from the prior year?
3. Is the latest annual average above or below the decade midpoint?
