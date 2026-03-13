# Getting Started

This page gives you the shortest path to understanding ParaCharts: what it is, how it works, how to implement it, and how to verify what it provides users.

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

## Choose An Implementation Mode

Use one of these integration modes:

1. Inline manifest (`manifestType="content"`): fastest for prototypes and experiments.
2. URL manifest (`manifestType="url"`): best for production pages and reproducible docs.
3. Cached live manifests: best for GitHub Pages with scheduled monthly data refresh.

For this repository, the standard live-data flow is:

1. Fetch third-party source data.
2. Build validated local manifests in `docs/data/manifests`.
3. Point documentation pages to those local manifests.
4. Refresh monthly with the workflow.

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

## URL Manifest Example (Recommended)

```html
<para-chart
  manifestType="url"
  manifest="data/manifests/us-unemployment-monthly.json"
></para-chart>
```

This approach keeps published docs stable and still allows monthly updates to data.

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
- `q` provides point-level description
- Important updates are announced through ARIA live behavior

## What Accessibility Affordances Users Get

- Keyboard-only chart exploration with structured navigation.
- Screen-reader announcements through ARIA live updates and query actions.
- Sonification for trend and magnitude understanding through sound.
- Self-voicing for spoken summaries without requiring separate assistive software.

For detailed behavior and validation, see [Accessibility Features](accessibility.md).

## 5-Minute Smoke Test

Run this quick script on any page in [Example Gallery](exampleGallery.md):

1. Focus the chart and press `h` to confirm help appears.
2. Use arrow keys to move between points and confirm focus movement.
3. Press `q` and confirm query output describes the focused point.
4. Press `s`, move again, and confirm sonification plays.
5. Press `v` and confirm speech behavior changes.
6. Open the control panel and verify Audio tab toggles match keyboard shortcuts.

If any check fails, continue with [Implementation & Testing Guide](implementationAndTesting.md).

See related docs:
- [Accessibility Features](accessibility.md)
- [Shortcuts & Commands](shortcutsAndCommands.md)
- [Control Panel & Settings](controlPanel.md)

## Where To Go Next

- [Chart Types](chartTypes.md): pick the right visual model for your data
- [Implementation & Testing Guide](implementationAndTesting.md): implementation patterns and validation workflow
- [Custom Elements](customElements.md): integration details for `para-chart` and `para-chart-ai`
- [GitHub Pages Showcase](githubPagesShowcase.md): what to present publicly and how
