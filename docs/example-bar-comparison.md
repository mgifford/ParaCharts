# Column Unemployment Example (United States, Monthly)

## Live Preview

<para-chart manifest="data/manifests/us-unemployment-monthly.json" style="display:block; width:100%; max-width: 52rem; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="assets/paracharts-loader.js"></script>


Concept reference from Fizz Studio demo: [ParaCharts demo bar chart](https://fizzstudio.github.io/ParaCharts-demo/charts/bar.html)

## Scenario

Track the U.S. unemployment rate across the most recent 12 published months.

## Data Source And Refresh

- Source: BLS public API series `LNS14000000`.
- Source URL: https://data.bls.gov/timeseries/LNS14000000 (series viewer) and https://api.bls.gov/publicAPI/v2/timeseries/data/LNS14000000 (API endpoint).
- Refresh cadence: Monthly via GitHub Actions cache update workflow.
- Data continuity: This page will continue updating while BLS publishes compatible data.

## When To Use

Use a column/bar-style chart to compare values across time intervals.

## Manifest

```html
<para-chart manifest="data/manifests/us-unemployment-monthly.json"></para-chart>
```

Full manifest (JSON):
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/data/manifests/us-unemployment-monthly.json

## Interpretation Prompts

1. Which recent month has the highest unemployment value?
2. Are there any month-to-month reversals in direction?
3. How different is the latest month from the earliest month shown?
