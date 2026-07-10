import { defineConfig } from "vite";

// Deployed as a GitHub Pages project site at
// https://sofia-llacer-caro.github.io/vermut-filosofic/
// so production builds need that path as the base. Dev/preview stay at "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/vermut-filosofic/" : "/",
}));
