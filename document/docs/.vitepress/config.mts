import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Debian Installation Tutorial',
  description: 'A guide to pack Debian Sid for your PlayStation device',
  base: '/video_driver_debian/',
  markdown: {
    theme: {
      light: 'catppuccin-latte',
      dark: 'catppuccin-mocha', // Match the dark flavor chosen in Step 2
    },
  },
})
