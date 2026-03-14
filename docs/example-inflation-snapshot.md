# Column Inflation Snapshot Example (U.S., Last 24 Months)

## Live Preview

<para-chart manifest="data/manifests/us-inflation-snapshot.json" style="display:block; width:100%; max-width: 52rem; aspect-ratio: 4/3; margin: 0.75rem 0;"></para-chart>

<script type="module" src="assets/paracharts-loader.js"></script>


## Scenario

Track the U.S. Consumer Price Index year-over-year inflation rate across the most recent 24 published months. This shorter time window highlights recent disinflation or re-acceleration without the year-selection noise of a multi-year trend.

## Data Source And Refresh

- Source: FRED series `CPIAUCSL` (Consumer Price Index for All Urban Consumers, seasonally adjusted).
- Source URL: https://fred.stlouisfed.org/series/CPIAUCSL (series viewer) and https://fred.stlouisfed.org/graph/fredgraph.csv?id=CPIAUCSL (CSV endpoint).
- Derived as year-over-year percentage change (current month vs same month one year prior).
- Refresh cadence: Monthly via GitHub Actions cache update workflow.
- Data continuity: This page will continue updating while FRED publishes compatible data.

## When To Use

Use a column chart when comparing a single metric across ordered time intervals and the question is about level, not just direction.

## Manifest

```html
<para-chart manifest="data/manifests/us-inflation-snapshot.json"></para-chart>
```

Full manifest (JSON):
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/data/manifests/us-inflation-snapshot.json

## Interpretation Prompts

1. Does the chart show inflation rising, falling, or stabilizing over the 24-month window?
2. Which recent month had the highest inflation reading, and which had the lowest?
3. How close is the most recent month to the 2% long-run target?
