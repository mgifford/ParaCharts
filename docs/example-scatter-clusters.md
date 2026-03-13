# Scatter Clusters Example

## Live Preview

<para-chart id="scatter-clusters-live"></para-chart>

<script type="module" src="https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js"></script>
<script>
  (function () {
    const el = document.getElementById('scatter-clusters-live');
    if (!el) return;
    el.manifestType = 'content';
    el.manifest = JSON.stringify({
      type: 'scatter',
      series: [
        { name: 'Cohort A', data: [[2, 55], [3, 58], [4, 62], [5, 66], [6, 70]] },
        { name: 'Cohort B', data: [[2, 48], [3, 52], [4, 55], [5, 59], [6, 63]] },
        { name: 'Cohort C', data: [[2, 68], [3, 71], [4, 74], [5, 78], [6, 81]] }
      ],
      description: 'Study hours vs score by cohort'
    });
  })();
</script>

If the component preview does not load in your browser, open this fallback demo page: [ParaCharts demo chart list](https://fizzstudio.github.io/ParaCharts-demo/)

## Scenario

Analyze relationship between study hours and test score for three cohorts.

## When To Use

Use a scatter chart when you need to inspect spread, clusters, and outliers rather than only averages.

## Manifest

```json
{
  "type": "scatter",
  "series": [
    { "name": "Cohort A", "data": [[2, 55], [3, 58], [4, 62], [5, 66], [6, 70]] },
    { "name": "Cohort B", "data": [[2, 48], [3, 52], [4, 55], [5, 59], [6, 63]] },
    { "name": "Cohort C", "data": [[2, 68], [3, 71], [4, 74], [5, 78], [6, 81]] }
  ],
  "description": "Study hours vs score by cohort"
}
```

## Interpretation Prompts

1. Which cohort appears to have the highest baseline performance?
2. Is there a positive relationship between study hours and score in all cohorts?
3. Do you see any outlier points that break the pattern?
