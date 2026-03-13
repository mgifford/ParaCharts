# Line Trend Example

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
