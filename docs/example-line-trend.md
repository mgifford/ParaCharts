# Line Trend Example

## Live Preview

<para-chart id="line-trend-live" style="display:block; min-height: 28rem; margin: 0.75rem 0;"></para-chart>

<script type="module" src="https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js"></script>
<script>
  (function () {
    const el = document.getElementById('line-trend-live');
    if (!el) return;
    el.manifestType = 'content';
    el.manifest = JSON.stringify({
      type: 'line',
      series: [{ name: 'MAU', data: [1200, 1275, 1330, 1410, 1480, 1545, 1620, 1710, 1805, 1890, 1980, 2100] }],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      description: 'Monthly active users across one calendar year'
    });
  })();
</script>

If the component preview does not load in your browser, open this fallback demo page: [ParaCharts demo line chart](https://fizzstudio.github.io/ParaCharts-demo/charts/line-single-1.html)

## Scenario

Track monthly active users over one year.

## When To Use

Use a line chart for ordered time data when slope and acceleration matter.

## Manifest

```json
{
  "type": "line",
  "series": [
    { "name": "MAU", "data": [1200, 1275, 1330, 1410, 1480, 1545, 1620, 1710, 1805, 1890, 1980, 2100] }
  ],
  "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  "description": "Monthly active users across one calendar year"
}
```

## Interpretation Prompts

1. In which month does growth start accelerating most clearly?
2. What is the difference between January and December?
3. Are there any periods of decline?
