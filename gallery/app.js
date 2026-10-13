const cards = [
  { id: "concept-board", image: "assets/concept-board.webp", category: "concept", label: "Planche de conception", title: "Un Minitel plein de caractère", description: "Vues, proportions et détails d’un premier univers: coque bois, clavier incliné, écran cathodique et antenne signal.", wide: true },
  { id: "concept-crt", image: "assets/concept-crt.webp", category: "concept", label: "Concept art", title: "Le petit poste", description: "Une piste de silhouette compacte, pensée autour du tube cathodique." },
  { id: "concept-greeting", image: "assets/concept-greeting.webp", category: "concept", label: "Concept art", title: "Salut, Minitel", description: "La pose qui donne au personnage sa présence et son geste d’accueil." },
  { id: "concept-metal-wood", image: "assets/concept-metal-wood.webp", category: "concept", label: "Concept art", title: "Bois patiné & métal", description: "Une recherche de matières entre objet domestique et petit robot mécanique." },
  { id: "concept-orange", image: "assets/concept-orange.webp", category: "concept", label: "Concept art", title: "Des mains articulées", description: "Une variante qui explore les gestes et l’expressivité des mains." },
  { id: "technical-chibi-variant", image: "assets/technical-chibi-variant.webp", category: "reference", label: "Fiche technique", title: "Proportions chibi · variante", description: "Étude de face, profil et dos, avec notes de construction et palette." },
  { id: "technical-chibi", image: "assets/technical-chibi.webp", category: "reference", label: "Fiche technique", title: "Proportions chibi", description: "Une planche de proportions et de détails destinée à guider la modélisation." },
  { id: "technical-modular", image: "assets/technical-modular.webp", category: "reference", label: "Fiche technique", title: "Version modulaire", description: "Une autre interprétation du corps, des accessoires et des articulations." },
  { id: "storyboard", image: "assets/storyboard.webp", category: "reference", label: "Storyboard", title: "Le salut en quelques images", description: "Storyboard cinématographique qui esquisse le rythme du personnage.", wide: true },
  { id: "model-master", image: "assets/model-master.webp", category: "atelier", label: "Étude 3D · volume", title: "La forme sans texture", description: "Vue frontale d’un mesh de travail pour lire la silhouette et les volumes." },
  { id: "model-textured", image: "assets/model-textured.webp", category: "atelier", label: "Étude 3D · matière", title: "La coque bois", description: "Rendu de comparaison avec textures. Image d’étude aplatie; le modèle source n’est pas diffusé." },
  { id: "model-sample", image: "assets/model-sample.webp", category: "atelier", label: "Étude 3D · variante", title: "Une autre génération", description: "Variante de comparaison conservée dans les archives de modélisation." },
];

const grid = document.querySelector("#gallery-grid");
const emptyState = document.querySelector("#empty-state");
const filters = [...document.querySelectorAll("[data-filter]")];
const dialog = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxDescription = document.querySelector("#lightbox-description");
const lightboxCategory = document.querySelector("#lightbox-category");
let visibleCards = cards;
let activeIndex = 0;
let lastTrigger = null;

function renderCards() {
  grid.replaceChildren();
  for (const [index, card] of visibleCards.entries()) {
    const article = document.createElement("article");
    article.className = `art-card${card.wide ? " is-wide" : ""}`;
    article.dataset.category = card.category;
    article.style.animationDelay = `${Math.min(index * 35, 210)}ms`;
    const button = document.createElement("button");
    button.className = "art-card__open";
    button.type = "button";
    button.setAttribute("aria-label", `Agrandir : ${card.title}`);
    const imageBox = document.createElement("span");
    imageBox.className = "art-card__image";
    const image = document.createElement("img");
    image.src = card.image;
    image.alt = card.description;
    image.loading = index < 3 ? "eager" : "lazy";
    image.decoding = "async";
    const zoom = document.createElement("span");
    zoom.className = "art-card__zoom";
    zoom.setAttribute("aria-hidden", "true");
    zoom.textContent = "↗";
    imageBox.append(image, zoom);
    const meta = document.createElement("span");
    meta.className = "art-card__meta";
    const text = document.createElement("span");
    const category = document.createElement("span");
    category.className = "art-card__category";
    category.textContent = card.label;
    const title = document.createElement("span");
    title.className = "art-card__title";
    title.textContent = card.title;
    text.append(category, title);
    const number = document.createElement("span");
    number.className = "art-card__index";
    number.textContent = String(cards.indexOf(card) + 1).padStart(2, "0");
    meta.append(text, number);
    button.append(imageBox, meta);
    button.addEventListener("click", () => openViewer(card, index, button));
    article.append(button);
    grid.append(article);
  }
  emptyState.hidden = visibleCards.length > 0;
}

function setFilter(filter) {
  visibleCards = filter === "all" ? cards : cards.filter((card) => card.category === filter);
  for (const button of filters) {
    const active = button.dataset.filter === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  }
  renderCards();
}

function showCard(card, index) {
  activeIndex = index;
  lightboxImage.src = `./${card.image}`;
  lightboxImage.alt = card.description;
  lightboxTitle.textContent = card.title;
  lightboxDescription.textContent = card.description;
  lightboxCategory.textContent = card.label;
}

function openViewer(card, index, trigger) {
  lastTrigger = trigger;
  showCard(card, index);
  dialog.showModal();
}

function moveViewer(direction) {
  if (!visibleCards.length) return;
  const next = (activeIndex + direction + visibleCards.length) % visibleCards.length;
  showCard(visibleCards[next], next);
}

for (const button of filters) button.addEventListener("click", () => setFilter(button.dataset.filter));
dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
dialog.querySelector("[data-previous]").addEventListener("click", () => moveViewer(-1));
dialog.querySelector("[data-next]").addEventListener("click", () => moveViewer(1));
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener("close", () => lastTrigger?.focus());
dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveViewer(-1);
  if (event.key === "ArrowRight") moveViewer(1);
});

renderCards();
