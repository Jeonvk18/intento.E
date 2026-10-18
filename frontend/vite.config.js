import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// "base" debe coincidir con el nombre del repositorio para que GitHub Pages
// encuentre los archivos: https://github.com/Jeonvk18/intento.E
export default defineConfig({
  plugins: [react()],
  base: '/encurtidos-classics/'
});
