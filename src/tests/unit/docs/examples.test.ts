import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../../../');
const DOCS_DIR = resolve(REPO_ROOT, 'docs');
const MANIFESTS_DIR = resolve(DOCS_DIR, 'data/manifests');

const exampleDocs = readdirSync(DOCS_DIR)
  .filter((name: string) => /^example-.*\.md$/.test(name))
  .toSorted();

function extractManifestPaths(markdown: string): string[] {
  const matches = markdown.matchAll(/<para-chart\s+[^>]*manifest="data\/manifests\/([^"]+)"/g);
  return Array.from(matches, match => match[1]);
}

describe('docs example integrity', () => {
  it('keeps local example manifests resolvable and parseable JSON', () => {
    const referencedManifestNames = new Set<string>();

    for (const fileName of exampleDocs) {
      const markdown = readFileSync(resolve(DOCS_DIR, fileName), 'utf-8');
      const manifestNames = extractManifestPaths(markdown);

      for (const manifestName of manifestNames) {
        referencedManifestNames.add(manifestName);

        const manifestPath = resolve(MANIFESTS_DIR, manifestName);
        expect(existsSync(manifestPath), `${fileName} references missing manifest ${manifestName}`).toBe(true);

        const parsed = JSON.parse(readFileSync(manifestPath, 'utf-8')) as any;
        expect(parsed?.datasets?.length, `${manifestName} should include at least one dataset`).toBeGreaterThan(0);
      }
    }

    // Most examples are para-chart based; keep a minimum floor so accidental removals fail loudly.
    expect(referencedManifestNames.size).toBeGreaterThanOrEqual(8);
  });

  it('keeps scatter-clusters page as static fallback example', () => {
    const markdown = readFileSync(resolve(DOCS_DIR, 'example-scatter-clusters.md'), 'utf-8');

    expect(markdown).toContain('assets/scatter.svg');
    expect(markdown).not.toContain('<para-chart');
  });
});
