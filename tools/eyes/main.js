// Aperçu des yeux de Lemegeton (sterenna.fr/lemegeton/eyes/).
// Les moteurs viennent tels quels de minitel-musee (alias @musee, voir
// tools/build-eyes.mjs) ; le moteur web vit dans l'iframe web.html. Les humeurs
// jouées viennent de la table de repli de canon/emotions.json (bloc fallbacks).
import { EyesController, EYE_PALETTES } from "@musee/eyes/EyesController";
import { SmoothEyes } from "@musee/eyes/SmoothEyes";
import { EMOTIONS } from "@musee/eyes/lemegetonEyes";
import { defaultEffects, renderTerminal } from "@musee/videotex/renderer";
import canon from "../../canon/emotions.json";

// Humeurs que les moteurs de minitel-musee savent jouer (celles de LibEyes). Le
// portage Zyra n'a pas calm, curious ni focused : voir canon/VISAGE.md.
const PLAYABLE = new Set(["default", "happy", "angry", "surprised", "tired", "fear", "disgust", "love"]);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const effects = { ...defaultEffects };

/**
 * Joue une émotion du canon sur un moteur à humeurs, d'après la table de repli
 * `fallbacks` de emotions.json (clé de moteur : "eyes" ou "zyra"). Renvoie
 * l'étiquette affichée sous la carte : l'humeur jouée, « repli » quand le moteur
 * n'a pas d'équivalent exact, et « non porté » quand l'humeur du canon n'existe
 * pas dans le portage (le moteur reste alors au repos).
 */
function playMood(controller, engine, emotion) {
  const spec = canon.fallbacks.engines[engine];
  const mood = spec.moods[emotion.id];
  if (!PLAYABLE.has(mood)) {
    controller.setMood("default");
    return `${emotion.id} → ${mood}, non porté : neutre`;
  }
  controller.setMood(mood);
  return `${emotion.id} → ${mood}${spec.approximate.includes(emotion.id) ? " (repli)" : ""}`;
}

/** Suivi du pointeur, coupé par le bouton « Suivi de la souris ». */
let tracking = true;
function onPointer(host, move) {
  host.addEventListener("pointermove", (event) => {
    if (!tracking) return;
    const box = host.getBoundingClientRect();
    move(((event.clientX - box.left) / box.width) * 2 - 1, ((event.clientY - box.top) / box.height) * 2 - 1);
  });
}
const follow = (host, controller) => onPointer(host, (x, y) => controller.follow(x, y));

/** Mosaïque Vidéotex : un EyesController dessiné par le rendu du Minitel 3D. */
function mountMosaic(host, style) {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  canvas.setAttribute("aria-hidden", "true");
  host.append(canvas);
  const ctx = canvas.getContext("2d");
  const controller = new EyesController({ style, palette: "cyan" });
  let queued = false;
  const draw = () => {
    queued = false;
    renderTerminal(ctx, controller.getSnapshot().frame, effects, performance.now(), reducedMotion);
  };
  controller.subscribe(() => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(draw);
    }
  });
  draw();
  if (!reducedMotion) controller.start();
  follow(host, controller);
  const native = style.startsWith("lemegeton");
  return {
    palette: (id) => controller.setPalette(id),
    emotion(emotion) {
      if (native) {
        controller.key(String(EMOTIONS.indexOf(emotion.id)));
        return `${emotion.id} (natif)`;
      }
      return playMood(controller, style === "zyra" ? "zyra" : "eyes", emotion);
    },
    neutral: () => (native ? controller.key("Retour") : controller.setMood("default")),
  };
}

/** Rendu lisse de minitel-musee, d'après l'overlay OBS. */
function mountSmooth(host) {
  const controller = new EyesController({ style: "zyra", render: "classique", palette: "cyan" });
  const smooth = new SmoothEyes(controller);
  smooth.canvas.setAttribute("aria-hidden", "true");
  smooth.setOptions({ effects, reducedMotion, scale: 1 });
  host.append(smooth.canvas);
  smooth.start();
  if (!reducedMotion) controller.start();
  follow(host, controller);
  return {
    palette: (id) => controller.setPalette(id),
    // Le rendu lisse dessine les huit humeurs de LibEyes.
    emotion: (emotion) => playMood(controller, "eyes", emotion),
    neutral: () => controller.setMood("default"),
  };
}

/** web-eye-animation (nitro-clicker), isolé dans son iframe : la bibliothèque occupe toute sa fenêtre. */
function mountWeb(host) {
  const frame = host.querySelector("iframe");
  const eyes = () => frame.contentWindow?.eyes;
  // Regard en pixels de l'iframe, borné comme dans l'overlay OBS (safeMove).
  const look = (x, y) => {
    const win = frame.contentWindow;
    if (win) eyes()?.move?.(win.innerWidth * (0.5 + x * 0.16), win.innerHeight * (0.5 + y * 0.14));
  };
  onPointer(host, look);
  host.addEventListener("pointerleave", () => look(0, 0));
  return {
    recenter: () => look(0, 0),
    palette: (id) => frame.contentWindow?.setPalette?.(id),
    emotion(emotion) {
      eyes()?.emotion?.(emotion.id);
      return `${emotion.id} (natif)`;
    },
    neutral: () => eyes()?.emotion?.(canon.default),
  };
}

const engines = [...document.querySelectorAll("[data-engine]")].map((host) => {
  const kind = host.dataset.engine;
  const engine =
    kind === "web" ? mountWeb(host) : kind === "smooth" ? mountSmooth(host) : mountMosaic(host, host.dataset.style);
  return { ...engine, caption: host.closest(".eye-card")?.querySelector(".eye-caption") };
});

const status = document.getElementById("eye-status");
const buttons = document.getElementById("emotion-buttons");
for (const emotion of canon.emotions) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "emotion";
  button.textContent = emotion.label.fr;
  button.title = `${emotion.id} — ${emotion.intent}`;
  button.addEventListener("click", () => {
    for (const engine of engines) {
      const text = engine.emotion(emotion);
      if (engine.caption) engine.caption.textContent = text;
    }
    status.textContent = `Émotion jouée : ${emotion.label.fr}.`;
  });
  buttons.append(button);
}
document.getElementById("emotion-neutral").addEventListener("click", () => {
  for (const engine of engines) {
    engine.neutral();
    if (engine.caption) engine.caption.textContent = "repos";
  }
  status.textContent = "Retour au repos.";
});

const trackingButton = document.getElementById("eye-tracking");
trackingButton.addEventListener("click", () => {
  tracking = !tracking;
  trackingButton.setAttribute("aria-pressed", String(tracking));
  if (!tracking) engines.forEach((engine) => engine.recenter?.());
  status.textContent = tracking ? "Suivi de la souris activé." : "Suivi de la souris coupé.";
});

const select = document.getElementById("eye-palette");
for (const palette of EYE_PALETTES) select.append(new Option(palette.label, palette.id));
select.addEventListener("change", () => engines.forEach((engine) => engine.palette(select.value)));
