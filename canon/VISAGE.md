# Yeux, visage et émotions : technologies en usage

Relevé du 2026-10-14 dans les dépôts où Lemegeton apparaît (voir
[apparitions.json](apparitions.json)). Les dépôts privés sont signalés comme tels,
sans détail d'infrastructure.

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
| Touches Minitel | minitel-musee, firmwares | Chiffres du clavier | Chiffre n → n-ième émotion |
| État de la radio | gwen-ha-star-static `data/lemegeton-state.json` | Fichier d'état publié | `eyes`/`mouth` (open, focused, closed) et `mood` en texte libre : hors canon |
| Progression du clicker | nitro-clicker `lemegeton-progression.js` | Suivi du pointeur au survol | Regard seulement |

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
- **Le même moteur existe quatre fois** : deux copies JS, un portage C++, un portage
  TypeScript. Un correctif doit aujourd'hui être reporté à la main dans chacun.
- **L'état de la radio est hors canon** : yeux et bouche nommés autrement, humeur en
  texte libre.
