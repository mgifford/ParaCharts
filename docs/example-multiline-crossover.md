# Multi-Line Crossover Example

## Scenario

Compare two regions' revenue trajectories and identify crossover points.

## When To Use

Use a multi-line chart when relative movement between series is as important as absolute value.

## Manifest

```json
{
  "type": "line",
  "series": [
    { "name": "North", "data": [42, 45, 49, 54, 58, 61] },
    { "name": "South", "data": [50, 48, 47, 51, 56, 63] }
  ],
  "categories": ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"],
  "description": "Revenue by region over six quarters"
}
```

## Interpretation Prompts

1. At which interval do the two series switch order?
2. Which region ends higher, and by how much?
3. During which interval is the gap between regions smallest?
