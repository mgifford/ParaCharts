import { afterEach, describe, expect, test, vi } from 'vitest';
import { waitFor } from '@testing-library/dom';
import { LoadErrorCode } from '../../../../lib/loader/paraloader';
import { getChartApplication, getParachart } from '../helpers';

type ExampleFixture = {
  name: string;
  manifest: string;
};

const exampleFixtures: ExampleFixture[] = [
  { name: 'bar comparison', manifest: '/docs/data/manifests/us-unemployment-monthly.json' },
  { name: 'line trend', manifest: '/docs/data/manifests/us-median-age-census.json' },
  { name: 'multiline crossover', manifest: '/docs/data/manifests/us-gdp-industry-tech.json' },
  { name: 'heatmap weekly', manifest: '/docs/data/manifests/us-unemployment-decade.json' },
  { name: 'donut budget', manifest: '/docs/data/manifests/us-electricity-top5.json' },
  { name: 'scatter macro live', manifest: '/docs/data/manifests/us-macro-scatter.json' },
  { name: 'heatmap hourly live', manifest: '/docs/data/manifests/us-hourly-temperature-heatmap.json' },
  { name: 'waterfall contribution live', manifest: '/docs/data/manifests/us-electricity-waterfall.json' },
  { name: 'stepline policy rate live', manifest: '/docs/data/manifests/us-policy-rate-stepline.json' },
  { name: 'inflation snapshot', manifest: '/docs/data/manifests/us-inflation-snapshot.json' },
  { name: 'policy unemployment line', manifest: '/docs/data/manifests/us-policy-unemployment-line.json' },
  { name: 'electricity top movers', manifest: '/docs/data/manifests/us-electricity-top-movers.json' },
  { name: 'policy scatter', manifest: '/docs/data/manifests/us-policy-scatter.json' },
];

function renderChart(manifest: string) {
  document.body.innerHTML = `<para-chart data-testid="para-chart" manifest="${manifest}"></para-chart>`;
  const chart = getParachart() as any;
  chart.config = { 'chart.isShowPopups': false };
  return chart;
}

async function waitForLoaderPromise(chart: any) {
  await waitFor(() => {
    expect(chart.loaded).toBeTruthy();
  }, { timeout: 5000 });
}

describe('docs example manifests', () => {
  afterEach(async () => {
    const chart = document.querySelector('para-chart') as any;
    if (chart?.loaded) {
      await chart.loaded.catch(() => {});
    }
    if (chart?.ready) {
      await chart.ready.catch(() => {});
    }
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  exampleFixtures.forEach(({ name, manifest }) => {
    test(`loads ${name} example manifest`, async () => {
      const chart = renderChart(manifest);
      await waitForLoaderPromise(chart);

      await chart.loaded;
      const app = await getChartApplication();

      expect(app.getAttribute('role')).toBe('application');
      expect(chart.paraState.dataState).toBe('complete');
    });
  });

  test('surfaces useful diagnostics for missing manifest files', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const chart = renderChart('/docs/data/manifests/does-not-exist.json');

    await waitForLoaderPromise(chart);
    const loadError = await chart.loaded.then(() => null).catch((error: Error) => error);

    expect(loadError).toBeTruthy();
    expect(chart.paraState.dataState).toBe('error');

    const diagnostics = [
      loadError?.message ?? '',
      ...consoleErrorSpy.mock.calls.flat().map((value: unknown) => String(value)),
    ].join(' ');

    expect(diagnostics).toContain('does-not-exist.json');
    expect(diagnostics).toMatch(/Failed to fetch manifest|404|NETWORK_ERROR/i);
  });

  test('surfaces useful diagnostics for malformed manifest content', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const chart = document.createElement('para-chart') as any;
    chart.setAttribute('data-testid', 'para-chart');
    chart.manifestType = 'content';
    chart.manifest = '{ "datasets": [ invalid }';
    chart.config = { 'chart.isShowPopups': false };
    document.body.innerHTML = '';
    document.body.append(chart);

    await waitForLoaderPromise(chart);
    const loadError = await chart.loaded.then(() => null).catch((error: any) => error);

    expect(loadError).toBeTruthy();
    expect(loadError.code).toBe(LoadErrorCode.MANIFEST_PARSE_ERROR);
    expect(chart.paraState.dataState).toBe('error');

    const diagnostics = [
      loadError?.message ?? '',
      ...consoleErrorSpy.mock.calls.flat().map((value: unknown) => String(value)),
    ].join(' ');

    expect(diagnostics).toMatch(/Failed to load manifest|MANIFEST_PARSE_ERROR|Unexpected token/i);
  });
});
