# Bar Comparison Example

## Live Preview

<para-chart id="bar-comparison-live" style="display:block; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js"></script>
<script>
  (function () {
    const el = document.getElementById('bar-comparison-live');
    if (!el) return;
    el.manifestType = 'content';
    el.manifest = JSON.stringify({
      type: 'bar',
      series: [{ name: 'Tickets', data: [82, 61, 104, 47, 73] }],
      categories: ['Billing', 'Onboarding', 'Mobile', 'API', 'Reporting'],
      description: 'Support ticket counts by product area for Q1'
    });
  })();
</script>

If the component preview does not load in your browser, open this fallback demo page: [ParaCharts demo bar chart](https://fizzstudio.github.io/ParaCharts-demo/charts/bar.html)

## Scenario

Compare support ticket volume by product area over one quarter.

## When To Use

Use a bar chart when category labels are important and direct comparison across categories is the primary task.

## Manifest

```json
{
  "type": "bar",
  "series": [
    { "name": "Tickets", "data": [82, 61, 104, 47, 73] }
  ],
  "categories": ["Billing", "Onboarding", "Mobile", "API", "Reporting"],
  "description": "Support ticket counts by product area for Q1"
}
```

## Interpretation Prompts

1. Which category has the highest ticket volume?
2. What is the range between highest and lowest categories?
3. Which two categories are closest in value?

## Optional Embed Snippet

```html
<para-chart manifestType="content" manifest='{"type":"bar","series":[{"name":"Tickets","data":[82,61,104,47,73]}],"categories":["Billing","Onboarding","Mobile","API","Reporting"],"description":"Support ticket counts by product area for Q1"}'></para-chart>
```
