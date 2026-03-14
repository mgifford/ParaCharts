# Waterfall Live Contribution Breakdown (U.S. Electricity)

## Live Preview

<para-chart manifest="data/manifests/us-electricity-waterfall.json" style="display:block; width:100%; max-width: 52rem; aspect-ratio: 4/3; margin: 0.75rem 0;"></para-chart>

<script type="module" src="assets/paracharts-loader.js"></script>


Concept reference from Fizz Studio demo pattern: [ParaCharts demo index](https://fizzstudio.github.io/ParaCharts-demo/)

## Scenario

Show how source-level month-over-month changes combine into the net change in U.S. electricity generation.

## Data Source And Refresh

- Source: EIA data browser CSV table `T07.02A`.
- Source URL: https://www.eia.gov/totalenergy/data/browser/csv.php?tbl=T07.02A
- Refresh cadence: Monthly via GitHub Actions cache update workflow.
- Data continuity: This page will continue updating while EIA publishes compatible data.

## When To Use

Use a waterfall chart to explain how component increases and decreases accumulate into a final net result.

## Manifest

```html
<para-chart manifest="data/manifests/us-electricity-waterfall.json"></para-chart>
```

Full manifest (JSON):
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/data/manifests/us-electricity-waterfall.json

## Interpretation Prompts

1. Which source contributes the largest positive change?
2. Which source contributes the largest negative change?
3. How much of the net total change is explained by the named top contributors versus other sources?
