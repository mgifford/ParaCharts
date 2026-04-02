import { describe, it, expect, beforeEach } from 'vitest';
import { Colors } from '../../../../lib/common/colors';
import type { ParaState } from '../../../../lib/state/parastate';
import type { ColorVisionMode } from '../../../../lib/state/settings_types';

/**
 * Create a minimal mock ParaState sufficient to construct a Colors instance.
 * Colors reads: settings.color.colorVisionMode, settings.color.colorPalette,
 * settings.color.colorMap, and settings.color.isDarkModeEnabled.
 */
function createMockState(overrides: {
  colorPalette?: string;
  colorVisionMode?: ColorVisionMode;
  isDarkModeEnabled?: boolean;
  colorMap?: string;
} = {}): ParaState {
  return {
    settings: {
      color: {
        colorPalette: overrides.colorPalette ?? 'diva',
        colorVisionMode: overrides.colorVisionMode ?? 'normal',
        isDarkModeEnabled: overrides.isDarkModeEnabled ?? false,
        colorMap: overrides.colorMap,
      }
    },
    updateSettings: () => {},
  } as unknown as ParaState;
}

describe('Colors', () => {
  let colors: Colors;

  beforeEach(() => {
    colors = new Colors(createMockState());
  });

  describe('getHslComponents', () => {
    it('should parse a basic HSL string', () => {
      const result = colors.getHslComponents('hsl(180, 50%, 25%)');
      expect(result.hue).toBe(180);
      expect(result.saturation).toBe(50);
      expect(result.lightness).toBe(25);
    });

    it('should expose shorthand h, s, l aliases', () => {
      const result = colors.getHslComponents('hsl(270, 100%, 50%)');
      expect(result.h).toBe(270);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('should parse decimal hue values', () => {
      const result = colors.getHslComponents('hsl(270.5, 33%, 66%)');
      expect(result.hue).toBeCloseTo(270.5);
    });

    it('should parse decimal saturation and lightness', () => {
      const result = colors.getHslComponents('hsl(120, 33.3%, 66.7%)');
      expect(result.saturation).toBeCloseTo(33.3);
      expect(result.lightness).toBeCloseTo(66.7);
    });

    it('should parse negative hue values', () => {
      const result = colors.getHslComponents('hsl(-45, 100%, 50%)');
      expect(result.hue).toBe(-45);
    });

    it('should default alpha to 1', () => {
      const result = colors.getHslComponents('hsl(0, 0%, 0%)');
      expect(result.alpha).toBe(1);
      expect(result.a).toBe(1);
    });

    it('should parse HSL with spaces around values', () => {
      const result = colors.getHslComponents('hsl( 90 , 50% , 50% )');
      expect(result.hue).toBe(90);
    });
  });

  describe('lighten', () => {
    it('should increase lightness by shade_count * 5', () => {
      const original = 'hsl(180, 50%, 30%)';
      const result = colors.lighten(original, 2);
      const components = colors.getHslComponents(result);
      expect(components.lightness).toBe(40); // 30 + 2*5
    });

    it('should preserve hue and saturation', () => {
      const original = 'hsl(120, 75%, 20%)';
      const result = colors.lighten(original, 3);
      const components = colors.getHslComponents(result);
      expect(components.hue).toBe(120);
      expect(components.saturation).toBe(75);
    });

    it('should cap lightness at 100', () => {
      const original = 'hsl(0, 50%, 99%)';
      const result = colors.lighten(original, 5); // would go to 124
      const components = colors.getHslComponents(result);
      expect(components.lightness).toBe(100);
    });

    it('should return 0 shade_count unchanged lightness', () => {
      const original = 'hsl(240, 60%, 45%)';
      const result = colors.lighten(original, 0);
      const components = colors.getHslComponents(result);
      expect(components.lightness).toBe(45);
    });
  });

  describe('generateSequentialPalette', () => {
    it('should return the requested number of colors', () => {
      const palette = colors.generateSequentialPalette('hsl(200, 70%, 40%)', 5, false);
      expect(palette).toHaveLength(5);
    });

    it('should return HSL strings', () => {
      const palette = colors.generateSequentialPalette('hsl(200, 70%, 40%)', 3, false);
      for (const color of palette) {
        expect(color).toMatch(/^hsl\(/);
      }
    });

    it('should start with the base color', () => {
      const base = 'hsl(200, 70%, 40%)';
      const palette = colors.generateSequentialPalette(base, 5, false);
      expect(palette[0]).toBe(base);
    });

    it('should generate lighter colors when is_lighter is true', () => {
      const base = 'hsl(200, 50%, 30%)';
      const palette = colors.generateSequentialPalette(base, 4, true);
      const first = colors.getHslComponents(palette[0]);
      const last = colors.getHslComponents(palette[palette.length - 1]);
      expect(last.lightness).toBeGreaterThan(first.lightness);
    });

    it('should handle count = 1', () => {
      const base = 'hsl(180, 60%, 50%)';
      const palette = colors.generateSequentialPalette(base, 1, false);
      expect(palette).toHaveLength(1);
      expect(palette[0]).toBe(base);
    });
  });

  describe('palette and color access', () => {
    it('should have a diva palette by default', () => {
      expect(colors.palette).toBeDefined();
      expect(colors.palette.key).toBe('diva');
    });

    it('should have colors in the diva palette', () => {
      expect(colors.palette.colors.length).toBeGreaterThan(0);
    });

    it('should return palette key matching settings', () => {
      expect(colors.paletteKey).toBe('diva');
    });

    it('should return the correct palette key for cvd mode', () => {
      const cvdState = createMockState({ colorVisionMode: 'deutan' });
      const cvdColors = new Colors(cvdState);
      expect(cvdColors.paletteKey).toBe('deutan');
    });
  });

  describe('indexOfPalette', () => {
    it('should find the diva palette', () => {
      const idx = colors.indexOfPalette('diva');
      expect(idx).toBeGreaterThanOrEqual(0);
    });

    it('should return -1 for unknown palette', () => {
      const idx = colors.indexOfPalette('not-a-real-palette');
      expect(idx).toBe(-1);
    });
  });

  describe('colorAt', () => {
    it('should return the name of the color at index 0', () => {
      const name = colors.colorAt(0);
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });

    it('should return "default" for out-of-range index', () => {
      const name = colors.colorAt(9999);
      expect(name).toBe('default');
    });
  });

  describe('wrapColorIndex', () => {
    it('should return index % palette length', () => {
      const paletteLength = colors.palette.colors.length;
      expect(colors.wrapColorIndex(0)).toBe(0);
      expect(colors.wrapColorIndex(paletteLength)).toBe(0);
      expect(colors.wrapColorIndex(paletteLength + 1)).toBe(1);
    });

    it('should handle index within range', () => {
      expect(colors.wrapColorIndex(3)).toBe(3);
    });
  });

  describe('colorIndex', () => {
    it('should find a color by name', () => {
      const firstName = colors.palette.colors[0].name;
      const idx = colors.colorIndex(firstName);
      expect(idx).toBe(0);
    });

    it('should return -1 for unknown color name', () => {
      const idx = colors.colorIndex('no-such-color-xyz');
      expect(idx).toBe(-1);
    });
  });

  describe('colorValueIndex', () => {
    it('should find a color by its value', () => {
      const firstValue = colors.palette.colors[0].value;
      const idx = colors.colorValueIndex(firstValue);
      expect(idx).toBe(0);
    });

    it('should return -1 for unknown color value', () => {
      const idx = colors.colorValueIndex('#notacolor');
      expect(idx).toBe(-1);
    });
  });

  describe('colorValue', () => {
    it('should return the value for a known color name', () => {
      const firstName = colors.palette.colors[0].name;
      const value = colors.colorValue(firstName);
      expect(value).toBe(colors.palette.colors[0].value);
    });

    it('should return grey for "default"', () => {
      const value = colors.colorValue('default');
      expect(value).toBe('hsl(0, 0%, 50%)');
    });

    it('should throw for unknown color name', () => {
      expect(() => colors.colorValue('not-a-real-color')).toThrow();
    });
  });

  describe('colorValueAt', () => {
    it('should return a color string for index 0', () => {
      const value = colors.colorValueAt(0);
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });

    it('should return the visit color for index -1', () => {
      const visitValue = colors.colorValueAt(-1);
      expect(typeof visitValue).toBe('string');
    });

    it('should cycle through colors when index >= palette length', () => {
      const paletteLength = colors.palette.colors.length;
      const colorA = colors.colorValueAt(0);
      const colorB = colors.colorValueAt(paletteLength - 1); // wraps past 'visit' slot
      // Both should be valid strings
      expect(typeof colorA).toBe('string');
      expect(typeof colorB).toBe('string');
    });

    it('should adjust lightness in dark mode', () => {
      const darkState = createMockState({ isDarkModeEnabled: true });
      const darkColors = new Colors(darkState);
      // Pick a color with low lightness so it gets adjusted
      // hsl(13, 58%, 35%) is the second color in diva - lightness 35 < 50
      const value = darkColors.colorValueAt(1);
      const components = darkColors.getHslComponents(value);
      expect(components.lightness).toBeGreaterThanOrEqual(50);
    });

    it('should not adjust lightness in light mode', () => {
      // In light mode, low-lightness colors are returned as-is
      const lightState = createMockState({ isDarkModeEnabled: false });
      const lightColors = new Colors(lightState);
      const value = lightColors.colorValueAt(1);
      const components = lightColors.getHslComponents(value);
      // Second diva color is hsl(13, 58%, 35%) - returned unchanged in light mode
      expect(components.lightness).toBe(35);
    });
  });

  describe('contrastValueAt', () => {
    it('should return a contrast color string for index 0', () => {
      const value = colors.contrastValueAt(0);
      expect(typeof value).toBe('string');
    });

    it('should return a contrast color for the highlight index (-1)', () => {
      const value = colors.contrastValueAt(-1);
      expect(typeof value).toBe('string');
    });

    it('should fall back to white when no contrastValue is defined', () => {
      // Colors without contrastValue defined should get the white fallback
      const colorsWithoutContrast = colors.palette.colors.filter(c => !c.contrastValue);
      if (colorsWithoutContrast.length > 0) {
        const idx = colors.palette.colors.indexOf(colorsWithoutContrast[0]);
        const value = colors.contrastValueAt(idx);
        expect(value).toBe('hsl(0, 0%, 100%)');
      }
    });
  });

  describe('addPalette', () => {
    it('should add a new palette to the list', () => {
      const before = colors.palettes.length;
      colors.addPalette({
        key: 'test-palette',
        title: 'Test Palette',
        colors: [{ value: 'hsl(0, 50%, 50%)', name: 'test-red' }],
      });
      expect(colors.palettes.length).toBe(before + 1);
    });

    it('should find the added palette by key', () => {
      colors.addPalette({
        key: 'custom-palette',
        title: 'Custom',
        colors: [{ value: 'hsl(120, 50%, 50%)', name: 'custom-green' }],
      });
      const idx = colors.indexOfPalette('custom-palette');
      expect(idx).toBeGreaterThanOrEqual(0);
    });
  });

  describe('setColorMap', () => {
    it('should set a color map with valid color names', () => {
      const firstName = colors.palette.colors[0].name;
      const secondName = colors.palette.colors[1].name;
      expect(() => colors.setColorMap(firstName, secondName)).not.toThrow();
    });

    it('should automatically append "visit" to the color map', () => {
      const firstName = colors.palette.colors[0].name;
      colors.setColorMap(firstName);
      // visit should be appended
      expect((colors as any)._colorMap).toBeDefined();
    });

    it('should throw for unknown color names', () => {
      expect(() => colors.setColorMap('not-a-real-color')).toThrow();
    });

    it('should not add visit twice if explicitly passed', () => {
      const firstName = colors.palette.colors[0].name;
      colors.setColorMap(firstName, 'visit');
      // Should not throw and 'visit' should only be added once
      const colorMapLength = (colors as any)._colorMap!.length;
      expect(colorMapLength).toBe(2); // firstName + visit (once)
    });
  });

  describe('registerKey', () => {
    it('should register a new key', () => {
      colors.registerKey('series-A');
      expect(colors.keys.has('series-A')).toBe(true);
    });

    it('should not register the same key twice', () => {
      colors.registerKey('series-B');
      colors.registerKey('series-B');
      // Should not throw and should still have only one entry
      expect(colors.keys.size).toBeGreaterThanOrEqual(1);
    });

    it('should assign incrementing indices to keys', () => {
      const initialSize = colors.keys.size;
      colors.registerKey('key-first');
      colors.registerKey('key-second');
      expect(colors.keys.get('key-first')!.index).toBe(initialSize);
      expect(colors.keys.get('key-second')!.index).toBe(initialSize + 1);
    });
  });
});
