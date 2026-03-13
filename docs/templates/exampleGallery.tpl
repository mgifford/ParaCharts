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

## Expanded Backlog (What Is Missing)

The current monthly updater and validation pipeline is ready for these chart types now:
- `line`
- `column`
- `bar`
- `donut`
- `scatter`
- `heatmap`
- `waterfall`
- `stepline`

### Next Source-Backed Examples (No Runtime Wiring Needed)

1. **Monthly Inflation Snapshot (U.S., Last 24 Months)**
	- Type: `column`
	- Source: FRED `CPIAUCSL` (YoY transform)
	- Why: gives a shorter-horizon inflation page to complement the existing U.S./EU crossover page.

2. **Policy Rate vs Unemployment Timeline (U.S.)**
	- Type: `line` (two series)
	- Source: FRED `FEDFUNDS` + BLS `LNS14000000`
	- Why: clear policy context and an interpretation-focused companion to the macro scatter.

3. **Electricity Mix Momentum (Top Movers, Month-over-Month)**
	- Type: `bar`
	- Source: EIA `T07.02A`
	- Why: ranked directional change page that is easier to scan than a full waterfall for first-time readers.

4. **Unemployment Regime Scatter (U.S., Last 5 Years)**
	- Type: `scatter`
	- Source: BLS + FRED overlap months
	- Why: second scatter with a different analytical question (regime clustering instead of raw relationship).

### Chart-Family Examples That Need Runtime Validation Or Wiring

1. **Lollipop Ranked Movers (Live)**
	- Status: partially wired (uses bar chart info path today)
	- Next step: add dedicated example page and verify keyboard/label behavior.

2. **Venn Overlap Summary (Static-First, Then Live If Source Supports True Intersections)**
	- Status: runtime class exists
	- Next step: choose a source that provides real overlap counts (avoid synthetic intersections unless clearly labeled).

3. **Histogram Distribution (Live)**
	- Status: view/settings exist but chart-info registration is not enabled in current chart mapping
	- Next step: wire and validate before publishing live docs page.

4. **Gauge Target Tracking (Live)**
	- Status: settings exist; dedicated chart wiring remains incomplete
	- Next step: validate chart-info and rendering path prior to example rollout.

5. **Graphing Functions Playground Example**
	- Status: documented in control panel narratives, not yet represented as a stable docs example path
	- Next step: define manifest contract and add an education-focused example page.

## How To Use This In Demos

- Start with the business question.
- Show the chart manifest and explain data encoding choices.
- Ask interpretation prompts before revealing answers.
- Compare visual reading with keyboard/screen-reader/sonification exploration.

This model is adapted from the successful pattern used in `fizzstudio/ParaCharts-demo`: one chart page plus focused interpretation questions.
