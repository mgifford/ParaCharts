# AGENTS.md

Instructions for AI coding agents working in this repository.

This file is aligned with https://agents.md/ and incorporates accessibility and sustainability guidance inspired by:
- https://mgifford.github.io/ACCESSIBILITY.md
- https://mgifford.github.io/SUSTAINABILITY.md

For the full project accessibility commitment, requirements, known gaps, and testing checklist, see **[ACCESSIBILITY.md](ACCESSIBILITY.md)**.
For GitHub Copilot-specific instructions, see **[.github/copilot-instructions.md](.github/copilot-instructions.md)**.

## Scope and precedence

Use this precedence order when instructions conflict:
1. Direct user or maintainer instruction in the current task
2. The closest AGENTS.md in the directory tree
3. Repository conventions and existing code style

If a subproject adds its own AGENTS.md, the nearest one to edited files takes precedence.

## Project focus

ParaCharts exists to turn data into meaningful, trustworthy information through charts, tables, summaries, and sonification.

When making changes, optimize for:
- Data truthfulness and interpretability
- Accessibility and inclusive interaction
- Low resource cost and operational sustainability
- Maintainability of chart and graph behavior

## Repository map

Core areas:
- `lib/chart_types/`: chart implementations
- `lib/parachart/`, `lib/paraview/`: rendering and interaction orchestration
- `lib/control_panel/`: controls and UI for settings
- `lib/components/aria_live/`: assistive announcements
- `lib/assets/audio/`: sonification
- `lib/state/`: settings, defaults, keyboard mapping, and state management
- `docs/`: user and developer documentation

## Build, test, and docs commands

Use npm scripts from the repo root:
- `npm run build`: build primary package (`dist/`)
- `npm run build:ai`: build AI-enhanced package (`dist-ai/`)
- `npm run test:unit`: run unit tests
- `npm run test:browser`: run browser tests
- `npm run test:watch`: watch mode for tests
- `npm run docs:generate`: regenerate API/docs artifacts
- `npm run docs:dev`: local docs dev server

Before finishing substantial code changes, run relevant checks for touched areas.

## Chart and data integrity guardrails

Treat chart output as a data communication surface, not decoration.

Required behavior:
- Preserve source data meaning; never invent values or silently drop records.
- Explicitly document transformations (sorting, aggregation, normalization, bucketing, interpolation).
- Use chart types that match data semantics.
- Keep units, labels, legends, and scales unambiguous.
- Ensure table or textual fallbacks communicate equivalent insight.

Avoid misleading visual encodings:
- Bar-like comparisons should default to zero baselines unless a documented exception is required.
- If truncating axes or using non-linear scales, clearly signal this in labels and descriptions.
- Do not use color as the only channel for critical distinctions.

## Accessibility requirements (WCAG 2.2 AA target)

Accessibility is a quality gate. Full requirements, chart-specific rules, known gaps, and the testing checklist live in [ACCESSIBILITY.md](ACCESSIBILITY.md).

Minimum requirements for relevant UI changes:
- Full keyboard operation, visible focus, and logical focus order
- Screen-reader-friendly names, roles, states, and announcements
- Semantic structure and meaningful ARIA only when native semantics are insufficient
- Text alternatives for non-text chart meaning (summary, data table, or equivalent descriptions)
- Contrast-safe visuals and non-color encodings for key differences
- Motion and audio controls that are discoverable and keyboard accessible

ParaCharts-specific expectations:
- Preserve and test keyboard shortcuts and point navigation behavior.
- Preserve and test ARIA live summary updates.
- Preserve and test sonification and self-voicing toggles when touched.

Definition of done for accessibility-sensitive changes:
- No new critical keyboard or screen-reader blockers
- No new critical contrast or labeling regressions
- Updated docs when interaction patterns or shortcuts change

## Sustainability and low-impact engineering requirements

Use a deterministic-first decision order before AI-heavy or compute-heavy approaches:
1. Deterministic script/rule/tool
2. Existing local tooling/library
3. Cached or reusable output
4. Reduced execution frequency
5. Manual one-off action
6. AI only when clearly justified

Engineering guardrails:
- Keep bundles and assets lean; justify meaningful size increases.
- Avoid unnecessary dependencies, especially heavy runtime libraries.
- Gate expensive workflows to changed files when possible.
- Prefer simpler solutions that reduce compute, bandwidth, and maintenance cost.

AI usage policy:
- Keep prompts scoped to the task.
- Avoid repeated large-context prompts when a smaller context works.
- Disclose non-trivial AI usage in PR notes.
- Do not add always-on AI steps in CI without explicit maintainer approval.

## Testing and validation expectations

When code changes are made, agents should run checks appropriate to impact:
- Behavior and logic changes: `npm run test:unit`
- Interaction, rendering, accessibility behavior: `npm run test:browser`
- Public API or build-impacting changes: `npm run build`
- Docs generators/templates/API docs: `npm run docs:generate`

If checks cannot be run, report that clearly with reason and risk.

## PR and change reporting guidance

PR descriptions should include:
- What changed and why
- Accessibility impact (improves/neutral/regresses)
- Sustainability impact (improves/neutral/regresses)
- Data integrity impact (none or described explicitly)
- AI assistance disclosure (if used materially)

If a temporary exception is necessary, include:
- Rationale
- Owner
- Follow-up issue
- Expiry/revisit date

## Quick decision framework

If uncertain, choose the option that is:
1. More truthful to the data
2. More accessible to more users
3. Lower-impact in compute and bandwidth
4. Easier to test and maintain

## Interoperability note

AGENTS.md is plain Markdown and intended to be readable by humans and coding agents across tools. Keep instructions explicit, actionable, and current.
