# Canon de Lemegeton

Ce qui fait foi pour le personnage, quel que soit le projet qui l'utilise.
Les autres dépôts gardent leur code ; ils se rattachent au canon par ses
identifiants et sont recensés dans le registre.

| Fichier | Contenu |
| --- | --- |
| [emotions.json](emotions.json) | Les 10 émotions de référence, leurs équivalents sur chaque support et les déclencheurs connus |
| [apparitions.json](apparitions.json) | Registre des projets où Lemegeton apparaît, et leur alignement sur le canon |
| [VISAGE.md](VISAGE.md) | Technologies des yeux, du visage et des émotions, avec leurs constats |
| [VIDEOTEX.md](VIDEOTEX.md) | Pièges connus et vérifications avant de dessiner une forme en mosaïque G1 |
| [IDENTITE.md](IDENTITE.md) | Ce qui est dit du personnage, et ce qui reste à arbitrer |
| [UNIFICATION.md](UNIFICATION.md) | Étapes vers le rassemblement des projets |

## Règles

- Les identifiants d'émotion sont ceux de `emotions.json`, en minuscules et en
  anglais, comme dans web-eye-animation. Un nouveau support s'y rattache par
  `equivalents` plutôt que d'inventer ses noms.
- Un projet qui ajoute, retire ou change sa façon de représenter Lemegeton met à
  jour `apparitions.json`.
- Ce dépôt est public : pas d'adresse interne, de port, de jeton ni de chemin local
  pour les projets privés.
- Vérifier après modification : `python tools/check_canon.py`.
