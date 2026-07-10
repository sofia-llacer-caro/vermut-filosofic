import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { addGroundPlane } from "./scene.js";

const MODEL_URL = `${import.meta.env.BASE_URL}models/diagram.gltf`;

/**
 * Loads the diagram model, centers it at the origin (X/Z) so orbit controls
 * pivot sensibly, sits it on a shadow-catching ground plane, and enables
 * shadows on every mesh. Returns the model plus its (centered) bounding info
 * so the caller can frame the camera.
 */
export function loadDiagram({ scene, onProgress }) {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      MODEL_URL,
      (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.x -= center.x;
        model.position.z -= center.z;
        model.position.y -= box.min.y;

        scene.add(model);
        addGroundPlane(scene, 0);

        resolve({ model, size });
      },
      (event) => {
        if (onProgress && event.lengthComputable) {
          onProgress(event.loaded / event.total);
        }
      },
      (error) => reject(error)
    );
  });
}
