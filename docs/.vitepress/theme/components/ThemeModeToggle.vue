<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

const buttonLabel = computed(() =>
  isDark.value ? 'Switch to light mode' : 'Switch to dark mode'
)

const modeText = computed(() => (isDark.value ? 'Dark mode' : 'Light mode'))

function toggleTheme() {
  const nextMode = isDark.value ? 'light' : 'dark'
  isDark.value = nextMode === 'dark'
  if (typeof window !== 'undefined') {
    localStorage.setItem('vitepress-theme-appearance', nextMode)
  }
}
</script>

<template>
  <button
    class="theme-mode-toggle"
    type="button"
    :aria-label="buttonLabel"
    :aria-pressed="isDark"
    @click="toggleTheme"
  >
    <span class="theme-mode-toggle-icon" aria-hidden="true">{{ isDark ? 'DK' : 'LT' }}</span>
    <span class="theme-mode-toggle-text">{{ modeText }}</span>
  </button>
</template>
