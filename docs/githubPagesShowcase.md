# GitHub Pages Showcase

This page describes what ParaCharts can demonstrate well on GitHub Pages today, plus how to use GitHub and Copilot workflows to improve contributor experience.

## What Is Already In Place

Documentation is deployed from `main` using `.github/workflows/deploy-docs.yml`.

The deployment pipeline:
1. Installs dependencies
2. Runs `npm run docs:build`
3. Publishes `docs/.vitepress/dist` to GitHub Pages

## What To Showcase On GitHub Pages

GitHub Pages is best for static, high-signal documentation artifacts:
- Chart family overviews and visual examples
- Manifest recipes for common use cases
- Keyboard, accessibility, and sonification guides
- Control panel walkthroughs and option summaries
- Integration snippets for `para-chart` and `para-chart-ai`

Recommended docs flow for first-time visitors:
1. [Getting Started](gettingStarted.md)
2. [Chart Types](chartTypes.md)
3. [Control Panel & Settings](controlPanel.md)
4. [Accessibility Features](accessibility.md)
5. [Custom Elements](customElements.md)

## Ideas Borrowed From Related Fizz Repositories

Brief review of related projects surfaced useful patterns:

- From `fizzstudio/ParaCharts-demo`:
	- One chart per page with a clear chart title
	- A short set of "Chart questions" below each chart to guide interpretation
	- A simple index page linking to all sample charts
	- Manifest-per-example structure for easy reuse

- From `fizzstudio/paracharts-info`:
	- Audience-specific landing pages (for example, education and finance)
	- Narrative arc that works well on Pages: problem -> why current tools fail -> ParaCharts solution -> key features
	- Strong emphasis on accessibility barriers and equivalent insight for all users

Suggested adaptation for this repository:
1. Add an "Example Gallery" section with 6 to 10 focused chart pages.
2. For each example, include three interpretation prompts (the "chart questions" model).
3. Add two audience scenario pages (Education and Finance) that reuse the same chart examples but frame outcomes differently.
4. Keep every example page static-first so it runs well on GitHub Pages.

Current implementation in this repo:
- [Example Gallery](exampleGallery.md)
- [Bar Comparison Example](example-bar-comparison.md)
- [Line Trend Example](example-line-trend.md)
- [Multi-Line Crossover Example](example-multiline-crossover.md)
- [Scatter Clusters Example](example-scatter-clusters.md)
- [Heatmap Weekly Pattern Example](example-heatmap-weekly.md)
- [Donut Budget Share Example](example-donut-budget.md)

## What Usually Needs More Than Pages

For advanced live demos, static Pages may not be enough on its own:
- Real-time data ingestion
- Private AI-enhanced dependencies
- Heavy interactive playgrounds requiring custom bundling

Use Pages for explainability and onboarding, then link to richer hosted demos when needed.

## Copilot Through GitHub: Practical Uses

Copilot can help contributors move faster in the repository:

- Issues: convert feature ideas into implementable tasks
- Pull requests: review for accessibility, data integrity, and regression risks
- Code navigation: find where a control panel option maps to runtime behavior

Prompt starters:
- "Draft a ParaCharts manifest for a grouped column chart with two series and an accessibility description."
- "Review my changes for keyboard support, ARIA-live behavior, and data-encoding clarity."
- "Trace how the Audio tab toggles sonification and self-voicing in code."

## Suggested GitHub Project Checklist

Use this checklist to keep public docs useful and up to date:
- [ ] Every chart family has at least one realistic manifest example
- [ ] Accessibility and shortcut docs are current with runtime behavior
- [ ] Control panel options documented by tab with practical use cases
- [ ] README points to the Pages docs and key examples
- [ ] PR descriptions include accessibility and sustainability impact
