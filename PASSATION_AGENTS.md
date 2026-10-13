# Passation — lemegeton-core

État de rangement : 13 octobre 2026. Ce dépôt Git est le cœur créatif du
personnage Lemegeton. Le site Minitel/Web et les modèles de terminaux vivent
dans le dépôt séparé `minitel-musee`; ils ne sont pas des sous-projets locaux
dans cette arborescence.

## Où trouver les ressources

| Dossier | Rôle |
| --- | --- |
| `01_REFERENCES/CONCEPT_ART` | Planches et propositions visuelles |
| `01_REFERENCES/TECHNICAL_SHEETS` | Fiches techniques 2D |
| `01_REFERENCES/STORYBOARDS` | Storyboard |
| `02_SOURCES_3D` | Six GLB d’origine et rapport de préparation |
| `03_RIGS` | Quatre itérations de packages de rig; garder chaque package complet |
| `04_BLENDER` | Scènes et scripts de travail. Créer une nouvelle copie avant retouche |
| `05_EXPORTS` | Rendus, séquences, exports et rapports d’audit |
| `06_MODEL/MESHY_GENERATIONS` | Trois générations Meshy conservées comme essais |
| `06_MODEL/OTHER_EXPERIMENTS` | minitel_bot, sample et white_mesh; provenance à vérifier |
| `08_AUDIT` | Rapports et preuves de vérification |
| `09_SAUVEGARDES/INTAKE_LEMEGETON_WIP_2026-10-13` | Ancien brief et prototypes 2D/cut-out, archive intacte |
| `C:\DEV\assets\models-3d\Cyber-Djinn` | Dossier local dédié aux sources, textures et exports Cyber Djinn |

Les fichiers déplacés ont conservé leur SHA-256. Les nouveaux chemins des
références sont dans `TRI_MANIFEST.csv`; le récapitulatif est dans
`08_AUDIT/ORGANISATION_ASSETS_2026-10-13.md`. Aucun binaire du dépôt n’est
versionné, à l’exception de l’archive WIP explicitement demandée.

## Reprise Blender

Consulter [AUDIT_ET_SUITE.md](AUDIT_ET_SUITE.md) et
[PIPELINE_TRAVAIL.md](PIPELINE_TRAVAIL.md). Le personnage reste expérimental :
corriger les découpes, raccords, doigts et pivots avant de valider un rig et une
animation. Les scènes retouchées et leurs fichiers `.blend1` doivent être
préservés. La vidéo d’étude reste rejetée; les contrôles structurels ne valent
pas validation artistique.

## Archive 2D historique

Le lot `INTAKE_LEMEGETON_WIP_2026-10-13` contient plusieurs archives ZIP, fichiers
SVG/PNG/GIF, un document de conception et des notes de passation. Il n’a pas été
décompressé afin de préserver le lot d’origine; voir son README et le manifeste
SHA-256. Ces éléments sont des études anciennes, pas une branche de production.

## Limites

Ce dépôt et ses sauvegardes locales ne constituent pas une copie hors disque.
Aucune installation ou inférence PartField n’est validée. Le composant Web
Minitel se vérifie dans `C:\DEV\repos\minitel-musee`.
