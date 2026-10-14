# Vers l'unification des projets Lemegeton

Objectif (demande du 2026-10-14) : rassembler les projets qui tournent autour de
Lemegeton pour simplifier le travail et mieux préserver les éléments de travail.
Le canon est la première étape ; ce document trace la suite et reste à décider.

## Étape 1 — Canon (fait sur la branche `feat/canon`)

- [emotions.json](emotions.json) : les 10 émotions et leurs équivalents ;
- [apparitions.json](apparitions.json) : le registre des projets ;
- [VISAGE.md](VISAGE.md) : les technologies des yeux, du visage et des émotions ;
- [IDENTITE.md](IDENTITE.md) : ce qui est dit du personnage, et ce qui reste à arbitrer.

Aucun autre dépôt n'est modifié à ce stade.

## Étape 2 — Le hub public

La galerie [sterenna.fr/lemegeton](https://sterenna.fr/lemegeton/) gagne une
section « Où le rencontrer », générée depuis `apparitions.json` (projets publics
seulement).

## Étape 3 — Un seul moteur d'yeux

Le moteur existe quatre fois (voir [VISAGE.md](VISAGE.md)). Pistes, de la plus
légère à la plus profonde :

1. **Spécification partagée** : géométrie, timings et images clés des émotions
   décrits en données dans `canon/`, d'où l'on génère le C++ (`LemegetonEyes.h`)
   et le TypeScript. Le JS web reste web-eye-animation.
2. **Paquet unique** `lemegeton-eyes` (JS/TS) consommé par nitro-clicker, sigil et
   minitel-musee ; le firmware garde son portage, vérifié contre la spécification.
3. **Fusion de dépôts** : voir l'étape 4.

## Étape 4 — Regrouper les dépôts

Candidats au rassemblement, par affinité :

| Groupe | Dépôts | Point commun |
| --- | --- | --- |
| Personnage | lemegeton-core | Création, canon |
| Visage Minitel | minitel-face, Minitel-Face-Autonomous, Minitel-Sigil, 3615-gateways | Rendu Vidéotex du visage sur le Minitel réel |
| Web public | minitel-musee, galerie | Sites sous sterenna.fr |
| Plateforme Nitro | nitro-clicker, chronicles-tcg, gwen-ha-star-static | Jeux et radio où Lemegeton joue un rôle |

Questions à trancher avant toute fusion :

- **Public ou privé** : lemegeton-core et minitel-musee sont publics, minitel-face
  et les firmwares sont privés. Une fusion impose un choix de visibilité.
- **Monorepo ou fédération** : un dépôt unique `lemegeton` avec `core/`, `face/`,
  `firmware/`, `web/`, ou des dépôts séparés reliés par le canon et le registre.
- **Historique** : `git filter-repo` et `git subtree` permettent de garder l'historique
  de chaque dépôt lors d'un regroupement (déjà fait à la séparation de lemegeton-core).
- **Déploiements** : chaque site garde son propre workflow et son dossier sur OVH.
- **Binaires** : liste blanche de formats texte comme ici ; copie de travail locale
  unique pour les gros fichiers.
