# ACCESSIBILITY.md

Accessibility commitment for the ParaCharts project.

This file follows the [ACCESSIBILITY.md open standard](https://github.com/mgifford/ACCESSIBILITY.md) and documents what ParaCharts commits to, what is currently known to be incomplete, and what AI agents and human contributors are expected to uphold when making changes.

---

## Conformance Target

**Target:** WCAG 2.2 Level AA  
**Scope:** The `para-chart` and `para-chart-ai` custom elements and all associated UI in the control panel, popups, status bar, and audio controls.  
**Status:** Active development — not yet fully audited against WCAG 2.2 AA. Known gaps are listed below.

---

## Why Chart Accessibility Is Hard

Charts encode meaning through visual properties — position, color, shape, and size — that are inherently inaccessible to screen reader users, people with color vision deficiencies, or users who cannot operate a mouse. ParaCharts addresses this through:

- Keyboard navigation of every data point
- ARIA live region announcements for chart updates and selected points
- Sonification (audio pitch mapping) as an alternative sensory channel
- Self-voicing text summaries generated from chart data
- Data table equivalents accessible from the control panel

See [CHARTS_GRAPHS_ACCESSIBILITY_BEST_PRACTICES.md](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/CHARTS_GRAPHS_ACCESSIBILITY_BEST_PRACTICES.md) for the full reference on how to apply these requirements in chart code.

---

## Required Practices For All Chart Changes

These requirements come directly from the charts/graphs accessibility best practices referenced above. They are binding for all contributors and AI agents.

### Text alternatives

- Every chart rendered by `para-chart` must produce a meaningful ARIA label that includes the chart type, axes, and overall finding.
- The self-voicing summary must accurately reflect the current data, not a stale template value.
- When a data table is available, it must be equivalent to the visual chart — same rows, same values, same order.

### Color and visual encoding

- Color must never be the sole channel for distinguishing data series. A secondary encoding (pattern, shape, or direct label) is required.
- Apply the Okabe-Ito or another verified colorblind-safe palette by default. Do not introduce palettes that fail for deuteranopia/protanopia without justification.
- All text labels, axis labels, and tick marks must meet 4.5:1 contrast (or 3:1 for large text) against their background.
- All non-text chart elements (bars, lines, data point markers) must meet 3:1 non-text contrast against adjacent colors (WCAG 2.2 SC 1.4.11).

### Keyboard operation

Every interactive chart behavior available by pointer must be operable by keyboard. The required bindings:

| Interaction | Key |
|---|---|
| Navigate between data points | Arrow keys |
| Navigate between series | Tab or documented shortcut |
| Activate popup / detail | Enter or Space |
| Dismiss popup | Escape |
| Return to chart overview | Home |
| Zoom in / out (when applicable) | + / − or labeled controls |

Keyboard shortcuts must be documented in `docs/shortcutsAndCommands.md` and kept in sync with runtime behavior. Undocumented shortcuts are not acceptable.

### Focus management

- All interactive data points, legend items, and control panel inputs must be reachable by keyboard and show a visible focus indicator.
- When a popup or panel opens, the announcement must reach screen readers — use `aria-live` or programmatic focus transfer, not visual-only feedback.
- When chart data is updated (filter, live refresh, time range change), announce the change via the ARIA live region.

### Tooltips

Tooltips must be accessible on focus, not on hover only. A tooltip visible only on `:hover` is a keyboard and mobile accessibility failure.

### SVG chart structure

ParaCharts renders using SVG. Required SVG accessibility markup:

- `<svg>` must carry `role="graphics-document"` or `role="img"` as appropriate for its interactive level.
- `<title>` and `<desc>` must be the first children inside `<svg>` and referenced via `aria-labelledby`.
- Decorative SVG elements (grid lines, backgrounds, decorative borders) must be hidden from assistive technology with `aria-hidden="true"`.
- Data point groups should use `role="list"` / `role="listitem"` where screen reader enumeration is useful.

### Sonification

Sonification is a non-visual channel, not a nice-to-have feature. Required behavior:

- Sonification and self-voicing toggles must be keyboard-accessible and clearly labeled.
- Changes to sonification state must be announced to screen readers.
- Sonification must not begin without explicit user action.
- Volume and playback controls must be operable by keyboard.

### Responsive and mobile

- Charts must be usable at 320px viewport width without horizontal scrolling (WCAG 2.2 SC 1.4.10 Reflow).
- Touch targets for interactive chart elements must be at least 24×24 CSS pixels (WCAG 2.2 SC 2.5.8).
- A "View as table" or equivalent fallback must be reachable on small viewports when the chart cannot be fully accessible at that size.

---

## Relevant WCAG 2.2 Success Criteria

| SC | Level | Requirement |
|---|---|---|
| 1.1.1 Non-text Content | A | All charts must have text alternatives that convey equivalent meaning |
| 1.3.1 Info and Relationships | A | Chart structure (axes, labels, series) must be programmatically determinable |
| 1.3.3 Sensory Characteristics | A | Instructions must not rely solely on color, shape, or position |
| 1.4.1 Use of Color | A | Color must not be the sole means of distinguishing data series |
| 1.4.3 Contrast (Minimum) | AA | Text labels and tick marks must meet 4.5:1 (3:1 large text) |
| 1.4.10 Reflow | AA | Charts must be usable at 320px without horizontal scrolling |
| 1.4.11 Non-text Contrast | AA | Chart lines, bars, and data markers must meet 3:1 against adjacent colors |
| 2.1.1 Keyboard | A | All interactive chart functionality must be operable by keyboard |
| 2.4.3 Focus Order | A | Focus sequence across chart, controls, and dialog must be logical |
| 2.4.7 Focus Visible | AA | Keyboard focus must be visible on all interactive chart elements |
| 2.5.8 Target Size (Minimum) | AA | Touch and click targets must be at least 24×24 CSS pixels |
| 4.1.2 Name, Role, Value | A | All interactive controls must have accessible names, roles, and states |
| 4.1.3 Status Messages | AA | Chart updates and announcements must reach screen readers via live regions |

---

## Definition Of Done For Accessibility-Sensitive Changes

A change that touches chart rendering, control panel, popups, keyboard handling, ARIA, or sonification is complete only when:

- [ ] All chart renderings produce accurate ARIA labels and summaries.
- [ ] Color is not the sole means of distinguishing any two data elements.
- [ ] All text labels and graphical elements meet WCAG 2.2 contrast requirements.
- [ ] All interactive functionality is keyboard-operable with visible focus.
- [ ] Dynamic updates are announced via the ARIA live region.
- [ ] Sonification and self-voicing toggles are keyboard-accessible.
- [ ] The chart renders without horizontal scrolling at 320px.
- [ ] No new keyboard or screen-reader blockers introduced.
- [ ] Keyboard shortcuts and interaction patterns documented in `docs/shortcutsAndCommands.md` are current.

---

## Known Gaps

The following are known accessibility gaps at the time of this writing. They are tracked as issues and are not yet resolved:

- Histogram, gauge, lollipop, and venn chart types have not been fully audited for keyboard and screen reader behavior. Example pages are deferred until the audit is completed.
- The scatter chart analysis tooltip content has not been tested end-to-end with NVDA and JAWS.
- Mobile touch target size for data point markers has not been formally measured against the 24×24px minimum.
- A full WCAG 2.2 AA conformance audit has not been conducted. Self-assessment against individual criteria is in progress.

---

## Issue Labels

Use these labels on GitHub issues related to accessibility:

- `accessibility` — any accessibility concern
- `keyboard` — keyboard navigation or focus management
- `screen-reader` — screen reader compatibility (NVDA, JAWS, VoiceOver, TalkBack)
- `color-contrast` — color or contrast failures
- `sonification` — audio feedback or sonification
- `wcag-a` / `wcag-aa` — conformance level of the issue

New accessibility issues should be triaged within two weeks. Critical barriers (WCAG Level A failures) block releases.

---

## Testing

### Automated

Run on every PR via CI:
- `axe-core` integration via Playwright browser tests (`npm run test:browser`)
- Color contrast checks in Vitest unit tests

### Manual checklist (required before release)

- [ ] Tab through the full chart, control panel, and dialog with keyboard only
- [ ] Verify visible focus indicator on every interactive element
- [ ] Test with NVDA + Firefox (Windows) or VoiceOver + Safari (macOS)
- [ ] Test with TalkBack + Chrome (Android) or VoiceOver + Safari (iOS)
- [ ] Verify ARIA live region announcements for data point selection and chart updates
- [ ] Verify sonification and self-voicing toggles work with keyboard and screen reader
- [ ] Verify data table equivalent is reachable and complete
- [ ] Verify no horizontal scrolling at 320px viewport width

### Screen reader testing procedure

For data point navigation:
1. Tab to the chart element.
2. Use arrow keys to move between data points.
3. Verify each point's label, value, and series name are announced.
4. Press Enter or Space to open a popup and confirm the popup content is read.
5. Press Escape to dismiss and confirm focus returns to the triggering data point.

---

## Reporting Accessibility Issues

File an issue at https://github.com/fizzstudio/ParaCharts/issues with the label `accessibility`.

Include:
- The browser and screen reader or assistive technology version
- The chart type and manifest or data you used
- The exact step that failed
- What you expected vs what happened

---

## References

- [Charts and Graphs Accessibility Best Practices](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/CHARTS_GRAPHS_ACCESSIBILITY_BEST_PRACTICES.md) — the primary reference for chart-specific accessibility requirements used in this project
- [ACCESSIBILITY.md open standard](https://github.com/mgifford/ACCESSIBILITY.md) — the framework for this file
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — the normative reference for all success criteria cited above
- [Keyboard Accessibility Best Practices](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/KEYBOARD_ACCESSIBILITY_BEST_PRACTICES.md)
- [SVG Accessibility Best Practices](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/SVG_ACCESSIBILITY_BEST_PRACTICES.md)
- [Audio/Video Accessibility Best Practices](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/AUDIO_VIDEO_ACCESSIBILITY_BEST_PRACTICES.md)
- [Okabe-Ito colorblind-safe palette](https://jfly.uni-koeln.de/color/)
- [Harvard HUIT: Data Visualization, Charts and Graphs Accessibility](https://accessibility.huit.harvard.edu/data-viz-charts-graphs)
- [Deque: How to Make Interactive Charts Accessible](https://www.deque.com/blog/how-to-make-interactive-charts-accessible/)
- [ParaCharts accessibility feature guide](docs/accessibility.md)
- [ParaCharts keyboard shortcuts reference](docs/shortcutsAndCommands.md)
