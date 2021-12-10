import { defineConfig } from 'vite'
import windicss from 'vite-plugin-windicss'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    windicss(),
    VitePWA({
      base: '/',
      registerType: 'autoUpdate',
      workbox: {
        disableDevLogs: true,
        runtimeCaching: [
          {
            urlPattern: /^\/img\/.*\.png/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'oauth-img-cache',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    // not use css chunked
    cssCodeSplit: false,
  },
  server: {
    fs: {
      allow: ['../'],
    },
    proxy: {
      '/verify': 'http://localhost/verify/',
    },
  },
})
