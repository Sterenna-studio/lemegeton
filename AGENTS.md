# Instructions pour les prochains agents

Commencer par `PASSATION_AGENTS.md`, `08_AUDIT/AUDIT_GLOBAL.md`, puis le README
du sous-projet concerné. Ce dépôt contient le cœur créatif du personnage; le
site Minitel/Web vit dans le dépôt `minitel-musee`.

## Préservation

- Les sources d’origine, références, rigs autonomes et scènes Blender sont des
  éléments de travail. Ne pas écraser, supprimer ou remplacer une variante sans
  demande explicite.
- Les packages sous `03_RIGS/` utilisent des chemins relatifs : garder chaque
  package complet.
- Conserver les scènes Blender retouchées, leurs `.blend1` et les anciennes
  études. Faire « Save As » avant toute régénération.
- Les builders peuvent remplacer leurs sorties : lire le script et identifier
  ses chemins avant de le lancer.
- Les binaires de travail sont locaux et ignorés par Git. Ne pas forcer leur
  ajout au dépôt. L’archive `09_SAUVEGARDES/INTAKE_LEMEGETON_WIP_2026-10-13`
  est l’exception demandée; elle reste une archive historique et ne remplace
  pas le pipeline Blender actif.
- Les modèles Cyber Djinn et leurs textures sont conservés hors de ce dépôt,
  dans `C:\DEV\assets\models-3d\Cyber-Djinn\`.
- `TRI_MANIFEST.csv` porte les empreintes des 51 fichiers initiaux. Les
  déplacements doivent conserver les octets et actualiser leurs chemins.

## Canon

- `canon/` fait foi pour le personnage dans les autres dépôts. Toute nouvelle
  apparition de Lemegeton, ou tout changement de sa représentation, met à jour
  `canon/apparitions.json`.
- Le dépôt est public : aucune donnée d'infrastructure privée dans `canon/`.
  Lancer `python tools/check_canon.py` avant de commiter.
- Toute forme Vidéotex (yeux, visage, icône, image G1) suit `canon/VIDEOTEX.md` :
  peindre chaque ligne d'un élément, regarder le résultat entier, reporter dans
  toutes les copies.

## État du projet

Le personnage et ses rigs restent expérimentaux, pas prêts pour la production.
Les découpes, pivots, doigts et contrôles doivent être validés avant animation.
Ne pas présenter une vérification structurelle comme une validation artistique.

Aucune publication n’est implicite. Pour le site Minitel, suivre les consignes
et les tests dans le dépôt `minitel-musee`. Ne pas supposer que ses fichiers
ou dépendances se trouvent dans ce dépôt.
