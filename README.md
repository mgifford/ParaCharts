# ParaCharts

The open-source, accessible charting toolkit from Fizz Studio for turning raw data into meaningful information.

ParaCharts focuses on:
- Data communication, not decoration
- Accessibility-first interaction (keyboard, screen reader, sonification, and self-voicing)
- Reusable web components for app and site integration

## Why ParaCharts

ParaCharts combines visual charts, textual descriptions, and audio exploration so more people can understand the same dataset.

Key capabilities:
- Multiple chart families: bar/column, line, scatter, heatmap, histogram, pie/donut, graph, venn, and more
- Rich control panel for chart appearance, data, audio, annotations, and analysis
- ARIA live updates and point-level descriptions
- Sonification and keyboard-first exploration

## How It Works

At a high level, ParaCharts works as a pipeline:

1. Provide a manifest containing chart type, data series, categories, and metadata.
2. Load ParaCharts via a custom element (`para-chart` or `para-chart-ai`).
3. ParaCharts renders the chart, labels, and accessibility metadata.
4. Users explore visually, by keyboard, through spoken summaries, or with sonification.

## Minimal Usage Example

```html
<para-chart
	manifestType="content"
	manifest='{
		"type": "column",
		"series": [{ "name": "Revenue", "data": [120, 150, 165, 200] }],
		"categories": ["Q1", "Q2", "Q3", "Q4"],
		"description": "Quarterly revenue in USD thousands"
	}'
></para-chart>
```

## Project Options At A Glance

- Chart type: choose a visual model that matches your data semantics
- Data input mode: inline content manifest or URL-driven manifest
- Accessibility options: sonification, self-voicing, ARIA announcements, keyboard navigation
- Visual options: color palettes, labels, title/subtitle, legend visibility, orientation
- Analysis options: summaries, outlier/trend exploration, annotations

See:
- `docs/chartTypes.md`
- `docs/controlPanel.md`
- `docs/accessibility.md`
- `docs/customElements.md`

## Local Development

```bash
npm ci
npm run dev
```

Useful scripts:
- `npm run build`: build primary package (`dist/`)
- `npm run build:ai`: build AI-enhanced package (`dist-ai/`)
- `npm run test:unit`: run unit tests
- `npm run test:browser`: run browser tests
- `npm run docs:dev`: run docs locally
- `npm run docs:build`: build docs for static hosting

## GitHub Pages And GitHub Actions

This repository already deploys documentation to GitHub Pages from `main` using `.github/workflows/deploy-docs.yml`.

This is ideal for showcasing:
- How ParaCharts works
- Chart type comparisons and examples
- Manifest recipes and integration snippets
- Accessibility and keyboard usage guidance

Current docs deployment flow:
1. Generate docs (`npm run docs:generate`)
2. Build VitePress site (`npm run docs:build`)
3. Deploy static artifact to GitHub Pages

## Working With Copilot On GitHub

Copilot can help make ParaCharts easier for contributors to adopt:
- In issues: ask Copilot to turn a feature request into implementation steps
- In pull requests: ask Copilot for reviews focused on accessibility and chart data integrity
- In code search/chat: ask Copilot to trace where a setting is defined and used

Prompt starters:
- "Generate a minimal ParaCharts manifest for a monthly line chart with two series and accessible descriptions."
- "Review this PR for keyboard, ARIA-live, and data-truthfulness risks."
- "Show where control panel options map to runtime chart settings."

## AI-Enhanced Build Notes

The AI-enhanced version is currently internal.

- Build with `npm run build:ai`.
- Output is written to `dist-ai/`.
- Entry point is `lib-ai/index-ai.ts`.
- Separate config files are used for AI build paths:
	- `ai.api-extractor.json`
	- `ai.tsconfig.json`
	- `ai.vite.config.ts`

The primary open package build remains `dist/`.
