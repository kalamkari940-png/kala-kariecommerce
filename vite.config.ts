import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import path from 'path'

const config = defineConfig({
  resolve: {
    alias: {
      '@': path.resolve('./src')
    }
  },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      start: { entry: './server/start.js' },
      server: { entry: './server/server.js' },
      router: {
        entry: './routes/router.jsx',
        routesDirectory: './routes/pages',
        generatedRouteTree: './routes/routeTree.gen.ts'
      }
    }),
    viteReact(),
  ],
})

export default config
