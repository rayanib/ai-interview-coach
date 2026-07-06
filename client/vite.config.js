import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This plugin lets Vite transform React JSX using the modern React runtime.
// Without it, the browser may show "React is not defined" and render a blank page.
export default defineConfig({
  plugins: [react()],
});
