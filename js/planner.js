const A = "assets/images/";

function isArabic() {
  const stored = localStorage.getItem("hawaLanguage");
  if (stored) return stored === "ar";
  return document.documentElement.lang === "ar" || document.documentElement.dir === "rtl";
}

function place(title, subtitle, file, location, duration, hours, interests, x, y, description, extras) {
  return customPlace(title, subtitle, `${A}${file}`, location, duration, hours, interests, x, y, description, [`${A}${file}`, ...extras.map(name => `${A}${name}`)]);
}
function customPlace(title, subtitle, image, location, duration, hours, interests, x, y, description, gallery) {
  return { title, subtitle, image, location, duration, hours, interests, x, y, description, gallery, rating: 4.6 + Math.min(.4, interests.length / 10) };
}

const places = {
  amman: place("Amman", "City Culture & Food", "food-jordanian-table.jpg", "Amman, Jordan", "6–8 Hours", 7, ["food", "history", "local"], 48, 32, "Meet Jordan through its lively capital: hilltop ruins, creative neighborhoods, busy souqs and a table made for sharing.", ["history-jerash.jpg", "nature-ajloun.jpg"]),
  jerash: place("Jerash", "Roman Heritage", "history-jerash.jpg", "Jerash, Jordan", "4–6 Hours", 5, ["history", "local"], 44, 39, "Walk colonnaded streets, grand plazas and temples in one of the best-preserved Roman cities in the world.", ["nature-ajloun.jpg", "food-jordanian-table.jpg"]),
  ajloun: place("Ajloun", "Forest & Castle", "nature-ajloun.jpg", "Ajloun, Jordan", "5–7 Hours", 6, ["nature", "history", "adventure"], 38, 34, "Hike through evergreen highlands and climb a medieval castle for wide views across Jordan's green north.", ["history-jerash.jpg", "wadi-bin-hammad-pools.jpg"]),
  "umm-qais": place("Umm Qais", "Ruins & Valley Views", "history-jerash.jpg", "Irbid, Jordan", "4–5 Hours", 4.5, ["history", "nature", "local"], 30, 24, "Explore black-basalt ruins, village life and panoramic views over the Jordan Valley and Sea of Galilee.", ["nature-ajloun.jpg", "dead-sea-sunset.jpg"]),
  salt: place("Old Salt", "Living Heritage", "history-jerash.jpg", "Al-Salt, Jordan", "3–5 Hours", 4, ["local", "food", "history"], 39, 45, "Follow golden-stone lanes through a welcoming city known for shared traditions, old homes and warm hospitality.", ["food-jordanian-table.jpg", "nature-ajloun.jpg"]),
  "dead-sea": customPlace("Dead Sea", "Relax & Rejuvenate", "assets/panoramas/waters-dead-sea-360-preview-v3.jpg", "Jordan Valley", "4–6 Hours", 5, ["wellness", "nature"], 37, 54, "Float effortlessly in mineral-rich water and watch the sunset from the lowest point on Earth.", ["assets/panoramas/waters-dead-sea-360-preview-v3.jpg", "assets/panoramas/waters-main-hot-springs-360-preview-v3.jpg", "assets/panoramas/waters-wadi-mujib-360-preview-v3.jpg"]),
  "wadi-mujib": customPlace("Wadi Mujib", "Canyon Adventure", "assets/panoramas/waters-wadi-mujib-360-preview-v3.jpg", "Madaba, Jordan", "4–6 Hours", 5, ["adventure", "nature"], 42, 60, "Follow cool water through towering sandstone walls on one of Jordan's most exhilarating canyon trails.", ["assets/panoramas/waters-wadi-mujib-360-preview-v3.jpg", "assets/panoramas/waters-bin-hammad-360-preview-v3.jpg", "assets/panoramas/waters-dead-sea-360-preview-v3.jpg"]),
  "wadi-bin-hammad": customPlace("Wadi Bin Hammad", "Living Canyon", "assets/panoramas/waters-bin-hammad-360-preview-v3.jpg", "Karak, Jordan", "4–6 Hours", 5, ["adventure", "nature"], 45, 65, "Walk through clear flowing water beneath hanging gardens and warm canyon walls.", ["assets/panoramas/waters-bin-hammad-360-preview-v3.jpg", "assets/panoramas/waters-wadi-mujib-360-preview-v3.jpg", "assets/panoramas/waters-main-hot-springs-360-preview-v3.jpg"]),
  "main-hot-springs": customPlace("Ma'in Hot Springs", "Thermal Escape", "assets/panoramas/waters-main-hot-springs-360-preview-v3.jpg", "Madaba, Jordan", "3–5 Hours", 4, ["wellness", "nature"], 47, 57, "Rest beneath mineral-rich waterfalls descending through a dramatic volcanic landscape near the Dead Sea.", ["assets/panoramas/waters-main-hot-springs-360-preview-v3.jpg", "assets/panoramas/waters-dead-sea-360-preview-v3.jpg", "assets/panoramas/waters-bin-hammad-360-preview-v3.jpg"]),
  dana: place("Dana Reserve", "Wild Trails", "nature-ajloun.jpg", "Tafilah, Jordan", "6–8 Hours", 7, ["nature", "adventure"], 47, 68, "Descend ancient trails through a remarkable biosphere stretching from a stone village to the Araba desert.", ["desert-wadi-rum.jpg", "wadi-bin-hammad-pools.jpg"]),
  petra: customPlace("Petra", "History & Wonder", "assets/backgrounds/main.png", "Ma'an, Jordan", "6–8 Hours", 7, ["history", "adventure"], 46, 73, "Explore the ancient Nabataean city carved into rose-red cliffs. Walk through the Siq and discover a wonder of the world.", ["assets/backgrounds/main.png", `${A}desert-wadi-rum.jpg`, "assets/backgrounds/auth-petra-night.jpg"]),
  "wadi-rum": customPlace("Wadi Rum", "Desert Adventure", `${A}desert-wadi-rum.jpg`, "Aqaba, Jordan", "1–2 Days", 12, ["adventure", "nature", "local"], 51, 82, "Cross immense sandstone valleys by jeep, share Bedouin hospitality and sleep beneath a spectacular desert sky.", [`${A}desert-wadi-rum.jpg`, "assets/backgrounds/auth-petra-night.jpg", "assets/backgrounds/main.png"]),
  aqaba: customPlace("Aqaba", "Sea & Activities", "assets/panoramas/waters-aqaba-360-preview-v3.jpg", "Aqaba, Jordan", "1–2 Days", 10, ["adventure", "wellness", "nature"], 41, 91, "Dive into clear Red Sea water, colorful coral reefs and relaxed evenings along Jordan's southern coast.", ["assets/panoramas/waters-aqaba-360-preview-v3.jpg", "assets/panoramas/waters-dead-sea-360-preview-v3.jpg", "assets/panoramas/waters-wadi-mujib-360-preview-v3.jpg"])
};

const placesMeta = {
  "umm-qais": { region: "north", regionAr: "الشمال", labelSide: "right", lat: 32.6534, lng: 35.6872, color: "#34d399" },
  "ajloun": { region: "north", regionAr: "الشمال", labelSide: "left", lat: 32.3327, lng: 35.7517, color: "#34d399" },
  "jerash": { region: "north", regionAr: "الشمال", labelSide: "right", lat: 32.2723, lng: 35.8914, color: "#34d399" },
  "amman": { region: "central", regionAr: "الوسط", labelSide: "right", lat: 31.9539, lng: 35.9106, color: "#38bdf8" },
  "salt": { region: "central", regionAr: "الوسط", labelSide: "left", lat: 32.0392, lng: 35.7272, color: "#38bdf8" },
  "dead-sea": { region: "central", regionAr: "الوسط", labelSide: "left", lat: 31.5590, lng: 35.5600, color: "#38bdf8" },
  "main-hot-springs": { region: "central", regionAr: "الوسط", labelSide: "right", lat: 31.6094, lng: 35.7042, color: "#38bdf8" },
  "wadi-mujib": { region: "central", regionAr: "الوسط", labelSide: "left", lat: 31.4667, lng: 35.5739, color: "#38bdf8" },
  "wadi-bin-hammad": { region: "south", regionAr: "الجنوب", labelSide: "right", lat: 31.2589, lng: 35.6603, color: "#f43f5e" },
  "dana": { region: "south", regionAr: "الجنوب", labelSide: "left", lat: 30.6725, lng: 35.6133, color: "#f43f5e" },
  "petra": { region: "south", regionAr: "الجنوب", labelSide: "right", lat: 30.3285, lng: 35.4444, color: "#f43f5e" },
  "wadi-rum": { region: "south", regionAr: "الجنوب", labelSide: "right", lat: 29.5734, lng: 35.4190, color: "#f43f5e" },
  "aqaba": { region: "south", regionAr: "الجنوب", labelSide: "left", lat: 29.5320, lng: 35.0063, color: "#f43f5e" }
};

Object.entries(placesMeta).forEach(([id, meta]) => {
  if (places[id]) Object.assign(places[id], meta);
});

function projectCoords(lat, lng) {
  const entries = Object.entries(placesMeta);
  for (const [id, m] of entries) {
    if (Math.hypot(lat - m.lat, lng - m.lng) < 0.005) {
      return { x: places[id].x, y: places[id].y, placeId: id };
    }
  }
  let wSum = 0, xSum = 0, ySum = 0;
  for (const [id, m] of entries) {
    const d = Math.hypot(lat - m.lat, lng - m.lng);
    const w = 1 / Math.pow(Math.max(d, 0.001), 2);
    wSum += w;
    xSum += places[id].x * w;
    ySum += places[id].y * w;
  }
  return {
    x: Math.max(12, Math.min(88, Math.round((xSum / wSum) * 10) / 10)),
    y: Math.max(10, Math.min(95, Math.round((ySum / wSum) * 10) / 10))
  };
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function buildSmoothPath(points) {
  if (!points || points.length < 2) return "";
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} L ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}`;
  }
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 5.5;
    const cp1y = p1.y + (p2.y - p0.y) / 5.5;
    const cp2x = p2.x - (p3.x - p1.x) / 5.5;
    const cp2y = p2.y - (p3.y - p1.y) / 5.5;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

const defaultTrip = ["amman", "dead-sea", "petra", "wadi-rum", "aqaba"];
const colors = ["#ef5732", "#f59f19", "#138ac1", "#e64a28", "#dc3c42", "#7742d4", "#51a86f"];
const storageKey = "hawaSmartTripV1";
const $ = selector => document.querySelector(selector);
const dom = {
  main: $(".planner-main"), list: $("#itinerary-list"), markers: $("#map-markers"), route: $("#route-path"),
  listView: $("#planner-list-view"), detail: $("#place-detail"), settings: $("#settings-dialog"),
  picker: $("#place-picker-dialog"), preview: $("#preview-dialog")
};
const saved = read(storageKey);
const legacy = read("hawaTrip");
let itinerary = Array.isArray(saved?.itinerary) ? saved.itinerary.filter(id => places[id]) : [];
if (!itinerary.length && Array.isArray(legacy)) itinerary = legacy.map(item => item?.id).filter(id => places[id]);
if (!itinerary.length) itinerary = [...defaultTrip];
let settings = { days: 5, pace: "balanced", interests: ["history", "nature", "adventure"], ...(saved?.settings || {}) };
let selectedId = places[saved?.selectedId] ? saved.selectedId : (itinerary.includes("petra") ? "petra" : itinerary[0]);
let draggedId = null;
let zoom = Number(saved?.zoom) || 1;

function read(key) { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; } }
function persist() {
  localStorage.setItem(storageKey, JSON.stringify({ itinerary, settings, selectedId, zoom }));
  localStorage.setItem("hawaTrip", JSON.stringify(itinerary.map(id => ({ id, title: places[id].title, image: places[id].image }))));
}
function esc(value) { return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]); }
function toast(message) {
  const node = document.createElement("div"); node.className = "toast"; node.textContent = message;
  $("#toast-region").append(node); setTimeout(() => node.remove(), 3200);
}
function dayFor(index) { return itinerary.length ? Math.min(settings.days, Math.floor(index * settings.days / itinerary.length) + 1) : 1; }
function distance(a, b) { return Math.hypot(places[a].x - places[b].x, places[a].y - places[b].y); }
function metrics() {
  const kilometers = itinerary.slice(1).reduce((sum, id, index) => sum + distance(itinerary[index], id) * 5.2, 0);
  return { kilometers: Math.max(0, Math.round(kilometers / 10) * 10), hours: Math.round(itinerary.reduce((sum, id) => sum + places[id].hours, 0)) };
}

function renderItinerary() {
  const isAr = isArabic();
  dom.list.innerHTML = itinerary.length ? itinerary.map((id, index) => {
    const p = places[id];
    const ar = arabicPlacesData[id] || {};
    const displayTitle = isAr && ar.title ? ar.title : p.title;
    const displaySubtitle = isAr && ar.subtitle ? ar.subtitle : p.subtitle;
    const dayLabel = isAr ? `اليوم ${dayFor(index)}` : `Day ${dayFor(index)}`;
    return `<article class="itinerary-item${id === selectedId ? " is-active" : ""}" data-place="${id}" draggable="true" tabindex="0" aria-label="${dayLabel}, ${esc(displayTitle)}">
      <span class="day-number">${dayFor(index)}</span><img class="itinerary-thumb" src="${p.image}" alt="" draggable="false">
      <div class="itinerary-copy"><small>${dayLabel}</small><h3>${esc(displayTitle)}</h3><p>${esc(displaySubtitle)}</p></div>
      <div class="item-tools"><button class="remove-stop" type="button" data-remove="${id}" aria-label="${isAr ? "إزالة" : "Remove"} ${esc(displayTitle)}">×</button><span class="drag-handle" title="${isAr ? "اسحب لإعادة الترتيب" : "Drag to reorder"}" aria-hidden="true">⠿</span></div>
    </article>`;
  }).join("") : `<div class="trip-empty"><strong>${isAr ? "مسارك مفتوح" : "Your route is open"}</strong><span>${isAr ? "أضف مكانًا أو دع المخطط الذكي يلهمك." : "Add a place or let the smart planner inspire you."}</span></div>`;
  
  if (isAr) {
    $("#trip-days").textContent = `${settings.days} ${settings.days === 1 ? "يوم" : "أيام"}`;
    $("#trip-places").textContent = `${itinerary.length} ${itinerary.length === 1 ? "مكان" : "أماكن"}`;
    $("#preview-summary").textContent = `${settings.days} أيام · ${itinerary.length} أماكن`;
  } else {
    $("#trip-days").textContent = `${settings.days} ${settings.days === 1 ? "Day" : "Days"}`;
    $("#trip-places").textContent = `${itinerary.length} ${itinerary.length === 1 ? "Place" : "Places"}`;
    $("#preview-summary").textContent = `${settings.days} Days · ${itinerary.length} Places`;
  }
  $("#preview-image").src = places[selectedId]?.image || places[itinerary[0]]?.image || "assets/backgrounds/main.png";
}

function renderMap() {
  const isAr = isArabic();

  dom.markers.innerHTML = itinerary.map((id, index) => {
    const p = places[id];
    const ar = arabicPlacesData[id] || {};
    const displayTitle = isAr && ar.title ? ar.title : p.title;
    const regionName = isAr
      ? (ar.region || p.regionAr || "الأردن")
      : (p.region ? (p.region.charAt(0).toUpperCase() + p.region.slice(1)) : "Jordan");
    const sideClass = `map-marker--side-${p.labelSide || (index % 2 === 0 ? "left" : "right")}`;
    const regionClass = `region--${p.region || "central"}`;
    const pinColor = p.color || colors[index % colors.length];

    return `<button class="map-marker ${sideClass} ${regionClass}${id === selectedId ? " is-active" : ""}" data-place="${id}" data-region="${p.region || "central"}" type="button" style="left:${p.x}%;top:${p.y}%;--pin:${pinColor};--marker-index:${index}" aria-label="${isAr ? "عرض" : "View"} ${esc(displayTitle)}">
      <span class="map-marker__pin"><span class="map-marker__num">${index + 1}</span></span>
      <span class="map-marker__label">
        <img src="${p.image}" alt="">
        <span class="map-marker__name">${esc(displayTitle)}</span>
        <span class="map-marker__badge">${esc(regionName)}</span>
      </span>
    </button>`;
  }).join("");

  const points = itinerary.map(id => ({ x: places[id].x, y: places[id].y }));
  const smoothD = buildSmoothPath(points);
  if (dom.route) dom.route.setAttribute("d", smoothD);
  const glow = $("#route-path-glow");
  if (glow) glow.setAttribute("d", smoothD);

  renderUserRouteConnection();

  if (activeRegionFilter !== "all") {
    setRegionFilter(activeRegionFilter);
  }
}

function renderListView() {
  const isAr = isArabic();
  const trip = metrics();
  const headingText = isAr ? "مسارك الذكي" : "YOUR SMART ROUTE";
  const journeyTitle = isAr ? `رحلة الأردن لـ ${settings.days} أيام` : `${settings.days}-day Jordan journey`;
  const statsText = isAr ? `${trip.kilometers} كم · ${trip.hours} ساعات تجربة` : `${trip.kilometers} km · ${trip.hours} experience hours`;
  const viewText = isAr ? "عرض ←" : "View →";

  dom.listView.innerHTML = `<div class="list-view-heading"><div><p>${headingText}</p><h2>${journeyTitle}</h2></div><span>${statsText}</span></div>
  ${itinerary.map((id, index) => {
    const p = places[id];
    const ar = arabicPlacesData[id] || {};
    const displayTitle = isAr && ar.title ? ar.title : p.title;
    const displaySubtitle = isAr && ar.subtitle ? ar.subtitle : p.subtitle;
    const dayLabel = isAr ? `اليوم ${dayFor(index)}` : `Day ${dayFor(index)}`;
    return `<button type="button" data-place="${id}" class="list-view-item${id === selectedId ? " is-active" : ""}" style="--item-index:${index}"><img src="${p.image}" alt=""><div><h3>${dayLabel} · ${esc(displayTitle)}</h3><p>${esc(displaySubtitle)} · ${esc(p.duration)}</p></div><b>${viewText}</b></button>`;
  }).join("")}`;
}

function renderDetail() {
  const isAr = isArabic();
  const p = places[selectedId] || places[itinerary[0]] || places.petra;
  selectedId = Object.keys(places).find(id => places[id] === p) || "petra";
  const ar = arabicPlacesData[selectedId] || {};
  const displayTitle = isAr && ar.title ? ar.title : p.title;
  const displayLocation = isAr && ar.location ? ar.location : p.location;
  const displayDescription = isAr && ar.description ? ar.description : p.description;
  const index = itinerary.indexOf(selectedId);
  $("#detail-day").textContent = index >= 0
    ? (isAr ? `اليوم ${dayFor(index)}` : `Day ${dayFor(index)}`)
    : (isAr ? "محطة مقترحة" : "Suggested stop");
  $("#detail-title").textContent = displayTitle;
  $("#detail-duration").textContent = p.duration;
  $("#detail-location").textContent = displayLocation;
  $("#detail-description").textContent = displayDescription;
  $("#detail-gallery").innerHTML = p.gallery.map((src, number) => `<img src="${src}" alt="${number ? "" : esc(displayTitle)}" loading="lazy">`).join("");
  $("#detail-link").href = `destination?id=${selectedId}`;
  $("#detail-action span:last-child").textContent = index >= 0
    ? (isAr ? "إزالة من المسار" : "Remove from Itinerary")
    : (isAr ? "إضافة إلى المسار" : "Add to Itinerary");
  $("#detail-action").classList.toggle("is-remove", index >= 0);
  document.querySelectorAll("[data-place]").forEach(node => node.classList.toggle("is-active", node.dataset.place === selectedId));
}

const arabicPlacesData = {
  amman: {
    title: "عمان",
    subtitle: "ثقافة المدينة والطعام",
    region: "الوسط",
    location: "عمّان، الأردن",
    description: "تعرّف على الأردن من خلال عاصمته النابضة بالحياة: آثار على قمم التلال، أحياء إبداعية، أسواق عامرة، ومائدة صُممت للمشاركة.",
    feelings: ["طعام", "تاريخ", "محلي", "ثقافة", "عاصمة"]
  },
  jerash: {
    title: "جرش",
    subtitle: "تراث روماني",
    region: "الشمال",
    location: "جرش، الأردن",
    description: "تجوّل في الشوارع ذات الأعمدة والساحات الفسيحة والمعابد في واحدة من أفضل المدن الرومانية المحفوظة في العالم.",
    feelings: ["تاريخ", "آثار", "محلي", "أعمدة", "روماني"]
  },
  ajloun: {
    title: "عجلون",
    subtitle: "غابات وقلعة",
    region: "الشمال",
    location: "عجلون، الأردن",
    description: "امشِ عبر المرتفعات الخضراء الدائمة واصعد إلى قلعة من العصور الوسطى للاستمتاع بإطلالات واسعة على شمال الأردن الأخضر.",
    feelings: ["طبيعة", "تاريخ", "مغامرة", "غابة", "قلعة", "شمال"]
  },
  "umm-qais": {
    title: "أم قيس",
    subtitle: "آثار وإطلالات على الوادي",
    region: "الشمال",
    location: "إربد، الأردن",
    description: "استكشف آثار البازلت الأسود والحياة القروية الأصيلة والإطلالات البانورامية الساحرة على وادي الأردن وبحيرة طبريا.",
    feelings: ["تاريخ", "طبيعة", "محلي", "إطلالة", "بحيرة", "يرموك"]
  },
  salt: {
    title: "السلط القديمة",
    subtitle: "تراث حي",
    region: "الوسط",
    location: "السلط، الأردن",
    description: "اتبع الأزقة ذات الحجارة الصفراء في مدينة عريقة تشتهر بالتراث المشترك والبيوت القديمة وكرم الضيافة الأصيل.",
    feelings: ["محلي", "طعام", "تاريخ", "تراث", "بيوت", "ضيافة"]
  },
  "dead-sea": {
    title: "البحر الميت",
    subtitle: "استرخاء واستجمام",
    region: "الوسط",
    location: "أخفض نقطة على وجه الأرض",
    description: "اطفُ بسهولة فوق مياه البحر الميت الغنية بالأملاح المعدنية وشاهد أروع مشهد لغروب الشمس في أخفض بقعة في العالم.",
    feelings: ["استجمام", "طبيعة", "بحر", "ملح", "غروب", "علاج"]
  },
  "wadi-mujib": {
    title: "وادي مجيب",
    subtitle: "مغامرة في الوادي",
    region: "الوسط",
    location: "مادبا، الأردن",
    description: "امشِ وسط المياه المنعشة بين جدران الحجر الرملي الشاهقة في واحد من أكثر مسارات الوديان إثارة في الأردن.",
    feelings: ["مغامرة", "طبيعة", "ماء", "سيق", "مائي", "تشويق"]
  },
  "wadi-bin-hammad": {
    title: "وادي بن حماد",
    subtitle: "وادي حي",
    region: "الجنوب",
    location: "الكرك، الأردن",
    description: "تنزّه بين المياه الجارية الصافية تحت الحدائق المعلقة وجدران الوادي الدافئة.",
    feelings: ["مغامرة", "طبيعة", "ينابيع", "نباتات", "جنة"]
  },
  "main-hot-springs": {
    title: "حمامات ماعين",
    subtitle: "واحة حرارية",
    region: "الوسط",
    location: "مادبا، الأردن",
    description: "استرخِ تحت شلالات المياه الدافئة الغنية بالمعادن المتدفقة عبر مشهد بركاني ساحر بالقرب من البحر الميت.",
    feelings: ["استجمام", "طبيعة", "ينابيع", "مياه حارة", "شلالات"]
  },
  dana: {
    title: "محمية ضانا",
    subtitle: "مسارات طبيعية برية",
    region: "الجنوب",
    location: "الطفيلة، الأردن",
    description: "انحدر عبر مسارات عريقة في محمية طبيعية مذهلة تمتد من قرية حجرية حتى صحراء وادي عربة.",
    feelings: ["طبيعة", "مغامرة", "مسار", "محمية", "جبال", "مشي"]
  },
  petra: {
    title: "البتراء",
    subtitle: "تاريخ وعجائب",
    region: "الجنوب",
    location: "معان، الأردن",
    description: "استكشف المدينة النبطية المنحوتة في الصخور الوردية. امشِ عبر السيق واكتشف إحدى عجائب الدنيا السبع.",
    feelings: ["تاريخ", "مغامرة", "عجيبة", "خزنة", "سيق", "وردي"]
  },
  "wadi-rum": {
    title: "وادي رم",
    subtitle: "مغامرة صحراوية",
    region: "الجنوب",
    location: "العقبة، الأردن",
    description: "اعبر الوديان الرملية الشاسعة بسيارات الدفع الرباعي، وتشارك الضيافة البدوية ونَم تحت سماء الصحراء المرصعة بالنجوم.",
    feelings: ["مغامرة", "طبيعة", "محلي", "صحراء", "نجوم", "تخييم"]
  },
  aqaba: {
    title: "العقبة",
    subtitle: "بحر وأنشطة",
    region: "الجنوب",
    location: "العقبة، الأردن",
    description: "اغص في مياه البحر الأحمر الصافية وشعابها المرجانية الملونة واستمتع بأمسيات هادئة على طول ساحل الأردن الجنوبي.",
    feelings: ["مغامرة", "استجمام", "طبيعة", "غوص", "بحر", "مرجان", "شاطئ"]
  }
};

let activeRegionFilter = "all";

function setRegionFilter(region) {
  activeRegionFilter = region;
  document.querySelectorAll(".region-chip").forEach(chip => {
    chip.classList.toggle("is-active", chip.dataset.region === region);
  });
  
  document.querySelectorAll(".map-marker").forEach(marker => {
    const markerRegion = marker.dataset.region;
    const match = region === "all" || markerRegion === region;
    marker.classList.toggle("is-dimmed", !match);
  });
}

let userLocation = {
  active: false,
  lat: null,
  lng: null,
  x: null,
  y: null,
  nearestPlaceId: null,
  nearestDistanceKm: null
};

function locateUser() {
  const btn = $("#locate-user-btn");
  const marker = $("#user-live-marker");
  const isAr = isArabic();

  if (!btn || !marker) return;
  btn.classList.add("is-active");

  function applyLocation(lat, lng, isSimulated = false) {
    const proj = projectCoords(lat, lng);
    userLocation.active = true;
    userLocation.lat = lat;
    userLocation.lng = lng;
    userLocation.x = proj.x;
    userLocation.y = proj.y;

    let minD = Infinity;
    let nearestId = "amman";
    Object.entries(placesMeta).forEach(([id, m]) => {
      const d = haversineKm(lat, lng, m.lat, m.lng);
      if (d < minD) {
        minD = d;
        nearestId = id;
      }
    });

    userLocation.nearestPlaceId = nearestId;
    userLocation.nearestDistanceKm = Math.round(minD);
    const nearestName = isAr && arabicPlacesData[nearestId]?.title ? arabicPlacesData[nearestId].title : places[nearestId].title;

    marker.hidden = false;
    marker.style.left = `${proj.x}%`;
    marker.style.top = `${proj.y}%`;

    const titleEl = $("#user-live-title");
    const statusEl = $("#user-live-status");
    if (titleEl) titleEl.textContent = isAr ? "موقعك الحالي" : "Your Location";
    if (statusEl) {
      if (isSimulated) {
        statusEl.textContent = isAr ? `موقع تقريبي (بالقرب من ${nearestName})` : `Estimated (near ${nearestName})`;
      } else {
        statusEl.textContent = isAr ? `يبعد ${Math.round(minD)} كم عن ${nearestName}` : `${Math.round(minD)} km to ${nearestName}`;
      }
    }

    renderUserRouteConnection();
    toast(isAr ? `تم تحديد موقعك على الخريطة 📍 (بالقرب من ${nearestName})` : `Location found 📍 (Near ${nearestName})`);
    setTimeout(() => btn.classList.remove("is-active"), 800);
  }

  let handled = false;
  const fallbackTimer = setTimeout(() => {
    if (!handled) {
      handled = true;
      applyLocation(31.9539, 35.9106, true);
    }
  }, 1400);

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        if (handled) return;
        handled = true;
        clearTimeout(fallbackTimer);
        const { latitude, longitude } = pos.coords;
        const insideJordan = latitude >= 29.0 && latitude <= 33.5 && longitude >= 34.5 && longitude <= 39.5;
        if (insideJordan) {
          applyLocation(latitude, longitude, false);
        } else {
          applyLocation(31.9539, 35.9106, true);
        }
      },
      () => {
        if (handled) return;
        handled = true;
        clearTimeout(fallbackTimer);
        applyLocation(31.9539, 35.9106, true);
      },
      { timeout: 1500, enableHighAccuracy: true }
    );
  } else {
    clearTimeout(fallbackTimer);
    applyLocation(31.9539, 35.9106, true);
  }
}

function renderUserRouteConnection() {
  const connectionEl = $("#user-connection-path");
  if (!connectionEl || !userLocation.active) {
    if (connectionEl) connectionEl.setAttribute("d", "");
    return;
  }
  const targetId = itinerary[0] || userLocation.nearestPlaceId || "amman";
  const target = places[targetId];
  if (target) {
    const d = `M ${userLocation.x} ${userLocation.y} Q ${(userLocation.x + target.x) / 2 + 2} ${(userLocation.y + target.y) / 2 - 2}, ${target.x} ${target.y}`;
    connectionEl.setAttribute("d", d);
  }
}

let activePickerFilter = "all";

function updatePickerFooter() {
  const countEl = $("#picker-count");
  if (countEl) {
    const isAr = document.documentElement.lang === "ar" || document.documentElement.dir === "rtl";
    countEl.textContent = isAr 
      ? `${itinerary.length} ${itinerary.length === 1 ? "وجهة" : "وجهات"} في مسارك`
      : `${itinerary.length} ${itinerary.length === 1 ? "stop" : "stops"} in your trip`;
  }
}

function renderPicker(filter = "", tag = activePickerFilter) {
  const needle = filter.trim().toLowerCase();
  const isAr = document.documentElement.lang === "ar" || document.documentElement.dir === "rtl";
  
  const entries = Object.entries(places).filter(([id, p]) => {
    const ar = arabicPlacesData[id] || {};
    const arFeelings = ar.feelings ? ar.feelings.join(" ") : "";
    
    // Tag filter
    if (tag !== "all" && !p.interests.includes(tag) && !(ar.feelings && ar.feelings.includes(tag))) {
      return false;
    }
    
    if (!needle) return true;
    
    const enText = `${p.title} ${p.subtitle} ${p.interests.join(" ")} ${p.location}`.toLowerCase();
    const arText = `${ar.title || ""} ${ar.subtitle || ""} ${arFeelings}`.toLowerCase();
    
    return enText.includes(needle) || arText.includes(needle);
  });

  const grid = $("#place-picker-grid");
  if (!grid) return;

  grid.innerHTML = entries.length ? entries.map(([id, p]) => {
    const added = itinerary.includes(id);
    const ar = arabicPlacesData[id] || {};
    const displayTitle = isAr && ar.title ? ar.title : p.title;
    const displaySubtitle = isAr && ar.subtitle ? ar.subtitle : p.subtitle;
    
    return `
      <article class="place-option${added ? " is-added" : ""}" data-place-id="${id}" tabindex="0" role="button" aria-pressed="${added}">
        <img src="${p.image}" alt="${esc(displayTitle)}" loading="lazy">
        <div class="place-option-info">
          <strong>${esc(displayTitle)}</strong>
          <span>${esc(displaySubtitle)}</span>
          <small>${esc(p.duration)}</small>
        </div>
        <button type="button" class="place-option-action" data-add-place="${id}" aria-label="${added ? (isAr ? `إزالة ${esc(displayTitle)}` : `Remove ${esc(displayTitle)}`) : (isAr ? `إضافة ${esc(displayTitle)}` : `Add ${esc(displayTitle)}`)}">
          ${added ? `<span class="action-check">✓</span><span>${isAr ? "تمت الإضافة" : "Added"}</span>` : `<span class="action-plus">+</span><span>${isAr ? "أضف" : "Add"}</span>`}
        </button>
      </article>
    `;
  }).join("") : `<div class="picker-empty"><p>${isAr ? "لا توجد أماكن تطابق هذا البحث." : "No places match that search."}</p></div>`;

  updatePickerFooter();
}

function renderPreview() {
  const trip = metrics();
  $("#preview-stats").innerHTML = `<div><strong>${settings.days}</strong><span>Days</span></div><div><strong>${itinerary.length}</strong><span>Places</span></div><div><strong>${trip.kilometers}</strong><span>Estimated km</span></div><div><strong>${trip.hours}</strong><span>Experience hours</span></div>`;
  $("#preview-timeline").innerHTML = itinerary.map((id, index) => { const p = places[id]; return `<article><span>${dayFor(index)}</span><img src="${p.image}" alt=""><div><strong>${esc(p.title)}</strong><p>${esc(p.subtitle)}</p></div><small>${esc(p.duration)}</small></article>`; }).join("");
}

function renderAll() {
  renderItinerary(); renderMap(); renderListView(); renderDetail();
  if (dom.picker?.open) renderPicker($("#place-search")?.value || "", activePickerFilter);
  document.documentElement.style.setProperty("--map-zoom", zoom); persist();
}
function selectPlace(id) { if (!places[id]) return; selectedId = id; dom.detail.classList.remove("is-collapsed"); $("#preview-image").src = places[id].image; renderDetail(); renderListView(); persist(); }
function addPlace(id, close = false) {
  if (!places[id] || itinerary.includes(id)) return;
  itinerary.push(id); selectedId = id; if (close) dom.picker.close(); renderAll(); toast(`${places[id].title} was added to your journey.`);
}
function removePlace(id) {
  const index = itinerary.indexOf(id); if (index < 0) return;
  itinerary.splice(index, 1); if (selectedId === id) selectedId = itinerary[Math.min(index, itinerary.length - 1)] || "petra";
  renderAll(); toast(`${places[id].title} was removed.`);
}
function togglePlaceInPicker(id) {
  if (!places[id]) return;
  if (itinerary.includes(id)) {
    removePlace(id);
  } else {
    addPlace(id, false);
  }
  renderPicker($("#place-search")?.value || "", activePickerFilter);
}

function doLinesIntersect(p1, p2, p3, p4) {
  function ccw(a, b, c) { return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x); }
  return (ccw(p1, p3, p4) !== ccw(p2, p3, p4)) && (ccw(p1, p2, p3) !== ccw(p1, p2, p4));
}

function untangleAndSortRoute(announce = true) {
  if (itinerary.length < 3) return;
  dom.main.classList.add("is-optimizing");
  
  // Sort from North to South along Jordan's natural geographic spine
  let r = [...itinerary].sort((a, b) => places[a].y - places[b].y);
  
  // 2-opt uncrossing pass to guarantee zero line intersections
  let improved = true;
  let iterations = 0;
  while (improved && iterations < 120) {
    improved = false;
    iterations++;
    for (let i = 0; i < r.length - 1; i++) {
      for (let j = i + 2; j < r.length; j++) {
        const p1 = places[r[i]];
        const p2 = places[r[i + 1]];
        const p3 = places[r[j]];
        const p4 = places[r[j + 1]];
        if (!p4) continue;
        if (doLinesIntersect(p1, p2, p3, p4)) {
          const slice = r.slice(i + 1, j + 1).reverse();
          r.splice(i + 1, slice.length, ...slice);
          improved = true;
          break;
        }
      }
      if (improved) break;
    }
  }

  setTimeout(() => {
    itinerary = r;
    renderAll();
    dom.main.classList.remove("is-optimizing");
    if (announce) {
      const isAr = isArabic();
      toast(isAr ? "تم فك تشابك المسار وترتيب المحطات جغرافياً بنجاح ✨" : "Route untangled and ordered seamlessly ✨");
    }
  }, 420);
}

function optimizeRoute(announce = true) {
  untangleAndSortRoute(announce);
}

function generateSmartRoute() {
  const interests = [...document.querySelectorAll('input[name="interest"]:checked')].map(input => input.value);
  const days = Number($("#days-range").value); const pace = $("#pace-select").value;
  settings = { days, pace, interests };
  const target = Math.min(Object.keys(places).length, pace === "relaxed" ? Math.max(3, days) : pace === "active" ? days * 2 : days + 2);
  const ranked = Object.entries(places).map(([id, p]) => ({ id, score: p.rating + p.interests.filter(i => interests.includes(i)).length * 4 + (id === "amman" ? 2 : 0) + Math.random() * .15 })).sort((a, b) => b.score - a.score);
  itinerary = ranked.slice(0, target).map(item => item.id); if (!itinerary.includes("amman")) itinerary[0] = "amman";
  selectedId = itinerary[0]; dom.settings.close(); renderAll(); optimizeRoute(false);
  toast(`A ${pace} ${days}-day route was created around your interests.`);
}

dom.list.addEventListener("click", event => {
  const remove = event.target.closest("[data-remove]"); if (remove) { event.stopPropagation(); removePlace(remove.dataset.remove); return; }
  const item = event.target.closest("[data-place]"); if (item) selectPlace(item.dataset.place);
});
dom.list.addEventListener("keydown", event => {
  const item = event.target.closest("[data-place]"); if (!item) return;
  if (["Enter", " "].includes(event.key)) { event.preventDefault(); selectPlace(item.dataset.place); }
  if (event.altKey && ["ArrowUp", "ArrowDown"].includes(event.key)) {
    event.preventDefault(); const from = itinerary.indexOf(item.dataset.place); const to = Math.max(0, Math.min(itinerary.length - 1, from + (event.key === "ArrowUp" ? -1 : 1)));
    itinerary.splice(to, 0, itinerary.splice(from, 1)[0]); renderAll(); dom.list.querySelector(`[data-place="${item.dataset.place}"]`)?.focus();
  }
});
dom.list.addEventListener("dragstart", event => { const item = event.target.closest("[data-place]"); if (!item) return; draggedId = item.dataset.place; item.classList.add("is-dragging"); event.dataTransfer.effectAllowed = "move"; });
dom.list.addEventListener("dragover", event => { if (event.target.closest("[data-place]")) event.preventDefault(); });
dom.list.addEventListener("drop", event => {
  event.preventDefault(); const target = event.target.closest("[data-place]")?.dataset.place; if (!target || target === draggedId) return;
  const from = itinerary.indexOf(draggedId); const to = itinerary.indexOf(target); itinerary.splice(to, 0, itinerary.splice(from, 1)[0]); renderAll(); toast("Stop reordered.");
});
dom.list.addEventListener("dragend", () => { draggedId = null; document.querySelectorAll(".is-dragging").forEach(node => node.classList.remove("is-dragging")); });
dom.markers.addEventListener("click", event => { const marker = event.target.closest("[data-place]"); if (marker) selectPlace(marker.dataset.place); });
dom.listView.addEventListener("click", event => { const card = event.target.closest("[data-place]"); if (card) selectPlace(card.dataset.place); });

document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
  const listMode = button.dataset.view === "list";
  document.querySelectorAll("[data-view]").forEach(item => { item.classList.toggle("is-active", item === button); item.setAttribute("aria-pressed", String(item === button)); });
  dom.main.classList.toggle("is-list-view", listMode); dom.listView.hidden = !listMode;
}));
$("#open-settings").addEventListener("click", () => {
  $("#days-range").value = settings.days; $("#days-output").value = `${settings.days} days`; $("#pace-select").value = settings.pace;
  document.querySelectorAll('input[name="interest"]').forEach(input => { input.checked = settings.interests.includes(input.value); }); dom.settings.showModal();
});
$("#days-range").addEventListener("input", event => { $("#days-output").value = `${event.target.value} days`; });
$("#settings-form").addEventListener("submit", event => { event.preventDefault(); generateSmartRoute(); });
$("#open-place-picker")?.addEventListener("click", () => {
  const searchInput = $("#place-search");
  if (searchInput) searchInput.value = "";
  const clearBtn = $("#place-search-clear");
  if (clearBtn) clearBtn.hidden = true;
  activePickerFilter = "all";
  document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("is-active", chip.dataset.chip === "all"));
  renderPicker();
  dom.picker.showModal();
});

$("#place-search")?.addEventListener("input", event => {
  const val = event.target.value;
  const clearBtn = $("#place-search-clear");
  if (clearBtn) clearBtn.hidden = !val;
  renderPicker(val, activePickerFilter);
});

$("#place-search-clear")?.addEventListener("click", () => {
  const input = $("#place-search");
  if (input) {
    input.value = "";
    input.focus();
  }
  const clearBtn = $("#place-search-clear");
  if (clearBtn) clearBtn.hidden = true;
  renderPicker("", activePickerFilter);
});

$("#place-filter-chips")?.addEventListener("click", event => {
  const chip = event.target.closest(".filter-chip");
  if (!chip) return;
  document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("is-active"));
  chip.classList.add("is-active");
  activePickerFilter = chip.dataset.chip || "all";
  renderPicker($("#place-search")?.value || "", activePickerFilter);
});

$("#place-picker-grid")?.addEventListener("click", event => {
  const option = event.target.closest("[data-place-id]");
  if (option) {
    togglePlaceInPicker(option.dataset.placeId);
  }
});

$("#place-picker-grid")?.addEventListener("keydown", event => {
  if (["Enter", " "].includes(event.key)) {
    const option = event.target.closest("[data-place-id]");
    if (option) {
      event.preventDefault();
      togglePlaceInPicker(option.dataset.placeId);
    }
  }
});
$("#detail-action").addEventListener("click", () => itinerary.includes(selectedId) ? removePlace(selectedId) : addPlace(selectedId));
$("#collapse-detail").addEventListener("click", () => dom.detail.classList.toggle("is-collapsed"));
$("#optimize-route").addEventListener("click", () => optimizeRoute());
$("#auto-sort-route")?.addEventListener("click", () => untangleAndSortRoute(true));
$("#locate-user-btn")?.addEventListener("click", () => locateUser());
$("#user-live-marker")?.addEventListener("click", () => {
  const isAr = isArabic();
  toast(isAr ? "موقعك الحالي النشط على الخريطة 📍" : "Your active location on map 📍");
});
$("#region-filter-bar")?.addEventListener("click", event => {
  const chip = event.target.closest(".region-chip");
  if (!chip) return;
  setRegionFilter(chip.dataset.region || "all");
});
function setZoom(next) { zoom = Math.max(.94, Math.min(1.14, Number(next.toFixed(2)))); document.documentElement.style.setProperty("--map-zoom", zoom); persist(); }
$("#zoom-in").addEventListener("click", () => setZoom(zoom + .04)); $("#zoom-out").addEventListener("click", () => setZoom(zoom - .04));
$("#open-preview").addEventListener("click", () => { renderPreview(); dom.preview.showModal(); });
document.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => button.closest("dialog").close()));
document.querySelectorAll("dialog").forEach(dialog => dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); }));
$("#save-trip").addEventListener("click", () => { persist(); dom.preview.close(); toast("Your trip is saved on this device."); });
$("#export-trip").addEventListener("click", () => {
  const data = { name: "My Hawa Jordan Trip", days: settings.days, pace: settings.pace, places: itinerary.map((id, index) => ({ day: dayFor(index), id, title: places[id].title, location: places[id].location, duration: places[id].duration })) };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const link = document.createElement("a"); link.href = url; link.download = "hawa-jordan-itinerary.json"; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000); toast("Your itinerary file is ready.");
});

$("#toggle-trip-panel")?.addEventListener("click", () => {
  const panel = $("#trip-panel");
  if (!panel) return;
  const isCollapsed = panel.classList.toggle("is-collapsed");
  const isAr = isArabic();
  const label = isCollapsed
    ? (isAr ? "إظهار لوحة المسار" : "Expand itinerary panel")
    : (isAr ? "إخفاء لوحة المسار" : "Collapse itinerary panel");
  const btn = $("#toggle-trip-panel");
  btn?.setAttribute("aria-label", label);
  btn?.setAttribute("title", label);
});

window.addEventListener("hawa:language-change", () => {
  renderAll();
});

renderAll();

window.planner = {
  get itinerary() { return itinerary; },
  set itinerary(val) { itinerary = val; renderAll(); },
  places,
  locateUser,
  untangleAndSortRoute,
  setRegionFilter,
  renderAll
};
