import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/ParaCharts/',
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
      { text: 'API', link: '/chartTypes' },
      { text: '🎮 Haptics Lab', link: '/haptics' }
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
