import { describe, it, expect } from 'vitest';
import {
  load,
  LoadError,
  LoadErrorCode,
} from '../../../../lib/loader/paraloader';

const createInlineManifest = (overrides: Record<string, any> = {}) => ({
  datasets: [{
    representation: {
      type: 'chart',
      subtype: 'bar'
    },
    title: 'Loader Browser Test',
    description: 'Loader browser test fixture',
    facets: {
      x: { label: 'x', variableType: 'independent', measure: 'ordinal', datatype: 'string', displayType: { type: 'axis', orientation: 'horizontal' } },
      y: { label: 'y', variableType: 'dependent', measure: 'ratio', datatype: 'number', displayType: { type: 'axis', orientation: 'vertical' } }
    },
    series: [
      {
        key: 'series-1',
        records: [
          { x: 'A', y: '1' },
          { x: 'B', y: '2' }
        ]
      }
    ],
    data: { source: 'inline' },
    ...overrides
  }]
});

describe('paraloader browser coverage', () => {
  it('loads inline manifest and applies chart type override', async () => {
    const manifestInput = JSON.stringify(createInlineManifest());
    const result = await load('content', manifestInput, 'line');

    expect(result.manifest.datasets[0].representation.subtype).toBe('line');
    expect(result.manifest.datasets[0].series).toHaveLength(1);
    expect(result.data).toBeUndefined();
  });

  it('returns detailed NETWORK_ERROR for a missing manifest URL', async () => {
    await expect(load('url', '/definitely-missing-manifest.json')).rejects.toMatchObject({
      name: 'LoadError',
      code: LoadErrorCode.NETWORK_ERROR,
    });

    try {
      await load('url', '/definitely-missing-manifest.json');
    } catch (error) {
      const err = error as LoadError;
      expect(err.message).toContain('Failed to fetch manifest');
      expect(err.message).toContain('/definitely-missing-manifest.json');
      expect(err.message).toContain('404');
    }
  });

  it('returns MANIFEST_PARSE_ERROR for malformed JSON content', async () => {
    await expect(load('content', '{ "datasets": [ invalid }')).rejects.toMatchObject({
      name: 'LoadError',
      code: LoadErrorCode.MANIFEST_PARSE_ERROR,
    });
  });

  it('returns detailed NETWORK_ERROR for missing external CSV data', async () => {
    const manifestInput = JSON.stringify(createInlineManifest({
      data: {
        source: 'external',
        path: '/definitely-missing-data.csv'
      },
      series: [
        { key: 'sales', records: [] },
        { key: 'profit', records: [] }
      ]
    }));

    await expect(load('content', manifestInput)).rejects.toMatchObject({
      name: 'LoadError',
      code: LoadErrorCode.NETWORK_ERROR,
    });

    try {
      await load('content', manifestInput);
    } catch (error) {
      const err = error as LoadError;
      expect(err.message).toContain('Failed to fetch CSV');
      expect(err.message).toContain('/definitely-missing-data.csv');
      expect(err.message).toContain('404');
    }
  });
});