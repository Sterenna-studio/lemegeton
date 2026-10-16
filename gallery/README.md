# Galerie publique Lemegeton

Site statique publié sous https://sterenna.fr/lemegeton/ par le workflow
`.github/workflows/deploy-gallery.yml`. Le dossier `gallery/` est envoyé vers
`~/www/lemegeton/` sans bundler ni code serveur.

Le site diffuse neuf planches de conception et de référence, plus trois aperçus
WebP aplatis des études de forme. Les images sont dérivées des références et
rendus locaux, converties en WebP (3,58 Mo au total, contre 22,65 Mo pour les
sources sélectionnées). Aucun GLB, USDZ, fichier Blender, archive ou texture
source n’est publié.

La galerie présente explicitement les modèles comme expérimentaux. Les modèles
sources restent locaux ou dans leur emplacement de travail; les aperçus sont
uniquement des images. Pour ajouter une image, produire un dérivé optimisé dans
`gallery/assets/`, ajouter sa notice dans `app.js`, puis vérifier la page avec
`node tools/check-gallery.mjs`.

## Aperçu des yeux

`eyes/` (https://sterenna.fr/lemegeton/eyes/) montre côte à côte les moteurs
d'yeux de Lemegeton, pilotés par les émotions de `canon/emotions.json`. Les
moteurs ne sont pas recopiés : `eyes/eyes.js` est généré par
`node tools/build-eyes.mjs` depuis le dépôt `minitel-musee` voisin (mosaïques
Vidéotex et rendu lisse) et le canon, et `eyes/vendor/` reprend tel quel
web-eye-animation (MIT, CyberAgentAILab) et GSAP depuis `nitro-clicker`.
Relancer le script après un changement des yeux ou du canon, puis commiter le
résultat.

La page est en HTML/CSS/JavaScript natifs pour rester légère et éviter de rendre
les dépendances ou les formats de travail du projet nécessaires au site public.
