import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Ahora la configuración depende del 'command' (serve o build)
export default defineConfig(({ command, mode }) => {
    // Tu carga de variables de entorno sigue igual
    const env = loadEnv(mode, process.cwd(), '');

    return {
      plugins: [react()],

      // --- ESTA ES LA LÍNEA CLAVE ---
      // Si el comando es 'serve' (npm run dev), la base es '/'.
      // Si es 'build' (npm run deploy), la base es el nombre de tu repo.
      base: command === 'serve' ? '/' : '/calculadora-de-caudal-hunter/',
      
      // Tu configuración de variables y alias sigue igual
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});