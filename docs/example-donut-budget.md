# Donut Budget Share Example

## Live Preview

<para-chart id="donut-budget-live"></para-chart>

<script type="module" src="https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js"></script>
<script>
  (function () {
    const el = document.getElementById('donut-budget-live');
    if (!el) return;
    el.manifestType = 'content';
    el.manifest = JSON.stringify({
      type: 'donut',
      series: [{ name: 'Budget', data: [35, 25, 20, 12, 8] }],
      categories: ['Instruction', 'Support Services', 'Technology', 'Operations', 'Community Programs'],
      description: 'Annual budget share by program area'
    });
  })();
</script>

If the component preview does not load in your browser, open this fallback demo page: [ParaCharts demo donut chart](https://fizzstudio.github.io/ParaCharts-demo/charts/donut.html)

## Scenario

Communicate allocation of annual program budget.

## When To Use

Use a donut chart for part-to-whole communication when exact precision is secondary to relative share.

## Manifest

```json
{
  "type": "donut",
  "series": [
    { "name": "Budget", "data": [35, 25, 20, 12, 8] }
  ],
  "categories": ["Instruction", "Support Services", "Technology", "Operations", "Community Programs"],
  "description": "Annual budget share by program area"
}
```

## Interpretation Prompts

1. Which program area has the largest share?
2. Is the largest segment more than double the smallest segment?
3. Which two segments together approximate half of the total?
