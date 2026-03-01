import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/descubra-sua-casa/', // Substitua pelo nome real que dará ao repositório no GitHub
})
