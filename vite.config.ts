import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // 🔴 REQUIRED for GitHub Pages
  base: "/VayuWatch/",

  plugins: [
    react(),
    // Lovable tagger ONLY in dev (safe)
    mode === "development"
      ? (await import("lovable-tagger")).componentTagger()
      : undefined,
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
