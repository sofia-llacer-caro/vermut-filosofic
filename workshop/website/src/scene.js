import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * Sets up renderer, camera, controls and lighting for the diagram viewer.
 * Kept separate from model loading / app wiring so new visual elements
 * (hotspots, extra props, etc.) can be added later without touching this.
 */
export function createScene(canvas) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );
  camera.position.set(260, 200, 320);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Soft lavender/white studio backdrop, matching the KeyShot renders.
  scene.background = new THREE.Color(0xeceafc);
  scene.fog = new THREE.Fog(0xeceafc, 900, 1800);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 120;
  controls.maxDistance = 900;
  controls.maxPolarAngle = Math.PI * 0.51;
  controls.target.set(0, 40, 0);
  controls.autoRotate = false;
  controls.autoRotateSpeed = 1.4;
  controls.update();

  setupLighting(scene);

  function handleResize() {
    const { innerWidth, innerHeight } = window;
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }
  window.addEventListener("resize", handleResize);

  // Lets features added later (e.g. post-it notes) hook into the render
  // loop for per-frame animation without this module knowing about them.
  const renderCallbacks = [];
  function onRender(callback) {
    renderCallbacks.push(callback);
  }

  const clock = new THREE.Clock();
  function tick() {
    controls.update();
    const delta = clock.getDelta();
    for (const callback of renderCallbacks) callback(delta);
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  return { scene, camera, renderer, controls, onRender };
}

function setupLighting(scene) {
  const ambient = new THREE.HemisphereLight(0xf6f4ff, 0xcfc9e8, 1.1);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(260, 420, 200);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -300;
  key.shadow.camera.right = 300;
  key.shadow.camera.top = 300;
  key.shadow.camera.bottom = -300;
  key.shadow.camera.far = 1200;
  key.shadow.bias = -0.0005;
  key.shadow.radius = 4;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xc9c3f0, 0.6);
  fill.position.set(-260, 180, -180);
  scene.add(fill);
}

/**
 * Adds an invisible shadow-catching ground plane at the given height.
 * Called once the model's bounding box is known so it sits at its base.
 */
export function addGroundPlane(scene, y) {
  const geometry = new THREE.PlaneGeometry(3000, 3000);
  const material = new THREE.ShadowMaterial({ opacity: 0.18 });
  const ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = y;
  ground.receiveShadow = true;
  scene.add(ground);
  return ground;
}
