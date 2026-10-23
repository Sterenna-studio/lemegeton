import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const gallery = join(root, "gallery");
const html = await readFile(join(gallery, "index.html"), "utf8");
const app = await readFile(join(gallery, "app.js"), "utf8");
const css = await readFile(join(gallery, "styles.css"), "utf8");
assert.match(html, /<html lang="fr">/);
assert.ok(html.includes("https://sterenna.fr/lemegeton/"));
assert.ok(html.includes('./assets/icon.webp'));
assert.match(html, /<dialog[^>]*id="lightbox"/);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /max-width: 600px/);
assert.match(app, /data-filter/);
assert.match(app, /ArrowLeft/);
assert.match(app, /ArrowRight/);

const assets = [...app.matchAll(/image: "(assets\/[a-z0-9-]+\.webp)"/g)].map((match) => match[1]);
assert.equal(assets.length, 12, `Expected 12 curated images, found ${assets.length}`);
const unique = [...new Set(assets)];
assert.equal(unique.length, assets.length, "Gallery image paths must be unique");
let total = 0;
for (const relative of assets) {
  const path = join(gallery, relative);
  const bytes = await readFile(path);
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF", `${relative} is not WebP`);
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP", `${relative} is not WebP`);
  assert.ok(bytes.length < 650_000, `${relative} exceeds the 650 KB image budget`);
  total += bytes.length;
}
const media = await readdir(join(gallery, "assets"));
assert.deepEqual(media.sort(), [...assets.map((item) => item.slice("assets/".length)), "icon.webp"].sort());
const icon = await readFile(join(gallery, "assets/icon.webp"));
assert.equal(icon.toString("ascii", 0, 4), "RIFF");
assert.equal(icon.toString("ascii", 8, 12), "WEBP");
for (const forbidden of [".glb", ".gltf", ".blend", ".blend1", ".zip", ".png", ".jpg"]) {
  assert.ok(!media.some((file) => file.toLowerCase().endsWith(forbidden)), `Source asset leaked: ${forbidden}`);
}
for (const local of ["./styles.css", "./app.js", "./assets/concept-greeting.webp"]) {
  assert.ok(html.includes(local), `${local} is not referenced from index.html`);
}
// Aperçu des yeux (eyes/) : page, iframe du moteur web et bundle généré par tools/build-eyes.mjs.
const eyes = join(gallery, "eyes");
const eyesHtml = await readFile(join(eyes, "index.html"), "utf8");
const eyesCss = await readFile(join(eyes, "eyes.css"), "utf8");
const bundle = await readFile(join(eyes, "eyes.js"), "utf8");
assert.ok(eyesHtml.includes("https://sterenna.fr/lemegeton/eyes/"));
for (const local of ["./eyes.js", "./eyes.css", "./web.html"]) assert.ok(eyesHtml.includes(local), `${local} is not referenced from eyes/index.html`);
assert.match(bundle, /^\/\* Aperçu des yeux de Lemegeton : généré par tools\/build-eyes\.mjs/);
assert.match(eyesCss, /prefers-reduced-motion/);
assert.match(eyesCss, /max-width: 600px/);
const web = await readFile(join(eyes, "web.html"), "utf8");
for (const vendor of ["vendor/gsap.min.js", "vendor/web-eye-animation.js"]) {
  assert.ok(web.includes(vendor), `${vendor} is not referenced from eyes/web.html`);
  await stat(join(eyes, vendor));
}
assert.ok(html.includes("./eyes/"), "eyes/ is not linked from the gallery");
// Le fichier assemblé embarque la table de repli du canon : elle doit être celle du canon,
// sinon eyes.js a été généré avant un changement de canon (relancer tools/build-eyes.mjs).
const canon = JSON.parse(await readFile(join(root, "canon", "emotions.json"), "utf8"));
assert.ok(bundle.includes(`decided:"${canon.fallbacks.decided}"`), "eyes.js embarque une ancienne table de repli : relancer node tools/build-eyes.mjs");
for (const [name, spec] of Object.entries(canon.fallbacks.engines)) {
  const inlined = `moods:{${Object.entries(spec.moods).map(([emotion, mood]) => `${emotion}:"${mood}"`).join(",")}}`;
  assert.ok(bundle.includes(inlined), `eyes.js : la table de repli ${name} diffère du canon : relancer node tools/build-eyes.mjs`);
}
console.log(`Gallery OK: ${assets.length} WebP assets, ${(total / 1024 / 1024).toFixed(2)} MiB, HTML/CSS/JS references and mobile/keyboard affordances present; eyes preview present.`);


