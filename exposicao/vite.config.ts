import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Caminhos relativos: o build funciona em qualquer endereço (GitHub Pages
  // com qualquer nome de repositório, pasta local, etc.).
  base: './',
  plugins: [react()],
})
