import * as THREE from "three";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey, isSupabaseConfigured } from "./supabaseConfig.js";

const TABLE_NAME = "postits";
const BASE_SCALE = 6;
const HOVER_SCALE = 22;
const SCALE_DAMPING = 8;
const MAX_TEXT_LENGTH = 240;
const MAX_NAME_LENGTH = 40;
const DRAG_THRESHOLD_PX = 6;
const NOTE_COLORS = ["#ffe066", "#ffb3c6", "#a8e6b6", "#a9d4ff"];

/**
 * Lets visitors pin a note to a point on the diagram's surface. Notes are
 * stored in Supabase (Postgres) so every visitor sees the same shared set,
 * rendered as small billboarded sprites that enlarge on hover to reveal
 * the text.
 *
 * If Supabase isn't configured (see .env.example) the feature is disabled
 * and the drop-note button stays hidden, so the viewer still works without it.
 */
export function initPostIts({ scene, camera, renderer, controls, model, onRender, ui }) {
  if (!isSupabaseConfigured) {
    console.warn(
      "Post-its are disabled: Supabase is not configured. See workshop/website/.env.example."
    );
    return { enabled: false };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const notesGroup = new THREE.Group();
  scene.add(notesGroup);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const sprites = new Map();
  let hovered = null;
  let placing = false;
  let pointerDownPos = null;

  supabase
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: true })
    .then(({ data, error }) => {
      if (error) {
        console.error("Failed to load post-its:", error);
        return;
      }
      data.forEach((row) => addNoteSprite(row.id, row));
    });

  const channel = supabase
    .channel(`${TABLE_NAME}-realtime`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: TABLE_NAME },
      (payload) => addNoteSprite(payload.new.id, payload.new)
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: TABLE_NAME },
      (payload) => removeNoteSprite(payload.old.id)
    )
    .subscribe();

  function addNoteSprite(id, data) {
    if (sprites.has(id) || !data) return;

    const hash = hashCode(id);
    const color = NOTE_COLORS[Math.abs(hash) % NOTE_COLORS.length];
    const texture = makeNoteTexture({ text: data.text ?? "", name: data.name ?? "", color });

    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);

    const normal = new THREE.Vector3(data.nx ?? 0, data.ny ?? 1, data.nz ?? 0);
    if (normal.lengthSq() === 0) normal.set(0, 1, 0);
    sprite.position.set(data.x ?? 0, data.y ?? 0, data.z ?? 0).addScaledVector(normal, 1.2);
    sprite.material.rotation = (((hash % 20) - 10) * Math.PI) / 180;
    sprite.scale.setScalar(BASE_SCALE);
    sprite.userData.baseScale = BASE_SCALE;
    sprite.userData.targetScale = BASE_SCALE;

    notesGroup.add(sprite);
    sprites.set(id, sprite);
  }

  function removeNoteSprite(id) {
    const sprite = sprites.get(id);
    if (!sprite) return;
    notesGroup.remove(sprite);
    sprite.material.map?.dispose();
    sprite.material.dispose();
    sprites.delete(id);
    if (hovered === sprite) hovered = null;
  }

  function setPointerFromEvent(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function handlePointerMove(event) {
    if (placing) return;
    setPointerFromEvent(event);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(notesGroup.children, false)[0];
    const next = hit ? hit.object : null;
    if (next === hovered) return;
    if (hovered) hovered.userData.targetScale = hovered.userData.baseScale;
    hovered = next;
    if (hovered) hovered.userData.targetScale = HOVER_SCALE;
  }

  function handlePointerDown(event) {
    pointerDownPos = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event) {
    if (!placing || !pointerDownPos) return;
    const dx = event.clientX - pointerDownPos.x;
    const dy = event.clientY - pointerDownPos.y;
    pointerDownPos = null;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) return;

    setPointerFromEvent(event);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObject(model, true)[0];
    if (!hit || !hit.face) return;

    const normalMatrix = new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld);
    const worldNormal = hit.face.normal.clone().applyMatrix3(normalMatrix).normalize();
    openNoteForm({ point: hit.point, normal: worldNormal });
  }

  renderer.domElement.addEventListener("pointermove", handlePointerMove);
  renderer.domElement.addEventListener("pointerdown", handlePointerDown);
  renderer.domElement.addEventListener("pointerup", handlePointerUp);

  function setPlacing(value) {
    placing = value;
    renderer.domElement.classList.toggle("is-placing", value);
    ui.dropButton.setAttribute("aria-pressed", String(value));
    ui.dropButton.textContent = value ? "Click the diagram to drop…" : "Drop a note";
  }

  function openNoteForm({ point, normal }) {
    ui.form.reset();
    ui.formDialog.hidden = false;
    ui.formText.focus();

    ui.form.addEventListener("submit", onSubmit);
    ui.formCancel.addEventListener("click", onCancel);

    function cleanup() {
      ui.formDialog.hidden = true;
      ui.form.removeEventListener("submit", onSubmit);
      ui.formCancel.removeEventListener("click", onCancel);
    }

    function onCancel() {
      cleanup();
      setPlacing(false);
    }

    async function onSubmit(event) {
      event.preventDefault();
      const text = ui.formText.value.trim().slice(0, MAX_TEXT_LENGTH);
      if (!text) return;
      const name = ui.formName.value.trim().slice(0, MAX_NAME_LENGTH);

      cleanup();
      setPlacing(false);

      const { error } = await supabase.from(TABLE_NAME).insert({
        x: point.x,
        y: point.y,
        z: point.z,
        nx: normal.x,
        ny: normal.y,
        nz: normal.z,
        text,
        name,
      });
      if (error) console.error("Failed to save post-it:", error);
    }
  }

  ui.dropButton.hidden = false;
  ui.dropButton.addEventListener("click", () => setPlacing(!placing));

  onRender((delta) => {
    sprites.forEach((sprite) => {
      const target = sprite.userData.targetScale;
      const current = sprite.scale.x;
      if (Math.abs(current - target) < 0.01) {
        sprite.scale.setScalar(target);
        return;
      }
      const next = THREE.MathUtils.damp(current, target, SCALE_DAMPING, delta);
      sprite.scale.setScalar(next);
      const isEnlarged = next > sprite.userData.baseScale + 0.5;
      sprite.renderOrder = isEnlarged ? 999 : 0;
      sprite.material.depthTest = !isEnlarged;
    });
  });

  return {
    enabled: true,
    dispose() {
      supabase.removeChannel(channel);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
    },
  };
}

function makeNoteTexture({ text, name, color }) {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(28, 34, size - 44, size - 44);

  ctx.fillStyle = color;
  ctx.fillRect(16, 16, size - 44, size - 44);

  ctx.fillStyle = "rgba(43, 39, 64, 0.92)";
  ctx.font = "600 34px Inter, system-ui, sans-serif";
  ctx.textBaseline = "alphabetic";
  wrapText(ctx, text, 44, 84, size - 96, 42, 8);

  if (name) {
    ctx.font = "italic 500 26px Inter, system-ui, sans-serif";
    ctx.fillStyle = "rgba(43, 39, 64, 0.6)";
    ctx.fillText(truncateLine(ctx, `— ${name}`, size - 96), 44, size - 44);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);

  const truncated = lines.length > maxLines;
  const visible = lines.slice(0, maxLines);
  if (truncated && visible.length) {
    visible[visible.length - 1] = truncateLine(ctx, `${visible[visible.length - 1]}…`, maxWidth);
  }
  visible.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
}

function truncateLine(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 1 && ctx.measureText(`${truncated}…`).width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated}…`;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
