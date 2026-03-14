# Multi-Line Sector Comparison Example (U.S. GDP by Industry)

## Live Preview

<para-chart manifest="data/manifests/us-gdp-industry-tech.json" style="display:block; width:100%; max-width: 52rem; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="assets/paracharts-loader.js"></script>


Concept reference from Fizz Studio demo: [ParaCharts demo multi-line chart](https://fizzstudio.github.io/ParaCharts-demo/charts/line-multi-1.html)

## Scenario

Compare recent-quarter trajectories for U.S. total GDP, Information, and Professional/Scientific/Technical services.

## Data Source And Refresh

- Source: BEA GDP workbook table 14 (public release file).
- Source URL: https://www.bea.gov/data/gdp/gross-domestic-product (release hub); updater reads Table 14 workbook file https://www.bea.gov/sites/default/files/2026-01/gdp3q25-updated.xlsx.
- Refresh cadence: Monthly via GitHub Actions cache update workflow.
- Data continuity: This page will continue updating while BEA publishes compatible data.

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
