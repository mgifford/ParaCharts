# Implementation & Testing Guide

This guide explains how to implement ParaCharts in a practical way, how accessibility affordances are delivered, and how to test what users actually receive.

## Architecture At A Glance

ParaCharts in this repository follows this pattern:

1. Third-party data sources are fetched by update scripts.
2. Scripts write validated manifests into `docs/data/manifests`.
3. Documentation pages point to local cached manifest files.
4. GitHub Actions refreshes cached data monthly.
5. Users consume charts with visual, keyboard, screen-reader, and audio affordances.

## Implementation Recipe

### Recipe A: Add A Static Or Semi-Static Chart

1. Create a manifest JSON file.
2. Add a page in `docs/` with a `para-chart` element.
3. Point the element to your manifest path.
4. Add a short scenario, source note, and interpretation prompts.
5. Link the new page from [Example Gallery](exampleGallery.md).

Minimal page embed:

```html
<para-chart manifest="data/manifests/your-manifest.json"></para-chart>
```

### Recipe B: Add A Monthly Live Chart

1. Add a builder function in `docs/scripts/update_live_data.py`.
2. Keep transforms explicit and deterministic.
3. Validate output manifest before writing.
4. Add your new target to the `targets` list in the updater.
5. Run the updater locally.
6. Create/update the docs page that points at your cached manifest.
7. Confirm status appears in `docs/data/live-data-status.json`.

## Accessibility Affordances You Deliver

When implemented correctly, a chart should provide:

- Keyboard navigation for chart exploration.
- Queryable point-level descriptions.
- ARIA live announcement behavior for summaries/updates.
- Sonification mode (`s`) for trend perception.
- Self-voicing mode (`v`) for spoken summaries.

Use [Accessibility Features](accessibility.md) as the source of truth for expected behavior and acceptance criteria.

## Testing Workflow

### 1. Data And Manifest Validation

Run the updater:

```bash
python3 docs/scripts/update_live_data.py
```

Expected:

- `Updated` count increases for healthy sources.
- `Failures without cache` stays at `0` for production-ready changes.
- `docs/data/live-data-status.json` reflects source states.

### 2. Build And Regression Checks

Recommended commands:

```bash
npm run build
npm run test:unit
npm run test:browser
```

Use browser tests when interaction, keyboard, accessibility, or rendering behavior changes.

### 3. Manual Accessibility Test Pass

For each changed chart page:

1. Focus chart and navigate with arrow keys.
2. Trigger `q` and verify meaningful point-level output.
3. Toggle `s` and verify sonification output changes with datapoints.
4. Toggle `v` and verify speech output behavior.
5. Confirm chart meaning is still understandable without color cues alone.

### 4. Documentation QA

1. Confirm page links appear in [Example Gallery](exampleGallery.md).
2. Confirm source and refresh policy text is present.
3. Confirm chart title, units, and labels match actual data semantics.

## Common Failure Modes

- Third-party API changed schema:
  - Symptom: parser error in updater.
  - Action: update parser and keep cache-retention behavior.

- Manifest shape drift:
  - Symptom: chart renders controls but no data marks.
  - Action: compare against existing known-good manifests.

- Keyboard shortcuts not responding:
  - Symptom: key commands do nothing.
  - Action: ensure chart has focus before testing.

## Done Criteria For New Chart Pages

A page is complete when all are true:

1. Manifest data is current and cached locally.
2. Monthly updater regenerates it successfully.
3. Accessibility smoke checks pass.
4. Source attribution and refresh notes are documented.
5. Example index links are updated.
