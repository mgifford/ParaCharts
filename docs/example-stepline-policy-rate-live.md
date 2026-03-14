# Stepline Live Policy-Rate Timeline (U.S. FEDFUNDS)

## Live Preview

<para-chart manifest="data/manifests/us-policy-rate-stepline.json" style="display:block; width:100%; max-width: 52rem; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="assets/paracharts-loader.js"></script>


Concept reference from Fizz Studio demo pattern: [ParaCharts demo index](https://fizzstudio.github.io/ParaCharts-demo/)

## Scenario

Track the U.S. effective federal funds rate across recent years using a step-like timeline.

## Data Source And Refresh

- Source: FRED series `FEDFUNDS`.
- Refresh cadence: Monthly via GitHub Actions cache update workflow.
- Data continuity: This page will continue updating while FRED publishes compatible data.

## When To Use

Use a stepline chart when values move in discrete stages and transition points are central to the narrative.

## Manifest

```html
<para-chart manifest="data/manifests/us-policy-rate-stepline.json"></para-chart>
```

Full manifest (JSON):
- https://raw.githubusercontent.com/mgifford/ParaCharts/main/docs/data/manifests/us-policy-rate-stepline.json

## Interpretation Prompts

1. Where are the longest plateaus in the policy-rate path?
2. Which periods show the steepest step-ups or step-downs?
3. How does the latest rate compare with the earliest value shown?
