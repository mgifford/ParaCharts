# Bar Comparison Example

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
