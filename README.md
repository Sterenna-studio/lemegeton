# lemegeton-core

Le cœur créatif du personnage Lemegeton : références 2D, sources et essais 3D,
packages de rig, scènes Blender, rendus et documentation. Les projets qui
utilisent ces ressources vivent dans leurs dépôts dédiés, notamment
[minitel-musee](https://github.com/Sterenna-studio/minitel-musee).

## Reprise

Lire [PASSATION_AGENTS.md](PASSATION_AGENTS.md), [AGENTS.md](AGENTS.md),
[PIPELINE_TRAVAIL.md](PIPELINE_TRAVAIL.md) et
[l’audit global](08_AUDIT/AUDIT_GLOBAL.md). Les sources 3D, rigs et scènes sont
préservés : ne pas supprimer ni remplacer une variante sur la seule base de son
nom. Les binaires de travail restent locaux et ne sont pas versionnés par Git.

## Classement des ressources

| Dossier | Contenu |
| --- | --- |
| [01_REFERENCES](01_REFERENCES/README.md) | Concept art, fiches techniques et storyboard 2D |
| `02_SOURCES_3D/` | Modèles GLB sources conservés tels que reçus |
| `03_RIGS/` | Packages V1/V2/V3 autonomes, avec scripts, viewer et dépendances |
| `04_BLENDER/` | Scènes de travail/audit et scripts Blender; conserver aussi les `.blend1` |
| `05_EXPORTS/` | Rendus, captures, animations et rapports d’export |
| [06_MODEL](06_MODEL/README.md) | Générations Meshy et autres modèles expérimentaux |
| `08_AUDIT/` | Inventaires, rapports, validations et historique de migration |
| [09_SAUVEGARDES/INTAKE_LEMEGETON_WIP_2026-10-13](09_SAUVEGARDES/INTAKE_LEMEGETON_WIP_2026-10-13/README.md) | Lot historique de concepts et prototypes 2D/cut-out, préservé sans extraction |

Les exports et textures de Cyber Djinn sont conservés hors de ce dépôt dans
`C:\DEV\assets\models-3d\Cyber-Djinn\`, conformément à la demande de rangement
dédié. Son ancien GLB et son USDZ ont été déplacés dans le sous-dossier
`exports/`; leurs empreintes SHA-256 sont conservées dans le manifeste du dossier
d’assets. Ce dépôt ne contient plus ces deux fichiers.

## Intégrité et Git

[TRI_MANIFEST.csv](TRI_MANIFEST.csv) conserve les chemins d’origine, chemins
actuels, tailles et empreintes SHA-256 des 51 fichiers de l’inventaire initial.
Le réarrangement des références est reporté dans ce manifeste. Les nouveaux
assets locaux ne sont pas inclus dans Git; l’archive `INTAKE_LEMEGETON_WIP`
est l’exception explicitement demandée et possède son propre inventaire SHA-256.

Les changements de classement sont documentés dans
[08_AUDIT/ORGANISATION_ASSETS_2026-10-13.md](08_AUDIT/ORGANISATION_ASSETS_2026-10-13.md).
