<script setup lang="ts">
import { ref, onMounted } from 'vue'

// ─── State ────────────────────────────────────────────────────────────────────

const audioCtx = ref<AudioContext | null>(null)
const isHapticSupported = ref(false)
const isAudioInitialized = ref(false)
const sliderValue = ref(50)
const progressWidth = ref(0)
const patternStatus = ref('Awaiting interaction…')
const supportMsg = ref('Audio/Haptics Idle…')
const isRunning = ref(false)

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
  isHapticSupported.value = 'vibrate' in navigator
  if (!isHapticSupported.value) {
    supportMsg.value =
      'Haptics (Web Vibration API) not supported on this device or browser. ' +
      'Audio-only mode is available. For haptics, try Chrome on Android over HTTPS.'
  } else {
    supportMsg.value =
      'Haptic support detected. Press "Initialize Audio Engine" to enable audio.'
  }
})

// ─── Audio ────────────────────────────────────────────────────────────────────

function initAudio() {
  if (audioCtx.value) return
  // AudioContext requires a user gesture to start
  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  audioCtx.value = new Ctx()
  isAudioInitialized.value = true
  supportMsg.value = isHapticSupported.value
    ? 'System online. Both audio and haptics are active.'
    : 'Audio engine active. Haptics unavailable on this device/browser.'
}

/**
 * Play a short sine-wave tone whose frequency maps linearly to `value` (1–100).
 * Range: 150 Hz (value 1) → 900 Hz (value 100).
 */
function playTone(value: number) {
  if (!audioCtx.value) return
  const ctx = audioCtx.value
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  const freq = 150 + value * 7.5

  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, ctx.currentTime)

  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.3)
}

// ─── Haptics ──────────────────────────────────────────────────────────────────

/**
 * Trigger a vibration pattern whose duration and cadence map to `value` (1–100).
 *
 * Perceptual zones:
 *   < 40  → single short tick
 *   40–79 → double pulse
 *   ≥ 80  → triple rapid buzz
 */
function vibrate(value: number) {
  if (!isHapticSupported.value) return
  const duration = Math.round(10 + value * 1.3)
  const gap = Math.round(500 - value * 4.8)

  if (value < 40) {
    navigator.vibrate(duration)
  } else if (value < 80) {
    navigator.vibrate([duration, gap, duration])
  } else {
    navigator.vibrate([duration, gap, duration, gap, duration])
  }
}

// ─── Combined trigger ─────────────────────────────────────────────────────────

function trigger(value: number) {
  playTone(value)
  vibrate(value)
}

function triggerManual() {
  trigger(Number(sliderValue.value))
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

function updateUI(val: number, text: string) {
  progressWidth.value = val
  patternStatus.value = text
}

// ─── Test patterns ────────────────────────────────────────────────────────────

async function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/**
 * Mountain Peak — linear rise from 1 → 100, then fall back to 1.
 * Tests whether the user can perceive a smooth gradient of intensity.
 */
async function testMountainPeak() {
  if (isRunning.value) return
  isRunning.value = true
  try {
    for (let i = 1; i <= 100; i += 4) {
      trigger(i)
      updateUI(i, `Rising — value: ${i} | freq: ${(150 + i * 7.5).toFixed(0)} Hz`)
      await delay(120)
    }
    for (let i = 100; i >= 1; i -= 4) {
      trigger(i)
      updateUI(i, `Falling — value: ${i} | freq: ${(150 + i * 7.5).toFixed(0)} Hz`)
      await delay(120)
    }
  } finally {
    updateUI(0, 'Mountain Peak complete.')
    isRunning.value = false
  }
}

/**
 * Staircase — three pulses each at values 20, 50, 80, and 100 with a rest between steps.
 * Tests threshold detection: can the user identify the four distinct levels?
 */
async function testStaircase() {
  if (isRunning.value) return
  isRunning.value = true
  try {
    for (const val of [20, 50, 80, 100]) {
      for (let i = 0; i < 3; i++) {
        trigger(val)
        updateUI(val, `Step ${val} (pulse ${i + 1} of 3)`)
        await delay(400)
      }
      await delay(600)
    }
  } finally {
    updateUI(0, 'Staircase complete.')
    isRunning.value = false
  }
}

/**
 * Heartbeat / Volatility — rapid alternation between a high value (90) and a low value (30).
 * Tests whether the haptic/audio rhythm is distinct enough to perceive without looking.
 */
async function testHeartbeat() {
  if (isRunning.value) return
  isRunning.value = true
  try {
    for (let i = 0; i < 8; i++) {
      trigger(90)
      updateUI(90, 'High — value: 90')
      await delay(200)
      trigger(30)
      updateUI(30, 'Low — value: 30')
      await delay(200)
    }
  } finally {
    updateUI(0, 'Volatility test complete.')
    isRunning.value = false
  }
}

function stopAll() {
  if (isHapticSupported.value) {
    navigator.vibrate(0)
  }
  isRunning.value = false
  updateUI(0, 'Stopped.')
}
</script>

<template>
  <div class="haptics-lab" aria-label="Haptics and Audio Lab">
    <!-- ── System Status ─────────────────────────────────────────────── -->
    <section class="hl-card" aria-labelledby="hl-status-heading">
      <h3 id="hl-status-heading" class="hl-card-title">System Status</h3>

      <div class="hl-support-row">
        <span
          class="hl-badge"
          :class="isHapticSupported ? 'hl-badge--ok' : 'hl-badge--warn'"
          aria-label="Haptics support"
        >
          Haptics: {{ isHapticSupported ? 'Supported' : 'Not supported' }}
        </span>
        <span
          class="hl-badge"
          :class="isAudioInitialized ? 'hl-badge--ok' : 'hl-badge--warn'"
          aria-label="Audio support"
        >
          Audio: {{ isAudioInitialized ? 'Active' : 'Not initialized' }}
        </span>
      </div>

      <p class="hl-support-msg" aria-live="polite">{{ supportMsg }}</p>

      <button
        class="hl-btn hl-btn--primary"
        type="button"
        :disabled="isAudioInitialized"
        :aria-pressed="isAudioInitialized"
        @click="initAudio"
      >
        {{ isAudioInitialized ? 'Audio Engine Active' : 'Initialize Audio Engine' }}
      </button>
    </section>

    <!-- ── Manual Probe ───────────────────────────────────────────────── -->
    <section class="hl-card" aria-labelledby="hl-probe-heading">
      <h3 id="hl-probe-heading" class="hl-card-title">Manual Probe</h3>

      <label class="hl-label" for="hl-slider">
        Data value (1–100): <strong>{{ sliderValue }}</strong>
      </label>
      <input
        id="hl-slider"
        v-model="sliderValue"
        type="range"
        min="1"
        max="100"
        class="hl-slider"
        :aria-valuetext="`Value ${sliderValue} — frequency ${(150 + Number(sliderValue) * 7.5).toFixed(0)} Hz`"
      />

      <button
        class="hl-btn hl-btn--secondary"
        type="button"
        :disabled="!isAudioInitialized"
        @click="triggerManual"
      >
        Trigger Audio + Haptic
      </button>
    </section>

    <!-- ── Pattern Tests ──────────────────────────────────────────────── -->
    <section class="hl-card" aria-labelledby="hl-patterns-heading">
      <h3 id="hl-patterns-heading" class="hl-card-title">Data Patterns</h3>

      <p class="hl-hint">
        Each test plays a sequence that mimics a real chart shape. Audio must be initialized first.
        On a supported mobile device over HTTPS, the haptic motor will fire simultaneously.
      </p>

      <div class="hl-btn-group" role="group" aria-label="Pattern tests">
        <button
          class="hl-btn hl-btn--primary"
          type="button"
          :disabled="!isAudioInitialized || isRunning"
          @click="testMountainPeak"
        >
          Mountain Peak (rise &amp; fall)
        </button>
        <button
          class="hl-btn hl-btn--primary"
          type="button"
          :disabled="!isAudioInitialized || isRunning"
          @click="testStaircase"
        >
          Staircase (stepped levels)
        </button>
        <button
          class="hl-btn hl-btn--primary"
          type="button"
          :disabled="!isAudioInitialized || isRunning"
          @click="testHeartbeat"
        >
          Heartbeat (volatility)
        </button>
        <button
          class="hl-btn hl-btn--stop"
          type="button"
          @click="stopAll"
        >
          Stop
        </button>
      </div>

      <!-- Progress bar -->
      <div class="hl-progress-track" role="progressbar" :aria-valuenow="progressWidth" aria-valuemin="0" aria-valuemax="100" :aria-label="`Pattern progress: ${progressWidth}%`">
        <div class="hl-progress-fill" :style="{ width: progressWidth + '%' }"></div>
      </div>

      <!-- Live status -->
      <div class="hl-status-box" aria-live="polite" aria-atomic="true">{{ patternStatus }}</div>
    </section>
  </div>
</template>

<style scoped>
/* ── Layout ──────────────────────────────────────────────────────────────────── */
.haptics-lab {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 1.5rem 0;
  max-width: 42rem;
}

/* ── Card ─────────────────────────────────────────────────────────────────────*/
.hl-card {
  padding: 1.25rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.hl-card-title {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

/* ── Support badges ───────────────────────────────────────────────────────────*/
.hl-support-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.hl-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid;
}

.hl-badge--ok {
  background: #d1fae5;
  border-color: #059669;
  color: #065f46;
}

.dark .hl-badge--ok {
  background: #064e3b;
  border-color: #34d399;
  color: #a7f3d0;
}

.hl-badge--warn {
  background: #fef3c7;
  border-color: #d97706;
  color: #78350f;
}

.dark .hl-badge--warn {
  background: #451a03;
  border-color: #fbbf24;
  color: #fde68a;
}

/* ── Support message ──────────────────────────────────────────────────────────*/
.hl-support-msg {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

/* ── Buttons ─────────────────────────────────────────────────────────────────*/
.hl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 1.1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.hl-btn:focus-visible {
  outline: 3px solid var(--vp-c-brand-1, #0f766e);
  outline-offset: 2px;
}

.hl-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.hl-btn--primary {
  background: var(--vp-c-brand-1, #0f766e);
  color: #fff;
}

.hl-btn--primary:not(:disabled):hover {
  background: var(--vp-c-brand-2, #0d6b63);
}

.hl-btn--secondary {
  background: transparent;
  border-color: var(--vp-c-brand-1, #0f766e);
  color: var(--vp-c-brand-1, #0f766e);
}

.hl-btn--secondary:not(:disabled):hover {
  background: var(--vp-c-brand-soft, rgba(15, 118, 110, 0.08));
}

.hl-btn--stop {
  background: #dc2626;
  color: #fff;
}

.hl-btn--stop:hover {
  background: #b91c1c;
}

/* ── Button group ─────────────────────────────────────────────────────────────*/
.hl-btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

/* ── Label / slider ───────────────────────────────────────────────────────────*/
.hl-label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
}

.hl-slider {
  width: 100%;
  margin-bottom: 0.75rem;
  accent-color: var(--vp-c-brand-1, #0f766e);
}

/* ── Progress bar ─────────────────────────────────────────────────────────────*/
.hl-progress-track {
  height: 10px;
  width: 100%;
  background: var(--vp-c-bg-mute);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.75rem;
  border: 1px solid var(--vp-c-divider);
}

.hl-progress-fill {
  height: 100%;
  background: var(--vp-c-brand-1, #0f766e);
  transition: width 0.1s linear;
}

/* ── Status box ───────────────────────────────────────────────────────────────*/
.hl-status-box {
  font-family: var(--vp-font-family-mono, monospace);
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  min-height: 2rem;
}

/* ── Hint text ────────────────────────────────────────────────────────────────*/
.hl-hint {
  margin: 0 0 0.75rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
