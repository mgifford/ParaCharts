# Donut Energy Composition Example (U.S. Electricity)

## Live Preview

<para-chart manifest="data/manifests/us-electricity-top5.json" style="display:block; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js"></script>

Concept reference from Fizz Studio demo: [ParaCharts demo donut chart](https://fizzstudio.github.io/ParaCharts-demo/charts/donut.html)

## Scenario

Communicate part-to-whole composition of the top U.S. electricity generation sources.

## Data Source And Refresh

- Source: EIA data browser CSV table `T07.02A`.
- Refresh cadence: Monthly via GitHub Actions cache update workflow.
- Data continuity: This page will continue updating while EIA publishes compatible data.

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
