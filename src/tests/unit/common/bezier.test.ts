import { describe, it, expect } from 'vitest';
import { Bezier } from '../../../../lib/common/bezier';

describe('Bezier', () => {
  describe('constructor', () => {
    it('should create a Bezier with the correct number of segments', () => {
      const bezier = new Bezier(0.25, 0.1, 0.25, 1.0, 10);
      // numSegs points + 1 final point
      expect((bezier as any)._pts.length).toBe(11);
    });

    it('should always end at (1, 1)', () => {
      const bezier = new Bezier(0.25, 0.1, 0.25, 1.0, 5);
      const lastPt = (bezier as any)._pts[(bezier as any)._pts.length - 1];
      expect(lastPt.x).toBeCloseTo(1);
      expect(lastPt.y).toBeCloseTo(1);
    });

    it('should start near (0, 0) for a standard ease curve', () => {
      const bezier = new Bezier(0.25, 0.1, 0.25, 1.0, 100);
      const firstPt = (bezier as any)._pts[0];
      // At t=0, the cubic bezier from (0,0) to (1,1) with control points
      // (0.25, 0.1) and (0.25, 1.0) starts at the origin
      expect(firstPt.x).toBeCloseTo(0, 5);
      expect(firstPt.y).toBeCloseTo(0, 5);
    });

    it('should handle a linear bezier (control points on diagonal)', () => {
      // Control points on the diagonal produce a linear-like curve
      const bezier = new Bezier(0.33, 0.33, 0.67, 0.67, 20);
      expect((bezier as any)._pts.length).toBe(21);
    });

    it('should work with numSegs = 1', () => {
      const bezier = new Bezier(0.5, 0.5, 0.5, 0.5, 1);
      expect((bezier as any)._pts.length).toBe(2);
    });
  });

  describe('eval', () => {
    it('should return approximately 0 at x=0', () => {
      // Standard CSS ease: cubic-bezier(0.25, 0.1, 0.25, 1.0)
      const bezier = new Bezier(0.25, 0.1, 0.25, 1.0, 100);
      const result = bezier.eval(0);
      expect(result).toBeCloseTo(0, 1);
    });

    it('should return approximately 1 at x=1', () => {
      const bezier = new Bezier(0.25, 0.1, 0.25, 1.0, 100);
      const result = bezier.eval(1);
      expect(result).toBeCloseTo(1, 3);
    });

    it('should return a value between 0 and 1 for x in (0, 1)', () => {
      const bezier = new Bezier(0.25, 0.1, 0.25, 1.0, 100);
      const midResult = bezier.eval(0.5);
      expect(midResult).toBeGreaterThanOrEqual(0);
      expect(midResult).toBeLessThanOrEqual(1);
    });

    it('should be monotonically increasing for a standard ease curve', () => {
      const bezier = new Bezier(0.25, 0.1, 0.25, 1.0, 200);
      const values = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map(x => bezier.eval(x)!);
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
      }
    });

    it('should return a value close to x for a nearly linear bezier', () => {
      // cubic-bezier(0.33, 0.33, 0.67, 0.67) is close to linear
      const bezier = new Bezier(0.33, 0.33, 0.67, 0.67, 100);
      const result = bezier.eval(0.5);
      expect(result).toBeCloseTo(0.5, 1);
    });

    it('should return the last point y when x equals the last segment x', () => {
      const bezier = new Bezier(0.42, 0.0, 0.58, 1.0, 50); // ease-in-out
      const result = bezier.eval(1.0);
      expect(result).toBeCloseTo(1.0, 3);
    });

    it('should return a value for all x in [0, 1] that is between 0 and 1', () => {
      const bezier = new Bezier(0.25, 0.1, 0.25, 1.0, 100);
      const xs = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
      for (const x of xs) {
        const result = bezier.eval(x)!;
        expect(result, `eval(${x}) out of [0, 1]`).toBeGreaterThanOrEqual(0);
        expect(result, `eval(${x}) out of [0, 1]`).toBeLessThanOrEqual(1);
      }
    });

    it('should evaluate a curve with linear-like control points near the midpoint', () => {
      // cubic-bezier(0.5, 0.5, 0.5, 0.5) is not perfectly linear but close
      const bezier = new Bezier(0.5, 0.5, 0.5, 0.5, 200);
      const result = bezier.eval(0.5);
      expect(result).toBeCloseTo(0.5, 0);
    });
  });
});
