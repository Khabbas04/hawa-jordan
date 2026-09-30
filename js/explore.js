const categories = {
  all: {
    number: "01", kicker: "Jordan in every mood", title: ["Feel", "Everything"], description: "Move from ancient cities to wild landscapes,\nand find the Jordan that speaks to you.", cta: "Explore Jordan", image: "assets/backgrounds/main.png", position: "center", accent: "#d9b16f",
    destinations: [
      ["petra", "Petra", "History", "assets/panoramas/history-petra-360-preview-v3.jpg"],
      ["wadi-rum", "Wadi Rum", "Desert", "assets/images/desert-wadi-rum.jpg"],
      ["wadi-mujib", "Wadi Mujib", "Waters · 360°", "assets/panoramas/waters-wadi-mujib-360-preview-v3.jpg"],
      ["jerash", "Jerash", "History", "assets/panoramas/history-jerash-360-preview-v3.jpg"],
      ["ajloun", "Ajloun", "Nature", "assets/images/nature-ajloun.jpg"]
    ]
  },
  desert: {
    number: "02", kicker: "Desert & Silence", title: ["Desert", "Silence"], description: "Follow the stillness of Jordan's open desert,\nwhere every horizon feels infinite.", cta: "Explore Deserts", image: "assets/images/desert-wadi-rum.jpg", position: "center", accent: "#e4aa58",
    destinations: [
      ["wadi-rum", "Wadi Rum", "Desert", "assets/images/desert-wadi-rum.jpg"],
      ["wadi-rum-sunset", "Sunset Point", "Wadi Rum", "assets/backgrounds/now-wadi-rum-sunset.png"],
      ["bedouin-camp", "Bedouin Camp", "Local Life", "assets/backgrounds/auth-petra-night.jpg"],
      ["little-petra", "Little Petra", "History", "assets/backgrounds/main.png"]
    ]
  },
  waters: {
    number: "03", kicker: "Jordan Beyond\nThe Ordinary", title: ["Roaring", "Waters"], description: "Dive into Jordan's hidden waters,\nwhere nature comes alive.", cta: "Explore Waters", image: "assets/panoramas/waters-wadi-mujib-360-4k-v3.jpg", position: "center", accent: "#9be9ee",
    destinations: [
      ["wadi-mujib", "Wadi Mujib", "Canyons · 360°", "assets/panoramas/waters-wadi-mujib-360-preview-v3.jpg"],
      ["dead-sea", "Dead Sea", "Float & Relax · 360°", "assets/panoramas/waters-dead-sea-360-preview-v3.jpg"],
      ["wadi-bin-hammad", "Wadi Bin Hammad", "Natural Pools · 360°", "assets/panoramas/waters-bin-hammad-360-preview-v3.jpg"],
      ["main-hot-springs", "Ma'in Hot Springs", "Thermal Falls · 360°", "assets/panoramas/waters-main-hot-springs-360-preview-v3.jpg"],
      ["aqaba", "Aqaba", "Red Sea Reef · 360°", "assets/panoramas/waters-aqaba-360-preview-v3.jpg"]
    ]
  },
  history: {
    number: "04", kicker: "Stories in Stone", title: ["Echoes of", "History"], description: "Walk through cities shaped by civilizations,\nand hear the stories held in every stone.", cta: "Explore History", image: "assets/panoramas/history-jerash-360-4k-v3.jpg", position: "center", accent: "#d9b16f",
    destinations: [
      ["petra", "Petra", "Nabataean · 360°", "assets/panoramas/history-petra-360-preview-v3.jpg"],
      ["jerash", "Jerash", "Roman · 360°", "assets/panoramas/history-jerash-360-preview-v3.jpg"],
      ["amman-citadel", "Amman Citadel", "Ancient Amman · 360°", "assets/panoramas/history-amman-citadel-360-preview-v3.jpg"],
      ["umm-qais", "Umm Qais", "Decapolis · 360°", "assets/panoramas/history-umm-qais-360-preview-v3.jpg"]
    ]
  },
  food: {
    number: "05", kicker: "Shared at the Table", title: ["Local", "Flavors"], description: "Taste recipes carried through generations,\nand hospitality that makes every guest family.", cta: "Taste Jordan", image: "assets/images/food-jordanian-table.jpg", position: "center", accent: "#e3a866",
    destinations: [
      ["mansaf", "Mansaf Experience", "Traditional", "assets/images/food-jordanian-table.jpg"],
      ["amman-food", "Amman Food Walk", "Street Food", "assets/panoramas/amman-market-360-preview-v2.jpg"],
      ["bedouin-dinner", "Bedouin Dinner", "Wadi Rum", "assets/panoramas/bedouin-table-360-preview-v2.jpg"],
      ["jerash-kitchen", "Local Kitchen", "Jerash", "assets/images/jerash-local-kitchen-v2.jpg"]
    ]
  },
  nature: {
    number: "06", kicker: "Wild & Green", title: ["Green", "Landscapes"], description: "Breathe in forested highlands and quiet trails,\nfar beyond Jordan's desert horizon.", cta: "Explore Nature", image: "assets/images/nature-ajloun.jpg", position: "center", accent: "#a8c286",
    destinations: [
      ["ajloun", "Ajloun Forest", "Highlands", "assets/images/nature-ajloun.jpg"],
      ["dana", "Dana Reserve", "Biosphere", "assets/images/dana-reserve-v2.jpg"],
      ["dibbeen", "Dibbeen Forest", "Nature", "assets/panoramas/ajloun-360-preview-v2.jpg"],
      ["wadi-mujib", "Wadi Mujib", "Canyon", "assets/panoramas/waters-wadi-mujib-360-preview-v3.jpg"]
    ]
  },
  local: {
    number: "07", kicker: "People & Place", title: ["Local", "Life"], description: "Meet the people whose warmth and stories\nturn a visit into a lasting connection.", cta: "Meet Jordan", image: "assets/backgrounds/auth-petra-night.jpg", position: "center", accent: "#efbd76",
    destinations: [
      ["bedouin-camp", "Bedouin Camp", "Wadi Rum", "assets/backgrounds/auth-petra-night.jpg"],
      ["salt", "Old Salt", "Community", "assets/images/history-jerash.jpg"],
      ["umm-qais", "Umm Qais Village", "Local Life", "assets/images/nature-ajloun.jpg"],
      ["amman-market", "Amman Markets", "City Life", "assets/images/food-jordanian-table.jpg"]
    ]
  }
};

const navCategories = [
  ["desert", "Desert"], ["waters", "Waters"], ["history", "History"],
  ["food", "Food"], ["nature", "Nature"], ["local", "Local Life"]
];

const immersiveScenes = {
  history: {
    petra: "history",
    jerash: "history-jerash",
    "amman-citadel": "history-amman-citadel",
    "umm-qais": "history-umm-qais"
  },
  waters: {
    "wadi-mujib": "waters",
    "dead-sea": "waters-dead-sea",
    "wadi-bin-hammad": "waters-bin-hammad",
    "main-hot-springs": "waters-main-hot-springs",
    aqaba: "waters-aqaba"
  }
};

const categoryIcons = {
  all: '<svg aria-hidden="true" viewBox="0 0 32 32"><rect x="5" y="5" width="8" height="8" rx="1"/><rect x="19" y="5" width="8" height="8" rx="1"/><rect x="5" y="19" width="8" height="8" rx="1"/><rect x="19" y="19" width="8" height="8" rx="1"/></svg>',
  desert: '<svg aria-hidden="true" viewBox="0 0 32 32"><path d="M3 27 12 9l5 9 4-6 8 15M7 27l7-9 5 7 3-4 4 6"/></svg>',
  waters: '<svg aria-hidden="true" viewBox="0 0 32 32"><path d="M3 9c4 0 4 3 8 3s4-3 8-3 4 3 8 3M3 16c4 0 4 3 8 3s4-3 8-3 4 3 8 3M3 23c4 0 4 3 8 3s4-3 8-3 4 3 8 3"/></svg>',
  history: '<svg aria-hidden="true" viewBox="0 0 32 32"><path d="M4 28h24M7 25h18M9 10h14v15H9zM6 8h20L16 3 6 8ZM13 10v15m6-15v15"/></svg>',
  food: '<svg aria-hidden="true" viewBox="0 0 32 32"><path d="M8 3v10m-3-10v6c0 3 6 3 6 0V3M8 13v16M23 3c-4 5-4 11 0 14v12M23 3v14"/></svg>',
  nature: '<svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16 29V15m0 7C8 20 5 14 7 5c7 1 10 6 9 12m1 5c7-3 10-9 8-18-7 2-10 7-9 14"/></svg>',
  local: '<svg aria-hidden="true" viewBox="0 0 32 32"><circle cx="16" cy="9" r="4"/><circle cx="7" cy="13" r="3"/><circle cx="25" cy="13" r="3"/><path d="M9 27v-3a7 7 0 0 1 14 0v3M2 27v-2a5 5 0 0 1 7-5m21 7v-2a5 5 0 0 0-7-5"/></svg>'
};

const main = document.querySelector(".explore-main");
const categoryNav = document.querySelector("#category-navigation");
const categorySelect = document.querySelector("#category-select");
const destinationList = document.querySelector("#destination-list");
const backdrop = document.querySelector("#explore-backdrop");
const nextBackdrop = document.querySelector("#explore-backdrop-next");
const status = document.querySelector("#explore-status");
const title = document.querySelector("#explore-title");
const description = document.querySelector("#explore-description");
const kicker = document.querySelector("#category-kicker");
const cta = document.querySelector("#explore-cta");
const categoryNumber = document.querySelector("#category-number");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let currentKey = categories[new URLSearchParams(location.search).get("category")]
  ? new URLSearchParams(location.search).get("category")
  : "waters";
let transitionId = 0;
let dragging = false;
let activePointerId = null;
let dragStartX = 0;
let dragStartScroll = 0;
let dragDistance = 0;
let suppressCardClick = false;

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

function preloadImage(source) {
  return new Promise((resolve) => {
    const image = new Image();
    const done = () => resolve();
    image.addEventListener("load", done, { once: true });
    image.addEventListener("error", done, { once: true });
    image.src = source;
    if (image.complete) resolve();
    window.setTimeout(resolve, 1200);
  });
}

function renderNavigation() {
  categoryNav.innerHTML = navCategories.map(([key, label]) => `
    <a class="category-link${key === currentKey ? " is-active" : ""}"
       href="explore?category=${key}"
       data-category="${key}"
       ${key === currentKey ? 'aria-current="page"' : ""}>
      <span class="category-icon">${categoryIcons[key]}</span>
      <span>${label}</span>
    </a>`).join("");
  const activeLink = categoryNav.querySelector('[aria-current="page"]');
  const rail = categoryNav.closest(".category-rail");
  if (activeLink && rail && rail.scrollWidth > rail.clientWidth) {
    rail.scrollTo({ left: activeLink.offsetLeft - (rail.clientWidth - activeLink.offsetWidth) / 2, behavior: reduceMotion ? "auto" : "smooth" });
  }
}

function renderDestinations(category) {
  destinationList.innerHTML = category.destinations.map(([id, name, label, image], index) => {
    const scene = immersiveScenes[currentKey]?.[id] || null;
    const href = scene
      ? `experience360?scene=${encodeURIComponent(scene)}`
      : `destination?id=${encodeURIComponent(id)}`;
    const actionLabel = scene ? `Open ${name} 360 degree view` : `Open ${name} details`;
    return `
    <a class="destination-card${index === 0 ? " is-featured" : ""}"
       href="${href}"
       data-destination-id="${id}"
       aria-label="${actionLabel}"
       style="--card-order:${index}">
      <img src="${image}" alt="${name}" loading="${index < 2 ? "eager" : "lazy"}" draggable="false">
      <span class="destination-card-content">
        <h3>${name}</h3>
        <span>${label}</span>
        <small>View place</small>
        <b class="destination-card-arrow" aria-hidden="true">→</b>
      </span>
    </a>`;
  }).join("");
  destinationList.scrollTo({ left: 0, behavior: "auto" });
  window.requestAnimationFrame(updateCarouselControls);
}

function updateContent(key) {
  const category = categories[key];
  currentKey = key;
  categorySelect.value = key === "all" ? "history" : key;
  main.style.setProperty("--category-accent", category.accent);
  kicker.innerHTML = category.kicker.replace("\n", "<br>");
  title.innerHTML = `${category.title[0]}<br><em>${category.title[1]}</em>`;
  description.innerHTML = category.description.replace("\n", "<br>");
  cta.querySelector("span").textContent = `See ${category.destinations[0][1]}`;
  categoryNumber.textContent = category.number;
  renderDestinations(category);
  renderNavigation();
  document.title = `${category.title.join(" ")} — Hawa Jordan`;
}

async function selectCategory(key, { pushHistory = true, animate = true, announce = true } = {}) {
  if (!categories[key] || (key === currentKey && animate)) return;
  const category = categories[key];
  const requestId = ++transitionId;
  main.setAttribute("aria-busy", "true");
  await preloadImage(category.image);
  if (requestId !== transitionId) return;

  if (!animate || reduceMotion) {
    backdrop.style.backgroundImage = `url("${category.image}")`;
    backdrop.style.backgroundPosition = category.position;
    updateContent(key);
  } else {
    nextBackdrop.style.backgroundImage = `url("${category.image}")`;
    nextBackdrop.style.backgroundPosition = category.position;
    main.classList.add("is-background-swapping", "is-leaving");
    await wait(260);
    if (requestId !== transitionId) return;
    updateContent(key);
    main.classList.remove("is-leaving");
    main.classList.add("is-entering");
    await wait(620);
    if (requestId !== transitionId) return;
    backdrop.style.backgroundImage = `url("${category.image}")`;
    backdrop.style.backgroundPosition = category.position;
    main.classList.remove("is-background-swapping", "is-entering");
    nextBackdrop.style.backgroundImage = "";
  }

  if (pushHistory) {
    const url = new URL(location.href);
    url.searchParams.set("category", key);
    history.pushState({ category: key }, "", url);
  }
  if (announce) status.textContent = `${category.title.join(" ")} category loaded. ${category.destinations.length} places available.`;
  main.removeAttribute("aria-busy");
}

categoryNav.addEventListener("click", (event) => {
  const link = event.target.closest("[data-category]");
  if (!link) return;
  event.preventDefault();
  selectCategory(link.dataset.category);
});

categoryNav.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  const links = [...categoryNav.querySelectorAll("[data-category]")];
  const current = links.indexOf(document.activeElement);
  if (current < 0) return;
  event.preventDefault();
  const step = event.key === "ArrowRight" ? 1 : -1;
  links[(current + step + links.length) % links.length].focus();
});

categorySelect.addEventListener("change", () => selectCategory(categorySelect.value));

cta.addEventListener("click", () => {
  const [id] = categories[currentKey].destinations[0];
  window.location.href = `destination?id=${encodeURIComponent(id)}`;
});

document.querySelector('[data-experience="virtual"]').addEventListener("click", () => {
  status.textContent = `Opening the ${categories[currentKey].title.join(" ")} 360° sensory experience…`;
  document.body.classList.add("is-page-leaving");
  window.setTimeout(() => {
    const scene = currentKey === "all" ? "history" : currentKey;
    window.location.href = `experience360?scene=${encodeURIComponent(scene)}`;
  }, reduceMotion ? 0 : 260);
});

const carouselButtons = [...document.querySelectorAll("[data-scroll-direction]")];
function updateCarouselControls() {
  const leftButton = carouselButtons.find((button) => button.dataset.scrollDirection === "left");
  const rightButton = carouselButtons.find((button) => button.dataset.scrollDirection === "right");
  if (leftButton) leftButton.disabled = destinationList.scrollLeft <= 2;
  if (rightButton) rightButton.disabled = false;
}

carouselButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.scrollDirection === "right" ? 1 : -1;
    const max = Math.max(0, destinationList.scrollWidth - destinationList.clientWidth - 2);
    if (direction === 1 && destinationList.scrollLeft >= max - 2) {
      const keys = navCategories.map(([key]) => key);
      selectCategory(keys[(keys.indexOf(currentKey) + 1) % keys.length]);
      return;
    }
    destinationList.scrollBy({ left: direction * Math.min(460, destinationList.clientWidth * .88), behavior: reduceMotion ? "auto" : "smooth" });
  });
});
destinationList.addEventListener("scroll", updateCarouselControls, { passive: true });

destinationList.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  activePointerId = event.pointerId;
  dragging = false;
  dragDistance = 0;
  suppressCardClick = false;
  dragStartX = event.clientX;
  dragStartScroll = destinationList.scrollLeft;
});
destinationList.addEventListener("pointermove", (event) => {
  if (event.pointerId !== activePointerId) return;
  const delta = event.clientX - dragStartX;
  dragDistance = Math.max(dragDistance, Math.abs(delta));
  if (dragDistance > 12 && !dragging) {
    dragging = true;
    destinationList.setPointerCapture(event.pointerId);
  }
  if (dragging) destinationList.scrollLeft = dragStartScroll - delta;
});
destinationList.addEventListener("pointerup", (event) => {
  if (event.pointerId !== activePointerId) return;
  suppressCardClick = dragging;
  if (destinationList.hasPointerCapture(event.pointerId)) destinationList.releasePointerCapture(event.pointerId);
  activePointerId = null;
  dragging = false;
  window.setTimeout(() => { suppressCardClick = false; }, 0);
});
destinationList.addEventListener("pointercancel", (event) => {
  if (event.pointerId !== activePointerId) return;
  suppressCardClick = dragging;
  if (destinationList.hasPointerCapture(event.pointerId)) destinationList.releasePointerCapture(event.pointerId);
  activePointerId = null;
  dragging = false;
  window.setTimeout(() => { suppressCardClick = false; }, 0);
});
destinationList.addEventListener("click", (event) => {
  const card = event.target.closest(".destination-card");
  if (!card) return;
  if (suppressCardClick) {
    event.preventDefault();
    suppressCardClick = false;
    return;
  }

  event.preventDefault();
  card.classList.add("is-opening");
  status.textContent = `Opening ${card.querySelector("h3").textContent}…`;
  window.setTimeout(() => window.location.assign(card.href), reduceMotion ? 0 : 170);
});

window.addEventListener("popstate", () => {
  const key = new URLSearchParams(location.search).get("category");
  selectCategory(categories[key] ? key : "waters", { pushHistory: false });
});

const initialCategory = categories[currentKey];
backdrop.style.backgroundImage = `url("${initialCategory.image}")`;
backdrop.style.backgroundPosition = initialCategory.position;
updateContent(currentKey);
