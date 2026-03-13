# Scatter Live Macro Relationship (U.S. Unemployment vs Inflation)

## Live Preview

<para-chart manifest="data/manifests/us-macro-scatter.json" style="display:block; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js"></script>

Concept reference from Fizz Studio demo pattern: [ParaCharts demo index](https://fizzstudio.github.io/ParaCharts-demo/)

## Scenario

Track the relationship between unemployment and inflation across recent monthly observations in the United States.

## Data Source And Refresh

- Sources: BLS series `LNS14000000` and FRED series `CPIAUCSL`.
- Refresh cadence: Monthly via GitHub Actions cache update workflow.
- Data continuity: This page will continue updating while BLS and FRED publish compatible data.

## When To Use

Use a scatter chart when the question is about relationship, clustering, or outliers between two numeric variables.

## Manifest

```html
<para-chart manifest="data/manifests/us-macro-scatter.json"></para-chart>
```

Full manifest (JSON):
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/data/manifests/us-macro-scatter.json

## Interpretation Prompts

1. Do points cluster around one inflation-unemployment zone, or spread broadly?
2. Are there visible outliers that break the typical relationship?
3. Does the pattern suggest a trade-off over the observed period?
