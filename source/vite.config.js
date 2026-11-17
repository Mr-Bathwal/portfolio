import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/portfolio/",
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
    rollupOptions: { output: { manualChunks: { three: ["three"], gsap: ["gsap", "lenis"], react: ["react", "react-dom", "react-redux", "@reduxjs/toolkit"] } } },
  },
});
