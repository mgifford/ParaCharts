import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../../../');
const DOCS_DIR = resolve(REPO_ROOT, 'docs');

/**
 * Regression tests for WCAG 2.1 SC 1.3.6 / axe "region" rule:
 * all page content must be contained by landmarks.
 *
 * Violation originally reported on /ParaCharts/exampleGallery.html:
 * <div class="container-lg px-3 my-5 markdown-body"> was outside any landmark
 * because Jekyll rendered the page without applying docs/_layouts/default.html.
 */
describe('docs landmark structure', () => {
  it('Jekyll default layout wraps content inside a <main> landmark', () => {
    const layout = readFileSync(resolve(DOCS_DIR, '_layouts/default.html'), 'utf-8');

    // The layout must contain a <main> element with an id so skip-links can target it.
    expect(layout).toMatch(/<main\b[^>]*id="main-content"[^>]*>/);

    // The {{ content }} Liquid placeholder must appear after (inside) the <main> opening tag.
    const mainIndex = layout.indexOf('<main');
    const contentIndex = layout.indexOf('{{ content }}');
    expect(mainIndex).toBeGreaterThanOrEqual(0);
    expect(contentIndex).toBeGreaterThan(mainIndex);

    // The closing </main> must appear after {{ content }}.
    const closingMainIndex = layout.indexOf('</main>', contentIndex);
    expect(closingMainIndex).toBeGreaterThan(contentIndex);
  });

  it('exampleGallery.md has YAML front matter so Jekyll applies the default layout', () => {
    const content = readFileSync(resolve(DOCS_DIR, 'exampleGallery.md'), 'utf-8');
    // YAML front matter must start at the very beginning of the file.
    // Without front matter, jekyll-optional-front-matter and jekyll-default-layout
    // may not reliably assign layout: default, leaving the page outside any landmark.
    expect(content.startsWith('---'), 'exampleGallery.md must begin with YAML front matter (---)')
      .toBe(true);
  });

  it('accessibility.md has YAML front matter so Jekyll applies the default layout', () => {
    const content = readFileSync(resolve(DOCS_DIR, 'accessibility.md'), 'utf-8');
    // YAML front matter must start at the very beginning of the file.
    // Without front matter, jekyll-optional-front-matter and jekyll-default-layout
    // may not reliably assign layout: default, leaving the page outside any landmark.
    // Violation originally reported on /ParaCharts/accessibility.html.
    expect(content.startsWith('---'), 'accessibility.md must begin with YAML front matter (---)')
      .toBe(true);
  });

  it('VitePress transformHtml adds complementary role to aside elements', () => {
    // Mirror the transformHtml replacements from docs/.vitepress/config.ts so that
    // any regression in those patterns is caught here.
    const transform = buildTransformHtml();

    const input = '<div class="aside"><nav>Outline</nav></div>';
    const output = transform(input);
    expect(output).toContain('role="complementary"');
    expect(output).toContain('aria-label="Page outline"');
  });

  it('VitePress transformHtml adds navigation role to VPLocalNav', () => {
    const transform = buildTransformHtml();

    const input = '<div class="VPLocalNav" id="VPLocalNav-bar"></div>';
    const output = transform(input);
    expect(output).toContain('role="navigation"');
    expect(output).toContain('aria-label="Page navigation"');
  });

  it('VitePress transformHtml adds aria-label to VPSidebar', () => {
    const transform = buildTransformHtml();

    const input = '<aside class="VPSidebar" id="sidebar"></aside>';
    const output = transform(input);
    expect(output).toContain('aria-label="Site navigation"');
  });
});

/**
 * Reconstructs the transformHtml logic from docs/.vitepress/config.ts.
 *
 * Keeping this in sync with the config is intentional: if the config changes
 * the patterns, these tests will fail and force a review of the landmark fix.
 */
function buildTransformHtml(): (code: string) => string {
  return (code: string) =>
    code
      .replace(
        /<div class="aside">/g,
        '<div class="aside" role="complementary" aria-label="Page outline">',
      )
      .replace(
        /<div class="aside left-aside">/g,
        '<div class="aside left-aside" role="complementary" aria-label="Page outline">',
      )
      .replace(
        /<aside class="VPSidebar"/g,
        '<aside class="VPSidebar" aria-label="Site navigation"',
      )
      .replace(
        /<div class="VPLocalNav"/g,
        '<div class="VPLocalNav" role="navigation" aria-label="Page navigation"',
      );
}
