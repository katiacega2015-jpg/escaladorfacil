import { defineConfig } from "vitest/config";
import { viteSingleFile } from "vite-plugin-singlefile";

// Build gera um único dist/index.html autocontido (sem assets externos), pronto
// para abrir no celular ou ser empacotado pelo Capacitor.
export default defineConfig({
  base: "./",
  plugins: [viteSingleFile()],
  build: { target: "es2020" },
  test: { include: ["tests/**/*.test.ts"] },
});
