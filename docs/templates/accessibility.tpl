# Accessibility Features

ParaCharts is designed to provide equivalent insight across multiple interaction modes. This page explains the core disability-related affordances, how each one helps, and how to test that it is functioning.

## Example Pages That Demonstrate Accessibility Features

Use these pages to pair each accessibility claim with a concrete implementation:

- Keyboard point navigation and query behavior: [Column Unemployment Example](example-bar-comparison.md)
- Multi-series comparison with legend and non-color cues: [Multi-Line Sector Comparison Example](example-multiline-crossover.md)
- Sonification and self-voicing controls: [Stepline Live Policy-Rate Timeline](example-stepline-policy-rate-live.md)
- Dense-data readability with non-color structure: [Heatmap Live Hourly Pattern](example-heatmap-hourly-live.md)
- Positive/negative contribution interpretation: [Waterfall Live Contribution Breakdown](example-waterfall-contribution-live.md)
- Relationship analysis and outlier exploration: [Scatter Live Macro Relationship](example-scatter-macro-live.md)

For all accessibility test targets in one list, use [Example Gallery](exampleGallery.md).

## Why This Matters In The Wider Data-Viz Ecosystem

Most charts published online still assume a sighted mouse user. In practice, that means many people can see a chart but cannot fully use it, or cannot access it at all.

Common gaps in public charts:

- Keyboard trap or no keyboard point navigation.
- Visual-only interpretation with no meaningful text equivalent.
- No screen reader announcements when focus or state changes.
- Color-only encoding that fails for color-vision differences.
- No non-visual trend channel such as sound.

ParaCharts is designed to close those gaps by default, so the same core insight is available through keyboard interaction, screen reader output, self-voicing, and sonification.

## Gap To Capability Mapping

| Typical online chart gap | Why it excludes people | ParaCharts capability | How to verify quickly |
| :--- | :--- | :--- | :--- |
| Hover-only interaction | Keyboard and many assistive tech users cannot access point detail | Keyboard-first point traversal and query shortcuts | Focus chart, use arrow keys and `q` |
| Visual-only trend communication | Blind users and some low-vision users miss main insight | ARIA live summaries and self-voicing output | Trigger summary/query and confirm spoken/announced result |
| Color-only distinctions | Users with color-vision differences cannot separate series reliably | Non-color cues, labels, and configurable palettes | Switch palette/mode and confirm interpretation remains clear |
| Static chart with no state announcements | Dynamic updates are silent to assistive tech | Live-region announcements for focus and state changes | Move points and confirm screen reader announcements |
| No audio channel for trend pattern | Some users lose rapid pattern perception | Sonification mode for directional and relative movement | Toggle `s` and traverse points |

## Accessibility Outcome For Teams

When adopted consistently, ParaCharts helps teams move from "visual chart published" to "insight is operationally available to more users." This is especially important for:

- Public dashboards (health, climate, transit, elections).
- Civic and policy reporting where equal access is a legal and trust requirement.
- Education and newsroom contexts where interpretation quality matters as much as visual polish.

## Quick Controls

- Toggle sonification: `s`
- Toggle self-voicing: `v`
- Query focused data detail: `q`
- Open keyboard help: `h`
- Stop speech/audio playback: `Ctrl` or `Escape`

For the full keyboard map, see [Shortcuts & Commands](shortcutsAndCommands.md).

## Affordance Matrix

| User need | ParaCharts affordance | Practical result | How to verify |
| :--- | :--- | :--- | :--- |
| Cannot use a mouse | Full keyboard navigation across chart and datapoints | Users can explore trend and value detail without pointer input | Focus chart, use arrow keys, confirm point traversal and status updates |
| Blind or low-vision screen reader users | ARIA live summaries and query announcements | High-level and point-level chart meaning can be heard | Focus chart, trigger `q`, confirm spoken/announced data description |
| Users who benefit from non-visual trend cues | Sonification mode | Relative value movement is perceivable through sound | Toggle `s`, traverse points, confirm pitch/motion mapping |
| Users who need built-in speech output | Self-voicing mode | Chart summaries can be spoken without external setup | Toggle `v`, trigger summary/query, confirm browser speech output |
| Users with color-vision differences | Color controls and non-color cues | Distinctions remain interpretable beyond hue alone | Change palette/color mode in control panel and confirm readability |
| Users with cognitive load constraints | Query/summary shortcuts and focused prompts | Key insights are available in concise, structured text/speech | Use `q` and compare output to chart context |

## Manual Test Script (10-15 Minutes)

Run this script on any page from [Example Gallery](exampleGallery.md):

1. Keyboard-only navigation
	- Focus the chart.
	- Press arrow keys to move point-by-point.
	- Expected: the focus target changes and the currently focused datapoint context updates.

2. Query behavior
	- Press `q` while a datapoint is focused.
	- Expected: a meaningful datapoint description is produced.

3. Sonification
	- Press `s` to enable sonification.
	- Move across several points.
	- Expected: audible changes track value movement.

4. Self-voicing
	- Press `v` to enable speech mode.
	- Trigger a query and move focus.
	- Expected: spoken output reflects updates.

5. Screen-reader/announcement check
	- With a screen reader active, focus chart and query.
	- Expected: chart summary and point details are announced in a usable order.

6. Control-panel parity
	- Open Audio and related tabs in control panel.
	- Toggle the same features there.
	- Expected: control panel toggles match keyboard command outcomes.

## Implementation Notes For Accessible Outcomes

- Always provide clear chart titles and descriptions in manifests.
- Keep facet labels explicit (units, time period, measure).
- Avoid encoding critical distinctions by color only.
- Preserve keyboard focusability wherever charts are embedded.
- Prefer local cached manifests for predictable behavior on static hosting.

## Troubleshooting

- No audio output:
  - Check system volume and browser audio permissions.
  - Verify sonification is enabled with `s`.

- No spoken announcements:
  - Ensure focus is on the chart.
  - Toggle self-voicing with `v`.
  - If using a screen reader, confirm live-region announcements are not muted.

- Keyboard commands not responding:
  - Click the chart once to ensure focus is inside the component.
  - Use `h` to confirm help dialog and active shortcut scope.

## Acceptance Criteria

Treat accessibility as passing only when all are true:

1. Keyboard-only exploration works end-to-end.
2. Query output provides understandable point-level context.
3. Sonification and self-voicing toggles both function.
4. Screen-reader announcements occur with meaningful content.
5. Chart meaning remains interpretable without relying on color alone.
