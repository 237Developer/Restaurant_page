import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    base: '/Restaurant_page/',
    plugins: [
      ViteImageOptimizer(),
    ],
  };
});