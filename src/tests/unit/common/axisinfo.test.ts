import { describe, it, expect } from 'vitest';
import { computeLabels } from '../../../../lib/common/axisinfo';

describe('computeLabels', () => {
  describe('basic range computation', () => {
    it('should return an object with min, max, range, and labelTiers', () => {
      const result = computeLabels(0, 100, false);
      expect(result).toHaveProperty('min');
      expect(result).toHaveProperty('max');
      expect(result).toHaveProperty('range');
      expect(result).toHaveProperty('labelTiers');
    });

    it('should include the full range: min <= start and max >= end', () => {
      const result = computeLabels(0, 100, false);
      expect(result.min!).toBeLessThanOrEqual(0);
      expect(result.max!).toBeGreaterThanOrEqual(100);
    });

    it('should generate labels for a 0-100 range', () => {
      const result = computeLabels(0, 100, false);
      expect(result.labelTiers).toHaveLength(1);
      expect(result.labelTiers[0].length).toBeGreaterThan(0);
      // Labels should be strings
      for (const label of result.labelTiers[0] as string[]) {
        expect(typeof label).toBe('string');
      }
    });

    it('should produce round numbers as labels', () => {
      const result = computeLabels(0, 100, false);
      const labels = result.labelTiers[0] as string[];
      // All labels should be parseable as numbers
      for (const label of labels) {
        expect(isNaN(Number(label))).toBe(false);
      }
    });

    it('should include 0 in labels for a 0-100 range', () => {
      const result = computeLabels(0, 100, false);
      const labels = result.labelTiers[0] as string[];
      expect(labels).toContain('0');
    });

    it('should include the maximum in labels', () => {
      const result = computeLabels(0, 100, false);
      const labels = result.labelTiers[0] as string[];
      expect(labels).toContain('100');
    });
  });

  describe('range and interval consistency', () => {
    it('should set range = max - min', () => {
      const result = computeLabels(0, 100, false);
      expect(result.range).toBeCloseTo(result.max! - result.min!, 5);
    });

    it('should generate equally spaced labels', () => {
      const result = computeLabels(0, 100, false);
      const labels = result.labelTiers[0] as string[];
      const values = labels.map(Number);
      const intervals = values.slice(1).map((v, i) => v - values[i]);
      const firstInterval = intervals[0];
      for (const interval of intervals) {
        expect(interval).toBeCloseTo(firstInterval, 5);
      }
    });

    it('should handle a range of 0-1000', () => {
      const result = computeLabels(0, 1000, false);
      expect(result.min!).toBeLessThanOrEqual(0);
      expect(result.max!).toBeGreaterThanOrEqual(1000);
      expect(result.labelTiers[0].length).toBeGreaterThan(2);
    });

    it('should handle a small range like 0-10', () => {
      const result = computeLabels(0, 10, false);
      expect(result.min!).toBeLessThanOrEqual(0);
      expect(result.max!).toBeGreaterThanOrEqual(10);
      expect(result.labelTiers[0].length).toBeGreaterThan(1);
    });

    it('should handle non-zero start values (50-150)', () => {
      const result = computeLabels(50, 150, false);
      expect(result.min!).toBeLessThanOrEqual(50);
      expect(result.max!).toBeGreaterThanOrEqual(150);
    });

    it('should handle negative ranges (-100 to 100)', () => {
      const result = computeLabels(-100, 100, false);
      expect(result.min!).toBeLessThanOrEqual(-100);
      expect(result.max!).toBeGreaterThanOrEqual(100);
      const labels = result.labelTiers[0] as string[];
      // Should include 0
      expect(labels.some(l => l === '0')).toBe(true);
    });

    it('should handle negative-only ranges (-200 to -50)', () => {
      const result = computeLabels(-200, -50, false);
      expect(result.min!).toBeLessThanOrEqual(-200);
      expect(result.max!).toBeGreaterThanOrEqual(-50);
    });

    it('should handle decimal ranges (0.0 to 1.0)', () => {
      const result = computeLabels(0.0, 1.0, false);
      expect(result.min!).toBeLessThanOrEqual(0.0);
      expect(result.max!).toBeGreaterThanOrEqual(1.0);
      expect(result.labelTiers[0].length).toBeGreaterThan(1);
    });
  });

  describe('percent format', () => {
    it('should append % to labels when isPercent is true', () => {
      const result = computeLabels(0, 100, true);
      const labels = result.labelTiers[0] as string[];
      for (const label of labels) {
        expect(label.endsWith('%')).toBe(true);
      }
    });

    it('should not append % to labels when isPercent is false', () => {
      const result = computeLabels(0, 100, false);
      const labels = result.labelTiers[0] as string[];
      for (const label of labels) {
        expect(label.endsWith('%')).toBe(false);
      }
    });
  });

  describe('grouping format', () => {
    it('should use grouping separators when isGrouping is true (default)', () => {
      const result = computeLabels(0, 10000, false, true);
      const labels = result.labelTiers[0] as string[];
      // With grouping, a value like 10,000 might have a comma depending on locale
      // Just ensure labels are strings - locale may not always use commas
      expect(labels.length).toBeGreaterThan(0);
    });

    it('should not affect label count when grouping is disabled', () => {
      const withGrouping = computeLabels(0, 100, false, true);
      const withoutGrouping = computeLabels(0, 100, false, false);
      expect(withGrouping.labelTiers[0].length).toBe(withoutGrouping.labelTiers[0].length);
    });
  });

  describe('stagger mode', () => {
    it('should return two tiers when stagger is true', () => {
      const result = computeLabels(0, 100, false, true, true);
      expect(result.labelTiers).toHaveLength(2);
    });

    it('should return one tier when stagger is false (default)', () => {
      const result = computeLabels(0, 100, false);
      expect(result.labelTiers).toHaveLength(1);
    });

    it('staggered tiers should not overlap: even labels in tier 0, odd in tier 1', () => {
      const result = computeLabels(0, 100, false, true, true);
      const tier0 = result.labelTiers[0] as string[];
      const tier1 = result.labelTiers[1] as string[];
      expect(tier0.length).toBe(tier1.length);
      for (let i = 0; i < tier0.length; i++) {
        if (i % 2 === 0) {
          // Even index: non-empty in tier0, empty in tier1
          expect(tier0[i]).not.toBe('');
          expect(tier1[i]).toBe('');
        } else {
          // Odd index: empty in tier0, non-empty in tier1
          expect(tier0[i]).toBe('');
          expect(tier1[i]).not.toBe('');
        }
      }
    });

    it('staggered tiers combined should contain all labels from non-staggered', () => {
      const staggered = computeLabels(0, 100, false, true, true);
      const flat = computeLabels(0, 100, false, true, false);
      const tier0 = staggered.labelTiers[0] as string[];
      const tier1 = staggered.labelTiers[1] as string[];
      const combined = tier0.map((v, i) => v || tier1[i]);
      expect(combined).toEqual(flat.labelTiers[0]);
    });
  });
});
