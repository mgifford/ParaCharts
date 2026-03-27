<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isSupported = ref<boolean | null>(null)

onMounted(() => {
  isSupported.value = 'vibrate' in navigator
})
</script>

<template>
  <div
    v-if="isSupported !== null"
    class="hsa-alert"
    :class="isSupported ? 'hsa-alert--supported' : 'hsa-alert--unsupported'"
    role="status"
  >
    <span class="hsa-icon" aria-hidden="true">{{ isSupported ? '✚' : '⛔' }}</span>
    <span class="hsa-text">
      <strong>Haptics {{ isSupported ? 'supported' : 'not supported' }}</strong>
      <span v-if="isSupported"> — this device supports the Web Vibration API.
        Jump to <a href="#chart-navigation-lab" class="hsa-link">Chart Navigation Lab</a> or
        <a href="#multi-modal-lab" class="hsa-link">Multi-Modal Lab</a> to feel the data.
      </span>
      <span v-else> — the Web Vibration API is not available on this device or browser. Audio will still play. For haptics, try Chrome on Android over HTTPS.</span>
    </span>
  </div>
</template>

<style scoped>
.hsa-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1.125rem;
  border-radius: 0.5rem;
  border: 2px solid;
  margin: 1.25rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.hsa-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
  line-height: 1.3;
}

.hsa-text {
  color: inherit;
}

/* ── Supported (green) ───────────────────────────────────────────────────── */
.hsa-alert--supported {
  background: #d1fae5;
  border-color: #059669;
  color: #064e3b;
}

.dark .hsa-alert--supported {
  background: #064e3b;
  border-color: #34d399;
  color: #a7f3d0;
}

.hsa-alert--supported .hsa-link {
  color: #065f46;
  font-weight: 600;
  text-underline-offset: 2px;
}

.dark .hsa-alert--supported .hsa-link {
  color: #6ee7b7;
}

/* ── Not supported (red) ─────────────────────────────────────────────────── */
.hsa-alert--unsupported {
  background: #fee2e2;
  border-color: #dc2626;
  color: #7f1d1d;
}

.dark .hsa-alert--unsupported {
  background: #450a0a;
  border-color: #f87171;
  color: #fecaca;
}
</style>
