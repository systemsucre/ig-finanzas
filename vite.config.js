import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: './', // Cambia a '/app/' si va en subcarpeta

  define: {
    // Esto ayuda a que algunas librerías antiguas no rompan en modo módulo
    'process.env': {},
    'global': 'window',
  },
},


)
