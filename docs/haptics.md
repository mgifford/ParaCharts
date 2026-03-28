
# Haptics Lab

The Haptics Lab is an exploratory page for evaluating how tactile feedback (haptics) can complement chart sonification in ParaCharts.

<HapticsSupportAlert />

Haptics is treated as a **progressive enhancement**: the page works fully as an audio-only experience on all devices, and adds vibration on devices that support the [Web Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API). No chart rendering or accessibility features are changed by this experiment.

::: tip 🎮 Ready to feel the data? Jump to the interactive labs
- **[Multi-Modal Lab](#multi-modal-lab)** — use a slider to manually probe haptic intensity levels
- **[Chart Navigation Lab](#chart-navigation-lab)** — navigate real charts with arrow keys; every data point fires a vibration that strengthens with higher values
:::

## Browser and Device Support

| Feature | Chrome (Android) | Firefox (Android) | Safari (iOS) | Desktop |
| :--- | :---: | :---: | :---: | :---: |
| Web Vibration API (haptics) | ✅ | ✅ | ❌ | ❌ |
| Web Audio API (tones) | ✅ | ✅ | ✅ | ✅ |

Key constraints:

- **Haptics require HTTPS.** Vibration is blocked on plain HTTP pages.
- **iOS (Safari and all iOS browsers) does not support the Web Vibration API** and will silently skip the haptic step.
- **Desktop browsers** expose no haptic motor; only the audio channel will play.
- **User gesture required.** The Web Audio API will not start until you press "Initialize Audio Engine."

## Compatibility Policy

- **PWA installation is not required.** This page can vibrate from a regular website tab when browser/device policies allow it.
- **Support is capability-based, not app-type-based.** The deciding factors are browser support, device hardware, secure context, and user settings.
- **Treat haptics as progressive enhancement.** Audio, visible UI, and keyboard/screen reader flows remain the primary channels.

### When Logs Say "vibrate(...) sent" But You Feel Nothing

If debug logs show successful `vibrate(...) sent` entries but you do not feel any motor output:

1. Run **Run Vibration Self-Test** in the System Status card first.
1. If self-test returns accepted patterns but nothing is felt, verify phone settings: vibration/haptics enabled at OS level; Silent/Do Not Disturb/Battery Saver not suppressing haptics; accessibility or per-app vibration controls not disabled.
1. Retry with a firmer grip-free touch (some motors are easier to feel when the phone is resting on a surface).

The self-test metadata is exported with the debug JSON (`metadata.selfTest`) so field testing can distinguish implementation issues from device-policy suppression.

## Android Troubleshooting Checklist

Use this quick flow when self-test works but chart interactions feel weak:

1. Confirm there is no Chrome-only toggle to enable web vibration on Android; behavior is primarily controlled by OS/device policy.
1. Run **Run Vibration Self-Test** and confirm `metadata.selfTest.passed` is `true`.
1. In **Touch Feedback Preferences**, set `Scrub feedback mode` to `haptic` or `audio + haptics`.
1. Set `Scrub sensitivity` to `high` while testing.
1. Enable `Boost chart haptics (diagnostic)`.
1. Touch-scrub across either chart and verify new entries include `mode=scrub` (or navigate with keyboard and check `mode=nav`).
1. If chart pulses are still hard to feel but self-test remains strong, keep diagnostic boost enabled for your device profile.

## Multi-Modal Lab

Press **Initialize Audio Engine** first, then use the Manual Probe or run a pattern test. If you are on a supported Android device over HTTPS, the vibration motor will fire at the same time as each audio tone.

<HapticsLab />

## Chart Navigation Lab

The charts below are fully integrated with haptic and audio feedback. Navigate into a chart with the keyboard and move between data points with arrow keys — each point fires both a tone and a vibration whose intensity reflects the data value.

<script type="module" src="assets/paracharts-loader.js"></script>
<style>
#hc-root {
  gap: 0.75rem;
  margin: 1rem 0;
  max-width: 100%;
  overflow-x: clip;
}

#hc-root > section {
  padding: 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  background: var(--vp-c-bg-soft, #f9f9f9);
  min-width: 0;
  overflow: visible;
}

#hc-root p,
#hc-root li,
#hc-root label,
#hc-root select,
#hc-root button,
#hc-root summary,
#hc-root dd,
#hc-root dt {
  font-size: 0.9rem;
}

#hc-root h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 700;
}

#hc-root .hc-chart-card {
  padding: 0.875rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  background: var(--vp-c-bg-soft, #f9f9f9);
}

#hc-root para-chart {
  display: block !important;
  box-sizing: border-box !important;
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  margin: 0.5rem 0 !important;
  overflow: visible !important;
}

/* Tablet and up: wider layout, wider charts */
@media (min-width: 640px) {
  #hc-root {
    gap: 1rem;
    margin: 1.25rem auto;
    max-width: 95vw;
  }

  #hc-root > section {
    padding: 1rem 1.25rem;
  }

  #hc-root .hc-chart-card {
    padding: 1rem 1.25rem;
  }

  #hc-root para-chart {
    height: auto !important;
    max-height: none !important;
    max-width: 100% !important;
  }
}

/* Desktop: constrained max-width */
@media (min-width: 1024px) {
  #hc-root {
    max-width: 900px;
    margin: 1.5rem auto;
  }

  #hc-root > section {
    padding: 1.25rem 1.5rem;
  }

  #hc-root .hc-chart-card {
    padding: 1.25rem 1.5rem;
  }

  #hc-root para-chart {
    max-width: 100%;
    height: auto !important;
    max-height: none !important;
  }
}
</style>

<div id="hc-root" style="display:flex;flex-direction:column;gap:1rem">
<section id="hc-status-card" aria-labelledby="hc-status-heading">
<h3 id="hc-status-heading">System Status</h3>
<div id="hc-badge-row" style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem"></div>
<p id="hc-support-msg" style="margin:0;font-size:0.875rem" aria-live="polite">Initializing…</p>
<div style="margin-top:0.75rem;display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap">
<button id="hc-self-test-btn" type="button" style="font-size:0.75rem;padding:0.35rem 0.6rem;border-radius:0.4rem;border:1px solid var(--vp-c-divider,#d1d5db);background:var(--vp-c-bg,#fff);cursor:pointer">Run Vibration Self-Test</button>
<p id="hc-self-test-status" style="margin:0;font-size:0.75rem" aria-live="polite">Self-test not run yet.</p>
</div>
</section>
<section aria-labelledby="hc-how-heading">
<h3 id="hc-how-heading">How to Navigate</h3>
<ol style="margin:0;padding-left:1.25rem;font-size:0.875rem;line-height:1.8">
<li>Tab into one of the charts below to focus it.</li>
<li>Press <kbd>Enter</kbd> or <kbd>↓</kbd> to enter the data layer.</li>
<li>Use <kbd>←</kbd> / <kbd>→</kbd> to move between data points.</li>
<li>Each point fires a vibration (on Android over HTTPS) whose intensity reflects the data value, plus an audio tone from the chart's built-in sonification.</li>
<li>Press <kbd>Escape</kbd> to return to the chart top level.</li>
<li>Press <kbd>q</kbd> while on a data point to hear a spoken summary.</li>
</ol>
</section>
<section id="hc-prefs-card" aria-labelledby="hc-prefs-heading">
<h3 id="hc-prefs-heading">Haptics Settings</h3>
<p style="margin:0 0 0.75rem;font-size:0.8rem;line-height:1.5">These settings are saved on this device.</p>
<div style="display:grid;gap:0.75rem;max-width:28rem">
<label style="display:flex;gap:0.5rem;align-items:flex-start;font-size:0.875rem;line-height:1.4">
<input id="hc-pref-haptics-enabled" type="checkbox" checked style="margin-top:0.15rem" />
<span>Enable haptics on data point navigation</span>
</label>
</div>
<p id="hc-pref-status" style="margin:0.75rem 0 0;font-size:0.75rem" aria-live="polite"></p>
</section>
<section id="hc-feedback-card" aria-labelledby="hc-feedback-heading" aria-live="polite" aria-atomic="true">
<h3 id="hc-feedback-heading">Current Point</h3>
<div id="hc-current"><p style="margin:0;font-size:0.875rem">Navigate into a chart with the keyboard to see point details here.</p></div>
</section>
<section id="hc-debug-card" aria-labelledby="hc-debug-heading">
<h3 id="hc-debug-heading">Haptics Debug Log</h3>
<p style="margin:0 0 0.75rem;font-size:0.8rem;line-height:1.5">Use this on mobile when the browser console is not available. It logs vibration support checks, skipped calls, API return values, and runtime chart events.</p>
<details id="hc-debug-details">
<summary id="hc-debug-summary" style="cursor:pointer;font-weight:600">Show debug log (0 entries)</summary>
<div style="margin-top:0.6rem">
<button id="hc-debug-clear" type="button" style="font-size:0.75rem;padding:0.25rem 0.5rem;border-radius:0.4rem;border:1px solid var(--vp-c-divider,#d1d5db);background:var(--vp-c-bg,#fff);cursor:pointer">Clear log</button>
<button id="hc-debug-copy" type="button" style="font-size:0.75rem;padding:0.25rem 0.5rem;border-radius:0.4rem;border:1px solid var(--vp-c-divider,#d1d5db);background:var(--vp-c-bg,#fff);margin-left:0.4rem;cursor:pointer">Copy log</button>
<button id="hc-debug-copy-json" type="button" style="font-size:0.75rem;padding:0.25rem 0.5rem;border-radius:0.4rem;border:1px solid var(--vp-c-divider,#d1d5db);background:var(--vp-c-bg,#fff);margin-left:0.4rem;cursor:pointer">Copy as JSON</button>
</div>
<p id="hc-debug-copy-status" style="margin:0.5rem 0 0;font-size:0.72rem" aria-live="polite"></p>
<ol id="hc-debug-log" style="margin:0.75rem 0 0;padding-left:1.25rem;font-size:0.75rem;line-height:1.45;display:grid;gap:0.25rem;max-height:14rem;overflow:auto">
<li>Waiting for events...</li>
</ol>
</details>
</section>
<section class="hc-chart-card" aria-labelledby="hc-mountain-heading">
<h3 id="hc-mountain-heading">Chart 1: Mountain Peak</h3>
<p style="margin:0 0 0.75rem;font-size:0.8rem;line-height:1.5">A column chart with values rising from 8 to 100 then falling back to 8. Use arrow keys to navigate left to right and feel intensity climb then descend. Higher values produce longer vibrations. The peak (point 7, value 100) vibrates longest.</p>
<para-chart id="hc-mountain" manifestType="content" style="display:block;width:100%;max-width:52rem;margin:0.75rem 0" aria-label="Mountain Peak haptic chart — bell-curve column chart, 13 points from 8 to 100 and back"></para-chart>
</section>
<section class="hc-chart-card" aria-labelledby="hc-staircase-heading">
<h3 id="hc-staircase-heading">Chart 2: Staircase</h3>
<p style="margin:0 0 0.75rem;font-size:0.8rem;line-height:1.5">A line chart with four distinct steps at values 20, 50, 80, and 100 (three points each). Use arrow keys to navigate through and feel the four distinct haptic zones increase in intensity. Each step repeats three times so you can feel consistent vibration at each level.</p>
<para-chart id="hc-staircase" manifestType="content" style="display:block;width:100%;max-width:52rem;margin:0.75rem 0" aria-label="Staircase haptic chart — line chart with four stepped levels: 20, 50, 80, 100"></para-chart>
</section>
</div>
<script type="module">
(function () {
  const MOUNTAIN_VALUES = [8, 18, 32, 48, 65, 82, 100, 82, 65, 48, 32, 18, 8];
  const STAIRCASE_VALUES = [20, 20, 20, 50, 50, 50, 80, 80, 80, 100, 100, 100];
  const CHART_RENDER_MAX_WIDTH = 640;
  const CHART_RENDER_MIN_WIDTH = 280;
  const CHART_RENDER_RATIO = 400 / 640;
  const DATA_LOOKUP = { 'hc-mountain': { Intensity: MOUNTAIN_VALUES }, 'hc-staircase': { Level: STAIRCASE_VALUES } };
  const CHART_NAMES = { 'hc-mountain': 'Mountain Peak', 'hc-staircase': 'Staircase' };
  const BASE_CHART_MANIFESTS = {
    'hc-mountain': {
      type: 'column',
      title: 'Mountain Peak (haptic chart)',
      xLabel: 'Step',
      yLabel: 'Intensity (0-100)',
      seriesKey: 'Intensity',
      xValues: MOUNTAIN_VALUES.map(function (_value, index) { return String(index + 1); }),
      values: MOUNTAIN_VALUES,
    },
    'hc-staircase': {
      type: 'line',
      title: 'Staircase (haptic chart)',
      xLabel: 'Step',
      yLabel: 'Level (0-100)',
      seriesKey: 'Level',
      xValues: ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'D3'],
      values: STAIRCASE_VALUES,
    },
  };
  const isHapticSupported = 'vibrate' in navigator;
  const isHttps = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const PREF_STORAGE_KEY = 'paracharts-haptics-nav-prefs-v1';
  const MAX_DEBUG_ENTRIES = 80;

  const prefs = {
    hapticsEnabled: true,
  };

  const debugDetails = document.getElementById('hc-debug-details');
  const debugSummary = document.getElementById('hc-debug-summary');
  const debugLog = document.getElementById('hc-debug-log');
  const debugClearBtn = document.getElementById('hc-debug-clear');
  const debugCopyBtn = document.getElementById('hc-debug-copy');
  const debugCopyJsonBtn = document.getElementById('hc-debug-copy-json');
  const debugCopyStatus = document.getElementById('hc-debug-copy-status');
  const prefHapticsEnabled = document.getElementById('hc-pref-haptics-enabled');
  const prefStatus = document.getElementById('hc-pref-status');
  const selfTestBtn = document.getElementById('hc-self-test-btn');
  const selfTestStatus = document.getElementById('hc-self-test-status');
  const debugEntries = [];
  const selfTestResult = {
    ranAt: null,
    passed: null,
    steps: [],
  };
  const pointEventState = {
    lastChartId: null,
    lastIndex: null,
    lastTime: 0,
  };
  const lastPointerByChart = {
    'hc-mountain': { ts: 0, type: null },
    'hc-staircase': { ts: 0, type: null },
  };
  const keyboardFallbackIndex = {
    'hc-mountain': 0,
    'hc-staircase': 0,
  };

  function nowStamp() {
    return new Date().toLocaleTimeString([], { hour12: false });
  }

  function updateDebugSummary() {
    if (!debugSummary || !debugLog) return;
    const count = debugLog.children.length;
    debugSummary.textContent = 'Show debug log (' + count + ' entr' + (count === 1 ? 'y' : 'ies') + ')';
  }

  function appendDebug(level, message) {
    if (!debugLog) return;
    if (debugLog.children.length === 1 && debugLog.firstElementChild && debugLog.firstElementChild.textContent === 'Waiting for events...') {
      debugLog.replaceChildren();
    }
    const item = document.createElement('li');
    const levelUpper = level.toUpperCase();
    const icon = level === 'error' ? '🛑' : (level === 'warn' ? '⚠️' : '•');
    const messageLower = message.toLowerCase();
    const isHapticsSpecific = messageLower.indexOf('vibrate') >= 0
      || messageLower.indexOf('haptic') >= 0
      || messageLower.indexOf('vibration api') >= 0;
    item.textContent = icon + ' [' + nowStamp() + '] [' + levelUpper + '] ' + message;
    item.dataset.level = level;
    item.dataset.message = message;
    item.dataset.ts = new Date().toISOString();
    if (isHapticsSpecific) {
      item.style.fontWeight = '700';
      item.dataset.haptics = 'true';
    }
    if (level === 'warn') item.style.color = '#92400e';
    if (level === 'error') item.style.color = '#991b1b';
    debugLog.prepend(item);
    debugEntries.unshift({
      ts: item.dataset.ts,
      level,
      message,
      hapticsSpecific: !!isHapticsSpecific,
    });
    while (debugEntries.length > MAX_DEBUG_ENTRIES) {
      debugEntries.pop();
    }
    while (debugLog.children.length > MAX_DEBUG_ENTRIES) {
      debugLog.removeChild(debugLog.lastElementChild);
    }
    if (debugDetails && (level === 'warn' || level === 'error')) {
      debugDetails.open = true;
    }
    updateDebugSummary();
  }

  function getScrubEventMinMs() {
    if (prefs.scrubSensitivity === 'low') return 70;
    if (prefs.scrubSensitivity === 'high') return 35;
    return 50;
  }

  function getScrubHapticMinMs() {
    if (prefs.scrubSensitivity === 'low') return 150;
    if (prefs.scrubSensitivity === 'high') return 90;
    return 120;
  }

  function getScrubStartThresholdPx() {
    if (prefs.scrubSensitivity === 'low') return 18;
    if (prefs.scrubSensitivity === 'high') return 8;
    return 12;
  }

  function getScrubIntensityScale() {
    if (prefs.scrubSensitivity === 'low') return 1;
    if (prefs.scrubSensitivity === 'high') return 1.35;
    return 1.15;
  }

  function updatePrefStatus() {
    if (!prefStatus) return;
    prefStatus.textContent = 'Haptics: ' + (prefs.hapticsEnabled ? 'enabled' : 'disabled') + '.';
  }

  function buildDebugMetadata() {
    const nav = navigator;
    const branchHint = location.hostname === 'mgifford.github.io'
      ? 'main (GitHub Pages deployment)'
      : 'non-pages-or-local';
    return {
      deployment: {
        sourceRepo: 'mgifford/ParaCharts',
        branchHint,
        pagePath: location.pathname,
      },
      environment: {
        href: location.href,
        userAgent: nav.userAgent,
        platform: nav.platform,
        language: nav.language,
        maxTouchPoints: typeof nav.maxTouchPoints === 'number' ? nav.maxTouchPoints : null,
        isSecureContext: typeof window.isSecureContext === 'boolean' ? window.isSecureContext : null,
        pageVisibility: typeof document.visibilityState === 'string' ? document.visibilityState : null,
      },
      haptics: {
        hasVibrateFunction: typeof nav.vibrate === 'function',
        isHapticSupported,
        isHttps,
      },
      preferences: {
        hapticsEnabled: !!prefs.hapticsEnabled,
      },
      selfTest: selfTestResult,
    };
  }

  async function waitMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function runVibrationSelfTest() {
    selfTestResult.ranAt = new Date().toISOString();
    selfTestResult.passed = null;
    selfTestResult.steps = [];

    if (selfTestStatus) {
      selfTestStatus.textContent = 'Running self-test...';
    }
    appendDebug('info', 'Self-test started.');

    if (typeof navigator.vibrate !== 'function') {
      selfTestResult.passed = false;
      selfTestResult.steps.push({ step: 'capability-check', ok: false, reason: 'navigator.vibrate is not a function' });
      appendDebug('warn', 'Self-test failed: navigator.vibrate is unavailable.');
      if (selfTestStatus) {
        selfTestStatus.textContent = 'Self-test failed: Vibration API unavailable.';
      }
      return;
    }

    const patterns = [
      { name: 'single-short', pattern: 30 },
      { name: 'single-long', pattern: 400 },
      { name: 'double-strong', pattern: [200, 120, 200] },
      { name: 'triple-strong', pattern: [150, 100, 150, 100, 150] },
    ];

    let anySuccess = false;
    for (const test of patterns) {
      const startedAt = Date.now();
      let ok = false;
      let errMessage = null;
      try {
        ok = navigator.vibrate(test.pattern);
      } catch (err) {
        errMessage = err instanceof Error ? (err.name + ': ' + err.message) : String(err);
      }
      const elapsedMs = Date.now() - startedAt;
      selfTestResult.steps.push({
        step: test.name,
        pattern: test.pattern,
        result: ok,
        elapsedMs,
        error: errMessage,
      });

      if (errMessage) {
        appendDebug('error', 'Self-test ' + test.name + ' threw: ' + errMessage + '.');
      } else {
        appendDebug(ok ? 'info' : 'warn', 'Self-test ' + test.name + ' result=' + ok + '.');
      }
      anySuccess = anySuccess || !!ok;
      await waitMs(250);
    }

    try {
      navigator.vibrate(0);
      selfTestResult.steps.push({ step: 'stop', pattern: 0, result: true });
    } catch (_err) {
      selfTestResult.steps.push({ step: 'stop', pattern: 0, result: false });
    }

    selfTestResult.passed = anySuccess;
    if (selfTestStatus) {
      selfTestStatus.textContent = anySuccess
        ? 'Self-test complete: API accepted at least one pattern. If none were physically felt, this points to phone policy/settings or hardware behavior.'
        : 'Self-test complete: API did not accept any pattern. Check browser/device support and secure context.';
    }
    appendDebug(anySuccess ? 'info' : 'warn', 'Self-test completed. Any accepted pattern=' + anySuccess + '.');
  }

  function setupSelfTestButton() {
    if (!selfTestBtn) return;
    selfTestBtn.addEventListener('click', async () => {
      if (selfTestBtn.disabled) return;
      selfTestBtn.disabled = true;
      try {
        await runVibrationSelfTest();
      } finally {
        selfTestBtn.disabled = false;
      }
    });
  }

  function savePrefs() {
    try {
      localStorage.setItem(PREF_STORAGE_KEY, JSON.stringify(prefs));
    } catch (_err) {
      appendDebug('warn', 'Failed to save haptics preferences to localStorage.');
    }
  }

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREF_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.hapticsEnabled === 'boolean') prefs.hapticsEnabled = parsed.hapticsEnabled;
    } catch (_err) {
      appendDebug('warn', 'Failed to load haptics preferences from localStorage.');
    }
  }

  function syncPrefControls() {
    if (prefHapticsEnabled) prefHapticsEnabled.checked = !!prefs.hapticsEnabled;
    updatePrefStatus();
  }

  function setupPreferencePanel() {
    loadPrefs();
    syncPrefControls();
    if (!prefHapticsEnabled) {
      appendDebug('warn', 'Preference controls not found; using defaults.');
      return;
    }

    prefHapticsEnabled.addEventListener('change', () => {
      prefs.hapticsEnabled = !!prefHapticsEnabled.checked;
      savePrefs();
      updatePrefStatus();
      appendDebug('info', 'Preference changed: haptics ' + (prefs.hapticsEnabled ? 'enabled' : 'disabled') + '.');
    });
  }

  function setupDebugPanel() {
    if (!debugClearBtn || !debugLog) {
      return;
    }
    debugClearBtn.addEventListener('click', () => {
      debugLog.replaceChildren();
      const resetItem = document.createElement('li');
      resetItem.textContent = 'Waiting for events...';
      debugLog.appendChild(resetItem);
      debugEntries.splice(0, debugEntries.length);
      if (debugCopyStatus) {
        debugCopyStatus.textContent = '';
      }
      updateDebugSummary();
    });

    if (debugCopyBtn) {
      debugCopyBtn.addEventListener('click', async () => {
        if (!debugLog) return;
        const lines = Array.from(debugLog.querySelectorAll('li')).map(el => el.textContent || '').filter(Boolean);
        const payload = lines.join('\n');
        if (!payload) {
          if (debugCopyStatus) {
            debugCopyStatus.textContent = 'Nothing to copy yet.';
          }
          return;
        }
        try {
          await navigator.clipboard.writeText(payload);
          if (debugCopyStatus) {
            debugCopyStatus.textContent = 'Copied ' + lines.length + ' log entr' + (lines.length === 1 ? 'y' : 'ies') + '.';
          }
        } catch (_err) {
          const textArea = document.createElement('textarea');
          textArea.value = payload;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            if (debugCopyStatus) {
              debugCopyStatus.textContent = 'Copied ' + lines.length + ' log entr' + (lines.length === 1 ? 'y' : 'ies') + ' (fallback).';
            }
          } catch (_copyErr) {
            if (debugCopyStatus) {
              debugCopyStatus.textContent = 'Copy failed. You can long-press and copy manually.';
            }
          }
          document.body.removeChild(textArea);
        }
      });
    }

    if (debugCopyJsonBtn) {
      debugCopyJsonBtn.addEventListener('click', async () => {
        if (debugEntries.length === 0) {
          if (debugCopyStatus) {
            debugCopyStatus.textContent = 'No structured entries to copy yet.';
          }
          return;
        }
        const payload = JSON.stringify({
          exportedAt: new Date().toISOString(),
          page: location.href,
          metadata: buildDebugMetadata(),
          entries: debugEntries,
        }, null, 2);
        try {
          await navigator.clipboard.writeText(payload);
          if (debugCopyStatus) {
            debugCopyStatus.textContent = 'Copied JSON with ' + debugEntries.length + ' entr' + (debugEntries.length === 1 ? 'y' : 'ies') + '.';
          }
        } catch (_err) {
          const textArea = document.createElement('textarea');
          textArea.value = payload;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            if (debugCopyStatus) {
              debugCopyStatus.textContent = 'Copied JSON (fallback).';
            }
          } catch (_copyErr) {
            if (debugCopyStatus) {
              debugCopyStatus.textContent = 'JSON copy failed. You can copy from browser dev tools.';
            }
          }
          document.body.removeChild(textArea);
        }
      });
    }
    updateDebugSummary();
  }

  console.log('[HapticsPage] init — Vibration API:', isHapticSupported ? 'present' : 'absent', '| HTTPS:', isHttps ? 'yes' : 'no', '| UA:', navigator.userAgent);
  appendDebug('info', 'Initialized. Vibration API: ' + (isHapticSupported ? 'present' : 'absent') + '. HTTPS: ' + (isHttps ? 'yes' : 'no') + '.');

  function initStatus() {
    const badgeRow = document.getElementById('hc-badge-row');
    const msg = document.getElementById('hc-support-msg');
    if (badgeRow) {
      // Haptics API badge
      const hapticsOk = isHapticSupported && isHttps;
      const badge = document.createElement('span');
      badge.style.cssText = 'display:inline-flex;align-items:center;gap:0.3rem;padding:0.25rem 0.6rem;border-radius:999px;font-size:0.78rem;font-weight:600;border:1px solid;' + (hapticsOk ? 'background:#d1fae5;border-color:#059669;color:#065f46' : 'background:#fee2e2;border-color:#dc2626;color:#7f1d1d');
      const icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = hapticsOk ? '\u271a' : '\u26d4';
      const label = document.createElement('span');
      label.textContent = 'Haptics API: ' + (isHapticSupported ? 'Supported' : 'Not supported');
      badge.appendChild(icon);
      badge.appendChild(label);
      badgeRow.appendChild(badge);

      // HTTPS badge
      const httpsBadge = document.createElement('span');
      httpsBadge.style.cssText = 'display:inline-flex;align-items:center;gap:0.3rem;padding:0.25rem 0.6rem;border-radius:999px;font-size:0.78rem;font-weight:600;border:1px solid;' + (isHttps ? 'background:#d1fae5;border-color:#059669;color:#065f46' : 'background:#fee2e2;border-color:#dc2626;color:#7f1d1d');
      const httpsIcon = document.createElement('span');
      httpsIcon.setAttribute('aria-hidden', 'true');
      httpsIcon.textContent = isHttps ? '\uD83D\uDD12' : '\u26A0\uFE0F';
      const httpsLabel = document.createElement('span');
      httpsLabel.textContent = 'HTTPS: ' + (isHttps ? 'Yes' : 'No (haptics may be blocked)');
      httpsBadge.appendChild(httpsIcon);
      httpsBadge.appendChild(httpsLabel);
      badgeRow.appendChild(httpsBadge);
    }
    if (msg) {
      if (!isHapticSupported) {
        msg.textContent = 'Haptics (Web Vibration API) not supported on this device/browser. For haptics, try Chrome on Android over HTTPS. Audio will still play.';
        appendDebug('warn', 'Haptics unavailable: Web Vibration API not supported on this browser/device.');
      } else if (!isHttps) {
        msg.textContent = 'Vibration API detected but haptics require HTTPS. This page appears to be served over plain HTTP \u2014 reload over HTTPS to enable haptic feedback. Audio will still play.';
        appendDebug('warn', 'Haptics unavailable: page is not served over HTTPS.');
      } else {
        msg.textContent = 'Haptic support detected. Run Vibration Self-Test first, then navigate the charts below to feel value-linked patterns.';
        appendDebug('info', 'Haptics supported and HTTPS is enabled.');
      }
    }
  }
  let lastHapticTime = 0;

  function vibrate(value) {
    if (!prefs.hapticsEnabled) {
      appendDebug('info', 'vibrate(' + value + ') skipped: haptics disabled by user.');
      return;
    }
    if (!isHapticSupported) {
      console.warn('[HapticsPage] vibrate(' + value + ') skipped — Vibration API not supported');
      appendDebug('warn', 'vibrate(' + value + ') skipped: Vibration API not supported.');
      return;
    }
    if (!isHttps) {
      console.warn('[HapticsPage] vibrate(' + value + ') skipped — HTTPS required for haptics');
      appendDebug('warn', 'vibrate(' + value + ') skipped: HTTPS required for haptics.');
      return;
    }

    const now = Date.now();
    const timeSinceLastVibrate = now - lastHapticTime;
    if (timeSinceLastVibrate < 50) {
      console.debug('[HapticsPage] vibrate(' + value + ') throttled (only ' + timeSinceLastVibrate + 'ms since last)');
      appendDebug('info', 'vibrate(' + value + ') throttled: only ' + timeSinceLastVibrate + 'ms since last vibrate.');
      return;
    }
    lastHapticTime = now;

    const val = Math.max(0, Math.min(100, value));
    let pattern;
    let zone;

    // Value-based vibration zones: sensory intensity increases with data value
    if (val === 0) {
      pattern = 10;
      zone = 'zero-tick';
    } else if (val < 26) {
      pattern = 50;
      zone = 'low-tick';
    } else if (val < 51) {
      pattern = [100, 50, 100];
      zone = 'medium-double';
    } else if (val < 76) {
      pattern = [150, 75, 150];
      zone = 'strong-double';
    } else if (val < 100) {
      pattern = [200, 100, 200];
      zone = 'intense-double';
    } else {
      pattern = [250, 150, 250];
      zone = 'peak-triple';
    }

    let result = false;
    try {
      result = navigator.vibrate(pattern);
      console.log('[HapticsPage] vibrate(' + val + ') called — zone: ' + zone + ' | pattern: ' + (Array.isArray(pattern) ? '[' + pattern.join(',') + ']' : pattern) + 'ms | result: ' + result);
    } catch (err) {
      const errMessage = err instanceof Error ? (err.name + ': ' + err.message) : String(err);
      console.error('[HapticsPage] vibrate(' + val + ') threw error: ' + errMessage);
      appendDebug('error', 'vibrate(' + val + ') threw: ' + errMessage);
      return;
    }

    const patternStr = Array.isArray(pattern) ? '[' + pattern.join(',') + ']' : String(pattern);
    if (!result) {
      appendDebug('warn', 'vibrate(' + val + ') returned false. Pattern=' + patternStr + 'ms; zone=' + zone + '. (Vibration API accepted but device may not have motor or may have it disabled.)');
      return;
    }

    appendDebug('info', 'vibrate(' + val + ') sent successfully. Pattern=' + patternStr + 'ms; zone=' + zone + '.');
  }

  function hapticZoneLabel(val) {
    if (val === 0) return 'Zero (confirm presence)';
    if (val < 26) return 'Low (1–25)';
    if (val < 51) return 'Medium (26–50)';
    if (val < 76) return 'Strong (51–75)';
    if (val < 100) return 'Intense (76–99)';
    return 'Peak (100)';
  }

  function makeRow(label, valueText) {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:0.5rem';
    const dt = document.createElement('dt');
    dt.style.cssText = 'font-weight:600;min-width:9rem';
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.style.margin = '0';
    dd.textContent = valueText;
    row.appendChild(dt);
    row.appendChild(dd);
    return row;
  }

  function getChartRenderWidth(chartEl) {
    const card = chartEl && typeof chartEl.closest === 'function' ? chartEl.closest('.hc-chart-card') : null;
    const measuredWidth = card ? card.clientWidth : chartEl ? chartEl.clientWidth : 0;
    const computedStyle = card ? window.getComputedStyle(card) : null;
    const horizontalPadding = computedStyle
      ? (parseFloat(computedStyle.paddingLeft || '0') + parseFloat(computedStyle.paddingRight || '0'))
      : 0;
    const availableWidth = Math.round(Math.max(0, measuredWidth - horizontalPadding));
    return Math.max(CHART_RENDER_MIN_WIDTH, Math.min(CHART_RENDER_MAX_WIDTH, availableWidth || (window.innerWidth - 32)));
  }

  function buildResponsiveManifest(chartId, width) {
    const config = BASE_CHART_MANIFESTS[chartId];
    if (!config) return null;
    const chartWidth = Math.max(CHART_RENDER_MIN_WIDTH, Math.min(CHART_RENDER_MAX_WIDTH, width));
    const chartHeight = Math.max(240, Math.round(chartWidth * CHART_RENDER_RATIO));
    return JSON.stringify({
      datasets: [{
        type: config.type,
        title: config.title,
        facets: {
          x: {
            label: config.xLabel,
            variableType: 'independent',
            measure: 'interval',
            datatype: 'string',
            displayType: { type: 'axis', orientation: 'horizontal' },
          },
          y: {
            label: config.yLabel,
            variableType: 'dependent',
            measure: 'ratio',
            datatype: 'number',
            displayType: { type: 'axis', orientation: 'vertical' },
          },
        },
        series: [{
          key: config.seriesKey,
          records: config.values.map(function (value, index) {
            return { x: config.xValues[index], y: String(value) };
          }),
        }],
        data: { source: 'inline' },
        settings: {
          'chart.size.width': chartWidth,
          'chart.size.height': chartHeight,
          'chart.title.isDrawTitle': false,
          'chart.padding': chartWidth <= 420 ? '6 8' : '8 14',
          'chart.fontScale': chartWidth <= 420 ? 0.88 : 0.95,
          'axis.minInterval': chartWidth <= 420 ? 12 : 18,
          'axis.datapointMargin': 1,
          'axis.vert.title.isDrawTitle': false,
          'axis.vert.ticks.labels.fontSize': chartWidth <= 420 ? '8pt' : '9pt',
          'axis.horiz.ticks.labels.fontSize': chartWidth <= 420 ? '8pt' : '9pt',
          'axis.horiz.ticks.length': chartWidth <= 420 ? 6 : 8,
          'axis.horiz.ticks.labels.gap': chartWidth <= 420 ? 6 : 8,
          'axis.horiz.ticks.labels.offsetGap': chartWidth <= 420 ? 2 : 3,
          'type.column.barGap': chartWidth <= 420 ? 6 : 10,
          'type.column.clusterGap': chartWidth <= 420 ? 1 : 2,
          'type.line.baseSymbolSize': chartWidth <= 420 ? 7 : 8,
          'type.line.lineWidth': chartWidth <= 420 ? 3 : 4,
          'sonification.isSoniEnabled': true,
          'controlPanel.isControlPanelDefaultOpen': false,
          'animation.isAnimationEnabled': false,
        },
      }],
    });
  }

  function applyResponsiveManifest(chartId) {
    const chartEl = document.getElementById(chartId);
    if (!chartEl) {
      appendDebug('warn', 'Responsive sizing skipped: chart element ' + chartId + ' not found.');
      return;
    }
    const width = getChartRenderWidth(chartEl);
    if (chartEl.dataset.renderWidth === String(width)) return;
    const manifest = buildResponsiveManifest(chartId, width);
    if (!manifest) {
      appendDebug('warn', 'Responsive sizing skipped: no manifest config for ' + chartId + '.');
      return;
    }
    chartEl.manifest = manifest;
    chartEl.setAttribute('manifest', manifest);
    chartEl.dataset.renderWidth = String(width);
    appendDebug('info', 'Responsive sizing applied for ' + (CHART_NAMES[chartId] || chartId) + ': width=' + width + 'px.');
  }

  async function setupResponsiveCharts() {
    if (window.customElements && typeof window.customElements.whenDefined === 'function') {
      await window.customElements.whenDefined('para-chart');
    }
    applyResponsiveManifest('hc-mountain');
    applyResponsiveManifest('hc-staircase');

    let resizeFrame = 0;
    window.addEventListener('resize', function () {
      if (resizeFrame) {
        cancelAnimationFrame(resizeFrame);
      }
      resizeFrame = requestAnimationFrame(function () {
        resizeFrame = 0;
        applyResponsiveManifest('hc-mountain');
        applyResponsiveManifest('hc-staircase');
      });
    }, { passive: true });
  }

  function renderCurrentPoint(chartName, index, total, val, source) {
    const currentEl = document.getElementById('hc-current');
    if (!currentEl) return;
    const freq = (150 + val * 7.5).toFixed(0) + ' Hz';
    const dl = document.createElement('dl');
    dl.style.cssText = 'margin:0;display:grid;gap:0.25rem';
    dl.appendChild(makeRow('Chart', chartName));
    dl.appendChild(makeRow('Position', 'Point ' + (index + 1) + ' of ' + total));
    dl.appendChild(makeRow('Value', String(val)));
    dl.appendChild(makeRow('Audio tone', freq));
    dl.appendChild(makeRow('Haptic pattern', hapticZoneLabel(val)));
    dl.appendChild(makeRow('Interaction', source));
    currentEl.replaceChildren(dl);
  }

  function resolveSeriesKey(lookup, seriesKey) {
    if (!lookup || !seriesKey) return null;
    if (lookup[seriesKey]) return seriesKey;

    const normalized = String(seriesKey).toLowerCase();
    const matched = Object.keys(lookup).find((k) => String(k).toLowerCase() === normalized);
    return matched || null;
  }

  function handleDataPoint(chartId, seriesKey, index, source) {
    const now = Date.now();
    if (pointEventState.lastChartId === chartId && pointEventState.lastIndex === index && (now - pointEventState.lastTime) < 120) {
      appendDebug('info', source + ': duplicate point suppressed for chart=' + chartId + ', index=' + index + '.');
      return;
    }

    const lookup = DATA_LOOKUP[chartId];
    if (!lookup) {
      appendDebug('warn', source + ': chart id ' + chartId + ' not found in DATA_LOOKUP.');
      return;
    }
    const resolvedSeriesKey = resolveSeriesKey(lookup, seriesKey);
    const safeIndex = typeof index === 'number' ? index : parseInt(index, 10);
    const seriesData = resolvedSeriesKey ? lookup[resolvedSeriesKey] : null;
    if (!seriesData || Number.isNaN(safeIndex) || safeIndex < 0 || safeIndex >= seriesData.length) {
      appendDebug('warn', source + ': invalid series/index. series=' + seriesKey + ', resolvedSeries=' + resolvedSeriesKey + ', index=' + index + '.');
      return;
    }
    const val = seriesData[safeIndex];
    const chartName = CHART_NAMES[chartId] || chartId;
    pointEventState.lastChartId = chartId;
    pointEventState.lastIndex = safeIndex;
    pointEventState.lastTime = now;
    appendDebug('info', source + ': point focus chart=' + chartName + ', series=' + resolvedSeriesKey + ', index=' + safeIndex + ', value=' + val + '.');
    renderCurrentPoint(chartName, safeIndex, seriesData.length, val, source);
    vibrate(val);
  }

  function resolveChartId(evt, detail) {
    const directTarget = evt && evt.target;
    if (directTarget && directTarget.id && DATA_LOOKUP[directTarget.id]) return directTarget.id;

    if (directTarget && typeof directTarget.closest === 'function') {
      const chartHost = directTarget.closest('para-chart');
      if (chartHost && chartHost.id && DATA_LOOKUP[chartHost.id]) return chartHost.id;
    }

    if (detail && typeof detail.chartId === 'string' && DATA_LOOKUP[detail.chartId]) return detail.chartId;
    if (detail && typeof detail.targetId === 'string' && DATA_LOOKUP[detail.targetId]) return detail.targetId;
    if (detail && detail.value && typeof detail.value.chartId === 'string' && DATA_LOOKUP[detail.value.chartId]) return detail.value.chartId;

    const active = document.activeElement;
    if (active && typeof active.closest === 'function') {
      const activeChart = active.closest('para-chart');
      if (activeChart && activeChart.id && DATA_LOOKUP[activeChart.id]) return activeChart.id;
    }

    return null;
  }

  function setupDirectPointFallback(chartId, seriesKey) {
    const chartEl = document.getElementById(chartId);
    if (!chartEl) {
      appendDebug('warn', 'Fallback setup skipped: chart element ' + chartId + ' not found.');
      return;
    }
    const series = DATA_LOOKUP[chartId] && DATA_LOOKUP[chartId][seriesKey];
    if (!series || !series.length) {
      appendDebug('warn', 'Fallback setup skipped: missing series for ' + chartId + '.');
      return;
    }

    function clientXToIndex(clientX) {
      const rect = chartEl.getBoundingClientRect();
      if (!rect.width) return 0;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(ratio * (series.length - 1));
    }

    chartEl.addEventListener('pointerdown', (ev) => {
      lastPointerByChart[chartId] = { ts: Date.now(), type: ev.pointerType || 'unknown' };
    }, { passive: true });

    chartEl.addEventListener('pointerup', (ev) => {
      lastPointerByChart[chartId] = { ts: Date.now(), type: ev.pointerType || 'unknown' };
      const idx = clientXToIndex(ev.clientX);
      keyboardFallbackIndex[chartId] = idx;
      const source = ev.pointerType === 'mouse' ? 'pointer-click' : 'pointer-tap';
      handleDataPoint(chartId, seriesKey, idx, source);
    }, { passive: true });

    chartEl.addEventListener('keydown', (ev) => {
      const total = series.length;
      let nextIndex = keyboardFallbackIndex[chartId] || 0;
      let handled = false;

      if (ev.key === 'ArrowRight') {
        nextIndex = Math.min(total - 1, nextIndex + 1);
        handled = true;
      } else if (ev.key === 'ArrowLeft') {
        nextIndex = Math.max(0, nextIndex - 1);
        handled = true;
      } else if (ev.key === 'Home') {
        nextIndex = 0;
        handled = true;
      } else if (ev.key === 'End') {
        nextIndex = total - 1;
        handled = true;
      } else if (ev.key === 'ArrowDown' || ev.key === 'Enter' || ev.key === ' ') {
        handled = true;
      }

      if (!handled) return;
      keyboardFallbackIndex[chartId] = nextIndex;
      handleDataPoint(chartId, seriesKey, nextIndex, 'keyboard-fallback');
    }, true);

    appendDebug('info', 'Fallback handlers ready for ' + (CHART_NAMES[chartId] || chartId) + ': touch-tap + keyboard.');
  }

  function handleParanotice(e) {
    const detail = e.detail || {};
    const key = detail.key;
    const value = detail.value;

    // Log ALL paranotice events to help debug missing haptics
    console.debug('[HapticsPage] paranotice event detected — key: ' + key + ', value:', value);
    appendDebug('info', 'paranotice event: key=' + key + '; has value=' + (!!value) + '; has options=' + (!!(value && value.options)) + '.');

    if (['animRevealStep', 'animRevealEnd', 'animRevealStart'].indexOf(key) !== -1) {
      return;
    }

    const options = (value && value.options) || detail.options || value || null;
    if (!options || options.seriesKey === null || options.seriesKey === undefined || options.index === null || options.index === undefined) {
      console.warn('[HapticsPage] paranotice(' + key + ') — missing options or index/seriesKey', value);
      appendDebug('warn', 'paranotice(' + key + ') missing options.seriesKey or options.index. value=' + JSON.stringify(value) + '.');
      return;
    }

    const seriesKey = options.seriesKey;
    const index = options.index;
    const chartId = resolveChartId(e, detail);
    if (!chartId) {
      appendDebug('warn', 'paranotice(' + key + ') could not resolve chart id.');
      return;
    }

    appendDebug('info', 'paranotice -> handleDataPoint: chart=' + chartId + ', series=' + seriesKey + ', index=' + index + '.');
    keyboardFallbackIndex[chartId] = index;
    const pointerMeta = lastPointerByChart[chartId] || { ts: 0, type: null };
    const viaRecentPointer = (Date.now() - pointerMeta.ts) < 900;
    const source = viaRecentPointer
      ? (pointerMeta.type === 'mouse' ? 'pointer-select' : 'touch-select')
      : 'keyboard-nav';
    handleDataPoint(chartId, seriesKey, index, source);
  }
  setupDebugPanel();
  setupPreferencePanel();
  setupSelfTestButton();
  setupResponsiveCharts();
  setupDirectPointFallback('hc-mountain', 'Intensity');
  setupDirectPointFallback('hc-staircase', 'Level');
  
  // Add comprehensive paranotice listener for debugging
  document.addEventListener('paranotice', function(e) {
    const detail = e.detail || {};
    const targetId = e.target ? e.target.id : 'null';
    appendDebug('debug', '[RAW paranotice] key=' + detail.key + ', target=' + targetId + ', has options=' + (!!(detail.value && detail.value.options)) + '.');
  }, { passive: true, capture: true });
  
  appendDebug('info', 'Event listeners registered: paranotice (raw capture) + handleParanotice (main handler).');
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initStatus); } else { initStatus(); }
  document.addEventListener('paranotice', handleParanotice);
}());
</script>

## What To Notice During Testing

- **Value discrimination (Staircase):** Use arrow keys to navigate through the four steps (20, 50, 80, 100). Can you clearly distinguish each haptic zone by feel alone?
- **Trend detection (Mountain Peak):** Navigate left to right through the bell curve. Does the increasing then decreasing vibration intensity help you sense the peak?
- **Zero handling:** Notice the weak tick at value 0 — it confirms the value exists without creating a false rhythm.
- **Sensory binding:** Sound and touch within ~50 ms are typically fused by the brain. Do the audio tone and vibration feel unified?
- **Eyes-closed navigation:** Try closing your eyes while navigating to rely fully on haptic + audio feedback.

## Resources

If you want to go deeper into haptics, accessibility, and tactile communication, these are the most useful starting points from this experiment.

### 1. Web API docs

- [MDN: Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) — the main browser reference for `navigator.vibrate()`, vibration patterns, cancellation, and compatibility.
- [MDN: Progressive web apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) — broader background on installability and offline behavior. Useful context, but a PWA is **not required** for basic vibration support.

### 2. Accessibility and deafblind research

- [Beyond the fingertips: imagining haptic technologies for a deafblind future](https://mh.bmj.com/content/50/4/610) — strong design framing for haptics as part of a larger sociotechnical system, especially for deafblind users.
- [Nagish: Deafblind communication devices and apps](https://nagish.com/post/deaf-blind-communication-devices-and-apps) — practical overview of how haptics, text, AI, braille, and communication tools can work together.

### 3. Practical takeaways for builders

- Start with **confirmation and emphasis** patterns before attempting continuous tactile encoding.
- Treat haptics as **one channel in a multimodal experience**, alongside audio, text, visible labels, and assistive tech.
- Design for **real-time interaction** and **user pacing** so people can explore without being overloaded.
- Expect people to assemble their own workflow from multiple tools: haptics, speech, braille, interpreters, device settings, and contextual knowledge.

### 4. Good questions to keep asking

- Does the haptic cue add meaning, or just motion?
- Can the user control the pace of exploration?
- Is the system still understandable without haptics?
- Are you supporting real tasks and shared experiences, not just demonstrating a device feature?

## Learn More

<details style="margin: 1.5rem 0; padding: 1rem; border: 1px solid var(--vp-c-divider, #ddd); border-radius: 0.5rem; background: var(--vp-c-bg-soft, #f9f9f9)">
<summary style="cursor: pointer; font-weight: 600; margin: -1rem -1rem 1rem">✨ Technical Details</summary>

### Perceptual Zones

Haptic intensity increases with data value through six distinct sensory zones:

| Value | Sensation | Pattern | Duration |
| :--- | :--- | :--- | :--- |
| 0 | Minimal tick (presence confirmation) | Single short | 10 ms |
| 1–25 | Weak tick | Single tick | 50 ms |
| 26–50 | Medium double | Double pulse | [100, 50, 100] ms |
| 51–75 | Strong double | Strong pulse | [150, 75, 150] ms |
| 76–99 | Very intense | Intense double | [200, 100, 200] ms |
| 100 | Peak sensation | Triple strong | [250, 150, 250] ms |

The perceptual zones map linearly to data values. Users can distinguish these zones through haptic perception alone, enabling data exploration by touch feedback. The value 0 is acknowledged with a minimal vibration to confirm its presence without confusion with "no value."

### Frequency Mapping

Audio frequency maps linearly from **150 Hz** (value 1) to **900 Hz** (value 100):

```
freq (Hz) = 150 + (value × 7.5)
```

This places low-value data in the low-frequency range (rumble/thud) and high-value data in the high-frequency range (beep/tone), reinforcing the haptic intensity signal.

### HapticFeedbackManager Reference

Below is the standalone `HapticFeedbackManager` class developed for this evaluation. It can be integrated into ParaCharts as a decoupled module that listens to chart focus events.

```js
/**
 * HapticFeedbackManager
 * Maps data values (1–100) to Web Vibration API patterns.
 * Fails silently on unsupported browsers (iOS, desktop).
 */
class HapticFeedbackManager {
  constructor(options = {}) {
    this.isEnabled = options.enabled !== undefined ? options.enabled : true
    this.isSupported = 'vibrate' in navigator
    this.lastTriggerTime = 0
    this.throttleMs = 50 // Prevents motor lag during fast keyboard traversal
  }

  /**
   * Trigger a vibration for a data value (1–100).
   * @param {number} value
   */
  trigger(value) {
    if (!this.isEnabled || !this.isSupported) return

    const now = Date.now()
    if (now - this.lastTriggerTime < this.throttleMs) return
    this.lastTriggerTime = now

    const val = Math.max(1, Math.min(100, value))
    const duration = Math.round(10 + val * 1.3)
    const gap = Math.round(500 - val * 4.8)

    if (val < 40) {
      navigator.vibrate(duration)
    } else if (val < 80) {
      navigator.vibrate([duration, gap, duration])
    } else {
      navigator.vibrate([duration, gap, duration, gap, duration])
    }
  }

  toggle(state) {
    this.isEnabled = state
  }
}
```

**Throttling:** The 50 ms throttle prevents the device motor from queuing hundreds of commands when a user traverses a dense chart rapidly by keyboard. Without it, the phone may continue buzzing long after the user stops moving.

**Integration With ParaCharts:** The intended hook is the chart's `pointFocus` or equivalent event:

```js
const haptics = new HapticFeedbackManager({ enabled: true })

chart.on('pointFocus', (data) => {
  playTone(data.value)      // existing sonification
  haptics.trigger(data.value) // new tactile layer
})
```

The haptic trigger is synchronous so it fires at the same timestamp as the `AudioContext` note start, which keeps the two sensory channels aligned within the ~50 ms threshold where the brain perceives them as a single event.

### Accessibility Notes

- **Haptics are never the only channel.** All data is also conveyed through visual labels, keyboard queries (`q`), ARIA live regions, and sonification.
- **Users must be able to disable haptics** independently of audio. A toggle should be added to the Control Panel before this feature is promoted out of experimental status.
- **No motor intensity control.** The Web Vibration API only controls timing, not amplitude. This limits resolution to approximately 8–12 distinguishable zones.

</details>
