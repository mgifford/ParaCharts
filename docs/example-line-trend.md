# Line Trend Example (U.S. Median Age)

## Live Preview

<para-chart manifest="data/manifests/us-median-age-census.json" style="display:block; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js"></script>

<iframe src="https://fizzstudio.github.io/ParaCharts-demo/preview/?manifesturl=https%3A%2F%2Fraw.githubusercontent.com%2Fmgifford%2FParaCharts%2Fmain%2Fdocs%2Fdata%2Fmanifests%2Fus-median-age-census.json" title="Reference preview: U.S. median age trend" style="display:block; width:100%; min-height: 32rem; border: 1px solid #d0d7de; margin: 0.75rem 0;" loading="lazy"></iframe>

If the component preview does not load in your browser, open this fallback demo page: [ParaCharts preview for this live manifest](https://fizzstudio.github.io/ParaCharts-demo/preview/?manifesturl=https%3A%2F%2Fraw.githubusercontent.com%2Fmgifford%2FParaCharts%2Fmain%2Fdocs%2Fdata%2Fmanifests%2Fus-median-age-census.json)

## Scenario

Track U.S. median age over the most recent ACS 1-year releases.

## When To Use

Use a line chart for ordered time data when directional trend matters.

## Manifest

```html
<para-chart manifest="data/manifests/us-median-age-census.json"></para-chart>
```

Full manifest (JSON):
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/data/manifests/us-median-age-census.json

## Interpretation Prompts

1. Is median age steadily increasing, or are there flat periods?
2. How far does the latest value sit above the earliest value shown?
3. Are any years noticeably different from the overall trend?
