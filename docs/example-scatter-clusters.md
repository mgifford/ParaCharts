# Multi-Line Inflation Comparison Example (EU vs United States)

## Live Preview

<para-chart manifest="data/manifests/us-eu-inflation.json" style="display:block; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js"></script>

<iframe src="https://fizzstudio.github.io/ParaCharts-demo/preview/?manifesturl=https%3A%2F%2Fraw.githubusercontent.com%2Fmgifford%2FParaCharts%2Fmain%2Fdocs%2Fdata%2Fmanifests%2Fus-eu-inflation.json" title="Reference preview: EU vs U.S. inflation chart" style="display:block; width:100%; min-height: 32rem; border: 1px solid #d0d7de; margin: 0.75rem 0;" loading="lazy"></iframe>

If the component preview does not load in your browser, open this fallback demo page: [ParaCharts preview for this live manifest](https://fizzstudio.github.io/ParaCharts-demo/preview/?manifesturl=https%3A%2F%2Fraw.githubusercontent.com%2Fmgifford%2FParaCharts%2Fmain%2Fdocs%2Fdata%2Fmanifests%2Fus-eu-inflation.json)

## Scenario

Compare monthly inflation rates between the EU aggregate and the United States.

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
