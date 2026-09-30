const searchForm = document.querySelector("#destination-search");
const searchInput = document.querySelector("#destination-query");
const searchClearBtn = document.querySelector("#search-clear-btn");
const resultsContainer = document.querySelector("#search-results");
const railItems = [...document.querySelectorAll(".rail-thumb")];
const homeMain = document.querySelector(".home-main");

const sceneImages = {
  petra: "assets/backgrounds/main.png",
  waters: "assets/panoramas/waters-wadi-mujib-360-4k-v3.jpg",
  desert: "assets/images/desert-wadi-rum.jpg",
  nature: "assets/images/nature-ajloun.jpg",
  history: "assets/panoramas/history-petra-360-4k-v3.jpg"
};

// Fallback dataset in case network or offline
const fallbackDestinations = [
  { id: "petra", title: "Petra", titleAr: "البتراء", subtitle: "The Rose-Red City", category: "History", location: "Ma'an, Jordan", image: "assets/panoramas/history-petra-360-preview-v3.jpg", has360: true, rating: "4.9", tags: ["wonder", "siq", "treasury", "الخزنة", "السيق", "عجائب الدنيا", "البترا"], popular: true },
  { id: "wadi-rum", title: "Wadi Rum", titleAr: "وادي رم", subtitle: "Valley of the Moon", category: "Desert", location: "Aqaba, Jordan", image: "assets/images/desert-wadi-rum.jpg", has360: false, rating: "4.9", tags: ["desert", "stars", "camping", "bedouin", "رم", "صحراء", "نجوم", "تخييم"], popular: true },
  { id: "dead-sea", title: "Dead Sea", titleAr: "البحر الميت", subtitle: "The Lowest Point on Earth", category: "Waters", location: "Jordan Valley", image: "assets/panoramas/waters-dead-sea-360-preview-v3.jpg", has360: true, rating: "4.8", tags: ["floating", "salt", "spa", "wellness", "بحر", "طين", "ملح", "ميت"], popular: true },
  { id: "wadi-mujib", title: "Wadi Mujib", titleAr: "وادي الموجب", subtitle: "Jordan's Grand Canyon", category: "Waters", location: "Madaba, Jordan", image: "assets/panoramas/waters-wadi-mujib-360-preview-v3.jpg", has360: true, rating: "4.8", tags: ["canyon", "adventure", "waterfall", "موجب", "شلال", "مغامرة", "سيق"], popular: true },
  { id: "jerash", title: "Jerash", titleAr: "جرش", subtitle: "City of a Thousand Columns", category: "History", location: "Jerash, Jordan", image: "assets/panoramas/history-jerash-360-preview-v3.jpg", has360: true, rating: "4.7", tags: ["roman", "columns", "ruins", "اعمدة", "مدرج", "اثار", "جرش"], popular: true },
  { id: "ajloun", title: "Ajloun Forest & Castle", titleAr: "عجلون (الغابات والقلعة)", subtitle: "Green Highlands & Castle", category: "Nature", location: "Ajloun, Jordan", image: "assets/images/nature-ajloun.jpg", has360: false, rating: "4.7", tags: ["castle", "forest", "green", "cable car", "قلعة", "غابات", "تلفريك", "عجلون"], popular: true },
  { id: "aqaba", title: "Aqaba Red Sea", titleAr: "العقبة (البحر الأحمر)", subtitle: "Coral Reefs & Coastal Breeze", category: "Waters", location: "Aqaba, Jordan", image: "assets/panoramas/waters-aqaba-360-preview-v3.jpg", has360: true, rating: "4.8", tags: ["red sea", "coral", "diving", "beach", "غوص", "مرجان", "شاطئ", "بحر احمر", "العقبة"], popular: true },
  { id: "amman-citadel", title: "Amman Citadel", titleAr: "جبل القلعة (عمّان)", subtitle: "Above the White City", category: "History", location: "Amman, Jordan", image: "assets/panoramas/history-amman-citadel-360-preview-v3.jpg", has360: true, rating: "4.7", tags: ["citadel", "amman", "museum", "عمان", "قلعة", "معبد هرقل", "وسط البلد"], popular: false },
  { id: "dana", title: "Dana Biosphere Reserve", titleAr: "محمية ضانا الطبيعية", subtitle: "Highlands to Araba Desert", category: "Nature", location: "Tafilah, Jordan", image: "assets/images/dana-reserve-v2.jpg", has360: false, rating: "4.9", tags: ["biosphere", "reserve", "hiking", "trails", "ضانا", "محمية", "مسارات"], popular: false },
  { id: "salt", title: "Old Salt", titleAr: "مدينة السلط القديمة", subtitle: "UNESCO Living Heritage", category: "Local Life", location: "Al-Salt, Jordan", image: "assets/images/history-jerash.jpg", has360: false, rating: "4.7", tags: ["unesco", "heritage", "yellow stone", "سلط", "السلط", "تراث", "ضيافة"], popular: false },
  { id: "umm-qais", title: "Umm Qais (Gadara)", titleAr: "أم قيس (جدارا)", subtitle: "Basalt Ruins & Lake View", category: "History", location: "Irbid, Jordan", image: "assets/panoramas/history-umm-qais-360-preview-v3.jpg", has360: true, rating: "4.7", tags: ["gadara", "decapolis", "tiberias", "view", "جدارا", "اربد", "طبريا", "ام قيس"], popular: false },
  { id: "main-hot-springs", title: "Ma'in Hot Springs", titleAr: "حمامات ماعين", subtitle: "Thermal Healing Waterfalls", category: "Wellness", location: "Madaba, Jordan", image: "assets/panoramas/waters-main-hot-springs-360-preview-v3.jpg", has360: true, rating: "4.7", tags: ["hot springs", "thermal", "spa", "waterfall", "ماعين", "شلالات حارة", "ينابيع"], popular: false },
  { id: "wadi-bin-hammad", title: "Wadi Bin Hammad", titleAr: "وادي بن حماد", subtitle: "Hanging Gardens & Streams", category: "Waters", location: "Karak, Jordan", image: "assets/panoramas/waters-bin-hammad-360-preview-v3.jpg", has360: true, rating: "4.7", tags: ["canyon", "pools", "karak", "بن حماد", "الكرك", "حدائق معلقة"], popular: false },
  { id: "mansaf", title: "Mansaf Experience", titleAr: "تجربة المنسف الأردني", subtitle: "Authentic National Dish", category: "Food", location: "Amman, Jordan", image: "assets/images/food-jordanian-table.jpg", has360: false, rating: "4.9", tags: ["mansaf", "food", "jameed", "lamb", "hospitality", "منسف", "جميد", "طعام"], popular: false },
  { id: "bedouin-camp", title: "Bedouin Desert Camp", titleAr: "مخيم بدوي تحت النجوم", subtitle: "Campfire, Stories & Stars", category: "Local Life", location: "Wadi Rum, Jordan", image: "assets/backgrounds/auth-petra-night.jpg", has360: false, rating: "4.9", tags: ["camp", "bedouin", "stars", "tea", "zarb", "مخيم", "بدوي", "سهرة", "نجوم"], popular: false },
  { id: "amman-food", title: "Amman Downtown Food Tour", titleAr: "جولة طعام وسط البلد", subtitle: "Falafel, Knafeh & Souqs", category: "Food", location: "Amman, Jordan", image: "assets/panoramas/amman-market-360-preview-v2.jpg", has360: false, rating: "4.8", tags: ["street food", "falafel", "knafeh", "فلافل", "كنافة", "وسط البلد", "سوق"], popular: false }
];

let localDestinationsCache = null;
let currentResults = [];
let selectedIndex = -1;
let debounceTimer = null;
let activeAbortController = null;

// Normalize Arabic text for robust search comparison
function normalizeAr(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "") // strip tashkeel
    .replace(/[إأآا]/g, "ا")
    .replace(/[ة]/g, "ه")
    .replace(/[يى]/g, "ي")
    .replace(/[ؤ]/g, "و")
    .replace(/[ئ]/g, "ي")
    .trim();
}

function escapeHtml(text) {
  return String(text || "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]);
}

function highlightMatch(text, query) {
  if (!query || !text) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const qNorm = normalizeAr(query);
  const tNorm = normalizeAr(escaped);
  const idx = tNorm.indexOf(qNorm);
  if (idx === -1) return escaped;
  const matchLen = query.length;
  const start = escaped.slice(0, idx);
  const mid = escaped.slice(idx, idx + matchLen);
  const end = escaped.slice(idx + matchLen);
  return `${start}<mark class="search-highlight">${mid}</mark>${end}`;
}

// Client-side scoring algorithm
function scoreDestinations(list, query) {
  if (!query) return list.filter((item) => item.popular);
  const rawLower = query.toLowerCase().trim();
  const arNorm = normalizeAr(query);
  const arWithoutAl = arNorm.replace(/^ال/, "");

  return list
    .map((item) => {
      let score = 0;
      const titleLower = (item.title || "").toLowerCase();
      const titleArNorm = normalizeAr(item.titleAr);
      const titleArNoAl = titleArNorm.replace(/^ال/, "");
      const subLower = (item.subtitle || "").toLowerCase();
      const subArNorm = normalizeAr(item.subtitleAr);
      const catLower = (item.category || "").toLowerCase();
      const locLower = (item.location || "").toLowerCase();

      // Exact matches
      if (titleLower === rawLower || titleArNorm === arNorm) score += 120;
      else if (titleLower.startsWith(rawLower) || titleArNorm.startsWith(arNorm) || (arWithoutAl && titleArNoAl.startsWith(arWithoutAl))) score += 75;
      else if (titleLower.includes(rawLower) || titleArNorm.includes(arNorm) || (arWithoutAl && titleArNoAl.includes(arWithoutAl))) score += 50;

      if (subLower.includes(rawLower) || subArNorm.includes(arNorm)) score += 25;
      if (catLower.includes(rawLower)) score += 30;
      if (locLower.includes(rawLower)) score += 20;

      // 360 search tag
      if (rawLower === "360" || rawLower.includes("vr") || rawLower.includes("بانوراما")) {
        if (item.has360) score += 60;
      }

      // Tag matches
      if (Array.isArray(item.tags)) {
        for (const tag of item.tags) {
          const tagNorm = normalizeAr(tag);
          const tagNoAl = tagNorm.replace(/^ال/, "");
          if (tag.toLowerCase() === rawLower || tagNorm === arNorm) {
            score += 45;
            break;
          } else if (tag.toLowerCase().includes(rawLower) || tagNorm.includes(arNorm) || (arWithoutAl && tagNoAl.includes(arWithoutAl))) {
            score += 30;
            break;
          }
        }
      }

      return { item, score };
    })
    .filter((res) => res.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((res) => res.item);
}

// Smart AJAX destination fetcher with multi-tier fallback
async function fetchDestinations(query) {
  if (activeAbortController) activeAbortController.abort();
  activeAbortController = new AbortController();
  const { signal } = activeAbortController;

  // 1. Try real server AJAX endpoint
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.results)) {
        return data.results;
      }
    }
  } catch (err) {
    if (err.name === "AbortError") throw err;
  }

  // 2. Fallback: load static data/destinations.json once if not already cached
  if (!localDestinationsCache) {
    try {
      const jsonRes = await fetch("data/destinations.json", { signal });
      if (jsonRes.ok) {
        localDestinationsCache = await jsonRes.json();
      }
    } catch {
      localDestinationsCache = fallbackDestinations;
    }
  }

  const dataset = Array.isArray(localDestinationsCache) && localDestinationsCache.length ? localDestinationsCache : fallbackDestinations;
  return scoreDestinations(dataset, query);
}

function renderResults(places, query) {
  currentResults = places;
  selectedIndex = -1;

  if (!places.length) {
    resultsContainer.innerHTML = `
      <div class="search-no-results">
        <div class="search-no-results__icon" aria-hidden="true">🔍</div>
        <p class="search-no-results__text"><span>No places found matching</span> “<strong>${escapeHtml(query)}</strong>”</p>
        <div class="search-no-results__suggestions">
          <span class="search-suggestions-label">Explore popular spots instead:</span>
          <button type="button" class="search-pill-btn" data-query="Petra">Petra (البتراء)</button>
          <button type="button" class="search-pill-btn" data-query="Wadi Rum">Wadi Rum (وادي رم)</button>
          <button type="button" class="search-pill-btn" data-query="Dead Sea">Dead Sea (البحر الميت)</button>
          <button type="button" class="search-pill-btn" data-query="جرش">جرش</button>
          <button type="button" class="search-pill-btn" data-query="عجلون">عجلون</button>
        </div>
      </div>
      <div class="search-results__footer">
        <a class="search-explore-link" href="explore">
          <span>Explore all destinations</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>
        </a>
      </div>
    `;
    resultsContainer.classList.add("is-visible");
    searchInput?.setAttribute("aria-expanded", "true");
    attachPillListeners();
    return;
  }

  const isPopular = !query;
  const headerTitle = isPopular ? "Trending in Jordan" : `Found ${places.length} matching ${places.length === 1 ? "place" : "places"}`;

  const itemsHtml = places
    .map((place, index) => {
      const catClass = (place.category || "all").toLowerCase().replace(/[^a-z]/g, "");
      const highlightedTitle = highlightMatch(place.title, query);
      const highlightedTitleAr = highlightMatch(place.titleAr, query);

      return `
        <a class="search-item" href="destination?id=${encodeURIComponent(place.id)}" role="option" id="search-opt-${index}" data-index="${index}" data-id="${escapeHtml(place.id)}">
          <div class="search-item__thumb-wrap">
            <img class="search-item__thumb" src="${escapeHtml(place.image)}" alt="" loading="lazy">
            ${place.has360 ? '<span class="search-item__vr-badge" title="360° Virtual Tour Available">360°</span>' : ""}
          </div>
          <div class="search-item__info">
            <div class="search-item__title-row">
              <span class="search-item__title">${highlightedTitle}</span>
              ${place.titleAr ? `<span class="search-item__title-ar">${highlightedTitleAr}</span>` : ""}
            </div>
            <div class="search-item__meta-row">
              <span class="search-item__tag search-item__tag--${catClass}">${escapeHtml(place.category || "Explore")}</span>
              <span class="search-item__location">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                ${escapeHtml(place.location || "Jordan")}
              </span>
              <span class="search-item__rating">★ ${escapeHtml(place.rating || "4.8")}</span>
            </div>
          </div>
          <div class="search-item__action" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>
          </div>
        </a>
      `;
    })
    .join("");

  resultsContainer.innerHTML = `
    <div class="search-results__header">
      <span>${escapeHtml(headerTitle)}</span>
      <span class="search-results__count">${places.length} ${places.length === 1 ? "destination" : "destinations"}</span>
    </div>
    <div class="search-results__list">
      ${itemsHtml}
    </div>
    <div class="search-results__footer">
      <a class="search-explore-link" href="explore${query ? `?category=${encodeURIComponent(query)}` : ""}">
        <span>Browse all destinations in Explore</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>
      </a>
    </div>
  `;

  resultsContainer.classList.add("is-visible");
  searchInput?.setAttribute("aria-expanded", "true");
}

function attachPillListeners() {
  const pills = resultsContainer.querySelectorAll(".search-pill-btn");
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const q = pill.dataset.query;
      if (searchInput) {
        searchInput.value = q;
        searchInput.focus();
        handleLiveSearch(q);
      }
    });
  });
}

function hideResults() {
  resultsContainer?.classList.remove("is-visible");
  searchInput?.setAttribute("aria-expanded", "false");
  selectedIndex = -1;
}

function updateSelection(newIndex) {
  const items = resultsContainer.querySelectorAll(".search-item");
  if (!items.length) return;

  items.forEach((item) => item.classList.remove("is-selected"));

  if (newIndex >= items.length) newIndex = 0;
  if (newIndex < 0) newIndex = items.length - 1;

  selectedIndex = newIndex;
  const activeItem = items[selectedIndex];
  if (activeItem) {
    activeItem.classList.add("is-selected");
    activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
    searchInput?.setAttribute("aria-activedescendant", activeItem.id);
  }
}

async function handleLiveSearch(query) {
  // Toggle clear button
  if (searchClearBtn) {
    searchClearBtn.hidden = !query;
  }

  try {
    const places = await fetchDestinations(query);
    renderResults(places, query);
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Search fetch error:", err);
    }
  }
}

// Input event listener with debounce
searchInput?.addEventListener("input", (event) => {
  const query = event.target.value.trim();
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    handleLiveSearch(query);
  }, 120);
});

// Show options on focus
searchInput?.addEventListener("focus", () => {
  const query = searchInput.value.trim();
  handleLiveSearch(query);
});

// Clear button
searchClearBtn?.addEventListener("click", () => {
  if (searchInput) {
    searchInput.value = "";
    searchClearBtn.hidden = true;
    searchInput.focus();
    handleLiveSearch("");
  }
});

function isAuth() {
  return Boolean(
    localStorage.getItem("hawaCurrentUserId") ||
    localStorage.getItem("hawaLocalUser")
  );
}

function navigateWithAuthCheck(targetUrl) {
  if (!isAuth()) {
    window.location.assign(`login?redirect=${encodeURIComponent(targetUrl)}`);
    return;
  }
  window.location.assign(targetUrl);
}

// Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
searchInput?.addEventListener("keydown", (event) => {
  const isVisible = resultsContainer?.classList.contains("is-visible");

  if (event.key === "Escape") {
    hideResults();
    return;
  }

  if (event.key === "ArrowDown") {
    if (!isVisible) {
      handleLiveSearch(searchInput.value.trim());
      return;
    }
    event.preventDefault();
    updateSelection(selectedIndex + 1);
  } else if (event.key === "ArrowUp") {
    if (!isVisible) return;
    event.preventDefault();
    updateSelection(selectedIndex - 1);
  } else if (event.key === "Enter") {
    if (isVisible && selectedIndex >= 0 && currentResults[selectedIndex]) {
      event.preventDefault();
      navigateWithAuthCheck(`destination?id=${encodeURIComponent(currentResults[selectedIndex].id)}`);
    } else if (isVisible && currentResults.length > 0) {
      event.preventDefault();
      navigateWithAuthCheck(`destination?id=${encodeURIComponent(currentResults[0].id)}`);
    }
  }
});

// Form submit handler
searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();

  if (currentResults.length > 0) {
    const target = selectedIndex >= 0 ? currentResults[selectedIndex] : currentResults[0];
    navigateWithAuthCheck(`destination?id=${encodeURIComponent(target.id)}`);
    return;
  }

  if (!query) {
    searchInput.focus();
    handleLiveSearch("");
    return;
  }

  navigateWithAuthCheck(`explore?q=${encodeURIComponent(query)}`);
});

// Dismiss dropdown when clicking outside
document.addEventListener("click", (event) => {
  if (!searchForm?.contains(event.target) && !resultsContainer?.contains(event.target)) {
    hideResults();
  }
});

// Rail scene switcher
railItems.forEach((item) => {
  item.addEventListener("click", () => {
    railItems.forEach((button) => {
      button.classList.remove("is-active");
      button.removeAttribute("aria-current");
    });
    item.classList.add("is-active");
    item.setAttribute("aria-current", "true");
    const image = sceneImages[item.dataset.scene];
    if (image && homeMain) homeMain.style.backgroundImage = `url("${image}")`;
  });
});
