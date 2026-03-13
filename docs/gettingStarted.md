# Getting Started

This page gives you the shortest path to understanding ParaCharts: what it is, how it works, and which options matter first.

## What ParaCharts Solves

ParaCharts helps teams communicate data in more than one mode at the same time:
- Visual charting
- Text summaries and descriptions
- Keyboard-first interaction
- Sonification and speech support

The result is a charting workflow that is easier to interpret for more users.

## How ParaCharts Works

Use this mental model:

1. You define a manifest (type, series, categories, metadata).
2. You bind that manifest to a `para-chart` element.
3. ParaCharts renders the chart and accessibility semantics.
4. Users explore via pointer, keyboard, screen reader, or audio.
5. Optional controls adjust appearance, behavior, and analysis.

## Minimal Manifest Example

```json
{
  "type": "line",
  "series": [
    { "name": "Revenue", "data": [120, 150, 165, 200] },
    { "name": "Cost", "data": [90, 110, 140, 170] }
  ],
  "categories": ["Q1", "Q2", "Q3", "Q4"],
  "description": "Revenue and cost by quarter"
}
```

## Minimal Element Example

```html
<para-chart
  manifestType="content"
  manifest='{
    "type": "line",
    "series": [{ "name": "Revenue", "data": [120, 150, 165, 200] }],
    "categories": ["Q1", "Q2", "Q3", "Q4"],
    "description": "Quarterly revenue"
  }'
></para-chart>
```

## First Options To Learn

| Option | Where | Why it matters |
| :--- | :--- | :--- |
| `type` | manifest | Selects the chart model (line, bar, pie, heatmap, etc.). |
| `series` + `categories` | manifest | Defines your data values and labels. |
| `description` | manifest | Improves non-visual understanding and context. |
| `manifestType` | custom element | Chooses inline content vs URL manifest loading. |
| Control Panel: Audio | UI tab | Enables sonification, self-voicing, and announcement behavior. |
| Control Panel: Chart/Colors | UI tabs | Adjusts readability, labels, orientation, and color use. |

## Accessibility-First Quick Check

After loading any chart, verify these basics:
- Keyboard focus can reach the chart
- `s` toggles sonification
- `v` toggles self-voicing
- `Q` provides point-level description
- Important updates are announced through ARIA live behavior

See related docs:
- [Accessibility Features](accessibility.md)
- [Shortcuts & Commands](shortcutsAndCommands.md)
- [Control Panel & Settings](controlPanel.md)

## Where To Go Next

- [Chart Types](chartTypes.md): pick the right visual model for your data
- [Custom Elements](customElements.md): integration details for `para-chart` and `para-chart-ai`
- [GitHub Pages Showcase](githubPagesShowcase.md): what to present publicly and how
