# Line Trend Example (U.S. Median Age)

## Live Preview

<para-chart manifest="data/manifests/us-median-age-census.json" style="display:block; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js"></script>

Concept reference from Fizz Studio demo: [ParaCharts demo line chart](https://fizzstudio.github.io/ParaCharts-demo/charts/line-single-1.html)

## Scenario

Track U.S. median age over the most recent ACS 1-year releases.

## Data Source And Refresh

- Source: U.S. Census ACS 1-year table `B01002_001E`.
- Refresh cadence: Monthly via GitHub Actions cache update workflow.
- Data continuity: This page will continue updating while Census publishes compatible data.

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
