import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    // GitHub Pages builds inject BASE_PATH=/<repo-name>/ from Actions.
    // Local dev and Vercel keep the default root path.
    base: env.BASE_PATH || "/",
  };
});
