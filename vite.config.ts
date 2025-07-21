import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // <-- Asegúrate de que esta importación esté presente

export default defineConfig(({ mode }) => {
    // Carga las variables de entorno desde el archivo .env
    const env = loadEnv(mode, process.cwd(), '');

    return {
      // Tu configuración existente de variables de entorno
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },

      // Tu configuración existente de alias
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'), // Es más común apuntar a 'src', ajusta si es necesario
        }
      },
      
      // Añade el plugin de React si aún no lo tienes
      plugins: [react()], 

      // --- AÑADE ESTA LÍNEA AQUÍ ---
      // Esta es la clave para que funcione en GitHub Pages
      base: '/calculadora-de-caudal-hunter/',
    };
});