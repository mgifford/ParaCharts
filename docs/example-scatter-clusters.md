# Scatter Clusters Example (Old Faithful Geyser Eruptions)

## Preview

<img src="assets/scatter.svg" alt="Scatter chart of Old Faithful geyser eruptions showing clustered groups by eruption duration and time since last eruption." style="display:block; width:100%; max-width: 52rem; margin: 0.75rem 0;" />

This page uses a checked-in ParaCharts SVG artifact for now. The previous page content was a mislabeled line-chart example that pulled a stale external demo bundle and failed before render on GitHub Pages.

## Scenario

Explore how Old Faithful eruption duration relates to the waiting time before the next eruption, and identify the visible clusters in those observations.

## Data Source And Refresh

- Source: Old Faithful geyser eruptions sample dataset used in ParaCharts demos.
- Structure: One scatter series with eruption duration on the x-axis and waiting time on the y-axis.
- Refresh cadence: Static reference dataset.

## When To Use

Use a scatter chart when the question is about clustering, separation, or outliers between two numeric variables.

## Asset

```html
<img src="assets/scatter.svg" alt="Old Faithful clustered scatter chart" />
```

The checked-in SVG is at:
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/assets/scatter.svg

## Interpretation Prompts

1. Do the points separate into distinct eruption patterns, or form a single continuous cloud?
2. Which cluster appears to contain the longest waiting times?
3. Are there points that sit clearly outside the main groups?
