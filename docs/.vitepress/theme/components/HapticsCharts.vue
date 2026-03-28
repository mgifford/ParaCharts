<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// ─── Chart data (values on a 0–100 scale for direct haptic mapping) ──────────

/**
 * Mountain Peak — a symmetric bell-curve column chart.
 * Values rise from 8 to 100 then fall back to 8, matching the
 * "Mountain Peak" audio test pattern from the Haptics Lab above.
 */
const MOUNTAIN_RECORDS = [
  { x: '1', y: '8' },
  { x: '2', y: '18' },
  { x: '3', y: '32' },
  { x: '4', y: '48' },
  { x: '5', y: '65' },
  { x: '6', y: '82' },
  { x: '7', y: '100' },
  { x: '8', y: '82' },
  { x: '9', y: '65' },
  { x: '10', y: '48' },
  { x: '11', y: '32' },
  { x: '12', y: '18' },
  { x: '13', y: '8' },
]

/**
 * Staircase — four distinct steps at 20, 50, 80, and 100,
 * three points per step, matching the "Staircase" audio test pattern.
 */
const STAIRCASE_RECORDS = [
  { x: 'A1', y: '20' },
  { x: 'A2', y: '20' },
  { x: 'A3', y: '20' },
  { x: 'B1', y: '50' },
  { x: 'B2', y: '50' },
  { x: 'B3', y: '50' },
  { x: 'C1', y: '80' },
  { x: 'C2', y: '80' },
  { x: 'C3', y: '80' },
  { x: 'D1', y: '100' },
  { x: 'D2', y: '100' },
  { x: 'D3', y: '100' },
]

// Build inline manifests (manifestType="content")
function makeManifest(
  type: string,
  title: string,
  yLabel: string,
  seriesKey: string,
  records: { x: string; y: string }[],
) {
  return JSON.stringify({
    datasets: [
      {
        type,
        title,
        facets: {
          x: {
            label: 'Step',
            variableType: 'independent',
            measure: 'interval',
            datatype: 'string',
            displayType: { type: 'axis', orientation: 'horizontal' },
          },
          y: {
            label: yLabel,
            variableType: 'dependent',
            measure: 'ratio',
            datatype: 'number',
            displayType: { type: 'axis', orientation: 'vertical' },
          },
        },
        series: [{ key: seriesKey, records }],
        data: { source: 'inline' },
        settings: {
          'sonification.isSoniEnabled': true,
          'controlPanel.isControlPanelDefaultOpen': false,
        },
      },
    ],
  })
}

const mountainManifest = makeManifest(
  'column',
  'Mountain Peak (haptic chart)',
  'Intensity (0–100)',
  'Intensity',
  MOUNTAIN_RECORDS,
)

const staircaseManifest = makeManifest(
  'line',
  'Staircase (haptic chart)',
  'Level (0–100)',
  'Level',
  STAIRCASE_RECORDS,
)

// Build lookup maps: seriesKey → [y values] for each chart
const mountainLookup: Record<string, number[]> = {
  Intensity: MOUNTAIN_RECORDS.map((r) => Number(r.y)),
}
const staircaseLookup: Record<string, number[]> = {
  Level: STAIRCASE_RECORDS.map((r) => Number(r.y)),
}

// ─── State ────────────────────────────────────────────────────────────────────

const isHapticSupported = ref(false)
const isHttps = ref(false)
const supportMsg = ref('Initializing…')

/** Info about the last navigated datapoint */
const currentChart = ref<string>('')
const currentLabel = ref<string>('')
const currentValue = ref<number | null>(null)
const hapticZone = ref<string>('')

/** Capped ring-buffer of the last 20 haptic debug log entries */
const hapticLog = ref<string[]>([])
const MAX_LOG = 20

function addLog(msg: string) {
  const ts = new Date().toISOString().slice(11, 23)
  hapticLog.value = [`[${ts}] ${msg}`, ...hapticLog.value].slice(0, MAX_LOG)
}

// Refs to the chart DOM elements so we can identify which chart fired
const mountainChartRef = ref<HTMLElement | null>(null)
const staircaseChartRef = ref<HTMLElement | null>(null)

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
  isHapticSupported.value = 'vibrate' in navigator
  isHttps.value =
    typeof location !== 'undefined' &&
    (location.protocol === 'https:' ||
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1')

  const apiStatus = isHapticSupported.value ? 'Vibration API present' : 'Vibration API absent'
  const httpsStatus = isHttps.value ? 'HTTPS ✓' : 'HTTP (haptics may be blocked)'
  console.log(`[HapticsCharts] init — ${apiStatus} | ${httpsStatus} | UA: ${navigator.userAgent}`)

  if (!isHapticSupported.value) {
    supportMsg.value =
      'Haptics (Web Vibration API) not supported on this device/browser. For haptics, try Chrome on Android over HTTPS. Audio will still play.'
  } else if (!isHttps.value) {
    supportMsg.value =
      'Vibration API detected but haptics require HTTPS. This page appears to be served over plain HTTP — reload over HTTPS to enable haptic feedback. Audio will still play.'
  } else {
    supportMsg.value =
      'Haptic support detected. Navigate the charts below with the keyboard to feel the data.'
  }

  // Dynamically load the ParaCharts runtime if not already present
  if (!document.querySelector('script[data-paracharts-loader]')
      && !customElements.get('para-chart')) {
    const script = document.createElement('script')
    script.type = 'module'
    script.dataset.parachartsLoader = 'true'
    // BASE_URL handles both dev ('/ParaCharts/') and direct-serve scenarios
    script.src = `${import.meta.env.BASE_URL}assets/paracharts-loader.js`
    document.head.appendChild(script)
  }

  document.addEventListener('paranotice', handleParanotice as EventListener)
})

onUnmounted(() => {
  document.removeEventListener('paranotice', handleParanotice as EventListener)
})

// ─── Haptics ──────────────────────────────────────────────────────────────────

let _lastHapticTime = 0

/**
 * Trigger a vibration pattern whose duration and cadence map to `value` (0–100).
 *
 * Perceptual zones (matching the HapticsLab above):
 *   < 40  → single short tick
 *   40–79 → double pulse
 *   ≥ 80  → triple rapid buzz
 *
 * The chart already plays its own audio tone via built-in sonification;
 * this function only fires the haptic layer.
 */
function vibrate(value: number) {
  if (!isHapticSupported.value) {
    const msg = `vibrate(${value}) skipped — Vibration API not supported`
    console.warn(`[HapticsCharts] ${msg}`)
    addLog(msg)
    return
  }
  if (!isHttps.value) {
    const msg = `vibrate(${value}) skipped — HTTPS required for haptics`
    console.warn(`[HapticsCharts] ${msg}`)
    addLog(msg)
    return
  }
  const now = Date.now()
  if (now - _lastHapticTime < 50) {
    console.debug(`[HapticsCharts] vibrate(${value}) skipped — throttled (< 50 ms since last)`)
    return // throttle — same as HapticsLab
  }
  _lastHapticTime = now

  const val = Math.max(1, Math.min(100, value))
  const duration = Math.round(10 + val * 1.3)
  const gap = Math.round(500 - val * 4.8)

  let pattern: number | number[]
  let zone: string
  if (val < 40) {
    pattern = duration
    zone = 'single-tick'
  } else if (val < 80) {
    pattern = [duration, gap, duration]
    zone = 'double-pulse'
  } else {
    pattern = [duration, gap, duration, gap, duration]
    zone = 'triple-buzz'
  }

  const result = navigator.vibrate(pattern)
  const patternStr = Array.isArray(pattern) ? `[${pattern.join(',')}]` : String(pattern)
  const msg = `vibrate(${val}) — zone: ${zone} | pattern: ${patternStr}ms | result: ${result}`
  console.log(`[HapticsCharts] ${msg}`)
  addLog(msg)
}

// ─── paranotice handler ───────────────────────────────────────────────────────

function handleParanotice(e: CustomEvent<{ key: string; value: unknown }>) {
  const { key, value } = e.detail ?? {}
  console.debug(`[HapticsCharts] paranotice — key: ${key}`)
  // Only respond to datapoint navigation events
  if (
    key !== 'move' &&
    key !== 'goSeriesMinMax' &&
    key !== 'goChartMinMax' &&
    key !== 'goFirst' &&
    key !== 'goLast'
  ) return

  const options = (value as { options?: { seriesKey?: string; index?: number } })?.options
  if (!options || options.seriesKey == null || options.index == null) {
    console.warn(`[HapticsCharts] paranotice(${key}) — missing options.seriesKey or options.index`, value)
    return
  }

  const { seriesKey, index } = options

  // Identify which chart fired using the event's bubbling target.
  // Because paranotice is dispatched directly by the para-chart element
  // (not from within shadow DOM), e.target is always the para-chart host.
  const target = e.target as HTMLElement | null
  let lookup: Record<string, number[]> | null = null
  let chartName = ''

  if (target && mountainChartRef.value && target === mountainChartRef.value) {
    lookup = mountainLookup
    chartName = 'Mountain Peak'
  } else if (target && staircaseChartRef.value && target === staircaseChartRef.value) {
    lookup = staircaseLookup
    chartName = 'Staircase'
  } else {
    console.debug(`[HapticsCharts] paranotice(${key}) — event target not matched to a managed chart; ignoring`, target)
    return // event from a different chart on the page — ignore
  }

  const seriesData = lookup[seriesKey]
  if (!seriesData || index < 0 || index >= seriesData.length) {
    console.warn(`[HapticsCharts] paranotice(${key}) — seriesKey "${seriesKey}" not found or index ${index} out of range for chart "${chartName}"`)
    return
  }

  const val = seriesData[index]
  console.log(`[HapticsCharts] point focus — chart: ${chartName} | seriesKey: ${seriesKey} | index: ${index} | value: ${val}`)

  // Update status display
  currentChart.value = chartName
  currentLabel.value = `Point ${index + 1} of ${seriesData.length}`
  currentValue.value = val
  hapticZone.value = hapticZoneLabel(val)

  vibrate(val)
}

function hapticZoneLabel(val: number): string {
  if (val < 40) return 'Single tick (< 40)'
  if (val < 80) return 'Double pulse (40–79)'
  return 'Triple buzz (≥ 80)'
}

// ─── Derived display ──────────────────────────────────────────────────────────

const freqDisplay = computed(() => {
  if (currentValue.value == null) return '—'
  return `${(150 + currentValue.value * 7.5).toFixed(0)} Hz`
})
</script>

<template>
  <div class="hc-root" aria-label="Haptic Chart Navigation">

    <!-- ── System Status ──────────────────────────────────────────────── -->
    <section class="hc-card" aria-labelledby="hc-status-heading">
      <h3 id="hc-status-heading" class="hc-card-title">System Status</h3>

      <div class="hc-badge-row">
        <span
          class="hc-badge"
          :class="isHapticSupported ? 'hc-badge--ok' : 'hc-badge--warn'"
        >
          <span aria-hidden="true">{{ isHapticSupported ? '✚' : '⛔' }}</span>
          Haptics API: {{ isHapticSupported ? 'Supported' : 'Not supported' }}
        </span>
        <span
          class="hc-badge"
          :class="isHttps ? 'hc-badge--ok' : 'hc-badge--warn'"
          aria-label="HTTPS status"
        >
          <span aria-hidden="true">{{ isHttps ? '🔒' : '⚠️' }}</span>
          HTTPS: {{ isHttps ? 'Yes' : 'No (haptics may be blocked)' }}
        </span>
      </div>

      <p class="hc-msg" aria-live="polite">{{ supportMsg }}</p>
    </section>

    <!-- ── How to use ─────────────────────────────────────────────────── -->
    <section class="hc-card" aria-labelledby="hc-how-heading">
      <h3 id="hc-how-heading" class="hc-card-title">How to Navigate</h3>
      <ol class="hc-list">
        <li>Tab into one of the charts below to focus it.</li>
        <li>Press <kbd>Enter</kbd> or <kbd>↓</kbd> to enter the data layer.</li>
        <li>Use <kbd>←</kbd> / <kbd>→</kbd> to move between data points.</li>
        <li>
          Each point plays a tone (via the chart's built-in sonification) and —
          on supported Android devices over HTTPS — fires a vibration whose
          intensity reflects the data value.
        </li>
        <li>Press <kbd>Escape</kbd> to return to the chart top level.</li>
        <li>Press <kbd>q</kbd> while on a data point to hear a spoken summary.</li>
      </ol>
    </section>

    <!-- ── Live feedback ──────────────────────────────────────────────── -->
    <section
      class="hc-card"
      aria-labelledby="hc-feedback-heading"
      aria-live="polite"
      aria-atomic="true"
    >
      <h3 id="hc-feedback-heading" class="hc-card-title">Current Point</h3>
      <dl class="hc-dl" v-if="currentValue !== null">
        <div class="hc-dl-row">
          <dt>Chart</dt><dd>{{ currentChart }}</dd>
        </div>
        <div class="hc-dl-row">
          <dt>Position</dt><dd>{{ currentLabel }}</dd>
        </div>
        <div class="hc-dl-row">
          <dt>Value</dt><dd>{{ currentValue }}</dd>
        </div>
        <div class="hc-dl-row">
          <dt>Audio tone</dt><dd>{{ freqDisplay }}</dd>
        </div>
        <div class="hc-dl-row">
          <dt>Haptic pattern</dt><dd>{{ hapticZone }}</dd>
        </div>
      </dl>
      <p class="hc-msg" v-else>
        Navigate into a chart with the keyboard to see point details here.
      </p>
    </section>

    <!-- ── Chart 1: Mountain Peak ─────────────────────────────────────── -->
    <section class="hc-card" aria-labelledby="hc-mountain-heading">
      <h3 id="hc-mountain-heading" class="hc-card-title">Chart 1: Mountain Peak</h3>
      <p class="hc-hint">
        A column chart whose values rise from 8 to 100 then fall back to 8 — a
        symmetric bell curve. Navigate left to right to feel intensity climb then descend.
        The peak (point 7) is value 100: the longest triple buzz and the highest tone.
      </p>
      <para-chart
        ref="mountainChartRef"
        :manifest="mountainManifest"
        manifestType="content"
        style="display:block; width:100%; max-width:48rem; aspect-ratio:4/3; margin:0.5rem 0;"
        aria-label="Mountain Peak haptic chart — bell-curve column chart, 13 points from 8 to 100 and back"
      ></para-chart>
    </section>

    <!-- ── Chart 2: Staircase ─────────────────────────────────────────── -->
    <section class="hc-card" aria-labelledby="hc-staircase-heading">
      <h3 id="hc-staircase-heading" class="hc-card-title">Chart 2: Staircase</h3>
      <p class="hc-hint">
        A line chart with four distinct steps at values 20, 50, 80, and 100
        (three points each). Navigate through it to feel the four distinct haptic
        zones — single tick (20), double pulse (50), triple buzz (80 and 100).
        Each step repeats three times so you can feel the difference between zones.
      </p>
      <para-chart
        ref="staircaseChartRef"
        :manifest="staircaseManifest"
        manifestType="content"
        style="display:block; width:100%; max-width:48rem; aspect-ratio:4/3; margin:0.5rem 0;"
        aria-label="Staircase haptic chart — line chart with four stepped levels: 20, 50, 80, 100"
      ></para-chart>
    </section>

    <!-- ── Haptic Debug Log ───────────────────────────────────────────── -->
    <section class="hc-card" aria-labelledby="hc-debug-heading">
      <h3 id="hc-debug-heading" class="hc-card-title">Haptic Debug Log</h3>
      <p class="hc-hint">
        Each haptic trigger attempt from chart navigation is logged here (most recent first).
        Check the browser console (<kbd>F12</kbd>) for full detail including device info.
        <code>result: true</code> means the vibration was accepted by the browser;
        <code>result: false</code> or a <em>skipped</em> entry means it did not fire.
      </p>
      <div
        class="hc-debug-log"
        role="log"
        aria-label="Haptic debug log"
        aria-live="polite"
        aria-atomic="false"
      >
        <p v-if="hapticLog.length === 0" class="hc-debug-empty">No haptic events yet. Navigate a chart above with the keyboard to see entries.</p>
        <div v-else>
          <div
            v-for="(entry, i) in hapticLog"
            :key="i"
            class="hc-debug-entry"
            :class="{
              'hc-debug-entry--warn': entry.includes('skipped'),
              'hc-debug-entry--false': entry.includes('result: false'),
            }"
          >{{ entry }}</div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ── Root ─────────────────────────────────────────────────────────────────── */
.hc-root {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 1.5rem 0;
}

/* ── Card ─────────────────────────────────────────────────────────────────── */
.hc-card {
  padding: 1.25rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.hc-card-title {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

/* ── Badges ───────────────────────────────────────────────────────────────── */
.hc-badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.hc-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid;
}

.hc-badge--ok {
  background: #d1fae5;
  border-color: #059669;
  color: #065f46;
}

.dark .hc-badge--ok {
  background: #064e3b;
  border-color: #34d399;
  color: #a7f3d0;
}

.hc-badge--warn {
  background: #fee2e2;
  border-color: #dc2626;
  color: #7f1d1d;
}

.dark .hc-badge--warn {
  background: #450a0a;
  border-color: #f87171;
  color: #fecaca;
}

/* ── Messages ─────────────────────────────────────────────────────────────── */
.hc-msg {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

/* ── How-to list ──────────────────────────────────────────────────────────── */
.hc-list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
  line-height: 1.8;
}

.hc-list kbd {
  display: inline-block;
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-mute);
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.78rem;
}

/* ── Feedback dl ──────────────────────────────────────────────────────────── */
.hc-dl {
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.25rem;
}

.hc-dl-row {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.hc-dl-row dt {
  font-weight: 600;
  color: var(--vp-c-text-2);
  min-width: 9rem;
}

.hc-dl-row dd {
  margin: 0;
  color: var(--vp-c-text-1);
}

/* ── Hint text ────────────────────────────────────────────────────────────── */
.hc-hint {
  margin: 0 0 0.75rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* ── Debug log ────────────────────────────────────────────────────────────── */
.hc-debug-log {
  font-family: var(--vp-font-family-mono, monospace);
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  min-height: 4rem;
  max-height: 14rem;
  overflow-y: auto;
}

.hc-debug-empty {
  margin: 0;
  color: var(--vp-c-text-3, #aaa);
  font-style: italic;
}

.hc-debug-entry {
  padding: 0.1rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--vp-c-text-1);
}

.hc-debug-entry:last-child {
  border-bottom: none;
}

.hc-debug-entry--warn {
  color: #b45309;
}

.dark .hc-debug-entry--warn {
  color: #fcd34d;
}

.hc-debug-entry--false {
  color: #dc2626;
}

.dark .hc-debug-entry--false {
  color: #f87171;
}
</style>
