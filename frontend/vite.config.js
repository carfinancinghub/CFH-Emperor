import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@services": resolve(__dirname, "src/services"),
      "@utils": resolve(__dirname, "src/utils"),
      "@hooks": resolve(__dirname, "src/hooks"),
      "@styles": resolve(__dirname, "src/styles"),
      "@i18n": resolve(__dirname, "src/i18n"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
});
