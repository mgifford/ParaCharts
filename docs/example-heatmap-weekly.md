# Heatmap Weekly Pattern Example

## Live Preview

<para-chart id="heatmap-weekly-live"></para-chart>

<script type="module" src="https://cdn.jsdelivr.net/gh/fizzstudio/ParaCharts-demo@main/script/paracharts.js"></script>
<script>
  (function () {
    const el = document.getElementById('heatmap-weekly-live');
    if (!el) return;
    el.manifestType = 'content';
    el.manifest = JSON.stringify({
      type: 'heatmap',
      xCategories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      yCategories: ['09:00', '11:00', '13:00', '15:00', '17:00'],
      data: [
        [12, 18, 24, 20, 15],
        [14, 19, 27, 23, 16],
        [10, 16, 22, 19, 13],
        [11, 17, 25, 21, 14],
        [9, 13, 19, 18, 12]
      ],
      description: 'Support chat load by day and hour'
    });
  })();
</script>

If the component preview does not load in your browser, open this fallback demo page: [ParaCharts demo chart list](https://fizzstudio.github.io/ParaCharts-demo/)

## Scenario

Show hourly support chat intensity by weekday.

## When To Use

Use a heatmap for two-dimensional pattern detection where magnitude is better communicated by color density.

## Manifest

```json
{
  "type": "heatmap",
  "xCategories": ["Mon", "Tue", "Wed", "Thu", "Fri"],
  "yCategories": ["09:00", "11:00", "13:00", "15:00", "17:00"],
  "data": [
    [12, 18, 24, 20, 15],
    [14, 19, 27, 23, 16],
    [10, 16, 22, 19, 13],
    [11, 17, 25, 21, 14],
    [9, 13, 19, 18, 12]
  ],
  "description": "Support chat load by day and hour"
}
```

## Interpretation Prompts

1. Which weekday/hour cell appears to be the busiest?
2. Is lunchtime consistently higher than early morning?
3. Which day seems to have the lowest overall volume?
