# Friction First — interactive diagram

A Three.js viewer for the workshop's 3D diagram, letting people orbit, zoom, and (soon) explore it interactively in the browser.

## Develop

```
npm install
npm run dev
```

Opens at http://localhost:5173.

## Build

```
npm run build
```

Outputs static files to `dist/`.

## Structure

- `src/scene.js` — renderer, camera, lighting, ground plane
- `src/loadModel.js` — loads and frames the glTF model
- `src/main.js` — wires everything together and the UI (loading state, auto-rotate button)
- `public/models/` — the exported diagram (`diagram.gltf` + `diagram_resources/diagram.bin`), copied from `diagram/renders/`. Re-copy both files here if the source diagram is re-exported.

## Deploy

Pushing to `main` with changes under `workshop/website/` triggers `.github/workflows/deploy-website.yml`, which builds the site and publishes it to GitHub Pages at:

https://sofia-llacer-caro.github.io/vermut-filosofic/

One-time setup: in the GitHub repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
