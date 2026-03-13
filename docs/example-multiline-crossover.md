# Multi-Line Sector Comparison Example (U.S. GDP by Industry)

## Live Preview

<para-chart manifest="data/manifests/us-gdp-industry-tech.json" style="display:block; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js"></script>

<iframe src="https://fizzstudio.github.io/ParaCharts-demo/preview/?manifesturl=https%3A%2F%2Fraw.githubusercontent.com%2Fmgifford%2FParaCharts%2Fmain%2Fdocs%2Fdata%2Fmanifests%2Fus-gdp-industry-tech.json" title="Reference preview: U.S. GDP by industry chart" style="display:block; width:100%; min-height: 32rem; border: 1px solid #d0d7de; margin: 0.75rem 0;" loading="lazy"></iframe>

If the component preview does not load in your browser, open this fallback demo page: [ParaCharts preview for this live manifest](https://fizzstudio.github.io/ParaCharts-demo/preview/?manifesturl=https%3A%2F%2Fraw.githubusercontent.com%2Fmgifford%2FParaCharts%2Fmain%2Fdocs%2Fdata%2Fmanifests%2Fus-gdp-industry-tech.json)

## Scenario

Compare recent-quarter trajectories for U.S. total GDP, Information, and Professional/Scientific/Technical services.

## When To Use

Use a multi-line chart when relative movement between several series is as important as absolute value.

## Manifest

```html
<para-chart manifest="data/manifests/us-gdp-industry-tech.json"></para-chart>
```

Full manifest (JSON):
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/data/manifests/us-gdp-industry-tech.json

## Interpretation Prompts

1. Which series is highest in absolute dollars at the most recent quarter?
2. Do Information and Professional/Scientific/Technical services move in parallel?
3. Where do growth rates appear to diverge across the three lines?
