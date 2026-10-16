// Construit gallery/eyes/eyes.js et copie le moteur web dans gallery/eyes/vendor/.
//
// Les moteurs d'yeux ne sont pas recopiés ici : ils sont assemblés depuis le
// dépôt minitel-musee voisin (esbuild de son node_modules), et le moteur web
// depuis nitro-clicker. Relancer après un changement des yeux ou du canon :
//   node tools/build-eyes.mjs
//   MINITEL_MUSEE=../ailleurs/minitel-musee NITRO_CLICKER=... node tools/build-eyes.mjs
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync } from "node:fs";
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

mkdirSync(join(out, "vendor"), { recursive: true });
for (const file of ["web-eye-animation.js", "gsap.min.js"]) {
  copyFileSync(join(clicker, "js", "vendor", file), join(out, "vendor", file));
}
console.log(`vendor/ copié depuis nitro-clicker ${revision(clicker)}`);
