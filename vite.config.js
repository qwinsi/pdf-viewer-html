import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // A disgusting behavior of vite. May be fixed in the future release.
    // https://github.com/vitejs/vite/issues/15354
    rollupOptions: {
      external: ['viewer.mjs'],
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
      },
      output: {
        entryFileNames: 'main.js',
        assetFileNames: 'main.css',
        format: 'es',
      },
    }
  }
})