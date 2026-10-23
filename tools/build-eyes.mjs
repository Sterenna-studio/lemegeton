// Construit gallery/eyes/eyes.js et copie le moteur web dans gallery/eyes/vendor/.
//
// Les moteurs d'yeux ne sont pas recopiés ici : ils sont assemblés depuis le
// dépôt minitel-musee voisin (esbuild de son node_modules), et le moteur web
// depuis nitro-clicker. Relancer après un changement des yeux ou du canon :
//   node tools/build-eyes.mjs
//   MINITEL_MUSEE=../ailleurs/minitel-musee NITRO_CLICKER=... node tools/build-eyes.mjs
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const musee = resolve(process.env.MINITEL_MUSEE ?? join(root, "..", "minitel-musee"));
const clicker = resolve(process.env.NITRO_CLICKER ?? join(root, "..", "nitro-clicker"));
const out = join(root, "gallery", "eyes");
const revision = (repo) => execFileSync("git", ["-C", repo, "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();

const esbuild = createRequire(join(musee, "package.json"))("esbuild");
await esbuild.build({
  entryPoints: [join(root, "tools", "eyes", "main.js")],
  outfile: join(out, "eyes.js"),
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  platform: "browser",
  alias: { "@musee": join(musee, "src") },
  banner: {
    js: `/* Aperçu des yeux de Lemegeton : généré par tools/build-eyes.mjs depuis minitel-musee ${revision(musee)} et canon/emotions.json. Ne pas modifier à la main. */`,
  },
  logLevel: "info",
});

// Cloudflare garde eyes.js 7 jours et eyes.css 30 jours alors que la page, elle, n'est pas
// mise en cache : l'adresse de chaque fichier porte donc une empreinte de son contenu
// (fins de ligne ignorées, pour que l'empreinte soit la même sous Windows et sous Linux),
// comme l'icône de la galerie. tools/check-gallery.mjs vérifie qu'elle est à jour.
export const assetVersion = (file) =>
  createHash("sha256").update(readFileSync(file, "utf8").replace(/\r\n/g, "\n")).digest("hex").slice(0, 10);
const page = join(out, "index.html");
let html = readFileSync(page, "utf8");
for (const name of ["eyes.js", "eyes.css"]) {
  const pattern = new RegExp(`\\./${name.replace(".", "\\.")}(\\?v=[0-9a-f]+)?"`);
  if (!pattern.test(html)) throw new Error(`${name} n'est pas référencé dans gallery/eyes/index.html`);
  html = html.replace(pattern, `./${name}?v=${assetVersion(join(out, name))}"`);
}
writeFileSync(page, html);

mkdirSync(join(out, "vendor"), { recursive: true });
for (const file of ["web-eye-animation.js", "gsap.min.js"]) {
  copyFileSync(join(clicker, "js", "vendor", file), join(out, "vendor", file));
}
console.log(`vendor/ copié depuis nitro-clicker ${revision(clicker)}`);
