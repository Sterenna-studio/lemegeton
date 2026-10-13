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
console.log(`Gallery OK: ${assets.length} WebP assets, ${(total / 1024 / 1024).toFixed(2)} MiB, HTML/CSS/JS references and mobile/keyboard affordances present.`);


