
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
</ol>
</section>
<section id="hc-feedback-card" style="padding:1.25rem 1.5rem;border-radius:0.75rem;border:1px solid var(--vp-c-divider,#e2e2e2);background:var(--vp-c-bg-soft,#f9f9f9)" aria-labelledby="hc-feedback-heading" aria-live="polite" aria-atomic="true">
<h3 id="hc-feedback-heading" style="margin:0 0 0.75rem;font-size:1rem;font-weight:700">Current Point</h3>
<div id="hc-current"><p style="margin:0;font-size:0.875rem">Navigate into a chart with the keyboard to see point details here.</p></div>
</section>
<section style="padding:1.25rem 1.5rem;border-radius:0.75rem;border:1px solid var(--vp-c-divider,#e2e2e2);background:var(--vp-c-bg-soft,#f9f9f9)" aria-labelledby="hc-mountain-heading">
<h3 id="hc-mountain-heading" style="margin:0 0 0.75rem;font-size:1rem;font-weight:700">Chart 1: Mountain Peak</h3>
<p style="margin:0 0 0.75rem;font-size:0.8rem;line-height:1.5">A column chart whose values rise from 8 to 100 then fall back to 8 — a symmetric bell curve. Navigate left to right to feel intensity climb then descend. The peak (point 7) is value 100: the longest triple buzz and the highest tone.</p>
<para-chart id="hc-mountain" manifest='{"datasets":[{"type":"column","title":"Mountain Peak (haptic chart)","facets":{"x":{"label":"Step","variableType":"independent","measure":"interval","datatype":"string","displayType":{"type":"axis","orientation":"horizontal"}},"y":{"label":"Intensity (0-100)","variableType":"dependent","measure":"ratio","datatype":"number","displayType":{"type":"axis","orientation":"vertical"}}},"series":[{"key":"Intensity","records":[{"x":"1","y":"8"},{"x":"2","y":"18"},{"x":"3","y":"32"},{"x":"4","y":"48"},{"x":"5","y":"65"},{"x":"6","y":"82"},{"x":"7","y":"100"},{"x":"8","y":"82"},{"x":"9","y":"65"},{"x":"10","y":"48"},{"x":"11","y":"32"},{"x":"12","y":"18"},{"x":"13","y":"8"}]}],"data":{"source":"inline"},"settings":{"sonification.isSoniEnabled":true,"controlPanel.isControlPanelDefaultOpen":false}}]}' manifestType="content" style="display:block;width:100%;max-width:48rem;aspect-ratio:4/3;margin:0.5rem 0" aria-label="Mountain Peak haptic chart — bell-curve column chart, 13 points from 8 to 100 and back"></para-chart>
</section>
<section style="padding:1.25rem 1.5rem;border-radius:0.75rem;border:1px solid var(--vp-c-divider,#e2e2e2);background:var(--vp-c-bg-soft,#f9f9f9)" aria-labelledby="hc-staircase-heading">
<h3 id="hc-staircase-heading" style="margin:0 0 0.75rem;font-size:1rem;font-weight:700">Chart 2: Staircase</h3>
<p style="margin:0 0 0.75rem;font-size:0.8rem;line-height:1.5">A line chart with four distinct steps at values 20, 50, 80, and 100 (three points each). Navigate through it to feel the four distinct haptic zones — single tick (20), double pulse (50), triple buzz (80 and 100). Each step repeats three times so you can feel the difference between zones.</p>
<para-chart id="hc-staircase" manifest='{"datasets":[{"type":"line","title":"Staircase (haptic chart)","facets":{"x":{"label":"Step","variableType":"independent","measure":"interval","datatype":"string","displayType":{"type":"axis","orientation":"horizontal"}},"y":{"label":"Level (0-100)","variableType":"dependent","measure":"ratio","datatype":"number","displayType":{"type":"axis","orientation":"vertical"}}},"series":[{"key":"Level","records":[{"x":"A1","y":"20"},{"x":"A2","y":"20"},{"x":"A3","y":"20"},{"x":"B1","y":"50"},{"x":"B2","y":"50"},{"x":"B3","y":"50"},{"x":"C1","y":"80"},{"x":"C2","y":"80"},{"x":"C3","y":"80"},{"x":"D1","y":"100"},{"x":"D2","y":"100"},{"x":"D3","y":"100"}]}],"data":{"source":"inline"},"settings":{"sonification.isSoniEnabled":true,"controlPanel.isControlPanelDefaultOpen":false}}]}' manifestType="content" style="display:block;width:100%;max-width:48rem;aspect-ratio:4/3;margin:0.5rem 0" aria-label="Staircase haptic chart — line chart with four stepped levels: 20, 50, 80, 100"></para-chart>
</section>
</div>
<script type="module">
(function () {
  const MOUNTAIN_VALUES = [8, 18, 32, 48, 65, 82, 100, 82, 65, 48, 32, 18, 8];
  const STAIRCASE_VALUES = [20, 20, 20, 50, 50, 50, 80, 80, 80, 100, 100, 100];
  const DATA_LOOKUP = { 'hc-mountain': { Intensity: MOUNTAIN_VALUES }, 'hc-staircase': { Level: STAIRCASE_VALUES } };
  const CHART_NAMES = { 'hc-mountain': 'Mountain Peak', 'hc-staircase': 'Staircase' };
  const isHapticSupported = 'vibrate' in navigator;
  function initStatus() {
    const badgeRow = document.getElementById('hc-badge-row');
    const msg = document.getElementById('hc-support-msg');
    if (badgeRow) {
      const badge = document.createElement('span');
      badge.style.cssText = 'display:inline-flex;align-items:center;gap:0.3rem;padding:0.25rem 0.6rem;border-radius:999px;font-size:0.78rem;font-weight:600;border:1px solid;' + (isHapticSupported ? 'background:#d1fae5;border-color:#059669;color:#065f46' : 'background:#fee2e2;border-color:#dc2626;color:#7f1d1d');
      const icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = isHapticSupported ? '\u271a' : '\u26d4';
      const label = document.createElement('span');
      label.textContent = 'Haptics: ' + (isHapticSupported ? 'Supported' : 'Not supported');
      badge.appendChild(icon);
      badge.appendChild(label);
      badgeRow.appendChild(badge);
    }
    if (msg) {
      msg.textContent = isHapticSupported ? 'Haptic support detected. Navigate the charts below with the keyboard to feel the data.' : 'Haptics (Web Vibration API) not supported on this device/browser. For haptics, try Chrome on Android over HTTPS. Audio will still play.';
    }
  }
  let lastHapticTime = 0;
  function vibrate(value) {
    if (!isHapticSupported) return;
    const now = Date.now();
    if (now - lastHapticTime < 50) return;
    lastHapticTime = now;
    const val = Math.max(1, Math.min(100, value));
    const duration = Math.round(10 + val * 1.3);
    const gap = Math.round(500 - val * 4.8);
    if (val < 40) { navigator.vibrate(duration); }
    else if (val < 80) { navigator.vibrate([duration, gap, duration]); }
    else { navigator.vibrate([duration, gap, duration, gap, duration]); }
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
  function handleParanotice(e) {
    const detail = e.detail || {};
    const key = detail.key;
    const value = detail.value;
    if (['move', 'goSeriesMinMax', 'goChartMinMax', 'goFirst', 'goLast'].indexOf(key) === -1) return;
    const options = value && value.options;
    if (!options || options.seriesKey === null || options.seriesKey === undefined || options.index === null || options.index === undefined) return;
    const seriesKey = options.seriesKey;
    const index = options.index;
    const target = e.target;
    if (!target || !target.id) return;
    const lookup = DATA_LOOKUP[target.id];
    if (!lookup) return;
    const seriesData = lookup[seriesKey];
    if (!seriesData || index < 0 || index >= seriesData.length) return;
    const val = seriesData[index];
    const currentEl = document.getElementById('hc-current');
    if (currentEl) {
      const chartName = CHART_NAMES[target.id] || target.id;
      const freq = (150 + val * 7.5).toFixed(0) + ' Hz';
      const dl = document.createElement('dl');
      dl.style.cssText = 'margin:0;display:grid;gap:0.25rem';
      dl.appendChild(makeRow('Chart', chartName));
      dl.appendChild(makeRow('Position', 'Point ' + (index + 1) + ' of ' + seriesData.length));
      dl.appendChild(makeRow('Value', String(val)));
      dl.appendChild(makeRow('Audio tone', freq));
      dl.appendChild(makeRow('Haptic pattern', hapticZoneLabel(val)));
      currentEl.replaceChildren(dl);
    }
    vibrate(val);
  }
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
