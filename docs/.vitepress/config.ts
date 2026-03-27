import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/ParaCharts/',
  transformHtml(code) {
    // VitePress renders the Table of Contents (right panel) as a plain <div class="aside">
    // which is outside any ARIA landmark, violating the axe "region" rule.
    // Add role="complementary" and aria-label so it becomes a proper landmark.
    //
    // Note: these string replacements target VitePress v1's specific, deterministic SSR
    // output.  The opening tags produced by VPDoc.vue and VPSidebar.vue are stable; if
    // VitePress upgrades change them, update these patterns accordingly.
    return code
      .replace(/<div class="aside">/g, '<div class="aside" role="complementary" aria-label="Page outline">')
      .replace(/<div class="aside left-aside">/g, '<div class="aside left-aside" role="complementary" aria-label="Page outline">')
      // VitePress also renders the left navigation sidebar without an aria-label; add one to
      // disambiguate when multiple complementary landmarks are present on the same page.
      .replace(/<aside class="VPSidebar"/g, '<aside class="VPSidebar" aria-label="Site navigation"')
  },
  vue: {
    template: {
      compilerOptions: {
        // Treat any hyphenated tag starting with "para-" as a native custom element
        isCustomElement: (tag) => tag.startsWith('para-'),
      },
    },
  },
  title: 'ParaCharts',
  description: 'ParaCharts user and developer documentation',
  appearance: false,
  themeConfig: {
    logo: '/fizz-logo.svg',
    nav: [
      { text: 'Docs', link: '/index' },
      { text: 'Getting Started', link: '/gettingStarted' },
      { text: 'Implement & Test', link: '/implementationAndTesting' },
      { text: 'Examples', link: '/exampleGallery' },
      { text: 'API', link: '/chartTypes' }
    ],
    sidebar: {
      '/': [
        {
          text: 'Overview',
          items: [
            { text: 'Introduction', link: '/index' },
            { text: 'Getting Started', link: '/gettingStarted' },
            { text: 'Implementation & Testing', link: '/implementationAndTesting' },
            { text: 'GitHub Pages Showcase', link: '/githubPagesShowcase' }
          ]
        },
        {
          text: 'User Guide',
          items: [
            { text: 'Example Gallery', link: '/exampleGallery' },
            { text: 'Chart Types', link: '/chartTypes' },
            { text: 'Control Panel', link: '/controlPanel' },
             { text: 'Accessibility', link: '/accessibility' },
            { text: 'Shortcuts & Commands', link: '/shortcutsAndCommands' }
          ]
        },
        {
          text: 'Developer Guide',
          items: [
            { text: 'Custom Elements', link: '/customElements' },
            { text: 'Manifest', link: '/manifest' },
            { text: 'Settings Object', link: '/settingsObj' }
          ]
        },
        {
          text: 'Experimental',
          items: [
            { text: 'Haptics Lab', link: '/haptics' }
          ]
        }
      ]
    }
  }
})
