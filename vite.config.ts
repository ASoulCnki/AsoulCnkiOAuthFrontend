import { defineConfig } from 'vite'
import windicss from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [windicss()],
  build: {
    // not use css chunked
    cssCodeSplit: false,
  },
  server: {
    fs: {
      allow: ['../'],
    },
  },
})
