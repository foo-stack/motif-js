import { defineConfig } from 'vitepress';

/**
 * Vitepress config for the motif-js documentation site.
 *
 * Phase G batch 4 ships the structure + stub pages for every section
 * the ROADMAP listed (getting-started / theming / responsive /
 * compiler / SSR / per-primitive / per-headless / recipes /
 * comparisons / migration). Real content lands incrementally.
 *
 * Sidebar groups mirror the package boundaries so users can land on
 * the section they need without bouncing.
 */
export default defineConfig({
  title: 'motif-js',
  description: 'Cross-platform React styling library — web, React Native, and desktop.',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Guides', link: '/guides/getting-started' },
      { text: 'Primitives', link: '/primitives/' },
      { text: 'Headless', link: '/headless/' },
      { text: 'Recipes', link: '/recipes/' },
      {
        text: 'Compare',
        items: [
          { text: 'vs Tamagui', link: '/comparisons/tamagui' },
          { text: 'vs NativeWind', link: '/comparisons/nativewind' },
          { text: 'vs Stitches', link: '/comparisons/stitches' },
          { text: 'vs Tailwind', link: '/comparisons/tailwind' },
          { text: '— Migrate from —', link: '/migration/from-tamagui' },
          { text: 'From Tamagui', link: '/migration/from-tamagui' },
          { text: 'From NativeWind', link: '/migration/from-nativewind' },
          { text: 'From Stitches', link: '/migration/from-stitches' },
          { text: 'From Tailwind', link: '/migration/from-tailwind' },
        ],
      },
      { text: 'GitHub', link: 'https://github.com/foo-stack/motif-js' },
    ],
    sidebar: {
      '/guides/': [
        {
          text: 'Guides',
          items: [
            { text: 'Getting started', link: '/guides/getting-started' },
            { text: 'Installation', link: '/guides/installation' },
            { text: 'Theming', link: '/guides/theming' },
            { text: 'Responsive', link: '/guides/responsive' },
            { text: 'Container queries', link: '/guides/container-queries' },
            { text: 'SSR (Next.js / RSC)', link: '/guides/ssr' },
            { text: 'Compiler', link: '/guides/compiler' },
            { text: 'styled() factory', link: '/guides/styled' },
          ],
        },
      ],
      '/primitives/': [
        {
          text: 'Primitives',
          items: [
            { text: 'Overview', link: '/primitives/' },
            { text: 'Box', link: '/primitives/box' },
            { text: 'Stack / HStack / VStack', link: '/primitives/stack' },
            { text: 'Text', link: '/primitives/text' },
            { text: 'Pressable', link: '/primitives/pressable' },
            { text: 'Image', link: '/primitives/image' },
            { text: 'Container', link: '/primitives/container' },
            { text: 'Button', link: '/primitives/button' },
            { text: 'IconButton', link: '/primitives/icon-button' },
            { text: 'Link', link: '/primitives/link' },
            { text: 'Layout extras', link: '/primitives/layout-extras' },
            { text: 'Typography', link: '/primitives/typography' },
            { text: 'Forms', link: '/primitives/forms' },
            { text: 'Media', link: '/primitives/media' },
            { text: 'Scroll', link: '/primitives/scroll' },
            { text: 'Overlay & a11y', link: '/primitives/overlay' },
          ],
        },
      ],
      '/headless/': [
        {
          text: 'Headless components',
          items: [
            { text: 'Overview', link: '/headless/' },
            { text: 'Dialog / AlertDialog', link: '/headless/dialog' },
            { text: 'Tooltip', link: '/headless/tooltip' },
            { text: 'Popover', link: '/headless/popover' },
            { text: 'HoverCard', link: '/headless/hover-card' },
            { text: 'Menu / ContextMenu', link: '/headless/menu' },
            { text: 'Switch / Checkbox / Radio', link: '/headless/toggle' },
            { text: 'Tabs / Accordion / Collapsible', link: '/headless/disclosure' },
            { text: 'Toast / Toaster', link: '/headless/toast' },
            { text: 'Combobox / Select / Search', link: '/headless/combobox' },
            { text: 'Slider / Progress / RatingInput', link: '/headless/range' },
            { text: 'Drawer / Sheet', link: '/headless/drawer' },
            { text: 'Calendar / DatePicker / TimeInput', link: '/headless/datetime' },
            { text: 'ColorPicker / FileUpload / TreeView', link: '/headless/specialized' },
            {
              text: 'Pagination / Breadcrumb / Stepper / NavigationMenu / Toolbar',
              link: '/headless/navigation',
            },
          ],
        },
      ],
      '/recipes/': [
        {
          text: 'Recipes',
          items: [
            { text: 'Overview', link: '/recipes/' },
            { text: 'Auth flow', link: '/recipes/auth' },
            { text: 'Dashboard', link: '/recipes/dashboard' },
            { text: 'Settings page', link: '/recipes/settings' },
            { text: 'E-commerce checkout', link: '/recipes/checkout' },
          ],
        },
      ],
      '/comparisons/': [
        {
          text: 'Comparisons',
          items: [
            { text: 'vs Tamagui', link: '/comparisons/tamagui' },
            { text: 'vs NativeWind', link: '/comparisons/nativewind' },
            { text: 'vs Stitches', link: '/comparisons/stitches' },
            { text: 'vs Tailwind', link: '/comparisons/tailwind' },
          ],
        },
      ],
      '/migration/': [
        {
          text: 'Migrate to motif',
          items: [
            { text: 'From Tamagui', link: '/migration/from-tamagui' },
            { text: 'From NativeWind', link: '/migration/from-nativewind' },
            { text: 'From Stitches', link: '/migration/from-stitches' },
            { text: 'From Tailwind', link: '/migration/from-tailwind' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/foo-stack/motif-js' }],
    search: { provider: 'local' },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 motif-js contributors',
    },
  },
});
