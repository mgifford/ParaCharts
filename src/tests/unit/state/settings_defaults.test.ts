import { describe, it, expect } from 'vitest';
import { defaults, chartTypeDefaults } from '../../../../lib/state/settings_defaults';

describe('defaults', () => {
  describe('structure', () => {
    it('should be a defined object', () => {
      expect(defaults).toBeDefined();
      expect(typeof defaults).toBe('object');
    });

    it('should have a chart section', () => {
      expect(defaults.chart).toBeDefined();
    });

    it('should have an axis section', () => {
      expect(defaults.axis).toBeDefined();
    });

    it('should have a legend section', () => {
      expect(defaults.legend).toBeDefined();
    });

    it('should have a color section', () => {
      expect(defaults.color).toBeDefined();
    });

    it('should have a popup section', () => {
      expect(defaults.popup).toBeDefined();
    });

    it('should have a sonification section', () => {
      expect(defaults.sonification).toBeDefined();
    });
  });

  describe('chart defaults', () => {
    it('should have a positive default width', () => {
      expect(defaults.chart!.size!.width).toBeGreaterThan(0);
    });

    it('should have a positive default height', () => {
      expect(defaults.chart!.size!.height).toBeGreaterThan(0);
    });

    it('default width should be 600', () => {
      expect(defaults.chart!.size!.width).toBe(600);
    });

    it('default height should be 450', () => {
      expect(defaults.chart!.size!.height).toBe(450);
    });

    it('should have a default chart type', () => {
      expect(defaults.chart!.type).toBeDefined();
      expect(typeof defaults.chart!.type).toBe('string');
    });

    it('default chart type should be "bar"', () => {
      expect(defaults.chart!.type).toBe('bar');
    });

    it('should have a font scale >= 0.5', () => {
      expect(defaults.chart!.fontScale!).toBeGreaterThanOrEqual(0.5);
    });

    it('should have positive strokeWidth', () => {
      expect(defaults.chart!.strokeWidth!).toBeGreaterThan(0);
    });

    it('should have strokeHighlightScale >= 1', () => {
      expect(defaults.chart!.strokeHighlightScale!).toBeGreaterThanOrEqual(1);
    });

    it('should have positive symbolStrokeWidth', () => {
      expect(defaults.chart!.symbolStrokeWidth!).toBeGreaterThan(0);
    });

    it('should have symbolHighlightScale >= 1', () => {
      expect(defaults.chart!.symbolHighlightScale!).toBeGreaterThanOrEqual(1);
    });
  });

  describe('axis defaults', () => {
    it('should have minInterval >= 0', () => {
      expect(defaults.axis!.minInterval!).toBeGreaterThanOrEqual(0);
    });

    it('should have datapointMargin >= 0', () => {
      expect(defaults.axis!.datapointMargin!).toBeGreaterThanOrEqual(0);
    });

    it('horizontal axis ticks step should be >= 1', () => {
      expect(defaults.axis!.horiz!.ticks!.step!).toBeGreaterThanOrEqual(1);
    });

    it('vertical axis ticks step should be >= 1', () => {
      expect(defaults.axis!.vert!.ticks!.step!).toBeGreaterThanOrEqual(1);
    });

    it('horizontal ticks opacity should be between 0 and 1', () => {
      const opacity = defaults.axis!.horiz!.ticks!.opacity!;
      expect(opacity).toBeGreaterThanOrEqual(0);
      expect(opacity).toBeLessThanOrEqual(1);
    });

    it('vertical ticks opacity should be between 0 and 1', () => {
      const opacity = defaults.axis!.vert!.ticks!.opacity!;
      expect(opacity).toBeGreaterThanOrEqual(0);
      expect(opacity).toBeLessThanOrEqual(1);
    });

    it('horiz ticks label angle should be in [-180, 180]', () => {
      const angle = defaults.axis!.horiz!.ticks!.labels!.angle!;
      expect(angle).toBeGreaterThanOrEqual(-180);
      expect(angle).toBeLessThanOrEqual(180);
    });

    it('vert ticks label angle should be in [-180, 180]', () => {
      const angle = defaults.axis!.vert!.ticks!.labels!.angle!;
      expect(angle).toBeGreaterThanOrEqual(-180);
      expect(angle).toBeLessThanOrEqual(180);
    });

    it('x axis minValue/maxValue should default to "unset"', () => {
      expect(defaults.axis!.x!.minValue).toBe('unset');
      expect(defaults.axis!.x!.maxValue).toBe('unset');
    });

    it('y axis minValue/maxValue should default to "unset"', () => {
      expect(defaults.axis!.y!.minValue).toBe('unset');
      expect(defaults.axis!.y!.maxValue).toBe('unset');
    });
  });

  describe('legend defaults', () => {
    it('should have padding >= 0', () => {
      expect(defaults.legend!.padding!).toBeGreaterThanOrEqual(0);
    });

    it('should have margin >= 0', () => {
      expect(defaults.legend!.margin!).toBeGreaterThanOrEqual(0);
    });

    it('should have a position string', () => {
      expect(typeof defaults.legend!.position).toBe('string');
    });
  });

  describe('popup defaults', () => {
    it('should have opacity between 0 and 1', () => {
      expect(defaults.popup!.opacity!).toBeGreaterThanOrEqual(0);
      expect(defaults.popup!.opacity!).toBeLessThanOrEqual(1);
    });

    it('should have non-negative padding values', () => {
      expect(defaults.popup!.leftPadding!).toBeGreaterThanOrEqual(0);
      expect(defaults.popup!.rightPadding!).toBeGreaterThanOrEqual(0);
      expect(defaults.popup!.upPadding!).toBeGreaterThanOrEqual(0);
      expect(defaults.popup!.downPadding!).toBeGreaterThanOrEqual(0);
    });

    it('should have positive maxWidth', () => {
      expect(defaults.popup!.maxWidth!).toBeGreaterThan(0);
    });

    it('should have non-negative margin', () => {
      expect(defaults.popup!.margin!).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('chartTypeDefaults', () => {
  it('should be a defined object', () => {
    expect(chartTypeDefaults).toBeDefined();
    expect(typeof chartTypeDefaults).toBe('object');
  });

  it('should include overrides for "bar"', () => {
    expect(chartTypeDefaults.bar).toBeDefined();
  });

  it('should include overrides for "column"', () => {
    expect(chartTypeDefaults.column).toBeDefined();
  });

  it('should include overrides for "line"', () => {
    expect(chartTypeDefaults.line).toBeDefined();
  });

  it('bar should set orientation to "east"', () => {
    expect(chartTypeDefaults.bar!['chart.orientation']).toBe('east');
  });

  it('column should have horiz tick settings', () => {
    expect(chartTypeDefaults.column!['axis.horiz.ticks.isDrawTicks']).toBeDefined();
  });

  it('line should have grid settings', () => {
    expect(chartTypeDefaults.line!['grid.isDrawVertLines']).toBeDefined();
  });

  it('all chart type overrides should use string keys (dotted paths)', () => {
    for (const [chartType, overrides] of Object.entries(chartTypeDefaults)) {
      for (const key of Object.keys(overrides!)) {
        expect(key, `${chartType}: key "${key}" should be a dotted path`).toMatch(/^[a-zA-Z0-9.]+$/);
      }
    }
  });
});
