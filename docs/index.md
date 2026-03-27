# ParaCharts Documentation

Welcome to the paracharts documentation.
This site contains information on how to get the most out of ParaCharts as an end-user, as well as developer documentation.

ParaCharts exists to close a persistent accessibility gap in online data visualization: many published charts are still visual-first and mouse-first. ParaCharts is built so chart insight is also available through keyboard interaction, screen-reader announcements, self-voicing, and sonification.

## Start Here

- [Getting Started](gettingStarted.md): what ParaCharts does, how it works, and a minimal first integration.
- [Implementation & Testing Guide](implementationAndTesting.md): how to add charts, wire monthly live data updates, and validate accessibility behavior.
- [GitHub Pages Showcase](githubPagesShowcase.md): what can be effectively demonstrated on GitHub Pages and how to use GitHub workflows and Copilot around it.
- [Example Gallery](exampleGallery.md): live chart examples with copyable manifests and interpretation prompts.

## User Guide

- [Chart Types](chartTypes.md): overview of chart types.
- [Control Panel & Settings](controlPanel.md): quick guide to the control panel tabs and common settings.
- [Shortcuts & Commands](shortcutsAndCommands.md): full keyboard reference and flows.
- [Accessibility Features](accessibility.md): disability-focused affordances, expected outcomes, and testing steps.

## Quick Workflow

1. Start with [Getting Started](gettingStarted.md) and load one manifest.
2. Use [Implementation & Testing Guide](implementationAndTesting.md) to add a page or data source.
3. Validate behavior using the accessibility test matrix in [Accessibility Features](accessibility.md).
4. Compare your output to the live patterns in [Example Gallery](exampleGallery.md).

## Developer Guide

- [Custom Elements](customElements.md): the `para-chart` and `para-chart-ai` elements.
- [Manifest](manifest.md): a description of the manifest format used by ParaCharts.
- [Settings object](settingsObj.md): the settings property of a ParaChart element.

## Experimental

- [Haptics Lab](haptics.md): exploratory page for evaluating tactile feedback (Web Vibration API) as a complement to chart sonification.
