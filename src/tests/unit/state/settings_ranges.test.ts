import { describe, it, expect } from 'vitest';
import { settingRanges, type IntRange, type FloatRange, type NumericRange } from '../../../../lib/state/settings_ranges';

/** Returns true when the range's constraints are internally consistent. */
function isConsistentRange(range: NumericRange): boolean {
  if (range.type === 'int') {
    const r = range as IntRange;
    if (r.min !== undefined && r.max !== undefined) {
      return r.min <= r.max;
    }
    return true;
  }
  if (range.type === 'float') {
    const r = range as FloatRange;
    if (r.min !== undefined && r.max !== undefined) {
      return r.min <= r.max;
    }
    if (r.minOpen !== undefined && r.maxOpen !== undefined) {
      return r.minOpen < r.maxOpen;
    }
    if (r.min !== undefined && r.maxOpen !== undefined) {
      return r.min < r.maxOpen;
    }
    if (r.minOpen !== undefined && r.max !== undefined) {
      return r.minOpen < r.max;
    }
    return true;
  }
  return false;
}

describe('settingRanges', () => {
  describe('structure', () => {
    it('should be a non-empty record', () => {
      expect(typeof settingRanges).toBe('object');
      expect(Object.keys(settingRanges).length).toBeGreaterThan(0);
    });

    it('every entry should have a type of "int" or "float"', () => {
      for (const [key, range] of Object.entries(settingRanges)) {
        expect(['int', 'float'], `${key} has unexpected type`).toContain(range.type);
      }
    });

    it('every entry with min and max should satisfy min <= max', () => {
      for (const [key, range] of Object.entries(settingRanges)) {
        expect(isConsistentRange(range), `${key}: min/max inconsistent`).toBe(true);
      }
    });

    it('every key should be a dotted path (no spaces)', () => {
      for (const key of Object.keys(settingRanges)) {
        expect(key).toMatch(/^[a-zA-Z0-9.]+$/);
      }
    });
  });

  describe('expected keys are present', () => {
    const expectedKeys = [
      'chart.size.width',
      'chart.size.height',
      'chart.fontScale',
      'axis.horiz.ticks.opacity',
      'axis.vert.ticks.opacity',
      'color.contrastLevel',
      'popup.opacity',
      'sonification.hertzLower',
      'sonification.hertzUpper',
    ];

    for (const key of expectedKeys) {
      it(`should include the "${key}" setting`, () => {
        expect(settingRanges).toHaveProperty(key);
      });
    }
  });

  describe('int ranges', () => {
    it('chart.size.width should be an int with min >= 1', () => {
      const range = settingRanges['chart.size.width'] as IntRange;
      expect(range.type).toBe('int');
      expect(range.min).toBeGreaterThanOrEqual(1);
    });

    it('chart.size.height should be an int with min >= 1', () => {
      const range = settingRanges['chart.size.height'] as IntRange;
      expect(range.type).toBe('int');
      expect(range.min).toBeGreaterThanOrEqual(1);
    });

    it('axis.horiz.ticks.step should be an int with min >= 1 (step=0 causes NaN)', () => {
      const range = settingRanges['axis.horiz.ticks.step'] as IntRange;
      expect(range.type).toBe('int');
      expect(range.min).toBeGreaterThanOrEqual(1);
    });

    it('axis.vert.ticks.step should be an int with min >= 1', () => {
      const range = settingRanges['axis.vert.ticks.step'] as IntRange;
      expect(range.type).toBe('int');
      expect(range.min).toBeGreaterThanOrEqual(1);
    });

    it('type.histogram.bins should be an int with min >= 5', () => {
      const range = settingRanges['type.histogram.bins'] as IntRange;
      expect(range.type).toBe('int');
      expect(range.min).toBeGreaterThanOrEqual(5);
    });
  });

  describe('float ranges', () => {
    it('chart.fontScale should be a float with min >= 0.5', () => {
      const range = settingRanges['chart.fontScale'] as FloatRange;
      expect(range.type).toBe('float');
      expect(range.min).toBeGreaterThanOrEqual(0.5);
    });

    it('color.contrastLevel should be a float bounded [0, 1]', () => {
      const range = settingRanges['color.contrastLevel'] as FloatRange;
      expect(range.type).toBe('float');
      expect(range.min).toBe(0);
      expect(range.max).toBe(1);
    });

    it('popup.opacity should be a float bounded [0, 1]', () => {
      const range = settingRanges['popup.opacity'] as FloatRange;
      expect(range.type).toBe('float');
      expect(range.min).toBe(0);
      expect(range.max).toBe(1);
    });

    it('axis.horiz.ticks.opacity should be a float bounded [0, 1]', () => {
      const range = settingRanges['axis.horiz.ticks.opacity'] as FloatRange;
      expect(range.type).toBe('float');
      expect(range.min).toBe(0);
      expect(range.max).toBe(1);
    });

    it('axis.vert.ticks.opacity should be a float bounded [0, 1]', () => {
      const range = settingRanges['axis.vert.ticks.opacity'] as FloatRange;
      expect(range.type).toBe('float');
      expect(range.min).toBe(0);
      expect(range.max).toBe(1);
    });

    it('type.pie.annularThickness should use minOpen to exclude 0', () => {
      const range = settingRanges['type.pie.annularThickness'] as FloatRange;
      expect(range.type).toBe('float');
      expect(range.minOpen).toBe(0);
      expect(range.max).toBe(1);
    });

    it('type.donut.annularThickness should use minOpen to exclude 0', () => {
      const range = settingRanges['type.donut.annularThickness'] as FloatRange;
      expect(range.type).toBe('float');
      expect(range.minOpen).toBe(0);
      expect(range.max).toBe(1);
    });
  });

  describe('angle ranges', () => {
    it('horiz ticks label angle should be bounded [-180, 180]', () => {
      const range = settingRanges['axis.horiz.ticks.labels.angle'] as IntRange;
      expect(range.type).toBe('int');
      expect(range.min).toBe(-180);
      expect(range.max).toBe(180);
    });

    it('vert ticks label angle should be bounded [-180, 180]', () => {
      const range = settingRanges['axis.vert.ticks.labels.angle'] as IntRange;
      expect(range.type).toBe('int');
      expect(range.min).toBe(-180);
      expect(range.max).toBe(180);
    });
  });

  describe('non-negative constraints', () => {
    const nonNegativeKeys = [
      'chart.strokeWidth',
      'chart.strokeHighlightScale',
      'chart.symbolStrokeWidth',
      'chart.symbolHighlightScale',
      'axis.datapointMargin',
      'axis.minInterval',
      'legend.padding',
      'legend.margin',
      'popup.margin',
      'popup.maxWidth',
      'popup.borderRadius',
    ];

    for (const key of nonNegativeKeys) {
      it(`${key} should have min >= 0`, () => {
        const range = settingRanges[key];
        expect(range).toBeDefined();
        expect((range as any).min).toBeGreaterThanOrEqual(0);
      });
    }
  });
});
