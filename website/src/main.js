import { createScene } from "./scene.js";
import { loadDiagram } from "./loadModel.js";

const canvas = document.getElementById("scene");
const loadingEl = document.getElementById("loading");
const autorotateButton = document.getElementById("autorotate-toggle");

const { scene, camera, controls } = createScene(canvas);

autorotateButton.addEventListener("click", () => {
  controls.autoRotate = !controls.autoRotate;
  autorotateButton.setAttribute("aria-pressed", String(controls.autoRotate));
});

loadDiagram({ scene })
  .then(({ size }) => {
    frameCameraToFit(size);
    loadingEl.classList.add("is-hidden");
  })
  .catch((error) => {
    console.error("Failed to load diagram model:", error);
    loadingEl.querySelector("p").textContent =
      "Couldn't load the diagram. Please refresh the page.";
  });

function frameCameraToFit(size) {
  const maxDim = Math.max(size.x, size.y, size.z);
  const fitDistance = maxDim / (2 * Math.tan((camera.fov * Math.PI) / 360));
  const distance = fitDistance * 1.15;

  const target = { x: 0, y: size.y / 2, z: 0 };
  controls.target.set(target.x, target.y, target.z);

  camera.position.set(
    target.x + distance * 0.65,
    target.y + distance * 0.55,
    target.z + distance * 0.75
  );
  camera.near = distance / 100;
  camera.far = distance * 20;
  camera.updateProjectionMatrix();

  controls.minDistance = distance * 0.3;
  controls.maxDistance = distance * 2.5;
  controls.update();
}
