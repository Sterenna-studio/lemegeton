# Lemegeton --- dossier de passation du projet

> Document de référence pour reprendre le projet dans un dépôt Git.
> Langue de travail : français. Plateforme de développement confirmée :
> Windows. Niveau d'animation : débutant.

## Résumé exécutif

Lemegeton est un personnage robotique rétro inspiré d'un Minitel,
destiné à exister sous deux formes complémentaires : 1. un personnage
jouable dans un jeu 2D ; 2. un compagnon interactif sur le bureau
Windows.

La direction visuelle retenue est une marionnette 2D de type *jointed
paper doll / cut-out puppet* : pièces séparées, superposition, pivots et
mouvements articulés. La source graphique de référence est le pack
original fourni par l'utilisateur. **Ne pas générer de nouvelles
illustrations** pour cette étape : réutiliser, nettoyer, repositionner
et animer les assets existants uniquement.

La recommandation actuelle est Godot pour le runtime commun jeu +
compagnon de bureau. Synfig Studio reste une option d'atelier pour
préparer/tester des animations, mais il n'est pas nécessaire de
l'introduire dans le pipeline initial si cela complique le démarrage.

## Décisions confirmées

-   **OS cible de développement :** Windows.
-   **Niveau :** débutant en animation 2D.
-   **Cible produit :** jeu 2D + compagnon de bureau interactif.
-   **Style :** cut-out / paper puppet, articulations visuelles, pièces
    qui se chevauchent.
-   **Source d'art :** assets déjà présents dans le pack original.
-   **Interdit de production à ce stade :** pas de nouvelles
    illustrations générées.
-   **Mains :** une seule pose de main par bras dans une pose donnée ;
    les autres PNG sont des variantes interchangeables, jamais des mains
    permanentes dupliquées.
-   **Expressions :** une expression d'écran à la fois ; les PNG
    d'expressions sont des états alternatifs.
-   **Livrables précédents :** prototypes d'assemblage et d'animation
    sont des références, pas des rigs finaux.
-   **Priorité :** créer un prototype Godot minimal, testable et
    contrôlable, avant de développer le compagnon de bureau.

## Description visuelle et comportementale

Le personnage est un robot chibi inspiré d'un terminal Minitel rétro,
avec : - tête-écran CRT ; - expressions pixelisées cyan/magenta ; -
coque noire marbrée avec veines dorées/cuivrées ; - torse évoquant le
clavier d'un terminal ; - antenne ; - bras, mains et jambes courts ; -
accessoires/détails rétro présents dans les assets.

La direction paper-puppet doit venir de la façon d'assembler et d'animer
les images existantes, et non d'une nouvelle passe d'illustration :
pivots, superposition des raccords, animation par rotation/translation,
petites ombres éventuelles calculées par le moteur si cela n'exige pas
de nouvelles images sources.

## Architecture produit recommandée

### Phase 1 --- Prototype jouable Godot 2D

-   scène `Main` ;
-   personnage composé de pièces PNG ;
-   contrôles gauche/droite ;
-   saut et gravité ;
-   collisions sol/plateformes ;
-   état idle / marche / saut ;
-   changement d'expression déclenché par action ;
-   caméra simple et niveau de test minimal.

### Phase 2 --- Rig cut-out

-   pivots contrôlés pour cou, épaules, coudes, poignets, hanches,
    genoux et chevilles ;
-   hiérarchie des pièces ;
-   ordre de profondeur cohérent ;
-   correction des raccords et vérification des transparences ;
-   variantes de mains et d'expressions via remplacement d'état.

### Phase 3 --- Compagnon de bureau Windows

-   mode fenêtre sans bordure ;
-   option toujours au premier plan ;
-   fond transparent, après test sur la version de Godot et Windows
    retenues ;
-   déplacement du compagnon par glisser-déposer ;
-   clics / réactions simples ;
-   mode passif (idle), réactions à l'activité utilisateur ;
-   ne pas laisser les interactions du compagnon bloquer le jeu.

### Phase 4 --- Consolidation

-   sauvegarde des paramètres utiles ;
-   réglages d'accessibilité et de volume si nécessaire ;
-   tests de performance et de comportement de fenêtre ;
-   packaging Windows ;
-   README utilisateur et instructions de lancement.

## Structure de dépôt proposée

``` text
/
├── README.md
├── PROJECT_BRIEF.md
├── DECISIONS.md
├── ROADMAP.md
├── ASSET_INVENTORY.md
├── HISTORY_AND_ARTIFACTS.md
├── assets/
│   └── lemegeton/             # assets source validés, conservés sans altération
├── scenes/
│   ├── main/
│   ├── character/
│   └── desktop_companion/
├── scripts/
│   ├── character_controller.gd
│   ├── character_animation.gd
│   └── desktop_window.gd
├── animations/
├── tests/
└── docs/
```

Ne pas copier automatiquement tous les prototypes dans `assets/` de
production. Conserver les prototypes dans `reference_artifacts/` ou dans
un dossier d'archives jusqu'à validation.

## Risques / points à ne pas masquer

1.  Les PNG sont des découpes de travail et certains peuvent conserver
    des artefacts de la planche source. Un contrôle visuel est
    nécessaire.
2.  La tête et le torse disposent de certaines vues complètes : leurs
    sous-parties ne sont pas toutes séparées. L'écran indépendant doit
    être utilisé seulement si un asset correspondant existe réellement
    dans le pack.
3.  Les pivots présents dans les prototypes sont estimés et ne
    constituent pas une hiérarchie de rig finale.
4.  Le GIF de salut est un test de mouvement rudimentaire, pas une
    animation finale.
5.  Les capacités de fenêtre transparente, de clics traversants et de
    maintien au premier plan doivent être validées sur Windows avec la
    version de Godot ciblée.
6.  Le compagnon de bureau et le jeu 2D partagent les assets, mais leurs
    contrôleurs et leurs règles d'entrée doivent être séparés.
7.  Le format SVG et le fichier OpenRaster sont des références
    d'assemblage ; ils ne remplacent pas un projet Godot natif.

## Première tâche concrète recommandée

Créer un projet Godot 4.x minimal et importer uniquement les assets
utiles à la pose neutre : 1. tête/torse de base ; 2. bras supérieur et
inférieur de chaque côté ; 3. une main par côté ; 4. cuisse, jambe
inférieure et pied de chaque côté ; 5. antenne si elle ne fait pas déjà
partie de la tête complète.

Puis : - construire la scène du personnage avec des `Node2D`/`Sprite2D`
; - utiliser des nœuds parents comme pivots de rotation ; - tester une
rotation d'avant-bras ; - ajouter ensuite le contrôleur de déplacement
; - ne passer au compagnon de bureau qu'après validation du personnage
jouable.

La disponibilité exacte de chaque pièce doit être vérifiée dans
`manifest_assets.json`. Ne pas inventer de fichiers ou de ressources qui
n'existent pas.

## Règle de travail

Avant de modifier ou de remplacer un asset : - conserver l'original ; -
documenter la variante et la raison ; - ne jamais remplacer
silencieusement le pack source ; - éviter de dupliquer des pièces fixes
ou des mains ; - ne pas lancer de génération d'image pour résoudre un
problème d'assemblage.

------------------------------------------------------------------------

# Décisions de projet

## Confirmées

-   Projet centré sur Lemegeton, robot rétro inspiré du Minitel.
-   Windows comme environnement cible initial.
-   Godot est le moteur recommandé pour partager le runtime entre jeu 2D
    et compagnon de bureau.
-   L'utilisateur débute en animation 2D.
-   Style d'animation : marionnette de papier articulée / cut-out.
-   Utiliser exclusivement les assets graphiques existants ; aucune
    nouvelle illustration.
-   Les variantes de mains et d'expressions doivent être traitées comme
    des états alternatifs.
-   Une pose du personnage ne doit jamais montrer des mains dupliquées
    par erreur.

## Recommandations, non encore validées

-   Godot 4.x comme base de développement.
-   Construire d'abord le personnage jouable, puis ajouter le mode
    compagnon de bureau.
-   Commencer par une hiérarchie de pivots `Node2D` + `Sprite2D`, puis
    envisager `Skeleton2D` si les besoins le justifient.
-   Garder Synfig Studio facultatif ; ne pas ajouter un deuxième outil
    tant que le pipeline Godot n'est pas validé.
-   Le mode compagnon doit être une scène/mode distinct, partageant les
    assets et animations du personnage.

## À décider plus tard

-   Version exacte de Godot.
-   Vue et gameplay précis (plateformer, aventure, autre).
-   Système de caméra et dimensions du monde.
-   Interactions spécifiques du compagnon.
-   Gestion des clics traversants dans la fenêtre transparente.
-   Licence et provenance de chaque asset si le projet est publié.

------------------------------------------------------------------------

# Feuille de route

## M0 --- Audit du pack

-   [ ] Décompresser le pack source original dans une zone en lecture
    seule.
-   [ ] Vérifier le manifeste et l'aperçu de toutes les catégories.
-   [ ] Marquer les assets validés, les assets avec artefacts et les
    vues complètes non séparables.
-   [ ] Choisir une seule pose neutre de main par côté.
-   [ ] Confirmer la convention de nommage et la licence/provenance.

**Critère de sortie :** inventaire fiable, aucun asset source écrasé.

## M1 --- Prototype Godot jouable

-   [ ] Créer projet Godot 2D Windows.
-   [ ] Importer les PNG sélectionnés.
-   [ ] Construire la hiérarchie visuelle avec pivots `Node2D`.
-   [ ] Ajouter déplacement gauche/droite et saut.
-   [ ] Ajouter collisions sol.
-   [ ] Créer états idle, marche, saut (même si la première animation
    est minimale).
-   [ ] Ajouter une commande de changement d'expression.
-   [ ] Tester et documenter les contrôles.

**Critère de sortie :** un build local où Lemegeton peut se déplacer et
sauter sans artefacts majeurs.

## M2 --- Cut-out rig

-   [ ] Corriger les pivots
    cou/épaules/coudes/poignets/hanches/genoux/chevilles.
-   [ ] Vérifier les chevauchements en rotation.
-   [ ] Corriger l'ordre de profondeur.
-   [ ] Ajouter variantes de main comme états remplaçables.
-   [ ] Ajouter les expressions comme états exclusifs.
-   [ ] Tester une animation de salut et une marche simple.

**Critère de sortie :** mouvements lisibles, sans duplication des
membres et sans séparations visuelles grossières.

## M3 --- Compagnon de bureau

-   [ ] Ajouter un mode d'exécution distinct.
-   [ ] Tester fenêtre sans bordure, transparence et always-on-top sous
    Windows.
-   [ ] Déplacer le personnage à la souris.
-   [ ] Ajouter clics/réactions.
-   [ ] Prévoir une manière de quitter et de revenir au mode jeu.
-   [ ] Vérifier si la fenêtre doit recevoir les clics ou les laisser
    traverser lorsqu'elle est inactive.

**Critère de sortie :** compagnon de bureau utilisable sans empêcher
l'utilisation normale de Windows.

## M4 --- Distribution

-   [ ] Configurer export Windows.
-   [ ] Tester sur une session Windows propre.
-   [ ] Rédiger instructions de lancement.
-   [ ] Séparer assets sources, fichiers importés et assets optimisés.
-   [ ] Ajouter captures d'écran uniquement après validation du
    prototype.

------------------------------------------------------------------------

# Inventaire du pack source

Pack de référence : `source_assets/lemegeton_kit_rig_2d_original.zip`

Le ZIP source contient un `manifest_assets.json` avec les dimensions et
chemins des assets. Répartition issue du manifeste :

-   **antenne** : 4 asset(s)
-   **bras** : 5 asset(s)
-   **commandes** : 3 asset(s)
-   **details** : 6 asset(s)
-   **expressions** : 10 asset(s)
-   **jambes** : 5 asset(s)
-   **mains** : 8 asset(s)
-   **pieds** : 6 asset(s)
-   **tete** : 6 asset(s)
-   **torse** : 4 asset(s)

## Liste des assets déclarés

  Chemin                                 Catégorie         Dimensions
  -------------------------------------- ------------- --------------
  `expressions/ecran_neutre.png`         expressions     124 × 118 px
  `expressions/ecran_heureux.png`        expressions     124 × 118 px
  `expressions/ecran_content.png`        expressions     124 × 118 px
  `expressions/ecran_clin_oeil.png`      expressions     124 × 118 px
  `expressions/ecran_joyeux.png`         expressions     126 × 118 px
  `expressions/ecran_surpris.png`        expressions     124 × 122 px
  `expressions/ecran_inquiet.png`        expressions     124 × 122 px
  `expressions/ecran_triste.png`         expressions     124 × 122 px
  `expressions/ecran_determine.png`      expressions     124 × 122 px
  `expressions/ecran_enerve.png`         expressions     126 × 122 px
  `tete/tete_face.png`                   tete            267 × 258 px
  `tete/tete_profil_gauche.png`          tete            174 × 247 px
  `tete/tete_profil_droit.png`           tete            177 × 248 px
  `tete/tete_trois_quarts_gauche.png`    tete            185 × 206 px
  `tete/tete_dos.png`                    tete            217 × 206 px
  `tete/tete_trois_quarts_droit.png`     tete            216 × 206 px
  `antenne/antenne_standard.png`         antenne          85 × 139 px
  `antenne/antenne_signal_grande.png`    antenne         134 × 190 px
  `antenne/antenne_signal_moyenne.png`   antenne          82 × 132 px
  `antenne/antenne_signal_petite.png`    antenne          60 × 100 px
  `details/grille_arriere.png`           details         141 × 125 px
  `details/plaque_nom.png`               details          156 × 87 px
  `details/connectique_arriere.png`      details          155 × 62 px
  `details/panneau_bas.png`              details          127 × 57 px
  `details/vis_rondes.png`               details           78 × 59 px
  `details/petite_plaque.png`            details           97 × 57 px
  `torse/torse_face_clavier.png`         torse           279 × 212 px
  `torse/torse_profil_gauche.png`        torse           153 × 213 px
  `torse/torse_profil_droit.png`         torse           154 × 213 px
  `torse/torse_dos.png`                  torse           259 × 213 px
  `bras/epaule_rotule.png`               bras             89 × 119 px
  `bras/bras_superieur.png`              bras            114 × 105 px
  `bras/bras_inferieur.png`              bras             113 × 96 px
  `bras/poignet.png`                     bras            114 × 115 px
  `bras/bras_extensible_spirale.png`     bras            474 × 100 px
  `mains/main_ouverte.png`               mains             99 × 97 px
  `mains/main_pointee.png`               mains             96 × 97 px
  `mains/main_pouce_haut.png`            mains             96 × 97 px
  `mains/main_pointe.png`                mains            121 × 97 px
  `mains/main_poing.png`                 mains             86 × 94 px
  `mains/main_ok.png`                    mains             96 × 94 px
  `mains/main_grab.png`                  mains            105 × 94 px
  `mains/main_plate.png`                 mains            118 × 94 px
  `jambes/hanche_rotule.png`             jambes           84 × 107 px
  `jambes/cuisse.png`                    jambes           89 × 136 px
  `jambes/genou.png`                     jambes           84 × 112 px
  `jambes/jambe_inferieure.png`          jambes           98 × 136 px
  `jambes/pied_detache.png`              jambes          143 × 121 px
  `pieds/pied_face.png`                  pieds           108 × 112 px
  `pieds/pied_profil.png`                pieds           107 × 106 px
  `pieds/pied_trois_quarts.png`          pieds           111 × 115 px
  `pieds/pied_arriere.png`               pieds           108 × 112 px
  `pieds/pied_vue_haute.png`             pieds            93 × 119 px
  `pieds/semelle.png`                    pieds           106 × 147 px
  `commandes/clavier_detail.png`         commandes       235 × 130 px
  `commandes/boutons_lateraux.png`       commandes        81 × 130 px
  `commandes/touches_fonction.png`       commandes       174 × 110 px

## Règles d'utilisation

-   Le ZIP original est la source canonique ; ne pas modifier son
    contenu.
-   Copier les assets sélectionnés vers le projet Godot sans renommer
    l'original dans l'archive.
-   Conserver les PNG d'expressions comme états exclusifs.
-   Conserver les PNG de mains comme variantes ; une seule variante par
    main visible à la fois.
-   Vérifier visuellement les découpes et transparences avant
    intégration finale.
-   Les fichiers de détails (grilles, vis, plaques, connectique,
    clavier) sont optionnels pour la première version jouable.

## Limites de l'inventaire

La présence d'un fichier dans le manifeste ne garantit pas qu'il soit
immédiatement exploitable pour un rig : certains éléments sont des vues
complètes, d'autres des variantes d'orientation, et certaines découpes
peuvent garder des artefacts. L'inventaire doit être complété par une
validation visuelle dans le prototype.

------------------------------------------------------------------------

# Historique des travaux et livrables antérieurs

Les fichiers ci-dessous sont conservés comme références de travail.
Aucun n'est à considérer comme rig de production validé.

## Source canonique

-   `source_assets/lemegeton_kit_rig_2d_original.zip` : pack transmis
    par l'utilisateur, à traiter comme source de référence et à
    conserver intact.

## Références de travail incluses dans l'archive

-   `reference_artifacts/lemegeton_synfig_starter.zip` : préparation
    pour Synfig, avec PNG placés sur une toile commune, aperçu, document
    OpenRaster et pivots estimés. Gabarit, pas un rig Synfig natif
    final.
-   `reference_artifacts/lemegeton_cutout_rig_v2.zip` : assemblage SVG
    et manifeste de pivots. Prototype d'assemblage, pas un rig final.
-   `reference_artifacts/lemegeton_animation_test.zip` : GIF de salut
    rudimentaire et images de frames. Test visuel seulement.
-   `reference_artifacts/lemegeton_rig_2d_editable.zip` : premier SVG
    d'assemblage éditable, à conserver pour historique.
-   `reference_artifacts/lemegeton_modele_maitre_2d.zip` : première
    composition de référence et overlay de pivots.

## Leçons déjà identifiées

-   Une composition d'assets n'est pas équivalente à un rig animé.
-   Les mains en double étaient un défaut repéré : une seule main par
    bras dans la pose maître.
-   Les pivots des anciens prototypes sont approximatifs.
-   Certaines pièces peuvent contenir des résidus de découpe ou de
    légendes.
-   Le besoin produit a évolué : la cible n'est plus uniquement
    l'animation dans Synfig, mais un personnage jouable et un compagnon
    de bureau.
-   Godot est désormais la voie recommandée pour le runtime. Synfig
    reste optionnel pour des travaux d'animation dédiés.

## À ne pas faire

-   Ne pas utiliser les images de concept générées comme nouvelle source
    graphique.
-   Ne pas présenter les prototypes précédents comme terminés.
-   Ne pas écraser le pack d'origine.
-   Ne pas générer de nouvelles illustrations sans changement explicite
    de consigne.
