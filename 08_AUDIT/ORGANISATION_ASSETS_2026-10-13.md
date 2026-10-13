# Réorganisation des assets — 13 octobre 2026

## Résultat

Le dépôt a été classé par étape de création et type de ressource, sans fusionner
les versions similaires ni extraire l’archive historique 2D. L’inventaire local
avant rangement comptait 318 fichiers pour 2 607 711 742 octets, soit environ
2,61 Go. Une vérification SHA-256 avant/après a couvert chacun des 17 fichiers
physiques déplacés.

| Catégorie | Emplacement | Contenu |
| --- | --- | --- |
| Concept art 2D | `01_REFERENCES/CONCEPT_ART/` | 5 images |
| Fiches techniques 2D | `01_REFERENCES/TECHNICAL_SHEETS/` | 3 images |
| Storyboard 2D | `01_REFERENCES/STORYBOARDS/` | 1 image |
| Sources 3D | `02_SOURCES_3D/` | 6 GLB originaux, inchangés |
| Rigs | `03_RIGS/` | 4 packages autonomes, inchangés |
| Travail Blender | `04_BLENDER/` | Scènes, fichiers `.blend1` et scripts, inchangés |
| Exports | `05_EXPORTS/` | Rendus, 120 images d’étude et rapports, inchangés |
| Générations Meshy | `06_MODEL/MESHY_GENERATIONS/` | 3 GLB d’essai |
| Autres modèles expérimentaux | `06_MODEL/OTHER_EXPERIMENTS/` | minitel_bot, sample et white_mesh (3 GLB) |
| Prototypes historiques 2D | `09_SAUVEGARDES/INTAKE_LEMEGETON_WIP_2026-10-13/` | Lot d’origine préservé, non extrait |
| Cyber Djinn | `C:\DEV\assets\models-3d\Cyber-Djinn\exports/` | GLB et USDZ déplacés hors du dépôt |

## Intégrité et limites

Les neuf références ont gardé leurs noms et SHA-256. Leurs nouveaux chemins
sont inscrits dans `TRI_MANIFEST.csv`; les chemins d’origine restent dans sa
première colonne. Les trois générations Meshy, les trois expériences et les deux
exports Cyber Djinn ont également été vérifiés par comparaison SHA-256 avant et
après déplacement. Les empreintes Cyber Djinn sont ajoutées à
`C:\DEV\assets\models-3d\Cyber-Djinn\SHA256SUMS`.

Aucune scène Blender, sauvegarde `.blend1`, ressource autonome de rig, rendu ou
fichier du lot WIP n’a été déplacé. Le binaire `white_mesh.glb` reste un essai
non qualifié et n’est pas promu au rang de modèle actif. Les actifs binaires du
repo sont ignorés par Git; seul le lot WIP demandé précédemment constitue une
exception suivie.

La réorganisation clarifie les catégories sans valider l’origine, la licence ou
la qualité artistique des modèles expérimentaux. Le site et les modèles de
terminaux restent dans `minitel-musee`.

## Vérification du manifeste historique

La vérification directe des fichiers du dossier trouve 25 fichiers texte dont les
octets du checkout diffèrent de leur SHA-256 historique à cause de la conversion
de fins de ligne Windows (`core.autocrlf=true`). Les blobs Git des 25 fichiers
sont identiques aux empreintes du manifeste; les 26 fichiers source locaux non
versionnés correspondent également. Aucun de ces 25 fichiers n’a été modifié
pour ce rangement. Le script historique `verify_sources.ps1` compare les octets
du checkout et peut donc signaler cette différence de fin de ligne.
