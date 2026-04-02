import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ParaState } from '../../../../lib/state/parastate';
import { GlobalState } from '../../../../lib/state';

describe('BaseState – additional coverage', () => {
  let state: ParaState;

  beforeEach(() => {
    state = new ParaState(new GlobalState({}), {});
  });

  describe('observeSettings (plural)', () => {
    it('should register an observer for multiple paths at once', () => {
      const observer = vi.fn();
      state.observeSettings(['chart.size.width', 'chart.size.height'], observer);

      state.updateSettings(draft => {
        draft.chart!.size!.width = 800;
      });
      expect(observer).toHaveBeenCalledOnce();

      state.updateSettings(draft => {
        draft.chart!.size!.height = 600;
      });
      expect(observer).toHaveBeenCalledTimes(2);
    });

    it('should call the observer with correct old and new values', () => {
      const observer = vi.fn();
      const originalWidth = state.settings.chart!.size!.width;
      state.observeSettings(['chart.size.width'], observer);

      state.updateSettings(draft => {
        draft.chart!.size!.width = 1920;
      });

      expect(observer).toHaveBeenCalledWith(originalWidth, 1920);
    });

    it('should allow the same observer to be removed for each registered path', () => {
      const observer = vi.fn();
      state.observeSettings(['chart.size.width', 'chart.size.height'], observer);

      state.unobserveSetting('chart.size.width', observer);
      state.unobserveSetting('chart.size.height', observer);

      state.updateSettings(draft => {
        draft.chart!.size!.width = 2560;
      });
      expect(observer).not.toHaveBeenCalled();
    });

    it('should handle an empty paths array without throwing', () => {
      const observer = vi.fn();
      expect(() => state.observeSettings([], observer)).not.toThrow();
    });
  });

  describe('unobserveSetting – error paths', () => {
    it('should throw when unobserving from a path that has an observer but the observer is not the registered one', () => {
      const observer = vi.fn();
      const differentObserver = vi.fn();
      state.observeSetting('chart.size.width', observer);

      expect(() => {
        state.unobserveSetting('chart.size.width', differentObserver);
      }).toThrow(/not registered/);
    });

    it('should clean up the path key after the last observer is removed', () => {
      const observer = vi.fn();
      state.observeSetting('chart.size.width', observer);
      state.unobserveSetting('chart.size.width', observer);

      // Now there are no observers – re-observing the same observer should succeed
      expect(() => {
        state.observeSetting('chart.size.width', observer);
      }).not.toThrow();
    });
  });

  describe('registerCallbacks – merging behaviour', () => {
    it('should merge new callbacks without overwriting existing unrelated ones', () => {
      const onUpdate = vi.fn();
      const onNotice = vi.fn();
      const onSettingChange = vi.fn();

      state.registerCallbacks({ onUpdate });
      state.registerCallbacks({ onNotice });
      state.registerCallbacks({ onSettingChange });

      state.requestUpdate();
      expect(onUpdate).toHaveBeenCalledOnce();

      state.postNotice('event', {});
      expect(onNotice).toHaveBeenCalledOnce();

      state.updateSettings(draft => {
        draft.chart!.size!.width = 1234;
      });
      expect(onSettingChange).toHaveBeenCalled();
    });

    it('should overwrite a callback when the same key is registered again', () => {
      const first = vi.fn();
      const second = vi.fn();

      state.registerCallbacks({ onUpdate: first });
      state.registerCallbacks({ onUpdate: second });

      state.requestUpdate();
      expect(second).toHaveBeenCalledOnce();
      expect(first).not.toHaveBeenCalled();
    });
  });

  describe('settingDidChange callback', () => {
    it('should call onSettingChange with path, oldValue, and newValue', () => {
      const onSettingChange = vi.fn();
      state.registerCallbacks({ onSettingChange });

      const originalWidth = state.settings.chart!.size!.width;
      state.updateSettings(draft => {
        draft.chart!.size!.width = 1024;
      });

      expect(onSettingChange).toHaveBeenCalledWith('chart.size.width', originalWidth, 1024);
    });

    it('should not call onSettingChange when ignoreObservers is true', () => {
      const onSettingChange = vi.fn();
      state.registerCallbacks({ onSettingChange });

      state.updateSettings(draft => {
        draft.chart!.size!.width = 512;
      }, true);

      expect(onSettingChange).not.toHaveBeenCalled();
    });
  });

  describe('multiple observers on a single path', () => {
    it('should call all registered observers for the same path', () => {
      const observerA = vi.fn();
      const observerB = vi.fn();

      state.observeSetting('chart.size.width', observerA);
      state.observeSetting('chart.size.width', observerB);

      state.updateSettings(draft => {
        draft.chart!.size!.width = 300;
      });

      expect(observerA).toHaveBeenCalledOnce();
      expect(observerB).toHaveBeenCalledOnce();
    });

    it('should only call remaining observers after one is removed', () => {
      const observerA = vi.fn();
      const observerB = vi.fn();

      state.observeSetting('chart.size.width', observerA);
      state.observeSetting('chart.size.width', observerB);
      state.unobserveSetting('chart.size.width', observerA);

      state.updateSettings(draft => {
        draft.chart!.size!.width = 400;
      });

      expect(observerA).not.toHaveBeenCalled();
      expect(observerB).toHaveBeenCalledOnce();
    });
  });
});
