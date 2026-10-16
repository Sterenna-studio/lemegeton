# Dessiner en Vidéotex : pièges connus

Règles à suivre pour toute forme en mosaïque G1 (yeux, visages, icônes, images
Vidéotex), quel que soit le dépôt : minitel-face et sa copie dans Korigan,
minitel-musee, les firmwares Minitel, ou un nouveau projet. Chaque piège ci-dessous
a déjà produit un défaut visible.

## Rappel : un caractère G1

En mode semi-graphique (G1), un octet de 0x20 à 0x3F ou de 0x60 à 0x7F est une
mosaïque de 2 × 3 « sextants ». Les bits 0x01, 0x02, 0x04, 0x08 et 0x10 allument
les cinq premiers sextants (haut-gauche, haut-droit, milieu-gauche, milieu-droit,
bas-gauche), 0x40 le dernier (bas-droit) ; 0x20 est toujours présent. Pour lire un
octet : `(b & 0x1F) | ((b & 0x40) >> 1)`, puis les bits 0 à 5 dans cet ordre.
Exemples : 0x7F plein, 0x20 vide, 0x70 tiers bas, 0x23 tiers haut.

## Les pièges déjà rencontrés

| Date | Défaut | Cause | Corrigé dans |
| --- | --- | --- | --- |
| 2026-10-06 | Barres **cisaillées** : le bout droit arrondi à l'envers du gauche (Zyra) | Deux octets différents (0x70 tiers bas, 0x2F deux tiers hauts) servaient d'embouts gauche et droit d'une même barre | minitel-face, minitel-musee, firmware Minitel-Face-Autonomous |
| 2026-10-16 | Yeux en **trois barres** au lieu de blocs pleins (LibEyes) | Trois constantes nommaient les lignes 9, 11 et 13 ; l'œil couvre 9 à 13, et les lignes 10 et 12 n'étaient jamais peintes | minitel-face, copie de Korigan, minitel-musee (style renommé « Blocs ») |
| 2026-10-16 | Visages Classic, Robot et Alien **troués, sans bords, décentrés**, bouches **à l'envers** | Nettoyage des sourcils qui effaçait le front sans le repeindre ; lignes sans bords ; traits décalés d'une colonne ; sourire dessiné barre en haut, coins en bas (∩) ; pupille en couleur NOIR, invisible sur fond noir | minitel-face, copie de Korigan (les firmwares ont leur propre dessin, continu) |

Chaque fois, la forme avait été écrite octet par octet sans jamais être regardée
en entier, et le défaut a été recopié dans chaque portage.

## Avant de créer ou de modifier une forme

1. **Une constante de ligne n'est pas une forme.** Si un élément va de la ligne A
   à la ligne B, peindre *chaque* ligne de A à B (une boucle ou un helper comme
   `eyeBlock`), pas seulement les lignes qui ont un nom. Une ligne vide au milieu
   d'un élément doit être un choix écrit en commentaire.
2. **La zone de nettoyage suit la forme.** Avec un rendu différentiel (minitel-face,
   firmwares), toute ligne qu'une forme peut peindre doit être dans la zone effacée
   au changement d'état, sinon il reste des traces.
3. **Embouts symétriques.** Une barre `[embout, plein…, embout]` a le même octet
   aux deux bouts, sauf intention contraire écrite.
4. **Seulement des mosaïques valides** : 0x20–0x3F et 0x60–0x7F. Un octet hors de
   ces plages s'affiche comme un caractère, pas comme un bloc.
5. **Regarder le résultat entier**, jamais seulement les octets : rendu texte
   sextant par sextant, Minitel 3D de minitel-musee, ou
   [sterenna.fr/lemegeton/eyes](https://sterenna.fr/lemegeton/eyes/). Passer chaque
   humeur et chaque état : ouvert, fermé, mi-clos, clins d'œil, regard haut et bas.
6. **Un test par forme** : aucune ligne vide entre le haut et le bas d'un même
   élément, embouts symétriques, codes G1 valides. minitel-face, sa copie de
   Korigan et minitel-musee ont chacun un test « yeux pleins ».
7. **Symétrique par construction.** Décrire la moitié gauche et calculer la
   droite par miroir (`sym`, `mirrorRow`, `mirrorG1` de `src/libs/g1.js` dans
   minitel-face). Une asymétrie voulue s'écrit en commentaire.
8. **Une région possède des lignes entières.** Elle efface et repeint toute sa
   largeur, bords compris : son nettoyage ne peut pas trouer ce qu'une autre
   région a peint. Les traits fins (sourcils, paupières) se dessinent en trait
   sombre dans une case de la couleur du visage, pas en trouant le visage.
9. **Penser à l'espace tampon.** Après chaque segment, minitel-face écrit une
   case noire (`ABSORB`) : un segment ou un nettoyage qui s'arrête juste avant un
   bord le gomme.
10. **Une pupille est un 0x20 dans une rangée colorée.** Une rangée en couleur
    NOIR ne dessine rien sur fond noir.
11. **Reporter dans toutes les copies.** Une forme vit souvent en plusieurs
   exemplaires (voir [VISAGE.md](VISAGE.md)) : corriger l'original et chaque
   portage le même jour, puis régénérer l'aperçu (`node tools/build-eyes.mjs`).

## Contrôles automatiques

minitel-face et sa copie de Korigan rejouent le vrai flux Vidéotex dans un écran
simulé : rendu différentiel égal au rendu complet et aucune structure trouée pour
chaque visage, silhouette continue et symétrie pour Classic, Robot et Alien.
minitel-musee vérifie que LibEyes n'a aucune ligne vide.
