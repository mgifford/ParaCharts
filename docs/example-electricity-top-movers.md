# Bar Chart: Electricity Top Generation Movers (U.S., Month-over-Month)

## Live Preview

<para-chart manifest="data/manifests/us-electricity-top-movers.json" style="display:block; width:100%; max-width: 52rem; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="assets/paracharts-loader.js"></script>


## Scenario

Rank U.S. electricity generation sources by how much their monthly output changed between the two most recently published months. Negative values show sources that decreased; positive values show sources that increased. This is a ranked-magnitude view, distinct from the cumulative waterfall contribution breakdown.

## Data Source And Refresh

- Source: EIA Monthly Energy Review, Table 7.2A (Net Generation by Energy Source, Monthly).
- Source URL: https://www.eia.gov/totalenergy/data/browser/csv.php?tbl=T07.02A
- Refresh cadence: Monthly via GitHub Actions cache update workflow.
- Data continuity: This page will continue updating while EIA publishes compatible data.

## When To Use

Use a bar chart when ranking categories by a signed magnitude value and the question is "which moved the most, and in which direction?"

## Manifest

```html
<para-chart manifest="data/manifests/us-electricity-top-movers.json"></para-chart>
```

Full manifest (JSON):
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/data/manifests/us-electricity-top-movers.json

## Interpretation Prompts

1. Which electricity source had the largest month-over-month decline, and which had the largest gain?
2. Do the top movers suggest a seasonal pattern (e.g., solar or wind swings)?
3. How does the net total compare to the sum of the individual movers shown?
