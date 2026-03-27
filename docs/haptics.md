<script setup>
import HapticsLab from './.vitepress/theme/components/HapticsLab.vue'
import HapticsCharts from './.vitepress/theme/components/HapticsCharts.vue'
</script>

# Haptics Lab

The Haptics Lab is an exploratory page for evaluating how tactile feedback (haptics) can complement chart sonification in ParaCharts.

Haptics is treated as a **progressive enhancement**: the page works fully as an audio-only experience on all devices, and adds vibration on devices that support the [Web Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API). No chart rendering or accessibility features are changed by this experiment.

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

<HapticsCharts />

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
