# Donut Energy Composition Example (U.S. Electricity)

## Live Preview

<para-chart manifest="data/manifests/us-electricity-top5.json" style="display:block; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js"></script>

<iframe src="https://fizzstudio.github.io/ParaCharts-demo/preview/?manifesturl=https%3A%2F%2Fraw.githubusercontent.com%2Fmgifford%2FParaCharts%2Fmain%2Fdocs%2Fdata%2Fmanifests%2Fus-electricity-top5.json" title="Reference preview: U.S. electricity source donut chart" style="display:block; width:100%; min-height: 32rem; border: 1px solid #d0d7de; margin: 0.75rem 0;" loading="lazy"></iframe>

If the component preview does not load in your browser, open this fallback demo page: [ParaCharts preview for this live manifest](https://fizzstudio.github.io/ParaCharts-demo/preview/?manifesturl=https%3A%2F%2Fraw.githubusercontent.com%2Fmgifford%2FParaCharts%2Fmain%2Fdocs%2Fdata%2Fmanifests%2Fus-electricity-top5.json)

## Scenario

Communicate part-to-whole composition of the top U.S. electricity generation sources.

## When To Use

Use a donut chart for part-to-whole communication where proportional share is the core message.

## Manifest

```html
<para-chart manifest="data/manifests/us-electricity-top5.json"></para-chart>
```

Full manifest (JSON):
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/data/manifests/us-electricity-top5.json

## Interpretation Prompts

1. Which generation source has the largest share in the latest annual data?
2. How concentrated is the mix across the top two sources?
3. Which sources are the smallest contributors within the top five?
