import DefaultTheme from 'vitepress/theme'
import { defineComponent, h, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import ThemeModeToggle from './components/ThemeModeToggle.vue'
import './custom.css'

/**
 * Ensures ARIA landmark attributes are present on VitePress elements that lack
 * them.  VitePress v1 renders the Table of Contents panel as a plain
 * <div class="aside"> (no landmark role) and the left sidebar <aside> without
 * a label.  Vue hydration can strip attributes that are not part of the
 * component template, so we also apply them here after every navigation so
 * that the DOM always matches the semantically-correct state needed to satisfy
 * the axe "region" rule.
 */
function fixLandmarks() {
	if (typeof document === 'undefined') return

	// Right-side Table-of-Contents panel — add complementary landmark.
	const aside = document.querySelector('.VPDoc .aside') as HTMLElement | null
	if (aside) {
		aside.setAttribute('role', 'complementary')
		aside.setAttribute('aria-label', 'Page outline')
	}

	// Left navigation sidebar — always add label to distinguish it from the TOC aside.
	const sidebar = document.querySelector('aside.VPSidebar') as HTMLElement | null
	if (sidebar) {
		sidebar.setAttribute('aria-label', 'Site navigation')
	}

	// Local (breadcrumb) nav bar — rendered as a plain <div> outside any landmark.
	const localNav = document.querySelector('.VPLocalNav') as HTMLElement | null
	if (localNav && !localNav.getAttribute('role')) {
		localNav.setAttribute('role', 'navigation')
		localNav.setAttribute('aria-label', 'Page navigation')
	}
}

const Layout = defineComponent({
	name: 'ParaChartsLayout',
	setup() {
		const route = useRoute()

		onMounted(fixLandmarks)
		watch(() => route.path, () => nextTick(fixLandmarks))

		return () => h(DefaultTheme.Layout, null, {
			'nav-bar-content-after': () => h(ThemeModeToggle),
			'nav-screen-content-after': () => h('div', { class: 'vp-mobile-theme-toggle-wrap' }, [
				h(ThemeModeToggle)
			]),
		})
	},
})

export default {
	extends: DefaultTheme,
	Layout,
}
