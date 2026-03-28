
# Haptics Lab

The Haptics Lab is an exploratory page for evaluating how tactile feedback (haptics) can complement chart sonification in ParaCharts.

<HapticsSupportAlert />

Haptics is treated as a **progressive enhancement**: the page works fully as an audio-only experience on all devices, and adds vibration on devices that support the [Web Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API). No chart rendering or accessibility features are changed by this experiment.

::: tip 🎮 Ready to feel the data? Jump to the interactive labs
- **[Multi-Modal Lab](#multi-modal-lab)** — use a slider to manually probe haptic intensity levels (single tick → double pulse → triple buzz)
- **[Chart Navigation Lab](#chart-navigation-lab)** — navigate real charts with the keyboard; every data point fires both a tone and a vibration whose strength reflects the value
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
<div id="hc-root" style="display:flex;flex-direction:column;gap:1.25rem;margin:1.5rem 0">
<section id="hc-status-card" style="padding:1.25rem 1.5rem;border-radius:0.75rem;border:1px solid var(--vp-c-divider,#e2e2e2);background:var(--vp-c-bg-soft,#f9f9f9)" aria-labelledby="hc-status-heading">
<h3 id="hc-status-heading" style="margin:0 0 0.75rem;font-size:1rem;font-weight:700">System Status</h3>
<div id="hc-badge-row" style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.75rem"></div>
<p id="hc-support-msg" style="margin:0;font-size:0.875rem" aria-live="polite">Initializing…</p>
<div style="margin-top:0.75rem;display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap">
<button id="hc-self-test-btn" type="button" style="font-size:0.75rem;padding:0.35rem 0.6rem;border-radius:0.4rem;border:1px solid var(--vp-c-divider,#d1d5db);background:var(--vp-c-bg,#fff)">Run Vibration Self-Test</button>
<p id="hc-self-test-status" style="margin:0;font-size:0.75rem" aria-live="polite">Self-test not run yet.</p>
</div>
</section>
<section style="padding:1.25rem 1.5rem;border-radius:0.75rem;border:1px solid var(--vp-c-divider,#e2e2e2);background:var(--vp-c-bg-soft,#f9f9f9)" aria-labelledby="hc-how-heading">
<h3 id="hc-how-heading" style="margin:0 0 0.75rem;font-size:1rem;font-weight:700">How to Navigate</h3>
<ol style="margin:0;padding-left:1.25rem;font-size:0.875rem;line-height:1.8">
<li>Tab into one of the charts below to focus it.</li>
<li>Press <kbd>Enter</kbd> or <kbd>↓</kbd> to enter the data layer.</li>
<li>Use <kbd>←</kbd> / <kbd>→</kbd> to move between data points.</li>
<li>Each point plays a tone (via the chart's built-in sonification) and — on supported Android devices over HTTPS — fires a vibration whose intensity reflects the data value.</li>
<li>Press <kbd>Escape</kbd> to return to the chart top level.</li>
<li>Press <kbd>q</kbd> while on a data point to hear a spoken summary.</li>
<li>On touch devices, drag your finger horizontally across a chart to scrub through points with shorter audio+haptic feedback that follows trend progression.</li>
</ol>
</section>
<section id="hc-prefs-card" style="padding:1.25rem 1.5rem;border-radius:0.75rem;border:1px solid var(--vp-c-divider,#e2e2e2);background:var(--vp-c-bg-soft,#f9f9f9)" aria-labelledby="hc-prefs-heading">
<h3 id="hc-prefs-heading" style="margin:0 0 0.75rem;font-size:1rem;font-weight:700">Touch Feedback Preferences</h3>
<p style="margin:0 0 0.75rem;font-size:0.8rem;line-height:1.5">These preferences apply to touch-scrub interaction and are saved on this device.</p>
<div style="display:grid;gap:0.75rem;max-width:28rem">
<label style="display:flex;gap:0.5rem;align-items:flex-start;font-size:0.875rem;line-height:1.4">
<input id="hc-pref-scrub-enabled" type="checkbox" checked style="margin-top:0.15rem" />
<span>Enable touch scrub across chart values</span>
</label>
<label style="display:grid;gap:0.3rem;font-size:0.875rem">
<span>Scrub feedback mode</span>
<select id="hc-pref-feedback-mode" style="padding:0.35rem;border-radius:0.35rem;border:1px solid var(--vp-c-divider,#d1d5db);background:var(--vp-c-bg,#fff)">
<option value="both">Audio + haptics</option>
<option value="audio">Audio only</option>
<option value="haptic">Haptics only</option>
</select>
</label>
<label style="display:grid;gap:0.3rem;font-size:0.875rem">
<span>Scrub sensitivity</span>
<select id="hc-pref-scrub-sensitivity" style="padding:0.35rem;border-radius:0.35rem;border:1px solid var(--vp-c-divider,#d1d5db);background:var(--vp-c-bg,#fff)">
<option value="low">Low (slower updates)</option>
<option value="normal">Normal</option>
<option value="high">High (faster updates)</option>
</select>
</label>
<label style="display:flex;gap:0.5rem;align-items:flex-start;font-size:0.875rem;line-height:1.4">
<input id="hc-pref-diagnostic-boost" type="checkbox" style="margin-top:0.15rem" />
<span>Boost chart haptics (diagnostic)</span>
</label>
</div>
<p id="hc-pref-status" style="margin:0.75rem 0 0;font-size:0.75rem" aria-live="polite"></p>
</section>
<section id="hc-feedback-card" style="padding:1.25rem 1.5rem;border-radius:0.75rem;border:1px solid var(--vp-c-divider,#e2e2e2);background:var(--vp-c-bg-soft,#f9f9f9)" aria-labelledby="hc-feedback-heading" aria-live="polite" aria-atomic="true">
<h3 id="hc-feedback-heading" style="margin:0 0 0.75rem;font-size:1rem;font-weight:700">Current Point</h3>
<div id="hc-current"><p style="margin:0;font-size:0.875rem">Navigate into a chart with the keyboard to see point details here.</p></div>
</section>
<section id="hc-debug-card" style="padding:1.25rem 1.5rem;border-radius:0.75rem;border:1px solid var(--vp-c-divider,#e2e2e2);background:var(--vp-c-bg-soft,#f9f9f9)" aria-labelledby="hc-debug-heading">
<h3 id="hc-debug-heading" style="margin:0 0 0.5rem;font-size:1rem;font-weight:700">Haptics Debug Log</h3>
<p style="margin:0 0 0.75rem;font-size:0.8rem;line-height:1.5">Use this on mobile when the browser console is not available. It logs vibration support checks, skipped calls, API return values, and runtime chart events.</p>
<details id="hc-debug-details">
<summary id="hc-debug-summary" style="cursor:pointer;font-weight:600">Show debug log (0 entries)</summary>
<div style="margin-top:0.6rem">
<button id="hc-debug-clear" type="button" style="font-size:0.75rem;padding:0.25rem 0.5rem;border-radius:0.4rem;border:1px solid var(--vp-c-divider,#d1d5db);background:var(--vp-c-bg,#fff)">Clear log</button>
<button id="hc-debug-copy" type="button" style="font-size:0.75rem;padding:0.25rem 0.5rem;border-radius:0.4rem;border:1px solid var(--vp-c-divider,#d1d5db);background:var(--vp-c-bg,#fff);margin-left:0.4rem">Copy log</button>
<button id="hc-debug-copy-json" type="button" style="font-size:0.75rem;padding:0.25rem 0.5rem;border-radius:0.4rem;border:1px solid var(--vp-c-divider,#d1d5db);background:var(--vp-c-bg,#fff);margin-left:0.4rem">Copy as JSON</button>
</div>
<p id="hc-debug-copy-status" style="margin:0.5rem 0 0;font-size:0.72rem" aria-live="polite"></p>
<ol id="hc-debug-log" style="margin:0.75rem 0 0;padding-left:1.25rem;font-size:0.75rem;line-height:1.45;display:grid;gap:0.25rem;max-height:14rem;overflow:auto">
<li>Waiting for events...</li>
</ol>
</details>
</section>
<section style="padding:1.25rem 1.5rem;border-radius:0.75rem;border:1px solid var(--vp-c-divider,#e2e2e2);background:var(--vp-c-bg-soft,#f9f9f9)" aria-labelledby="hc-mountain-heading">
<h3 id="hc-mountain-heading" style="margin:0 0 0.75rem;font-size:1rem;font-weight:700">Chart 1: Mountain Peak</h3>
<p style="margin:0 0 0.75rem;font-size:0.8rem;line-height:1.5">A column chart whose values rise from 8 to 100 then fall back to 8 — a symmetric bell curve. Navigate left to right to feel intensity climb then descend. The peak (point 7) is value 100: the longest triple buzz and the highest tone.</p>
<para-chart id="hc-mountain" manifest='{"datasets":[{"type":"column","title":"Mountain Peak (haptic chart)","facets":{"x":{"label":"Step","variableType":"independent","measure":"interval","datatype":"string","displayType":{"type":"axis","orientation":"horizontal"}},"y":{"label":"Intensity (0-100)","variableType":"dependent","measure":"ratio","datatype":"number","displayType":{"type":"axis","orientation":"vertical"}}},"series":[{"key":"Intensity","records":[{"x":"1","y":"8"},{"x":"2","y":"18"},{"x":"3","y":"32"},{"x":"4","y":"48"},{"x":"5","y":"65"},{"x":"6","y":"82"},{"x":"7","y":"100"},{"x":"8","y":"82"},{"x":"9","y":"65"},{"x":"10","y":"48"},{"x":"11","y":"32"},{"x":"12","y":"18"},{"x":"13","y":"8"}]}],"data":{"source":"inline"},"settings":{"sonification.isSoniEnabled":true,"controlPanel.isControlPanelDefaultOpen":false,"animation.isAnimationEnabled":false}}]}' manifestType="content" style="display:block;width:100%;max-width:48rem;aspect-ratio:4/3;margin:0.5rem 0" aria-label="Mountain Peak haptic chart — bell-curve column chart, 13 points from 8 to 100 and back"></para-chart>
</section>
<section style="padding:1.25rem 1.5rem;border-radius:0.75rem;border:1px solid var(--vp-c-divider,#e2e2e2);background:var(--vp-c-bg-soft,#f9f9f9)" aria-labelledby="hc-staircase-heading">
<h3 id="hc-staircase-heading" style="margin:0 0 0.75rem;font-size:1rem;font-weight:700">Chart 2: Staircase</h3>
<p style="margin:0 0 0.75rem;font-size:0.8rem;line-height:1.5">A line chart with four distinct steps at values 20, 50, 80, and 100 (three points each). Navigate through it to feel the four distinct haptic zones — single tick (20), double pulse (50), triple buzz (80 and 100). Each step repeats three times so you can feel the difference between zones.</p>
<para-chart id="hc-staircase" manifest='{"datasets":[{"type":"line","title":"Staircase (haptic chart)","facets":{"x":{"label":"Step","variableType":"independent","measure":"interval","datatype":"string","displayType":{"type":"axis","orientation":"horizontal"}},"y":{"label":"Level (0-100)","variableType":"dependent","measure":"ratio","datatype":"number","displayType":{"type":"axis","orientation":"vertical"}}},"series":[{"key":"Level","records":[{"x":"A1","y":"20"},{"x":"A2","y":"20"},{"x":"A3","y":"20"},{"x":"B1","y":"50"},{"x":"B2","y":"50"},{"x":"B3","y":"50"},{"x":"C1","y":"80"},{"x":"C2","y":"80"},{"x":"C3","y":"80"},{"x":"D1","y":"100"},{"x":"D2","y":"100"},{"x":"D3","y":"100"}]}],"data":{"source":"inline"},"settings":{"sonification.isSoniEnabled":true,"controlPanel.isControlPanelDefaultOpen":false,"animation.isAnimationEnabled":false}}]}' manifestType="content" style="display:block;width:100%;max-width:48rem;aspect-ratio:4/3;margin:0.5rem 0" aria-label="Staircase haptic chart — line chart with four stepped levels: 20, 50, 80, 100"></para-chart>
</section>
</div>
<script type="module">
(function () {
  const MOUNTAIN_VALUES = [8, 18, 32, 48, 65, 82, 100, 82, 65, 48, 32, 18, 8];
  const STAIRCASE_VALUES = [20, 20, 20, 50, 50, 50, 80, 80, 80, 100, 100, 100];
  const DATA_LOOKUP = { 'hc-mountain': { Intensity: MOUNTAIN_VALUES }, 'hc-staircase': { Level: STAIRCASE_VALUES } };
  const CHART_NAMES = { 'hc-mountain': 'Mountain Peak', 'hc-staircase': 'Staircase' };
  const isHapticSupported = 'vibrate' in navigator;
  const isHttps = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const PREF_STORAGE_KEY = 'paracharts-haptics-touch-prefs-v1';
  const MAX_DEBUG_ENTRIES = 80;

  let scrubAudioCtx = null;
  const prefs = {
    scrubEnabled: true,
    feedbackMode: 'both',
    scrubSensitivity: 'normal',
    diagnosticBoost: false,
  };

  const scrubState = {
    'hc-mountain': { active: false, lastIndex: -1, lastTime: 0, pointerId: null, startX: 0, startY: 0, hasMoved: false, suppressSelectUntil: 0 },
    'hc-staircase': { active: false, lastIndex: -1, lastTime: 0, pointerId: null, startX: 0, startY: 0, hasMoved: false, suppressSelectUntil: 0 },
  };

  const debugDetails = document.getElementById('hc-debug-details');
  const debugSummary = document.getElementById('hc-debug-summary');
  const debugLog = document.getElementById('hc-debug-log');
  const debugClearBtn = document.getElementById('hc-debug-clear');
  const debugCopyBtn = document.getElementById('hc-debug-copy');
  const debugCopyJsonBtn = document.getElementById('hc-debug-copy-json');
  const debugCopyStatus = document.getElementById('hc-debug-copy-status');
  const prefScrubEnabled = document.getElementById('hc-pref-scrub-enabled');
  const prefFeedbackMode = document.getElementById('hc-pref-feedback-mode');
  const prefScrubSensitivity = document.getElementById('hc-pref-scrub-sensitivity');
  const prefDiagnosticBoost = document.getElementById('hc-pref-diagnostic-boost');
  const prefStatus = document.getElementById('hc-pref-status');
  const selfTestBtn = document.getElementById('hc-self-test-btn');
  const selfTestStatus = document.getElementById('hc-self-test-status');
  const debugEntries = [];
  const selfTestResult = {
    ranAt: null,
    passed: null,
    steps: [],
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
    if (prefs.scrubSensitivity === 'low') return 55;
    if (prefs.scrubSensitivity === 'high') return 20;
    return 35;
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
    const modeLabel = prefs.feedbackMode === 'both'
      ? 'audio + haptics'
      : (prefs.feedbackMode === 'audio' ? 'audio only' : 'haptics only');
    prefStatus.textContent = 'Touch scrub: '
      + (prefs.scrubEnabled ? 'enabled' : 'disabled')
      + '. Mode: ' + modeLabel
      + '. Sensitivity: ' + prefs.scrubSensitivity
      + '. Diagnostic boost: ' + (prefs.diagnosticBoost ? 'on' : 'off') + '.';
  }

  function buildDebugMetadata() {
    const nav = navigator;
    return {
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
        scrubEnabled: !!prefs.scrubEnabled,
        feedbackMode: prefs.feedbackMode,
        scrubSensitivity: prefs.scrubSensitivity,
        diagnosticBoost: !!prefs.diagnosticBoost,
      },
      runtime: {
        scrubEventMinMs: getScrubEventMinMs(),
        scrubIntensityScale: getScrubIntensityScale(),
        diagnosticBoostMultiplier: prefs.diagnosticBoost ? 1.8 : 1,
        debugEntryCount: debugEntries.length,
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
      appendDebug('warn', 'Failed to save touch preferences to localStorage.');
    }
  }

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREF_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.scrubEnabled === 'boolean') prefs.scrubEnabled = parsed.scrubEnabled;
      if (parsed.feedbackMode === 'both' || parsed.feedbackMode === 'audio' || parsed.feedbackMode === 'haptic') {
        prefs.feedbackMode = parsed.feedbackMode;
      }
      if (parsed.scrubSensitivity === 'low' || parsed.scrubSensitivity === 'normal' || parsed.scrubSensitivity === 'high') {
        prefs.scrubSensitivity = parsed.scrubSensitivity;
      }
      if (typeof parsed.diagnosticBoost === 'boolean') {
        prefs.diagnosticBoost = parsed.diagnosticBoost;
      }
    } catch (_err) {
      appendDebug('warn', 'Failed to load touch preferences from localStorage.');
    }
  }

  function syncPrefControls() {
    if (prefScrubEnabled) prefScrubEnabled.checked = !!prefs.scrubEnabled;
    if (prefFeedbackMode) prefFeedbackMode.value = prefs.feedbackMode;
    if (prefScrubSensitivity) prefScrubSensitivity.value = prefs.scrubSensitivity;
    if (prefDiagnosticBoost) prefDiagnosticBoost.checked = !!prefs.diagnosticBoost;
    updatePrefStatus();
  }

  function setupPreferencePanel() {
    loadPrefs();
    syncPrefControls();
    if (!prefScrubEnabled || !prefFeedbackMode || !prefScrubSensitivity || !prefDiagnosticBoost) {
      appendDebug('warn', 'Preference controls not found; using defaults.');
      return;
    }

    prefScrubEnabled.addEventListener('change', () => {
      prefs.scrubEnabled = !!prefScrubEnabled.checked;
      savePrefs();
      updatePrefStatus();
      appendDebug('info', 'Preference changed: touch scrub ' + (prefs.scrubEnabled ? 'enabled' : 'disabled') + '.');
    });

    prefFeedbackMode.addEventListener('change', () => {
      prefs.feedbackMode = prefFeedbackMode.value;
      savePrefs();
      updatePrefStatus();
      appendDebug('info', 'Preference changed: feedback mode=' + prefs.feedbackMode + '.');
    });

    prefScrubSensitivity.addEventListener('change', () => {
      prefs.scrubSensitivity = prefScrubSensitivity.value;
      savePrefs();
      updatePrefStatus();
      appendDebug('info', 'Preference changed: scrub sensitivity=' + prefs.scrubSensitivity + '.');
    });

    prefDiagnosticBoost.addEventListener('change', () => {
      prefs.diagnosticBoost = !!prefDiagnosticBoost.checked;
      savePrefs();
      updatePrefStatus();
      appendDebug('info', 'Preference changed: diagnostic boost ' + (prefs.diagnosticBoost ? 'enabled' : 'disabled') + '.');
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

  function ensureScrubAudio() {
    if (scrubAudioCtx) return scrubAudioCtx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) {
      appendDebug('warn', 'AudioContext unavailable for touch-scrub tones.');
      return null;
    }
    try {
      scrubAudioCtx = new Ctx();
      appendDebug('info', 'Touch-scrub audio context initialized.');
      return scrubAudioCtx;
    } catch (err) {
      const errMessage = err instanceof Error ? (err.name + ': ' + err.message) : String(err);
      appendDebug('error', 'Failed to initialize touch-scrub audio context: ' + errMessage);
      return null;
    }
  }

  function playScrubTone(value) {
    if (prefs.feedbackMode === 'haptic') return;
    const ctx = ensureScrubAudio();
    if (!ctx) return;
    const val = Math.max(1, Math.min(100, value));
    const freq = 150 + val * 7.5;
    const start = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.06, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.08);
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
  let lastHapticTimeNav = 0;
  let lastHapticTimeScrub = 0;
  let scrubThrottleSkipCount = 0;
  let lastScrubThrottleLogTime = 0;
  function vibrate(value, mode) {
    const isScrubMode = mode === 'scrub';
    if (isScrubMode && prefs.feedbackMode === 'audio') {
      appendDebug('info', 'vibrate(' + value + ') skipped: scrub mode is set to audio only.');
      return;
    }
    if (!isHapticSupported) {
      console.warn('[HapticsPage] vibrate(' + value + ') skipped \u2014 Vibration API not supported');
      appendDebug('warn', 'vibrate(' + value + ') skipped: Vibration API not supported.');
      return;
    }
    if (!isHttps) {
      console.warn('[HapticsPage] vibrate(' + value + ') skipped \u2014 HTTPS required for haptics');
      appendDebug('warn', 'vibrate(' + value + ') skipped: HTTPS required for haptics.');
      return;
    }
    const now = Date.now();
    const hapticMinMs = isScrubMode ? 28 : 50;
    const lastHapticTime = isScrubMode ? lastHapticTimeScrub : lastHapticTimeNav;
    if (now - lastHapticTime < hapticMinMs) {
      console.debug('[HapticsPage] vibrate(' + value + ') skipped \u2014 throttled (< ' + hapticMinMs + ' ms since last)');
      if (isScrubMode) {
        scrubThrottleSkipCount += 1;
        if (now - lastScrubThrottleLogTime > 300) {
          appendDebug('info', 'vibrate scrub throttled ' + scrubThrottleSkipCount + ' time(s) in the last ~300ms.');
          scrubThrottleSkipCount = 0;
          lastScrubThrottleLogTime = now;
        }
      } else {
        appendDebug('info', 'vibrate(' + value + ') skipped: throttled (< ' + hapticMinMs + ' ms since last event).');
      }
      return;
    }
    if (isScrubMode) {
      lastHapticTimeScrub = now;
      scrubThrottleSkipCount = 0;
    } else {
      lastHapticTimeNav = now;
    }
    const val = Math.max(1, Math.min(100, value));
    const scrubScale = getScrubIntensityScale();
    const baseDuration = isScrubMode ? (10 + val * 0.9) : (12 + val * 1.35);
    const baseGap = isScrubMode ? (190 - val * 1.3) : (480 - val * 4.2);
    const modeScale = isScrubMode ? scrubScale : 1;
    const hapticOnlyBoost = prefs.feedbackMode === 'haptic' ? 1.15 : 1;
    const diagnosticBoost = prefs.diagnosticBoost ? 1.8 : 1;
    const combinedScale = modeScale * hapticOnlyBoost * diagnosticBoost;
    const duration = Math.max(8, Math.round(baseDuration * combinedScale));
    const gap = Math.max(18, Math.round(baseGap / Math.max(1, modeScale)));
    let pattern;
    let zone;
    if (prefs.diagnosticBoost) {
      const strongDuration = Math.max(duration, 120);
      const strongGap = Math.max(gap, 90);
      if (val < 40) {
        pattern = [strongDuration, strongGap, strongDuration];
        zone = 'diagnostic-double';
      } else if (val < 80) {
        pattern = [strongDuration, strongGap, strongDuration, strongGap, strongDuration];
        zone = 'diagnostic-triple';
      } else {
        pattern = [strongDuration, strongGap, strongDuration, strongGap, strongDuration, strongGap, strongDuration];
        zone = 'diagnostic-quad';
      }
    } else if (val < 40) {
      pattern = duration;
      zone = 'single-tick';
    } else if (val < 80) {
      pattern = [duration, gap, duration];
      zone = 'double-pulse';
    } else {
      pattern = [duration, gap, duration, gap, duration];
      zone = 'triple-buzz';
    }
    let result = false;
    try {
      result = navigator.vibrate(pattern);
    } catch (err) {
      const errMessage = err instanceof Error ? (err.name + ': ' + err.message) : String(err);
      console.error('[HapticsPage] vibrate(' + val + ') failed \u2014 ' + errMessage);
      appendDebug('error', 'vibrate(' + val + ') failed: ' + errMessage);
      return;
    }
    const patternStr = Array.isArray(pattern) ? '[' + pattern.join(',') + ']' : String(pattern);
    console.log('[HapticsPage] vibrate(' + val + ') \u2014 zone: ' + zone + ' | pattern: ' + patternStr + 'ms | result: ' + result);
    if (!result) {
      appendDebug('warn', 'vibrate(' + val + ') returned false. Pattern=' + patternStr + 'ms; zone=' + zone + '.');
      return;
    }
    appendDebug('info', 'vibrate(' + val + ') sent. Pattern=' + patternStr + 'ms; zone=' + zone + '; mode=' + (isScrubMode ? 'scrub' : 'nav') + '.');
  }
  function hapticZoneLabel(val) {
    if (val < 40) return 'Single tick (< 40)';
    if (val < 80) return 'Double pulse (40\u201379)';
    return 'Triple buzz (\u2265 80)';
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

  function handleDataPoint(chartId, seriesKey, index, source) {
    const lookup = DATA_LOOKUP[chartId];
    if (!lookup) {
      appendDebug('warn', source + ': chart id ' + chartId + ' not found in DATA_LOOKUP.');
      return;
    }
    const seriesData = lookup[seriesKey];
    if (!seriesData || index < 0 || index >= seriesData.length) {
      appendDebug('warn', source + ': invalid series/index. series=' + seriesKey + ', index=' + index + '.');
      return;
    }
    const val = seriesData[index];
    const chartName = CHART_NAMES[chartId] || chartId;
    appendDebug('info', source + ': point focus chart=' + chartName + ', series=' + seriesKey + ', index=' + index + ', value=' + val + '.');
    renderCurrentPoint(chartName, index, seriesData.length, val, source);
    if (source === 'touch-scrub') {
      playScrubTone(val);
      vibrate(val, 'scrub');
    } else {
      vibrate(val, 'nav');
    }
  }

  function setupTouchScrub(chartId, seriesKey) {
    const chartEl = document.getElementById(chartId);
    if (!chartEl) {
      appendDebug('warn', 'Touch scrub setup skipped: chart element ' + chartId + ' not found.');
      return;
    }
    const state = scrubState[chartId];
    const series = DATA_LOOKUP[chartId] && DATA_LOOKUP[chartId][seriesKey];
    if (!state || !series || series.length < 2) {
      appendDebug('warn', 'Touch scrub setup skipped: missing data for chart=' + chartId + ', series=' + seriesKey + '.');
      return;
    }

    function clientXToIndex(clientX) {
      const rect = chartEl.getBoundingClientRect();
      if (!rect.width) return 0;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(ratio * (series.length - 1));
    }

    function handleScrubMove(clientX) {
      if (!state.active) return;
      const now = Date.now();
      if (now - state.lastTime < getScrubEventMinMs()) return;
      const idx = clientXToIndex(clientX);
      if (idx === state.lastIndex) return;
      state.lastTime = now;
      state.lastIndex = idx;
      handleDataPoint(chartId, seriesKey, idx, 'touch-scrub');
    }

    chartEl.addEventListener('pointerdown', (ev) => {
      if (ev.pointerType === 'mouse') return;
      if (!prefs.scrubEnabled) {
        appendDebug('info', 'Touch scrub ignored on ' + (CHART_NAMES[chartId] || chartId) + ': disabled by preference.');
        return;
      }
      state.active = false;
      state.lastIndex = -1;
      state.lastTime = 0;
      state.pointerId = ev.pointerId;
      state.startX = ev.clientX;
      state.startY = ev.clientY;
      state.hasMoved = false;
      state.suppressSelectUntil = Date.now() + 500;
      if (chartEl.setPointerCapture) {
        try {
          chartEl.setPointerCapture(ev.pointerId);
        } catch (_err) {
          appendDebug('warn', 'Pointer capture failed on ' + (CHART_NAMES[chartId] || chartId) + '.');
        }
      }
    });

    chartEl.addEventListener('pointermove', (ev) => {
      if (ev.pointerType === 'mouse') return;
      if (state.pointerId !== ev.pointerId) return;
      const dx = ev.clientX - state.startX;
      const dy = ev.clientY - state.startY;
      if (!state.active) {
        if (Math.abs(dx) < getScrubStartThresholdPx()) return;
        if (Math.abs(dx) < Math.abs(dy)) {
          appendDebug('info', 'Touch scrub ignored on ' + (CHART_NAMES[chartId] || chartId) + ': vertical movement dominated.');
          return;
        }
        state.active = true;
        state.hasMoved = true;
        ensureScrubAudio();
        appendDebug('info', 'Touch scrub started on ' + (CHART_NAMES[chartId] || chartId) + '.');
      }
      ev.preventDefault();
      handleScrubMove(ev.clientX);
    });

    chartEl.addEventListener('pointerup', (ev) => {
      if (state.pointerId !== ev.pointerId) return;
      if (state.active) {
        appendDebug('info', 'Touch scrub ended on ' + (CHART_NAMES[chartId] || chartId) + '.');
      }
      if (chartEl.releasePointerCapture) {
        try {
          chartEl.releasePointerCapture(ev.pointerId);
        } catch (_err) {
          // Ignore capture release failures.
        }
      }
      state.active = false;
      state.pointerId = null;
      state.hasMoved = false;
    });

    chartEl.addEventListener('pointercancel', (ev) => {
      if (state.pointerId !== ev.pointerId) return;
      if (state.active) {
        appendDebug('info', 'Touch scrub canceled on ' + (CHART_NAMES[chartId] || chartId) + '.');
      }
      state.active = false;
      state.pointerId = null;
      state.hasMoved = false;
    });

    chartEl.style.touchAction = 'pan-y';
  }
  function handleParanotice(e) {
    const detail = e.detail || {};
    const key = detail.key;
    const value = detail.value;
    const now = Date.now();
    if (['animRevealStep', 'animRevealEnd', 'animRevealStart'].indexOf(key) !== -1) {
      return;
    }
    const isScrubSuppressingSelect = Object.values(scrubState).some(state => state.active || state.suppressSelectUntil > now);
    if (key === 'select' && isScrubSuppressingSelect) {
      return;
    }
    console.debug('[HapticsPage] paranotice \u2014 key: ' + key);
    appendDebug('info', 'paranotice key=' + key + '.');
    if (['move', 'goSeriesMinMax', 'goChartMinMax', 'goFirst', 'goLast'].indexOf(key) === -1) return;
    const options = value && value.options;
    if (!options || options.seriesKey === null || options.seriesKey === undefined || options.index === null || options.index === undefined) {
      console.warn('[HapticsPage] paranotice(' + key + ') \u2014 missing options.seriesKey or options.index', value);
      appendDebug('warn', 'paranotice(' + key + ') missing options.seriesKey or options.index.');
      return;
    }
    const seriesKey = options.seriesKey;
    const index = options.index;
    const target = e.target;
    if (!target || !target.id) {
      console.warn('[HapticsPage] paranotice(' + key + ') \u2014 no target id');
      appendDebug('warn', 'paranotice(' + key + ') ignored: missing target id.');
      return;
    }
    const lookup = DATA_LOOKUP[target.id];
    if (!lookup) {
      console.debug('[HapticsPage] paranotice(' + key + ') \u2014 target id "' + target.id + '" not in DATA_LOOKUP; ignoring');
      appendDebug('info', 'paranotice(' + key + ') ignored: target id ' + target.id + ' not in DATA_LOOKUP.');
      return;
    }
    handleDataPoint(target.id, seriesKey, index, 'keyboard-nav');
  }
  setupDebugPanel();
  setupPreferencePanel();
  setupSelfTestButton();
  setupTouchScrub('hc-mountain', 'Intensity');
  setupTouchScrub('hc-staircase', 'Level');
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initStatus); } else { initStatus(); }
  document.addEventListener('paranotice', handleParanotice);
}());
</script>

## Perceptual Zones

Haptic patterns are divided into three perceptual zones based on value (1–100):

| Value range | Sensation | Pulse pattern | Duration | Gap (decreases as value rises) |
| :--- | :--- | :--- | :--- | :--- |
| 1–39 | Single tick | `[duration]` | 10–61 ms | — |
| 40–79 | Double pulse | `[duration, gap, duration]` | 62–113 ms | ~308–121 ms |
| 80–100 | Triple rapid buzz | `[duration, gap, duration, gap, duration]` | 114–140 ms | ~116–20 ms |

Because the human hand can distinguish roughly 8–12 distinct tactile levels (not 100), the perceptual zones and the shrinking gap between pulses at higher values are what give the user a sense of "hotter" data — mimicking the way a higher-pitched sound feels more urgent.

## Frequency Mapping

Audio frequency maps linearly from **150 Hz** (value 1) to **900 Hz** (value 100):

```
freq (Hz) = 150 + (value × 7.5)
```

This places low-value data in the low-frequency range (rumble/thud) and high-value data in the high-frequency range (beep/tone), reinforcing the haptic intensity signal.

## HapticFeedbackManager Reference

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

### Throttling

The 50 ms throttle prevents the device motor from queuing hundreds of commands when a user traverses a dense chart rapidly by keyboard. Without it, the phone may continue buzzing long after the user stops moving.

### Integration With ParaCharts

The intended hook is the chart's `pointFocus` or equivalent event:

```js
const haptics = new HapticFeedbackManager({ enabled: true })

chart.on('pointFocus', (data) => {
  playTone(data.value)      // existing sonification
  haptics.trigger(data.value) // new tactile layer
})
```

The haptic trigger is synchronous so it fires at the same timestamp as the `AudioContext` note start, which keeps the two sensory channels aligned within the ~50 ms threshold where the brain perceives them as a single event.

## Accessibility Notes

- **Haptics are never the only channel.** All data is also conveyed through visual labels, keyboard queries (`q`), ARIA live regions, and sonification.
- **Users must be able to disable haptics** independently of audio. A toggle should be added to the Control Panel before this feature is promoted out of experimental status.
- **No motor intensity control.** The Web Vibration API only controls timing, not amplitude. This limits resolution to approximately 8–12 distinguishable zones.

## What To Notice During Testing

- **Sensory binding:** Does the high-pitched tone feel like it belongs with the fast buzz? Sound and touch within ~50 ms are typically fused by the brain into a single event.
- **Resolution (Mountain Peak):** Can you identify roughly where the 50% mark falls using feel and sound alone?
- **Threshold detection (Staircase):** Close your eyes and see if you can identify which of the four steps is playing.
- **Throttle behavior (Heartbeat):** If vibrations blur into a single continuous buzz, the gap interval may need widening for that value range.

## Status

The **Chart Navigation Lab** above wires the `HapticFeedbackManager` directly into ParaCharts keyboard navigation: every datapoint focus change triggers both an audio tone and a vibration pattern. The **Multi-Modal Lab** above remains useful for isolated testing of individual haptic patterns.

Future work: add a haptics toggle to the Control Panel and expose haptic intensity settings.
