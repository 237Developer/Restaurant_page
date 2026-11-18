import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  plugins: [ViteImageOptimizer()],
});
