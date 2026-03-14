import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import ThemeModeToggle from './components/ThemeModeToggle.vue'
import './custom.css'

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			'nav-bar-content-after': () => h(ThemeModeToggle),
			'nav-screen-content-after': () => h('div', { class: 'vp-mobile-theme-toggle-wrap' }, [
				h(ThemeModeToggle)
			]),
		})
	},
}
