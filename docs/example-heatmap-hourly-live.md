# Heatmap Live Hourly Pattern (New York City Temperatures)

## Live Preview

<para-chart manifest="data/manifests/us-hourly-temperature-heatmap.json" style="display:block; width:100%; max-width: 52rem; aspect-ratio: 4/3; margin: 0.75rem 0;"></para-chart>

<script type="module" src="assets/paracharts-loader.js"></script>


Concept reference from Fizz Studio demo pattern: [ParaCharts demo index](https://fizzstudio.github.io/ParaCharts-demo/)

## Scenario

Summarize hourly temperature observations for the latest complete month to reveal recurring hourly patterns.

## Data Source And Refresh

- Source: Open-Meteo archive API (`temperature_2m`, hourly, UTC) for New York City coordinates.
- Source URL: https://archive-api.open-meteo.com/v1/archive?latitude=40.7128&longitude=-74.0060&start_date=2025-01-01&end_date=2025-01-31&hourly=temperature_2m&timezone=UTC (representative API request).
- API docs: https://open-meteo.com/en/docs/historical-weather-api
- Refresh cadence: Monthly via GitHub Actions cache update workflow.
- Data continuity: This page will continue updating while Open-Meteo publishes compatible data.

## When To Use

Use a heatmap when density and distribution patterns matter more than individual observations.

## Manifest

```html
<para-chart manifest="data/manifests/us-hourly-temperature-heatmap.json"></para-chart>
```

Full manifest (JSON):
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/data/manifests/us-hourly-temperature-heatmap.json

## Interpretation Prompts

1. Which hours concentrate the most observations at higher temperatures?
2. Where is the densest band of hourly temperature values?
3. Do overnight and daytime periods separate into distinct ranges?
