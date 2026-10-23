# Yeux, visage et émotions : technologies en usage

Relevé du 2026-10-14 dans les dépôts où Lemegeton apparaît (voir
[apparitions.json](apparitions.json)). Les dépôts privés sont signalés comme tels,
sans détail d'infrastructure.

Aperçu côte à côte des moteurs publics, pilotés par les émotions du canon :
[sterenna.fr/lemegeton/eyes](https://sterenna.fr/lemegeton/eyes/) (`gallery/eyes/`).

## Moteurs de rendu

| Moteur | Dépôt | Support | Langage | Vocabulaire | Remarques |
| --- | --- | --- | --- | --- | --- |
| **web-eye-animation** (MIT, CyberAgentAILab) | nitro-clicker `js/vendor/` | Navigateur, OBS | JS + GSAP | 10 émotions du [canon](emotions.json) | Copie gelée le 2026-07-06 après une casse amont. Référence des yeux de Lemegeton |
| Copie de web-eye-animation | sigil (privé) `webui_static/js/vendor/` | Page `/visage` | JS | 10 émotions | Deuxième copie du même fichier |
| **LemegetonEyes.h** | Minitel-Sigil (privé) | Minitel réel, mosaïque G1, 4 800 bauds | C++ Arduino | 10 émotions | Portage du moteur web, timings réglés devant un vrai Minitel |
| **lemegetonEyes.ts** | minitel-musee `src/eyes/` | Minitel 3D (Three.js), grille G1 80×57 | TypeScript | 10 émotions | Portage de LemegetonEyes.h : même visage que le Minitel réel |
| **Bibliothèques de visages** (BaseFaceLib, Classic, Robot, Alien, Eyes, Zyra, ZyraEyes) | minitel-face (privé) `src/libs/` | Minitel réel via ESP32, rendu différentiel par régions | Node.js | Humeurs propres à chaque bibliothèque (default, happy, angry, tired, surprised, curious, love…) | FaceRenderer, séquences, mode autonome |
| Visages embarqués | Minitel-Face-Autonomous (privé) | Minitel réel, ESP32 sans serveur | C++ Arduino | Humeurs Zyra (NEUTRE, CALME, JOIE, CURIEUX, FOCUS, COLERE, SURPRIS, FATIGUE, AMOUR) | Les six visages de minitel-face exécutés sur le dongle |
| **libEyes.ts, libZyraEyes.ts, EyesController.ts** | minitel-musee `src/eyes/` | Minitel 3D | TypeScript | Humeurs minitel-face | Portage de LibEyes, LibZyraEyes et FaceRenderer |
| **SmoothEyes.ts** | minitel-musee `src/eyes/` | Minitel 3D, rendu lisse | TypeScript | Humeurs minitel-face | Rendu « classique » façon overlay OBS |
| **mosaic.ts** | minitel-musee `src/videotex/` | Peintre de rangées G1 | TypeScript | — | Format de rangées `[ligne, col, couleur, octets G1]` compatible avec le Minitel réel |
| **PtzEyes** | Korigan (privé) `app/admin/camera/` | Interface d'admin | React | Regard seulement (pan, tilt, zoom) | Yeux qui reflètent la caméra PTZ pilotée comme regard de Lemegéton (modes contrôle, suivi en direct, surveillance d'écran) |
| Avatar Vidéotex | 3615-gateways, Korigan (privé) | Page 3615 AVATAR / LEMEGETON | Node.js | `mood` (neutral) | Image texte `lemegeton.txt`, état `avatar-state.json` |

## Pilotage : ce qui choisit l'émotion

| Source | Dépôt | Mécanisme | Correspondance |
| --- | --- | --- | --- |
| Événements Twitch | nitro-clicker `obs-lemegeton-twitch.html` | EventSub + chat IRC en WebSocket | follow → love, sub → excitement, raid → surprise… (voir `triggers` dans [emotions.json](emotions.json)) |
| Radio | nitro-clicker `obs-lemegeton-radio.html` | État radio interrogé, niveau audio | Changement de morceau → surprise, émotion selon le volume |
| Mode autonome OBS | nitro-clicker `obs-lemegeton.html` | Minuteries | joy au démarrage, sleepy en veille, tirage toutes les ~7 s |
| Message direct | nitro-clicker (OBS Twitch) | WebSocket `lemegeton:emotion` | Identifiant du canon tel quel |
| Mesh Sigil | sigil (privé) | `GET /api/visage`, toutes les 2 s sur le Minitel | Statut de l'agent actif → couleur et émotion |
| Commande Sigil | sigil (privé) `minitel-face.py` | Action de la liste blanche | 10 émotions, envoyées en minuscules |
| API HTTP du visage | minitel-face (privé) | `GET /moods`, `POST /mood` | Humeurs de la bibliothèque active |
| Korigan | Korigan (privé) | Canal vers l'API de minitel-face : humeur, regard, clignement, séquence, bibliothèque | Humeurs minitel-face |
| Touches Minitel | minitel-musee, firmwares | Chiffres du clavier | Chiffre n → n-ième émotion |
| État de la radio | gwen-ha-star-static `data/lemegeton-state.json` | Fichier d'état publié | `eyes`/`mouth` (open, focused, closed) et `mood` en texte libre : hors canon |
| Progression du clicker | nitro-clicker `lemegeton-progression.js` | Suivi du pointeur au survol | Regard seulement |

## Références par famille

Vérifié le 2026-10-19 (hachages, comparaison à l'amont, chronologies, humeurs rendues).
Deux familles, chacune avec **une référence** ; tout le reste est une copie ou un
port, dit comme tel dans [apparitions.json](apparitions.json) (champ `lineage`) et
[emotions.json](emotions.json) (bloc `references`).

| Famille | Vocabulaire | Référence | Copies identiques | Portages |
| --- | --- | --- | --- | --- |
| **Émotions** | les 10 de [emotions.json](emotions.json) | web-eye-animation, copie gelée de nitro-clicker (amont CyberAgentAILab) | Sigil, galerie de lemegeton-core | LemegetonEyes.h (Minitel-Sigil), puis lemegetonEyes.ts (minitel-musee) |
| **Humeurs** | propre à chaque bibliothèque de minitel-face | minitel-face | copie vendue dans Korigan | Face_Autonomous (C++), Galerie.h (Minitel-Sigil), libEyes.ts, libZyraEyes.ts et SmoothEyes.ts (minitel-musee) |

**Règles.** Les identifiants d'émotion et leur ordre sont ceux du canon. Un
portage peut étirer le temps ou tenir la pose pour la liaison Minitel, à
condition de le dire. Une humeur appartient à une bibliothèque : un portage dit
quelle bibliothèque il suit.

### Ce que la vérification a établi

- **Émotions : trois copies identiques.** nitro-clicker, Sigil et la galerie ont
  le même `web-eye-animation.js` (même hachage, fins de ligne mises à part), et
  le même GSAP. Il diffère de l'amont par **une seule ligne** : l'adresse de GSAP.
- **Sigil n'emploie que 5 des 10 émotions** : excitement (agent occupé), confusion
  (dégradé), sleepy (déconnecté ou agent inactif), surprise puis, au bout de 8 s, anger (erreur). Les
  identifiants sont ceux du canon : « aligné » vaut pour les noms.
- **Les chronologies du firmware ne sont pas celles du web.** Quatre sont
  identiques (joy, sadness, anger, fear) ; cinq ont une étape de pose tenue en
  plus (surprise +500 ms, disgust +500, confusion +200, love +500, sleepy +500) ;
  excitement est 100 ms plus court. Le firmware étire en outre le temps de ×2,5 et
  tient la pose 1,2 s.
- **Le TypeScript de minitel-musee suit le firmware, pas le web** : les 10
  chronologies sont identiques à celles de `LemegetonEyes.h`.
- **Humeurs : deux vocabulaires.** LibEyes a 8 humeurs, Zyra et ZyraEyes 9 ;
  Classic, Robot et Alien 5, 5 et 7. Testé sur l'original : Zyra rend `fear` et
  `disgust` comme `default`, LibEyes rend `calm`, `curious` et `focused` comme
  `default`.
- **Le portage Zyra de minitel-musee a les neuf humeurs de LibZyra**, identiques à
  l'original rangée par rangée (vérifié le 2026-10-23 sur neuf humeurs, trois
  regards, ouvert, fermé et mi-clos) ; `fear` et `disgust`, propres à LibEyes, y sont
  en plus rapprochés des formes surpris et fatigué. Avant le 2026-10-23 il n'avait
  ni `calm`, ni `curious`, ni `focused`.
- **Avant la table de repli ci-dessus, les replis différaient selon le support** quand le canon n'a pas d'équivalent :
  Minitel-Sigil joue sadness en fatigué, fear en surpris et disgust en concentré ;
  la page d'aperçu lit les équivalents du canon et retombe sur neutre quand
  l'humeur n'existe pas dans le moteur (confusion, dont l'équivalent « curious »
  est absent de LibEyes).

### Repli quand une émotion n'a pas d'équivalent

Décidé le 2026-10-22, écrit dans le bloc `fallbacks` de [emotions.json](emotions.json) :
un moteur joue l'humeur la plus proche qu'il possède. Une étoile marque un repli
(pas d'équivalent exact). Robot est identique à Classic. Calm, focused et neutral
ne sont pas des émotions : l'état de la mesh les pilote.

| Émotion | LibEyes | Zyra | Classic, Robot | Alien |
| --- | --- | --- | --- | --- |
| joy | happy | happy | happy | happy |
| sadness | tired* | tired* | tired* | tired* |
| surprise | surprised | surprised | surprised | surprised |
| anger | angry | angry | angry | angry |
| fear | fear | surprised* | surprised* | surprised* |
| disgust | disgust | tired* | tired* | tired* |
| confusion | surprised* | curious | surprised* | curious |
| love | love | love | happy* | happy* |
| sleepy | tired* | tired* | tired* | tired* |
| excitement | happy* | happy* | happy* | happy* |

Deux choix à retenir : le **dégoût sur Zyra est « fatigué »**, parce que
« concentré » y donne exactement les yeux de la colère ; la **confusion est
« surpris »** là où l'humeur « curieux » n'existe pas.

**Écarts avec les supports actuels** (non corrigés) :

- Minitel-Sigil joue le dégoût en « concentré » (`GAL_MOOD_OF_EMOTION`) : c'est le
  seul écart restant avec la table.

La page d'aperçu des yeux suit la table depuis le 2026-10-23 : chaque carte lit son
moteur dans `fallbacks` et affiche l'humeur jouée, avec « repli » quand il n'y a pas
d'équivalent exact. `tools/check-gallery.mjs` vérifie que le fichier assemblé
embarque la même table que le canon.

### Écarts relevés, non corrigés

- Minitel-Sigil, en-tête de `LemegetonEyes.h` : annonce « durées ×1,5 » (le code
  utilise 2,5) et « 40 × 21 cellules, rangées 2 à 22 » (le code : 19 rangées, 2 à 20).

## Voix et personnalité

| Élément | Dépôt | Techno |
| --- | --- | --- |
| Voix de synthèse | Korigan (privé) radio-director | Piper, modèle `lemegeton.onnx` |
| Pack vocal (10 phrases) | Korigan (privé) `lemegeton-transitions/` | MP3, paroles dans `paroles.md` |
| Audio de l'animateur | gwen-ha-star-static `audio/leme/` | Fichiers audio de la radio |
| Oracle IA | Korigan (privé) page `/leme` | Interface de dialogue |

## Constats

- **Un vocabulaire domine déjà** : les 10 émotions de web-eye-animation sont
  partagées par nitro-clicker, sigil, Minitel-Sigil et minitel-musee. Le canon les
  reprend telles quelles.
- **Deux familles coexistent** : les *émotions* (réactions courtes, web-eye-animation)
  et les *humeurs* (postures durables, minitel-face et Zyra). Le canon les relie par
  sa table d'équivalents ; neutral, calm, focused et default restent sans émotion.
- **Le même moteur existe quatre fois** (plus PtzEyes, une cinquième représentation du regard) : deux copies JS, un portage C++, un portage
  TypeScript. Un correctif doit aujourd'hui être reporté à la main dans chacun.
- **Des défauts de forme se recopient d'un portage à l'autre** : barres cisaillées
  (2026-10-06), lignes manquantes de LibEyes (2026-10-16). Voir
  [VIDEOTEX.md](VIDEOTEX.md) avant de dessiner ou de porter une forme.
- **L'état de la radio est hors canon** : yeux et bouche nommés autrement, humeur en
  texte libre.
