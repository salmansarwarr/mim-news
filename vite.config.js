import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    define: {
      'import.meta.env.WORLD_NEWS_API_KEY': JSON.stringify(env.WORLD_NEWS_API_KEY || ''),
    },
    envPrefix: ['VITE_', 'WORLD_NEWS_'],
  }
})
