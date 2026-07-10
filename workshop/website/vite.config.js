import { defineConfig } from "vite";

// Deployed as a GitHub Pages project site, which serves from a
// /<repo-name>/ subpath. A relative base keeps this working regardless
// of the repo's name (it's been renamed once already).
export default defineConfig(({ command }) => ({
  base: command === "build" ? "./" : "/",
}));
