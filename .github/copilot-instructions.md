# GitHub Copilot Instructions for ParaCharts

These instructions apply to every Copilot session in this repository.
The full agent specification is in [AGENTS.md](../AGENTS.md).
The accessibility commitment and requirements are in [ACCESSIBILITY.md](../ACCESSIBILITY.md).

---

## Project Purpose

ParaCharts turns data into meaningful, trustworthy information through accessible charts, data tables, text summaries, and sonification. The `para-chart` and `para-chart-ai` custom elements are the primary public API.

---

## Non-Negotiable Rules

### Accessibility is a quality gate — not optional

- **Color must never be the only channel** for distinguishing data series. Add a shape, pattern, or direct label.
- **All interactive behavior must be keyboard-operable.** Arrow keys navigate data points; Tab navigates between series and controls; Enter/Space activates; Escape dismisses.
- **Keyboard focus must be visible** on every interactive element. Never suppress the focus ring without a CSS-based visible replacement.
- **ARIA live regions must announce** chart updates, selected point changes, and state changes to screen readers. The `lib/components/aria_live/` module handles this — use it, do not bypass it.
- **Text alternatives must convey meaning**, not describe the image ("chart showing data" is not acceptable). Include chart type, axes, trend, and key finding.
- **Sonification and self-voicing controls must be keyboard-accessible** and clearly labeled.
- **Tooltips must be accessible on focus, not hover only.**
- When in doubt, see [ACCESSIBILITY.md](../ACCESSIBILITY.md) and the [Charts and Graphs Accessibility Best Practices](https://github.com/mgifford/ACCESSIBILITY.md/blob/main/examples/CHARTS_GRAPHS_ACCESSIBILITY_BEST_PRACTICES.md).

### Data integrity

- Never invent, smooth, interpolate, or silently drop data values.
- Document all transformations (aggregation, normalization, sorting, bucketing) explicitly.
- Chart type must match data semantics — do not suggest a chart type that would mislead.
- Bar/column baselines default to zero unless the exception is documented.
- Do not use color as the only distinguishing channel for data (this is both a data integrity and accessibility rule).

### Scope discipline

- Make only the changes needed to address the current task. Do not refactor surrounding code, add new features, or clean up unrelated files unless explicitly asked.
- Do not add comments or docstrings to code you did not change.
- Do not add error handling for scenarios that cannot happen. Validate only at real system boundaries.

### Sustainability

- Keep bundles lean. Justify any meaningful size increase.
- Avoid adding new runtime dependencies unless there is no adequate existing alternative.
- Use deterministic logic before AI-assisted approaches. Only reach for AI when simpler tools cannot do the job.

---

## Codebase Map

| Path | What it contains |
|---|---|
| `lib/chart_types/` | Chart-type info classes (bar, line, scatter, heatmap, waterfall, etc.) |
| `lib/parachart/` | `para-chart` web component |
| `lib/paraview/` | Rendering orchestration |
| `lib/control_panel/` | Control panel UI and settings |
| `lib/components/aria_live/` | ARIA live region announcements |
| `lib/assets/audio/` | Sonification engine |
| `lib/state/` | Settings, defaults, keyboard mapping, state management |
| `lib/loader/` | Manifest loading and CSV parsing |
| `docs/` | User and developer documentation (VitePress) |
| `docs/data/manifests/` | Live-data manifest JSON files |
| `docs/scripts/update_live_data.py` | Monthly live-data updater (Python) |
| `src/tests/browser/` | Playwright browser tests |
| `src/tests/unit/` | Vitest unit tests |

---

## Build and Test Commands

Before finishing any change, run checks appropriate to what was touched:

- `npm run test:unit` — unit tests (behavior, logic, settings)
- `npm run test:browser` — browser/Playwright tests (rendering, keyboard, ARIA, accessibility)
- `npm run build` — build the primary package
- `npm run docs:generate` — regenerate API and docs artifacts

If commands cannot run due to environment constraints, state that clearly and explain the impact.

---

## PR and Commit Guidance

Every non-trivial PR description must include:

- **What changed and why**
- **Accessibility impact:** improves / neutral / regresses (and details if not neutral)
- **Data integrity impact:** none / described explicitly
- **AI assistance disclosure:** if Copilot was used materially in the PR

---

## Accessibility Quick Reference

WCAG 2.2 AA is the target. The most commonly relevant criteria for this codebase:

| SC | Level | Rule |
|---|---|---|
| 1.1.1 | A | Every chart needs a meaningful text alternative |
| 1.4.1 | A | Color alone is never sufficient to distinguish data |
| 1.4.3 | AA | Text labels need 4.5:1 contrast (3:1 large text) |
| 1.4.11 | AA | Chart lines, bars, and markers need 3:1 non-text contrast |
| 2.1.1 | A | All interactive chart behavior must be keyboard-operable |
| 2.4.7 | AA | Keyboard focus must be visible |
| 4.1.2 | A | All interactive controls need accessible name, role, and state |
| 4.1.3 | AA | Dynamic updates must be announced via live regions |

Full details: [ACCESSIBILITY.md](../ACCESSIBILITY.md)
