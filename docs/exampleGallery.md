# Example Gallery

This gallery provides ten concrete examples designed for GitHub Pages documentation.

Each example includes:
- A realistic manifest you can copy and adapt
- Suggested interpretation prompts for teaching, QA, or onboarding
- A brief "when to use" note
- Data source and refresh notes for monthly updates

All manifests in this gallery are refreshed monthly from third-party public sources, as long as those sources continue publishing compatible data.

## Gallery Index

1. [Column Unemployment Example (United States, Monthly)](example-bar-comparison.md)
2. [Line Trend Example (U.S. Median Age)](example-line-trend.md)
3. [Multi-Line Sector Comparison Example (U.S. GDP by Industry)](example-multiline-crossover.md)
4. [Scatter Clusters Example (Old Faithful Geyser Eruptions)](example-scatter-clusters.md)
5. [Single-Line Unemployment Example (United States, 10-Year)](example-heatmap-weekly.md)
6. [Donut Energy Composition Example (U.S. Electricity)](example-donut-budget.md)
7. [Scatter Live Macro Relationship (U.S. Unemployment vs Inflation)](example-scatter-macro-live.md)
8. [Heatmap Live Hourly Pattern (New York City Temperatures)](example-heatmap-hourly-live.md)
9. [Waterfall Live Contribution Breakdown (U.S. Electricity)](example-waterfall-contribution-live.md)
10. [Stepline Live Policy-Rate Timeline (U.S. FEDFUNDS)](example-stepline-policy-rate-live.md)

## Data Sources And Refresh Policy

- Data is pulled from BLS, U.S. Census, BEA, Eurostat, FRED, and EIA.
- Cached manifests are refreshed monthly via GitHub Actions.
- Existing cached data is retained until replacement data is downloaded and validated.
- Availability depends on third-party publication schedules and endpoint stability.

## TODO Next Live Examples

- Add a monthly lollipop example for ranked movers.
- Add a monthly venn example for overlap-based summaries.
- Evaluate and wire histogram runtime support before adding histogram live demos.

## How To Use This In Demos

- Start with the business question.
- Show the chart manifest and explain data encoding choices.
- Ask interpretation prompts before revealing answers.
- Compare visual reading with keyboard/screen-reader/sonification exploration.

This model is adapted from the successful pattern used in `fizzstudio/ParaCharts-demo`: one chart page plus focused interpretation questions.
