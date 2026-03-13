# Multi-Line Inflation Comparison Example (EU vs United States)

## Live Preview

<para-chart manifest="data/manifests/us-eu-inflation.json" style="display:block; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js"></script>

Concept reference from Fizz Studio demo: [ParaCharts demo multi-line chart](https://fizzstudio.github.io/ParaCharts-demo/charts/line-multi-2.html)

## Scenario

Compare monthly inflation rates between the EU aggregate and the United States.

## Data Source And Refresh

- Sources: Eurostat `prc_hicp_manr` and FRED `CPIAUCSL`.
- Refresh cadence: Monthly via GitHub Actions cache update workflow.
- Data continuity: This page will continue updating while Eurostat and FRED publish compatible data.

## When To Use

Use a multi-line chart when two correlated indicators must be tracked across the same timeline.

## Manifest

```html
<para-chart manifest="data/manifests/us-eu-inflation.json"></para-chart>
```

Full manifest (JSON):
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/data/manifests/us-eu-inflation.json

## Interpretation Prompts

1. Which economy starts with higher year-over-year inflation in the visible range?
2. Do the two lines converge or separate during disinflation periods?
3. Which economy has the higher latest reading?
