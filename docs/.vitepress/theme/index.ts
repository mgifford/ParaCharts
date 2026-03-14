import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
	...DefaultTheme,
	async enhanceApp() {
		if (typeof window !== 'undefined' && !customElements.get('para-chart')) {
			await import('../../../lib/index')
		}
	},
}
