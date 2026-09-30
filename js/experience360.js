import "./i18n.js";
import { getFirebaseServices } from "./firebase-config.js";

if (!localStorage.getItem("hawaCurrentUserId") && !localStorage.getItem("hawaLocalUser")) {
  const returnUrl = encodeURIComponent(location.pathname + location.search + location.hash);
  window.location.replace(`login?redirect=${returnUrl}`);
}

const viewer = document.querySelector(".viewer-360");
const canvas = document.querySelector("#panorama-canvas");
const atmosphereCanvas = document.querySelector("#atmosphere-canvas");
const atmosphere = atmosphereCanvas.getContext("2d", { alpha: true });
const fallback = document.querySelector("#panorama-fallback");
const loader = document.querySelector("#viewer-loader");
const loaderProgress = document.querySelector("#loader-progress");
const loaderLabel = document.querySelector("#loader-label");
const liveRegion = document.querySelector("#viewer-live");
const hotspotLayer = document.querySelector("#hotspot-layer");
const hotspotCard = document.querySelector("#hotspot-card");
const sceneSwitcher = document.querySelector("#scene-switcher");
const hint = document.querySelector("#viewer-hint");
const viewAngle = document.querySelector("#view-angle");
const renderStatus = document.querySelector("#render-status");
const compassNeedle = document.querySelector("#compass-needle");
const welcome = document.querySelector("#viewer-welcome");
const tourCard = document.querySelector("#guided-tour-card");
const aiPanel = document.querySelector("#ai-guide-panel");
const morePanel = document.querySelector("#viewer-more-panel");
const aiMessages = document.querySelector("#ai-messages");
const aiActionRow = document.querySelector("#ai-action-row");
const routeNav = document.querySelector("#tour-route");
const routePrevious = document.querySelector("#route-previous");
const routeNext = document.querySelector("#route-next");
const routeDots = document.querySelector("#route-dots");
const nodeTransition = document.querySelector("#node-transition");

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const normalizeAngle = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));
const sceneEffects = {
  desert: 1,
  waters: 2,
  "waters-dead-sea": 2,
  "waters-bin-hammad": 2,
  "waters-main-hot-springs": 2,
  "waters-aqaba": 2,
  history: 3,
  "history-jerash": 3,
  "history-amman-citadel": 3,
  "history-umm-qais": 3,
  food: 4,
  nature: 5,
  local: 6
};

const scenes = {
  desert: {
    title: "Wadi Rum Afterglow",
    label: "Desert & Silence",
    kicker: "DESERT & SILENCE",
    copy: "Turn slowly. Let the desert open around you.",
    image: "assets/panoramas/wadi-rum-360-8k-v2.jpg",
    image4k: "assets/panoramas/wadi-rum-360-4k-v2.jpg",
    lowImage: "assets/panoramas/wadi-rum-360-preview-v2.jpg",
    preview: "assets/images/desert-wadi-rum.jpg",
    accent: "#efbd69",
    audio: { type: "lowpass", frequency: 360, gain: 0.055, texture: "wind" },
    start: { yaw: -12, pitch: -2, fov: 70 },
    destinationId: "wadi-rum",
    guide: { bestTime: "October to April, especially the final two hours before sunset.", practical: "Bring water, a light layer after sunset and use a licensed local guide for remote routes." },
    hotspots: [
      { yaw: -73, pitch: -4, title: "Bedouin Camp", copy: "A lantern-lit camp where desert stories, tea and generous Jordanian hospitality meet.", href: "destination?id=bedouin-camp" },
      { yaw: 42, pitch: 2, title: "The Sandstone Giants", copy: "Wadi Rum's monumental formations glow copper and rose as daylight fades.", href: "destination?id=wadi-rum" },
      { yaw: 132, pitch: 16, title: "First Stars", copy: "The protected desert sky is one of Jordan's finest places for stargazing.", href: "now" }
    ]
  },
  waters: {
    title: "Inside Wadi Mujib",
    label: "Wadi Mujib 360°",
    kicker: "ROARING WATERS",
    copy: "Follow clear water between Wadi Mujib's towering sandstone walls.",
    image: "assets/panoramas/waters-wadi-mujib-360-8k-v3.jpg",
    image4k: "assets/panoramas/waters-wadi-mujib-360-4k-v3.jpg",
    lowImage: "assets/panoramas/waters-wadi-mujib-360-preview-v3.jpg",
    preview: "assets/panoramas/waters-wadi-mujib-360-preview-v3.jpg",
    accent: "#88dce9",
    audio: { type: "bandpass", frequency: 1180, gain: 0.065, texture: "water" },
    start: { yaw: 0, pitch: -3, fov: 68 },
    destinationId: "wadi-mujib",
    exploreCategory: "waters",
    guide: { bestTime: "The canyon season is generally best in the warmer months, subject to official opening and flash-flood conditions.", practical: "Check trail status before leaving, wear water shoes and never enter during rain warnings." },
    hotspots: [
      { yaw: -52, pitch: -8, title: "The Canyon Trail", copy: "Water-polished sandstone marks the beginning of Mujib's thrilling Siq trail.", href: "destination?id=wadi-mujib" },
      { yaw: 0, pitch: 3, title: "Hidden Cascade", copy: "Seasonal water finds its way through the narrow gorge and feeds cool natural pools.", href: "explore?category=waters" },
      { yaw: 55, pitch: -13, title: "Natural Pool", copy: "Pause where clear water gathers between warm canyon walls.", href: "destination?id=wadi-bin-hammad" }
    ]
  },
  "waters-dead-sea": {
    title: "Stillness at the Dead Sea",
    label: "Dead Sea 360°",
    kicker: "SALT & STILLNESS",
    copy: "Turn across mineral-blue water and sculpted salt terraces at sunset.",
    image: "assets/panoramas/waters-dead-sea-360-8k-v3.jpg",
    image4k: "assets/panoramas/waters-dead-sea-360-4k-v3.jpg",
    lowImage: "assets/panoramas/waters-dead-sea-360-preview-v3.jpg",
    preview: "assets/panoramas/waters-dead-sea-360-preview-v3.jpg",
    accent: "#94d9e6",
    audio: { type: "bandpass", frequency: 820, gain: 0.038, texture: "water" },
    start: { yaw: 0, pitch: -4, fov: 70 },
    destinationId: "dead-sea",
    exploreCategory: "waters",
    guide: { bestTime: "Late afternoon brings softer temperatures, calm water and a golden sunset across the western hills.", practical: "Protect cuts from the salty water, avoid splashing your eyes and rinse with fresh water after floating." },
    hotspots: [
      { yaw: -58, pitch: -11, title: "Salt Terraces", copy: "Bright mineral shelves form along the shoreline as the highly saline water recedes.", href: "destination?id=dead-sea" },
      { yaw: 3, pitch: -3, title: "The Lowest Shore", copy: "The Dead Sea lies more than four hundred metres below sea level in the Jordan Rift Valley.", href: "destination?id=dead-sea" },
      { yaw: 82, pitch: 2, title: "Sunset Float", copy: "Dense mineral water creates the effortless floating experience for which the shore is famous.", href: "planner" }
    ]
  },
  "waters-bin-hammad": {
    title: "Wadi Bin Hammad Gardens",
    label: "Wadi Bin Hammad 360°",
    kicker: "A LIVING CANYON",
    copy: "Walk through a green corridor of springs, palms and hanging gardens.",
    image: "assets/panoramas/waters-bin-hammad-360-8k-v3.jpg",
    image4k: "assets/panoramas/waters-bin-hammad-360-4k-v3.jpg",
    lowImage: "assets/panoramas/waters-bin-hammad-360-preview-v3.jpg",
    preview: "assets/panoramas/waters-bin-hammad-360-preview-v3.jpg",
    accent: "#82d7bf",
    audio: { type: "bandpass", frequency: 1420, gain: 0.058, texture: "water" },
    start: { yaw: -3, pitch: -5, fov: 69 },
    destinationId: "wadi-bin-hammad",
    exploreCategory: "waters",
    guide: { bestTime: "Spring and early autumn mornings are comfortable for walking and show the canyon at its greenest.", practical: "Wear shoes with strong wet grip, keep electronics protected and check local flood conditions before entering." },
    hotspots: [
      { yaw: -67, pitch: 1, title: "Hanging Gardens", copy: "Fresh water supports ferns and trailing plants along the warm sandstone walls.", href: "destination?id=wadi-bin-hammad" },
      { yaw: 0, pitch: 5, title: "Garden Cascade", copy: "A cool waterfall feeds the shallow stream running through the heart of the canyon.", href: "destination?id=wadi-bin-hammad" },
      { yaw: 78, pitch: -12, title: "Water Walk", copy: "The route follows the streambed through narrow passages and lush pools.", href: "planner" }
    ]
  },
  "waters-main-hot-springs": {
    title: "Ma'in Thermal Falls",
    label: "Ma'in Hot Springs 360°",
    kicker: "WARM WATER, WILD STONE",
    copy: "Feel steam rise where mineral water pours through the volcanic valley.",
    image: "assets/panoramas/waters-main-hot-springs-360-8k-v3.jpg",
    image4k: "assets/panoramas/waters-main-hot-springs-360-4k-v3.jpg",
    lowImage: "assets/panoramas/waters-main-hot-springs-360-preview-v3.jpg",
    preview: "assets/panoramas/waters-main-hot-springs-360-preview-v3.jpg",
    accent: "#79d1d0",
    audio: { type: "bandpass", frequency: 1080, gain: 0.064, texture: "water" },
    start: { yaw: 0, pitch: -3, fov: 68 },
    destinationId: "main-hot-springs",
    exploreCategory: "waters",
    guide: { bestTime: "Cool mornings and evenings make the contrast with the warm mineral water especially relaxing.", practical: "Test the temperature before entering, hydrate well and follow the on-site access and safety instructions." },
    hotspots: [
      { yaw: 0, pitch: 8, title: "Thermal Waterfall", copy: "Geothermally heated water descends through the rugged valley into warm bathing pools.", href: "destination?id=main-hot-springs" },
      { yaw: -74, pitch: -10, title: "Mineral Pool", copy: "Steam gathers above naturally warm water framed by dark volcanic rock.", href: "destination?id=main-hot-springs" },
      { yaw: 86, pitch: -3, title: "Valley Springs", copy: "Dozens of hot and cold springs emerge across the steep landscape near the Dead Sea.", href: "planner" }
    ]
  },
  "waters-aqaba": {
    title: "Below Aqaba's Red Sea",
    label: "Aqaba Reef 360°",
    kicker: "BENEATH THE RED SEA",
    copy: "Look around a clear reef alive with coral, fish and shafts of sunlight.",
    image: "assets/panoramas/waters-aqaba-360-8k-v3.jpg",
    image4k: "assets/panoramas/waters-aqaba-360-4k-v3.jpg",
    lowImage: "assets/panoramas/waters-aqaba-360-preview-v3.jpg",
    preview: "assets/panoramas/waters-aqaba-360-preview-v3.jpg",
    accent: "#6bdcf1",
    audio: { type: "bandpass", frequency: 1540, gain: 0.04, texture: "water" },
    start: { yaw: 0, pitch: -6, fov: 71 },
    destinationId: "aqaba",
    exploreCategory: "waters",
    guide: { bestTime: "Morning usually offers calm conditions, bright water and comfortable visibility for reef activities.", practical: "Use a licensed dive or snorkel operator, never touch coral and choose reef-safe sun protection." },
    hotspots: [
      { yaw: -62, pitch: -15, title: "Coral Garden", copy: "Aqaba's sheltered northern Red Sea reefs support colourful hard and soft corals.", href: "destination?id=aqaba" },
      { yaw: 18, pitch: 1, title: "Reef Fish", copy: "Warm clear water shelters schools of butterflyfish, anthias and other Red Sea species.", href: "destination?id=aqaba" },
      { yaw: 104, pitch: -8, title: "Responsible Dive", copy: "Keep neutral buoyancy and leave every coral exactly as you find it.", href: "planner" }
    ]
  },
  history: {
    title: "Petra at First Light",
    label: "Petra 360°",
    kicker: "ECHOES OF HISTORY",
    copy: "Turn through the Treasury plaza and the rose-red canyon around it.",
    image: "assets/panoramas/history-petra-360-8k-v3.jpg",
    image4k: "assets/panoramas/history-petra-360-4k-v3.jpg",
    lowImage: "assets/panoramas/history-petra-360-preview-v3.jpg",
    preview: "assets/panoramas/history-petra-360-preview-v3.jpg",
    accent: "#f4b56d",
    audio: { type: "lowpass", frequency: 620, gain: 0.045, texture: "history" },
    start: { yaw: 0, pitch: 0, fov: 68 },
    destinationId: "petra",
    exploreCategory: "history",
    guide: { bestTime: "Arrive near opening time for softer light, cooler temperatures and a calmer walk through the Siq.", practical: "Allow a full day, wear supportive shoes and carry water; the site includes long walks and steps." },
    hotspots: [
      { yaw: 0, pitch: 6, title: "The Treasury", copy: "Al-Khazneh rises directly from Petra's rose-red sandstone, its facade carved rather than built.", href: "destination?id=petra" },
      { yaw: -88, pitch: -1, title: "The Siq", copy: "A dramatic natural passage guides travellers into the ancient Nabataean capital.", href: "destination?id=petra" },
      { yaw: 96, pitch: -6, title: "The Outer Trail", copy: "The path continues between carved cliffs toward Petra's wider archaeological landscape.", href: "planner" }
    ]
  },
  "history-jerash": {
    title: "Jerash Oval Plaza",
    label: "Jerash 360°",
    kicker: "ROMAN JORDAN",
    copy: "Stand inside the great oval forum and follow its colonnade in every direction.",
    image: "assets/panoramas/history-jerash-360-8k-v3.jpg",
    image4k: "assets/panoramas/history-jerash-360-4k-v3.jpg",
    lowImage: "assets/panoramas/history-jerash-360-preview-v3.jpg",
    preview: "assets/panoramas/history-jerash-360-preview-v3.jpg",
    accent: "#e7c17f",
    audio: { type: "lowpass", frequency: 680, gain: 0.042, texture: "history" },
    start: { yaw: 0, pitch: -2, fov: 70 },
    destinationId: "jerash",
    exploreCategory: "history",
    guide: { bestTime: "Visit early morning or late afternoon when the limestone is warm and the Oval Plaza is quieter.", practical: "Allow at least half a day, wear shoes with good grip on polished stone and carry sun protection." },
    hotspots: [
      { yaw: 0, pitch: 1, title: "The Oval Plaza", copy: "A broad elliptical forum framed by a continuous Ionic colonnade links the sanctuary to the Cardo.", href: "destination?id=jerash" },
      { yaw: -72, pitch: -2, title: "The Colonnade", copy: "The surviving columns preserve the scale and rhythm of Roman Gerasa's civic center.", href: "destination?id=jerash" },
      { yaw: 83, pitch: -5, title: "Toward the Cardo", copy: "The paved route leads into the long ceremonial spine of the ancient city.", href: "planner" }
    ]
  },
  "history-amman-citadel": {
    title: "Amman Citadel at Sunset",
    label: "Amman Citadel 360°",
    kicker: "ABOVE THE WHITE CITY",
    copy: "Look from ancient columns across the layered hills of modern Amman.",
    image: "assets/panoramas/history-amman-citadel-360-8k-v3.jpg",
    image4k: "assets/panoramas/history-amman-citadel-360-4k-v3.jpg",
    lowImage: "assets/panoramas/history-amman-citadel-360-preview-v3.jpg",
    preview: "assets/panoramas/history-amman-citadel-360-preview-v3.jpg",
    accent: "#efb765",
    audio: { type: "lowpass", frequency: 720, gain: 0.038, texture: "history" },
    start: { yaw: 0, pitch: -2, fov: 69 },
    destinationId: "amman-citadel",
    exploreCategory: "history",
    guide: { bestTime: "Late afternoon gives clear city views and warm light across the Temple of Hercules.", practical: "The hilltop is exposed to sun and wind; bring water and allow time for the museum and Umayyad Palace." },
    hotspots: [
      { yaw: 0, pitch: 6, title: "Temple of Hercules", copy: "Monumental Roman columns mark the sanctuary that once dominated Philadelphia's hilltop.", href: "destination?id=amman-citadel" },
      { yaw: 88, pitch: -2, title: "The White City", copy: "Amman's limestone neighborhoods spread across a landscape of steep connected hills.", href: "destination?id=amman-citadel" },
      { yaw: -102, pitch: -5, title: "Citadel Layers", copy: "Roman, Byzantine and Umayyad remains share the same strategic summit.", href: "planner" }
    ]
  },
  "history-umm-qais": {
    title: "Umm Qais Panorama",
    label: "Umm Qais 360°",
    kicker: "BASALT & VALLEY",
    copy: "Turn from black-stone ruins toward one of northern Jordan's widest views.",
    image: "assets/panoramas/history-umm-qais-360-8k-v3.jpg",
    image4k: "assets/panoramas/history-umm-qais-360-4k-v3.jpg",
    lowImage: "assets/panoramas/history-umm-qais-360-preview-v3.jpg",
    preview: "assets/panoramas/history-umm-qais-360-preview-v3.jpg",
    accent: "#d7c29a",
    audio: { type: "lowpass", frequency: 760, gain: 0.038, texture: "history" },
    start: { yaw: 0, pitch: -3, fov: 70 },
    destinationId: "umm-qais",
    exploreCategory: "history",
    guide: { bestTime: "Clear spring mornings reveal the richest valley color and the longest views toward the Sea of Galilee.", practical: "The basalt paving can be uneven; use supportive shoes and bring a light layer for the exposed hilltop." },
    hotspots: [
      { yaw: -70, pitch: -4, title: "Basalt Street", copy: "Dark volcanic paving and columns give ancient Gadara a character unlike Jordan's limestone cities.", href: "destination?id=umm-qais" },
      { yaw: 0, pitch: 0, title: "Jordan Valley View", copy: "The site opens across fertile northern hills toward the distant water and highlands.", href: "destination?id=umm-qais" },
      { yaw: 92, pitch: -5, title: "Decapolis Ruins", copy: "The hill preserves traces of a city connected to the wider Greco-Roman Decapolis.", href: "planner" }
    ]
  },
  food: {
    title: "A Bedouin Table",
    label: "Local Flavors",
    kicker: "LOCAL FLAVORS",
    copy: "Sit close to the fire. Dinner is meant to be shared.",
    image: "assets/panoramas/bedouin-table-360-8k-v2.jpg",
    image4k: "assets/panoramas/bedouin-table-360-4k-v2.jpg",
    lowImage: "assets/panoramas/bedouin-table-360-preview-v2.jpg",
    preview: "assets/images/food-jordanian-table.jpg",
    accent: "#ffb867",
    audio: { type: "lowpass", frequency: 780, gain: 0.052, texture: "fire" },
    start: { yaw: -5, pitch: -8, fov: 68 },
    destinationId: "wadi-rum",
    guide: { bestTime: "Dinner after sunset works beautifully, when the desert cools and the camp lanterns come alive.", practical: "Tell your host about dietary needs in advance and accept coffee or tea with your right hand." },
    hotspots: [
      { yaw: 8, pitch: -17, title: "Zarb from the Earth", copy: "Meat and vegetables cook slowly beneath the desert sand in a sealed earth oven.", href: "explore?category=food" },
      { yaw: -92, pitch: -6, title: "Arabic Coffee", copy: "Cardamom-scented coffee is poured in small cups as a warm gesture of welcome.", href: "stories" },
      { yaw: 100, pitch: -3, title: "The Story Circle", copy: "A shared meal becomes an evening of songs, conversation and local memory.", href: "now" }
    ]
  },
  nature: {
    title: "Among Ajloun's Oaks",
    label: "Green Landscapes",
    kicker: "GREEN LANDSCAPES",
    copy: "Breathe with the forest and follow the morning light.",
    image: "assets/panoramas/ajloun-360-8k-v2.jpg",
    image4k: "assets/panoramas/ajloun-360-4k-v2.jpg",
    lowImage: "assets/panoramas/ajloun-360-preview-v2.jpg",
    preview: "assets/images/nature-ajloun.jpg",
    accent: "#a9d47b",
    audio: { type: "bandpass", frequency: 1750, gain: 0.037, texture: "forest" },
    start: { yaw: 15, pitch: 2, fov: 70 },
    destinationId: "ajloun",
    guide: { bestTime: "Spring mornings are especially green; autumn is quieter and comfortable for longer walks.", practical: "Choose a marked trail, carry water and keep a light layer because the highlands can be cooler than Amman." },
    hotspots: [
      { yaw: -38, pitch: -8, title: "Oak Forest Trail", copy: "Ancient evergreen oaks shelter a network of peaceful reserve paths.", href: "destination?id=ajloun" },
      { yaw: 56, pitch: 3, title: "Forest Lookout", copy: "A clearing opens towards the rolling green highlands of northern Jordan.", href: "explore?category=nature" },
      { yaw: 146, pitch: 13, title: "Birdsong Canopy", copy: "Listen for woodland species moving between pistachio, carob and oak trees.", href: "stories" }
    ]
  },
  local: {
    title: "Amman After Dark",
    label: "Local Life",
    kicker: "LOCAL LIFE",
    copy: "Step into the market rhythm and follow the scent of spice.",
    image: "assets/panoramas/amman-market-360-8k-v2.jpg",
    image4k: "assets/panoramas/amman-market-360-4k-v2.jpg",
    lowImage: "assets/panoramas/amman-market-360-preview-v2.jpg",
    preview: "assets/panoramas/amman-market-360-preview.jpg",
    accent: "#e9a56f",
    audio: { type: "bandpass", frequency: 930, gain: 0.04, texture: "market" },
    start: { yaw: -18, pitch: 0, fov: 69 },
    destinationId: "amman",
    guide: { bestTime: "Late afternoon into early evening brings lively streets, open food stalls and cooler walking weather.", practical: "Keep small cash, ask before photographing people and explore on foot with normal city awareness." },
    hotspots: [
      { yaw: -61, pitch: -3, title: "Spice Merchant", copy: "Sumac, za'atar and warm roasted coffee perfume the old downtown lanes.", href: "destination?id=amman-market" },
      { yaw: 23, pitch: -8, title: "Sweet Stop", copy: "Follow the crowd to a tray of hot knafeh finished with fragrant syrup.", href: "explore?category=food" },
      { yaw: 126, pitch: 4, title: "The Old Souq", copy: "Family-run stalls keep the heart of Amman lively long after sunset.", href: "stories" }
    ]
  }
};

const sceneTours = {
  "waters-route": [
    {
      id: "entrance",
      title: "Trail Entrance",
      copy: "Step into the Siq where the shallow stream begins between towering sandstone walls.",
      image: "assets/panoramas/mujib-entrance-8k.jpg",
      image4k: "assets/panoramas/mujib-entrance-4k.jpg",
      lowImage: "assets/panoramas/mujib-entrance-preview.jpg",
      preview: "assets/panoramas/mujib-entrance-preview.jpg",
      start: { yaw: 0, pitch: -2, fov: 68 },
      distance: "Start here · 0 m",
      narration: "Welcome to the Wadi Mujib Siq Trail. The water is still shallow here, and the layered sandstone ahead marks the beginning of the canyon route.",
      audio: { direction: 0, gain: .045, frequency: 980 },
      hotspots: [
        { yaw: -38, pitch: -7, title: "Water-polished Rock", copy: "Seasonal flow gradually smooths the lower canyon walls and reveals their horizontal layers.", href: "destination?id=wadi-mujib" },
        { yaw: 24, pitch: -12, title: "Shallow Crossing", copy: "The route begins through clear ankle-deep water over rounded stones.", href: "destination?id=wadi-mujib" }
      ]
    },
    {
      id: "corridor",
      title: "The Canyon Corridor",
      copy: "Follow the current deeper into the cool, water-polished sandstone passage.",
      image: "assets/panoramas/wadi-mujib-360-8k-v2.jpg",
      image4k: "assets/panoramas/wadi-mujib-360-4k-v2.jpg",
      lowImage: "assets/panoramas/wadi-mujib-360-preview-v2.jpg",
      preview: "assets/panoramas/wadi-mujib-360-preview-v2.jpg",
      start: { yaw: 0, pitch: -3, fov: 68 },
      distance: "40 m upstream",
      narration: "You are now inside the main canyon corridor. Notice how reflected light warms the wet sandstone while the current becomes stronger underfoot.",
      audio: { direction: 0, gain: .058, frequency: 1120 },
      hotspots: [
        { yaw: -52, pitch: -8, title: "The Canyon Trail", copy: "Water-polished sandstone marks the thrilling inner section of Mujib's Siq trail.", href: "destination?id=wadi-mujib" },
        { yaw: 0, pitch: 3, title: "Upstream Cascade", copy: "The narrow channel carries seasonal water toward a chain of cool natural pools.", href: "explore?category=waters" },
        { yaw: 55, pitch: -13, title: "River Stones", copy: "Rounded stones beneath the clear water reveal the direction and strength of the current.", href: "destination?id=wadi-mujib" }
      ]
    },
    {
      id: "pool",
      title: "Natural Pool",
      copy: "Pause at a clear basin where the canyon briefly opens before narrowing again.",
      image: "assets/panoramas/mujib-pool-8k.jpg",
      image4k: "assets/panoramas/mujib-pool-4k.jpg",
      lowImage: "assets/panoramas/mujib-pool-preview.jpg",
      preview: "assets/panoramas/mujib-pool-preview.jpg",
      start: { yaw: 0, pitch: -5, fov: 68 },
      distance: "85 m upstream",
      narration: "This natural pool forms where the canyon widens. The water appears deeper and calmer, while the stream continues toward the final cascade.",
      audio: { direction: 4, gain: .064, frequency: 1240 },
      hotspots: [
        { yaw: 2, pitch: -13, title: "Clear Basin", copy: "A deeper pocket gathers cool water before it flows back into the narrow channel.", href: "destination?id=wadi-mujib" },
        { yaw: 42, pitch: 5, title: "Layered Sandstone", copy: "Alternating rock bands record long periods of deposition and erosion.", href: "stories" }
      ]
    },
    {
      id: "waterfall",
      title: "Hidden Waterfall",
      copy: "Reach the final cascade where the sound of water fills the narrow canyon.",
      image: "assets/panoramas/mujib-waterfall-8k.jpg",
      image4k: "assets/panoramas/mujib-waterfall-4k.jpg",
      lowImage: "assets/panoramas/mujib-waterfall-preview.jpg",
      preview: "assets/panoramas/mujib-waterfall-preview.jpg",
      start: { yaw: 0, pitch: -3, fov: 66 },
      distance: "140 m upstream · Final stop",
      narration: "You have reached the hidden waterfall. Water descends over dark polished rock into the final basin, completing this short sensory journey through the Siq.",
      audio: { direction: 0, gain: .082, frequency: 1380 },
      hotspots: [
        { yaw: 0, pitch: 6, title: "The Cascade", copy: "Water drops over resistant sandstone ledges into the clear basin below.", href: "destination?id=wadi-mujib" },
        { yaw: -36, pitch: -12, title: "Final Basin", copy: "The cool pool marks the final stop in this guided virtual route.", href: "planner" }
      ]
    }
  ]
};

function sceneForNode(key, index = 0) {
  const base = scenes[key];
  const node = sceneTours[key]?.[index];
  if (!node) return base;
  return { ...base, ...node, label: base.label, kicker: base.kicker, accent: base.accent, destinationId: base.destinationId, guide: base.guide, audio: { ...base.audio, ...node.audio } };
}

const sceneAliases = { all: "history" };
const initialParams = new URLSearchParams(location.search);
let sceneKey = initialParams.get("scene") || "waters";
sceneKey = scenes[sceneKey] ? sceneKey : (sceneAliases[sceneKey] || "waters");
let activeNodeIndex = Math.max(0, sceneTours[sceneKey]?.findIndex((node) => node.id === initialParams.get("node")) ?? 0);
let scene = sceneForNode(sceneKey, activeNodeIndex);
let state = { yaw: 0, pitch: 0, fov: 75 * DEG };
let gl = null;
let program = null;
let texture = null;
let fallbackMode = false;
let motionMode = false;
let soundMode = false;
let userInteracting = false;
let lastFrame = performance.now();
let audioEngine = null;
let saveTimer = null;
let lastHotspotUpdate = 0;
let cameraTarget = null;
let activeHotspotIndex = null;
let guideLanguage = "en";
let voiceReply = false;
let guided = { active: false, index: 0, narrated: false, route: false };
let recognition = null;
let maxTextureSize = 4096;
let activeTextureSize = { width: 0, height: 0 };
let dragVelocity = { yaw: 0, pitch: 0 };
let atmosphereParticles = [];
let sceneLoadSequence = 0;

const sceneDestination = () => scene.destinationId || sceneKey;
const discoveredKey = (key) => `hawa360:discovered:${key}`;
const getDiscovered = () => new Set(JSON.parse(localStorage.getItem(discoveredKey(sceneKey)) || "[]"));

const storageKey = (key) => `hawa360:v2:view:${key}`;
function loadView(key, defaults) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(key)));
    if (Number.isFinite(saved?.yaw) && Number.isFinite(saved?.pitch) && Number.isFinite(saved?.fov)) {
      return { yaw: saved.yaw, pitch: saved.pitch, fov: saved.fov };
    }
  } catch { /* Keep the authored view. */ }
  return { yaw: defaults.yaw * DEG, pitch: defaults.pitch * DEG, fov: defaults.fov * DEG };
}

function saveView() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(storageKey(`${sceneKey}:${scene.id || "main"}`), JSON.stringify(state)); } catch { /* Storage is optional. */ }
  }, 180);
}

function setProgress(percent, label) {
  loaderProgress.style.width = `${percent}%`;
  if (label) loaderLabel.textContent = label;
}

function initWebGL() {
  gl = canvas.getContext("webgl", { antialias: true, alpha: false, powerPreference: "high-performance" });
  if (!gl) return false;
  maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096;
  const vertexSource = `
    attribute vec2 a_position;
    void main(){ gl_Position=vec4(a_position,0.0,1.0); }
  `;
  const fragmentSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform vec2 u_texture_size;
    uniform sampler2D u_panorama;
    uniform float u_yaw;
    uniform float u_pitch;
    uniform float u_fov;
    uniform float u_time;
    uniform float u_effect;
    const float PI=3.141592653589793;
    vec3 panoramaSample(vec2 coordinate){
      coordinate.x=fract(coordinate.x);
      vec3 base=texture2D(u_panorama,coordinate).rgb;
      float seamDistance=min(coordinate.x,1.0-coordinate.x);
      float seamBand=0.018;
      if(seamDistance<seamBand){
        float inset=max(seamDistance,2.0/u_texture_size.x);
        vec3 leftEdge=texture2D(u_panorama,vec2(inset,coordinate.y)).rgb;
        vec3 rightEdge=texture2D(u_panorama,vec2(1.0-inset,coordinate.y)).rgb;
        float feather=1.0-smoothstep(0.0,seamBand,seamDistance);
        base=mix(base,(leftEdge+rightEdge)*0.5,feather*0.94);
      }
      return base;
    }
    void main(){
      vec2 p=(gl_FragCoord.xy*2.0-u_resolution.xy)/u_resolution.y;
      float zoom=tan(u_fov*0.5);
      vec3 ray=normalize(vec3(p.x*zoom,p.y*zoom,1.0));
      float cp=cos(u_pitch),sp=sin(u_pitch);
      ray=vec3(ray.x,ray.y*cp-ray.z*sp,ray.y*sp+ray.z*cp);
      float cy=cos(u_yaw),sy=sin(u_yaw);
      ray=vec3(ray.x*cy+ray.z*sy,ray.y,-ray.x*sy+ray.z*cy);
      float longitude=atan(ray.x,ray.z);
      float latitude=asin(clamp(ray.y,-1.0,1.0));
      vec2 uv=vec2(fract(longitude/(2.0*PI)+0.5),0.5-latitude/PI);
      float water=1.0-step(0.5,abs(u_effect-2.0));
      float waterMask=smoothstep(0.46,0.83,uv.y)*water;
      uv.x=fract(uv.x+(sin(uv.y*122.0+u_time*0.75)+sin(uv.x*91.0-u_time*0.48))*0.00011*waterMask);
      vec2 texel=1.0/u_texture_size;
      vec3 center=panoramaSample(uv);
      vec3 nearby=(panoramaSample(uv+vec2(texel.x,0.0))+panoramaSample(uv-vec2(texel.x,0.0))+panoramaSample(uv+vec2(0.0,texel.y))+panoramaSample(uv-vec2(0.0,texel.y)))*0.25;
      vec3 color=clamp(center*1.11-nearby*0.11,0.0,1.0);
      float shimmer=(sin(uv.x*530.0+u_time*1.6)*sin(uv.y*470.0-u_time*1.1)*0.5+0.5)*waterMask;
      color+=vec3(0.012,0.025,0.028)*shimmer;
      float flame=max(1.0-step(0.55,abs(u_effect-4.0)),1.0-step(0.55,abs(u_effect-3.0)));
      color*=1.0+flame*smoothstep(0.72,0.48,uv.y)*(sin(u_time*7.0)+sin(u_time*11.0))*0.006;
      gl_FragColor=vec4(color,1.0);
    }
  `;
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  };
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch (error) {
    console.warn("WebGL panorama unavailable", error);
    return false;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  program.uniforms = {
    resolution: gl.getUniformLocation(program, "u_resolution"),
    textureSize: gl.getUniformLocation(program, "u_texture_size"),
    panorama: gl.getUniformLocation(program, "u_panorama"),
    yaw: gl.getUniformLocation(program, "u_yaw"),
    pitch: gl.getUniformLocation(program, "u_pitch"),
    fov: gl.getUniformLocation(program, "u_fov"),
    time: gl.getUniformLocation(program, "u_time"),
    effect: gl.getUniformLocation(program, "u_effect")
  };
  gl.uniform1i(program.uniforms.panorama, 0);
  return true;
}

function resizeCanvas() {
  if (!gl) return;
  const dpr = Math.min(window.devicePixelRatio || 1, innerWidth < 800 ? 2 : 2.5);
  const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
}

function resizeAtmosphere() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(atmosphereCanvas.clientWidth * dpr));
  const height = Math.max(1, Math.round(atmosphereCanvas.clientHeight * dpr));
  if (atmosphereCanvas.width !== width || atmosphereCanvas.height !== height) {
    atmosphereCanvas.width = width;
    atmosphereCanvas.height = height;
    atmosphere.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedAtmosphere();
  }
}

function seedAtmosphere() {
  const count = reduceMotion ? 12 : Math.round(clamp(innerWidth / 24, 28, 82));
  atmosphereParticles = Array.from({ length: count }, (_, index) => ({
    x: Math.random(), y: Math.random(), size: .7 + Math.random() * 2.1,
    speed: .012 + Math.random() * .026, drift: (Math.random() - .5) * .018,
    phase: Math.random() * TAU, alpha: .12 + Math.random() * .36, index
  }));
}

function renderAtmosphere(now, delta) {
  if (!atmosphere) return;
  resizeAtmosphere();
  const width = atmosphereCanvas.clientWidth;
  const height = atmosphereCanvas.clientHeight;
  atmosphere.clearRect(0, 0, width, height);
  const effect = sceneEffects[sceneKey];
  atmosphere.globalCompositeOperation = "screen";
  atmosphereParticles.forEach((particle) => {
    const rise = effect === 2 || effect === 3 || effect === 4;
    particle.y += (rise ? -1 : 1) * particle.speed * delta;
    particle.x += (particle.drift + Math.sin(now * .00035 + particle.phase) * .004) * delta;
    if (particle.y < -.04) particle.y = 1.04;
    if (particle.y > 1.04) particle.y = -.04;
    if (particle.x < -.03) particle.x = 1.03;
    if (particle.x > 1.03) particle.x = -.03;
    const pulse = .62 + Math.sin(now * .0015 + particle.phase) * .38;
    const x = particle.x * width + Math.sin(state.yaw + particle.phase) * 18;
    const y = particle.y * height + Math.sin(state.pitch + particle.phase) * 10;
    const colors = { 1: "239,189,105", 2: "145,232,244", 3: "255,184,105", 4: "255,126,52", 5: "198,231,150", 6: "255,196,126" };
    atmosphere.fillStyle = `rgba(${colors[effect] || colors[1]},${particle.alpha * pulse})`;
    const size = particle.size * (effect === 4 ? 1.35 : 1);
    atmosphere.beginPath();
    atmosphere.arc(x, y, size, 0, TAU);
    atmosphere.fill();
  });
  atmosphere.globalCompositeOperation = "source-over";
}

function applyTexture(image) {
  if (!gl) return;
  const nextTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, nextTexture);
  // Equirectangular files use a top-left origin; the shader maps latitude to that layout.
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  const powerOfTwo = (value) => (value & (value - 1)) === 0;
  const supportsWrap = powerOfTwo(image.width) && powerOfTwo(image.height);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, supportsWrap ? gl.REPEAT : gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  if (gl.getError() !== gl.NO_ERROR) {
    gl.deleteTexture(nextTexture);
    throw new Error("The panorama is larger than this graphics device can safely render.");
  }
  if (texture) gl.deleteTexture(texture);
  texture = nextTexture;
  activeTextureSize = { width: image.width, height: image.height };
  const anisotropic = gl.getExtension("EXT_texture_filter_anisotropic") || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
  if (anisotropic) gl.texParameterf(gl.TEXTURE_2D, anisotropic.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl.getParameter(anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
  gl.uniform2f(program.uniforms.textureSize, image.width, image.height);
}

function preferredSceneImage() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const lowMemory = Number(navigator.deviceMemory || 8) < 6;
  const qualityOverride = new URLSearchParams(location.search).get("quality");
  const use4k = qualityOverride === "4k" || maxTextureSize < 8192 || innerWidth < 900 || lowMemory || connection?.saveData;
  return { url: use4k ? scene.image4k : scene.image, label: use4k ? "4K" : "8K" };
}

function loadImage(url, onProgress) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = async () => {
      onProgress?.(82);
      try { await image.decode?.(); } catch { /* Already decoded by the browser. */ }
      resolve(image);
    };
    image.onerror = reject;
    image.src = url;
    onProgress?.(38);
  });
}

function renderSwitcher() {
  sceneSwitcher.innerHTML = Object.entries(scenes).map(([key, item]) => `
    <button class="scene-option${key === sceneKey ? " is-active" : ""}" type="button" data-scene="${key}" aria-pressed="${key === sceneKey}">
      <img src="${item.preview}" alt="" loading="lazy"><span>${item.label}</span>
    </button>`).join("");
}

function renderHotspots() {
  hotspotCard.hidden = true;
  const discovered = getDiscovered();
  hotspotLayer.innerHTML = scene.hotspots.map((hotspot, index) => `
    <button class="hotspot${discovered.has(index) ? " is-discovered" : ""}" type="button" data-hotspot="${index}" aria-label="Learn about ${hotspot.title}">
      <span>${discovered.has(index) ? "✓" : "+"}</span><small>${hotspot.title}</small>
    </button>`).join("");
}

function updateSceneText() {
  document.title = `${scene.title} · 360° — Hawa Jordan`;
  document.documentElement.style.setProperty("--scene-accent", scene.accent);
  document.querySelector("#scene-kicker").textContent = scene.kicker;
  document.querySelector("#scene-title").textContent = scene.title;
  document.querySelector("#scene-copy").textContent = scene.copy;
  document.querySelector("#viewer-exit").href = `explore?category=${scene.exploreCategory || sceneKey}`;
}

function renderRoute() {
  const nodes = sceneTours[sceneKey];
  routeNav.hidden = !nodes?.length;
  viewer.classList.toggle("has-route", Boolean(nodes?.length));
  if (!nodes?.length) return;
  const node = nodes[activeNodeIndex];
  document.querySelector("#route-step").textContent = `STOP ${activeNodeIndex + 1} OF ${nodes.length}`;
  document.querySelector("#route-title").textContent = node.title;
  document.querySelector("#route-distance").textContent = node.distance;
  routePrevious.disabled = activeNodeIndex === 0;
  routeNext.disabled = activeNodeIndex === nodes.length - 1;
  routeNext.setAttribute("aria-label", activeNodeIndex === nodes.length - 1 ? "Route complete" : `Continue to ${nodes[activeNodeIndex + 1].title}`);
  routeDots.innerHTML = nodes.map((item, index) => `<button type="button" data-route-node="${index}" class="${index === activeNodeIndex ? "is-active" : ""}" aria-label="Go to ${item.title}" aria-current="${index === activeNodeIndex ? "step" : "false"}"></button>`).join("");
}

function prefetchAdjacentNodes() {
  const nodes = sceneTours[sceneKey];
  if (!nodes) return;
  [nodes[activeNodeIndex - 1], nodes[activeNodeIndex + 1]].filter(Boolean).forEach((node) => {
    [node.lowImage, node.image4k].forEach((src) => { const image = new Image(); image.decoding = "async"; image.src = src; });
  });
}

async function selectScene(key, { updateHistory = true, nodeIndex = null, transition = false } = {}) {
  if (!scenes[key]) return;
  const requestId = ++sceneLoadSequence;
  sceneKey = key;
  const nodes = sceneTours[key];
  if (nodes?.length) {
    if (Number.isFinite(nodeIndex)) activeNodeIndex = clamp(nodeIndex, 0, nodes.length - 1);
    else {
      const requestedNode = new URLSearchParams(location.search).get("node");
      const requestedIndex = nodes.findIndex((node) => node.id === requestedNode);
      activeNodeIndex = requestedIndex >= 0 ? requestedIndex : clamp(activeNodeIndex, 0, nodes.length - 1);
    }
  } else activeNodeIndex = 0;
  scene = sceneForNode(key, activeNodeIndex);
  const viewStorageId = `${key}:${scene.id || "main"}`;
  state = loadView(viewStorageId, scene.start);
  const sharedHeading = Number(new URLSearchParams(location.search).get("heading"));
  if (Number.isFinite(sharedHeading)) state.yaw = normalizeAngle(sharedHeading * DEG);
  if (innerWidth < 600) state.fov = Math.max(state.fov, 76 * DEG);
  dragVelocity = { yaw: 0, pitch: 0 };
  seedAtmosphere();
  viewer.classList.toggle("is-loading", !transition);
  viewer.classList.toggle("is-node-transitioning", transition);
  if (transition) {
    nodeTransition.hidden = false;
    document.querySelector("#node-transition-title").textContent = `Moving to ${scene.title}…`;
  } else loader.classList.remove("is-ready");
  setProgress(18, `Entering ${scene.label}…`);
  updateSceneText();
  renderSwitcher();
  renderHotspots();
  renderRoute();
  updateGuideContext();
  fallback.style.backgroundImage = `url("${scene.lowImage || scene.image}")`;
  if (updateHistory) {
    const nodeQuery = scene.id ? `&node=${encodeURIComponent(scene.id)}` : "";
    history.replaceState(null, "", `experience360?scene=${key}${nodeQuery}`);
  }
  try {
    const previewImage = await loadImage(scene.lowImage || scene.image, () => setProgress(42, "Opening the scene…"));
    if (requestId !== sceneLoadSequence) return;
    if (gl) applyTexture(previewImage);
    viewer.classList.add("has-preview");
    const preferred = preferredSceneImage();
    setProgress(58, "Loading detailed 4K base…");
    const image = await loadImage(scene.image4k, () => setProgress(86, "Resolving rock, water and light…"));
    if (requestId !== sceneLoadSequence) return;
    if (gl) applyTexture(image);
    setProgress(100, "Immersive scene ready");
    await new Promise((resolve) => requestAnimationFrame(resolve));
    renderStatus.textContent = gl ? `${activeTextureSize.width} × ${activeTextureSize.height} · AI enhanced` : "360 image · Compatible mode";
    liveRegion.textContent = `${scene.title} panorama loaded. Drag to look around.`;
    if (preferred.label === "8K") {
      const requestedScene = key;
      const requestedNode = scene.id;
      loadImage(scene.image).then((ultraImage) => {
        if (sceneKey !== requestedScene || scene.id !== requestedNode || !gl) return;
        applyTexture(ultraImage);
        renderStatus.textContent = `${ultraImage.width} × ${ultraImage.height} · AI enhanced`;
        liveRegion.textContent = `${scene.title} upgraded to full 8K detail.`;
      }).catch(() => { /* Keep the crisp 4K texture on constrained graphics hardware. */ });
    }
  } catch {
    fallbackMode = true;
    fallback.style.display = "block";
    canvas.style.display = "none";
    renderStatus.textContent = "360 image · Compatible mode";
    liveRegion.textContent = "The compatible 360 viewer is active.";
  } finally {
    viewer.classList.remove("is-loading", "has-preview");
    if (transition) {
      viewer.classList.remove("is-node-transitioning");
      setTimeout(() => { nodeTransition.hidden = true; }, reduceMotion ? 0 : 280);
    }
    loader.classList.add("is-ready");
    if (soundMode) restartAudio();
    prefetchAdjacentNodes();
  }
}

function updateHotspots() {
  const rect = canvas.getBoundingClientRect();
  const aspect = rect.width / Math.max(rect.height, 1);
  const verticalFov = state.fov;
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
  hotspotLayer.querySelectorAll(".hotspot").forEach((button) => {
    const item = scene.hotspots[Number(button.dataset.hotspot)];
    const yawDelta = normalizeAngle(item.yaw * DEG - state.yaw);
    const pitchDelta = item.pitch * DEG - state.pitch;
    const visible = Math.abs(yawDelta) < horizontalFov * .56 && Math.abs(pitchDelta) < verticalFov * .62;
    button.hidden = !visible;
    if (!visible) return;
    button.classList.toggle("is-gazed", Math.abs(yawDelta) < horizontalFov * .13 && Math.abs(pitchDelta) < verticalFov * .14);
    const x = .5 + Math.tan(yawDelta) / (2 * Math.tan(horizontalFov / 2));
    const y = .5 + Math.tan(pitchDelta) / (2 * Math.tan(verticalFov / 2));
    const edge = rect.width < 800 ? 25 : 30;
    button.style.left = `${clamp(x * rect.width, edge, rect.width - edge)}px`;
    button.style.top = `${clamp(y * rect.height, 115, rect.height - edge)}px`;
  });
}

function renderFrame(now) {
  const delta = Math.min((now - lastFrame) / 1000, .05);
  lastFrame = now;
  if (cameraTarget && !userInteracting) {
    const speed = reduceMotion ? 1 : Math.min(1, delta * 3.2);
    state.yaw = normalizeAngle(state.yaw + normalizeAngle(cameraTarget.yaw - state.yaw) * speed);
    state.pitch += (cameraTarget.pitch - state.pitch) * speed;
    state.fov += (cameraTarget.fov - state.fov) * speed;
    if (Math.abs(normalizeAngle(cameraTarget.yaw - state.yaw)) < .004 && Math.abs(cameraTarget.pitch - state.pitch) < .004) cameraTarget = null;
  } else if (!userInteracting && !reduceMotion && (Math.abs(dragVelocity.yaw) > .00001 || Math.abs(dragVelocity.pitch) > .00001)) {
    state.yaw = normalizeAngle(state.yaw + dragVelocity.yaw * delta * 60);
    state.pitch = clamp(state.pitch + dragVelocity.pitch * delta * 60, -74 * DEG, 74 * DEG);
    const damping = Math.pow(.9, delta * 60);
    dragVelocity.yaw *= damping;
    dragVelocity.pitch *= damping;
  }
  if (gl && texture) {
    resizeCanvas();
    gl.useProgram(program);
    gl.uniform2f(program.uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1f(program.uniforms.yaw, state.yaw);
    gl.uniform1f(program.uniforms.pitch, state.pitch);
    gl.uniform1f(program.uniforms.fov, state.fov);
    gl.uniform1f(program.uniforms.time, now / 1000);
    gl.uniform1f(program.uniforms.effect, sceneEffects[sceneKey] || 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  } else if (fallbackMode) {
    const x = 50 + normalizeAngle(state.yaw) / Math.PI * 45;
    const y = 50 - state.pitch / (Math.PI / 2) * 30;
    fallback.style.backgroundPosition = `${x}% ${y}%`;
    fallback.style.backgroundSize = `${clamp(190 - state.fov / DEG, 105, 155)}% auto`;
  }
  renderAtmosphere(now, delta);
  if (now - lastHotspotUpdate > 32) {
    updateHotspots();
    lastHotspotUpdate = now;
    const degrees = (state.yaw / DEG + 360) % 360;
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    viewAngle.textContent = `${directions[Math.round(degrees / 45) % 8]} ${Math.round(degrees)}° · ${Math.round(state.fov / DEG)}° FOV`;
    compassNeedle.style.transform = `translateX(-50%) rotate(${-degrees}deg)`;
    if (audioEngine?.panner) {
      const soundDirection = (scene.audio.direction || 0) * DEG;
      audioEngine.panner.pan.value = Math.sin(soundDirection - state.yaw) * .68;
    }
  }
  requestAnimationFrame(renderFrame);
}

const pointers = new Map();
let pinchDistance = 0;
let lastTapTime = 0;
canvas.addEventListener("pointerdown", (event) => {
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY });
  if (pointers.size === 2) {
    const [first, second] = [...pointers.values()];
    pinchDistance = Math.hypot(second.x - first.x, second.y - first.y);
  }
  userInteracting = true;
  dragVelocity = { yaw: 0, pitch: 0 };
  viewer.classList.add("is-dragging");
  canvas.setPointerCapture(event.pointerId);
  hint.classList.add("is-hidden");
});
canvas.addEventListener("pointermove", (event) => {
  const pointer = pointers.get(event.pointerId);
  if (!pointer) return;
  if (pointers.size === 2) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    const [first, second] = [...pointers.values()];
    const distance = Math.hypot(second.x - first.x, second.y - first.y);
    if (pinchDistance) state.fov = clamp(state.fov - (distance - pinchDistance) * .0022, 38 * DEG, 94 * DEG);
    pinchDistance = distance;
    saveView();
    return;
  }
  const sensitivity = .0032 * (state.fov / (75 * DEG));
  const deltaX = event.clientX - pointer.x;
  const deltaY = event.clientY - pointer.y;
  dragVelocity.yaw = -deltaX * sensitivity;
  dragVelocity.pitch = deltaY * sensitivity;
  state.yaw = normalizeAngle(state.yaw + dragVelocity.yaw);
  state.pitch = clamp(state.pitch + dragVelocity.pitch, -74 * DEG, 74 * DEG);
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  saveView();
});
function releasePointer(event) {
  if (!pointers.has(event.pointerId)) return;
  const pointer = pointers.get(event.pointerId);
  const wasTap = Math.hypot(pointer.x - pointer.startX, pointer.y - pointer.startY) < 9;
  pointers.delete(event.pointerId);
  pinchDistance = 0;
  userInteracting = pointers.size > 0;
  viewer.classList.toggle("is-dragging", userInteracting);
  if (wasTap && !userInteracting) {
    const now = performance.now();
    if (now - lastTapTime < 320) {
      cameraTarget = { yaw: state.yaw, pitch: state.pitch, fov: clamp(state.fov - 14 * DEG, 38 * DEG, 94 * DEG) };
      liveRegion.textContent = "View zoomed in. Double tap again or pinch to adjust.";
      lastTapTime = 0;
    } else lastTapTime = now;
  }
}
canvas.addEventListener("pointerup", releasePointer);
canvas.addEventListener("pointercancel", releasePointer);
canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  state.fov = clamp(state.fov + event.deltaY * .00065, 38 * DEG, 94 * DEG);
  hint.classList.add("is-hidden");
  saveView();
}, { passive: false });

window.addEventListener("keydown", (event) => {
  if (/input|textarea/i.test(document.activeElement?.tagName)) return;
  const actions = {
    ArrowLeft: () => state.yaw -= 4 * DEG,
    ArrowRight: () => state.yaw += 4 * DEG,
    ArrowUp: () => state.pitch = clamp(state.pitch + 3 * DEG, -74 * DEG, 74 * DEG),
    ArrowDown: () => state.pitch = clamp(state.pitch - 3 * DEG, -74 * DEG, 74 * DEG),
    "+": () => state.fov = clamp(state.fov - 4 * DEG, 38 * DEG, 94 * DEG),
    "=": () => state.fov = clamp(state.fov - 4 * DEG, 38 * DEG, 94 * DEG),
    "-": () => state.fov = clamp(state.fov + 4 * DEG, 38 * DEG, 94 * DEG)
  };
  if (!actions[event.key]) return;
  event.preventDefault();
  actions[event.key]();
  state.yaw = normalizeAngle(state.yaw);
  hint.classList.add("is-hidden");
  saveView();
});

function rememberHotspot(index) {
  const discovered = getDiscovered();
  discovered.add(index);
  localStorage.setItem(discoveredKey(sceneKey), JSON.stringify([...discovered]));
  const button = hotspotLayer.querySelector(`[data-hotspot="${index}"]`);
  if (button) {
    button.classList.add("is-discovered");
    button.querySelector("span").textContent = "✓";
  }
  if (discovered.size === scene.hotspots.length) {
    const completed = new Set(JSON.parse(localStorage.getItem("hawa360CompletedScenes") || "[]"));
    completed.add(sceneKey);
    localStorage.setItem("hawa360CompletedScenes", JSON.stringify([...completed]));
  }
}

function destinationForHotspot(item = scene.hotspots[activeHotspotIndex]) {
  try {
    const url = new URL(item?.href || "", location.href);
    const candidate = url.searchParams.get("id");
    const known = new Set(["amman", "dead-sea", "petra", "wadi-rum", "aqaba", "jerash", "ajloun", "wadi-mujib", "dana", "salt", "madaba", "umm-qais", "main-hot-springs"]);
    return known.has(candidate) ? candidate : sceneDestination();
  } catch { return sceneDestination(); }
}

function addCurrentPlaceToTrip() {
  const item = scene.hotspots[activeHotspotIndex];
  const id = destinationForHotspot(item);
  const trip = JSON.parse(localStorage.getItem("hawaTrip") || "[]");
  if (!trip.some((place) => place.id === id)) trip.push({ id, title: item?.title || scene.title, image: scene.preview });
  localStorage.setItem("hawaTrip", JSON.stringify(trip));
  const smart = JSON.parse(localStorage.getItem("hawaSmartTripV1") || "null");
  if (smart?.itinerary && !smart.itinerary.includes(id)) {
    smart.itinerary.push(id);
    localStorage.setItem("hawaSmartTripV1", JSON.stringify(smart));
  }
  liveRegion.textContent = `${item?.title || scene.title} added to your trip.`;
  const button = document.querySelector("#add-hotspot-trip");
  if (button) { button.textContent = "✓ Added"; setTimeout(() => { button.textContent = "＋ Add to trip"; }, 1600); }
}

function updateGuideContext() {
  const item = scene.hotspots[activeHotspotIndex];
  document.querySelector("#ai-context-title").textContent = item?.title || scene.title;
  document.querySelector("#ai-context-copy").textContent = item?.copy || scene.copy;
}

function openHotspot(index) {
  const item = scene.hotspots[index];
  if (!item) return;
  activeHotspotIndex = index;
  rememberHotspot(index);
  hotspotLayer.querySelectorAll(".hotspot").forEach((node) => node.classList.toggle("is-active", Number(node.dataset.hotspot) === index));
  document.querySelector("#hotspot-title").textContent = item.title;
  document.querySelector("#hotspot-copy").textContent = item.copy;
  document.querySelector("#hotspot-link").href = item.href;
  hotspotCard.hidden = false;
  updateGuideContext();
  liveRegion.textContent = `${item.title}. ${item.copy}`;
}
hotspotLayer.addEventListener("click", (event) => {
  const button = event.target.closest(".hotspot");
  if (button) openHotspot(Number(button.dataset.hotspot));
});
document.querySelector("#close-hotspot").addEventListener("click", () => {
  hotspotCard.hidden = true;
  hotspotLayer.querySelectorAll(".hotspot").forEach((node) => node.classList.remove("is-active"));
});
document.querySelector("#add-hotspot-trip").addEventListener("click", addCurrentPlaceToTrip);
document.querySelector("#ask-hotspot").addEventListener("click", () => {
  openAiGuide();
  askGuide(guideLanguage === "ar" ? "احكيلي أكثر عن الشيء الذي أنظر إليه" : "Tell me more about what I am looking at.");
});
sceneSwitcher.addEventListener("click", (event) => {
  const button = event.target.closest("[data-scene]");
  if (button && button.dataset.scene !== sceneKey) {
    endGuidedTour();
    activeHotspotIndex = null;
    morePanel.hidden = true;
    document.querySelector("#more-toggle").setAttribute("aria-expanded", "false");
    selectScene(button.dataset.scene).then(updateGuideContext);
  }
});

async function moveAlongRoute(index, { keepGuide = false } = {}) {
  const nodes = sceneTours[sceneKey];
  if (!nodes || index < 0 || index >= nodes.length || index === activeNodeIndex) return;
  if (!keepGuide) endGuidedTour();
  hotspotCard.hidden = true;
  activeHotspotIndex = null;
  await selectScene(sceneKey, { nodeIndex: index, transition: true });
}

routePrevious.addEventListener("click", () => moveAlongRoute(activeNodeIndex - 1));
routeNext.addEventListener("click", () => moveAlongRoute(activeNodeIndex + 1));
routeDots.addEventListener("click", (event) => {
  const button = event.target.closest("[data-route-node]");
  if (button) moveAlongRoute(Number(button.dataset.routeNode));
});

function createNoiseBuffer(context, textureType) {
  const seconds = textureType === "water" ? 4 : 3;
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const data = buffer.getChannelData(0);
  let smooth = 0;
  for (let i = 0; i < data.length; i += 1) {
    const white = Math.random() * 2 - 1;
    smooth = smooth * .985 + white * .015;
    let sample = textureType === "water" ? white * .34 + smooth * 1.2 : smooth * 2.1 + white * .04;
    if (textureType === "fire" && Math.random() < .0008) sample += (Math.random() * 2 - 1) * 2.6;
    if (textureType === "forest") sample += Math.sin(i / context.sampleRate * TAU * 2200) * (Math.random() < .00025 ? .18 : 0);
    data[i] = clamp(sample, -1, 1);
  }
  return buffer;
}

function startAudio() {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) return false;
  const context = new Context();
  const source = context.createBufferSource();
  source.buffer = createNoiseBuffer(context, scene.audio.texture);
  source.loop = true;
  const filter = context.createBiquadFilter();
  filter.type = scene.audio.type;
  filter.frequency.value = scene.audio.frequency;
  filter.Q.value = scene.audio.type === "bandpass" ? .55 : .4;
  const gain = context.createGain();
  gain.gain.setValueAtTime(0, context.currentTime);
  gain.gain.linearRampToValueAtTime(scene.audio.gain, context.currentTime + 1.2);
  const panner = context.createStereoPanner ? context.createStereoPanner() : null;
  if (panner) source.connect(filter).connect(panner).connect(gain).connect(context.destination);
  else source.connect(filter).connect(gain).connect(context.destination);
  source.start();
  audioEngine = { context, source, gain, panner };
  return true;
}
function stopAudio() {
  const engine = audioEngine;
  audioEngine = null;
  try {
    if (engine) {
      engine.gain.gain.linearRampToValueAtTime(0, engine.context.currentTime + .18);
      setTimeout(() => { try { engine.source.stop(); engine.context.close(); } catch { /* Already stopped. */ } }, 220);
    }
  } catch { /* Audio is optional. */ }
}
function restartAudio() { stopAudio(); setTimeout(startAudio, 240); }

const soundButton = document.querySelector("#sound-toggle");
soundButton.addEventListener("click", () => {
  soundMode = !soundMode;
  soundButton.setAttribute("aria-pressed", String(soundMode));
  soundButton.querySelector("span").textContent = soundMode ? "●" : "◖";
  if (soundMode) {
    if (!startAudio()) liveRegion.textContent = "Ambient audio is not supported by this browser.";
    else liveRegion.textContent = `${scene.label} ambient sound on.`;
  } else {
    stopAudio();
    liveRegion.textContent = "Ambient sound off.";
  }
});

function speak(text, language = guideLanguage) {
  if (!("speechSynthesis" in window) || !text) return false;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === "ar" ? "ar-JO" : "en-GB";
  utterance.rate = .92;
  speechSynthesis.speak(utterance);
  return true;
}

function focusHotspot(index) {
  const item = scene.hotspots[index];
  if (!item) return;
  cameraTarget = { yaw: item.yaw * DEG, pitch: item.pitch * DEG, fov: 56 * DEG };
  setTimeout(() => { if (guided.active && guided.index === index) openHotspot(index); }, reduceMotion ? 50 : 760);
}

async function showTourStop(index) {
  const items = guided.route ? sceneTours[sceneKey] : scene.hotspots;
  guided.index = clamp(index, 0, items.length - 1);
  const item = items[guided.index];
  document.querySelector("#tour-step").textContent = `${guided.index + 1} / ${items.length}`;
  document.querySelector("#tour-title").textContent = item.title;
  document.querySelector("#tour-progress-bar").style.width = `${(guided.index + 1) / items.length * 100}%`;
  document.querySelector("#tour-previous").disabled = guided.index === 0;
  document.querySelector("#tour-next").textContent = guided.index === items.length - 1 ? "Finish ✓" : "Next →";
  if (guided.route) {
    if (activeNodeIndex !== guided.index) await moveAlongRoute(guided.index, { keepGuide: true });
    cameraTarget = { yaw: (item.start?.yaw || 0) * DEG, pitch: (item.start?.pitch || 0) * DEG, fov: 58 * DEG };
  } else focusHotspot(guided.index);
  if (guided.narrated) setTimeout(() => speak(item.narration || `${item.title}. ${item.copy}`, "en"), reduceMotion ? 100 : 700);
}

function startGuidedTour() {
  const route = Boolean(sceneTours[sceneKey]?.length);
  guided = { active: true, index: route ? activeNodeIndex : 0, narrated: true, route };
  tourCard.hidden = false;
  hotspotCard.hidden = true;
  aiPanel.hidden = true;
  morePanel.hidden = true;
  document.querySelector("#guided-tour-toggle").setAttribute("aria-pressed", "true");
  document.querySelector("#tour-narration").setAttribute("aria-pressed", "true");
  document.querySelector("#tour-narration").textContent = "Narration on";
  showTourStop(0);
  liveRegion.textContent = `Guided tour of ${scene.title} started.`;
}

function endGuidedTour() {
  if (!guided.active && tourCard.hidden) return;
  guided.active = false;
  cameraTarget = null;
  tourCard.hidden = true;
  document.querySelector("#guided-tour-toggle").setAttribute("aria-pressed", "false");
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

document.querySelector("#guided-tour-toggle").addEventListener("click", () => guided.active ? endGuidedTour() : startGuidedTour());
document.querySelector("#close-guided-tour").addEventListener("click", endGuidedTour);
document.querySelector("#tour-previous").addEventListener("click", () => showTourStop(guided.index - 1));
document.querySelector("#tour-next").addEventListener("click", () => {
  const items = guided.route ? sceneTours[sceneKey] : scene.hotspots;
  if (guided.index === items.length - 1) {
    if (!guided.route) rememberHotspot(guided.index);
    else {
      const completed = new Set(JSON.parse(localStorage.getItem("hawa360CompletedScenes") || "[]"));
      completed.add(sceneKey);
      localStorage.setItem("hawa360CompletedScenes", JSON.stringify([...completed]));
    }
    endGuidedTour();
    liveRegion.textContent = `${scene.title} tour completed. Sensory Explorer progress updated.`;
  } else showTourStop(guided.index + 1);
});
document.querySelector("#tour-narration").addEventListener("click", (event) => {
  guided.narrated = !guided.narrated;
  event.currentTarget.setAttribute("aria-pressed", String(guided.narrated));
  event.currentTarget.textContent = guided.narrated ? "Narration on" : "Listen";
  if (guided.narrated) {
    const item = guided.route ? sceneTours[sceneKey][guided.index] : scene.hotspots[guided.index];
    speak(item.narration || `${item.title}. ${item.copy}`, "en");
  } else if ("speechSynthesis" in window) speechSynthesis.cancel();
});

const motionButton = document.querySelector("#motion-toggle");
function handleOrientation(event) {
  if (!motionMode || event.alpha == null || event.beta == null) return;
  state.yaw = normalizeAngle(-event.alpha * DEG);
  state.pitch = clamp((event.beta - 75) * DEG, -66 * DEG, 66 * DEG);
}
motionButton.addEventListener("click", async () => {
  if (motionMode) {
    motionMode = false;
    motionButton.setAttribute("aria-pressed", "false");
    window.removeEventListener("deviceorientation", handleOrientation);
    return;
  }
  try {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission !== "granted") throw new Error("permission denied");
    }
    if (!("DeviceOrientationEvent" in window)) throw new Error("unsupported");
    motionMode = true;
    motionButton.setAttribute("aria-pressed", "true");
    window.addEventListener("deviceorientation", handleOrientation);
    liveRegion.textContent = "Move your phone to look around the panorama.";
  } catch {
    liveRegion.textContent = "Motion viewing is unavailable. Drag the scene with one finger instead.";
  }
});

document.querySelector("#reset-view").addEventListener("click", () => {
  state = { yaw: scene.start.yaw * DEG, pitch: scene.start.pitch * DEG, fov: scene.start.fov * DEG };
  hotspotCard.hidden = true;
  liveRegion.textContent = "View reset.";
  saveView();
});
document.querySelector("#fullscreen-view").addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) await viewer.requestFullscreen();
    else await document.exitFullscreen();
  } catch { liveRegion.textContent = "Fullscreen is unavailable in this browser."; }
});

function setPanelState(panel, open, trigger) {
  panel.hidden = !open;
  trigger?.setAttribute("aria-expanded", String(open));
  if (panel === aiPanel) routeNav.classList.toggle("is-suppressed", open);
}

const moreButton = document.querySelector("#more-toggle");
moreButton.addEventListener("click", () => {
  const open = morePanel.hidden;
  setPanelState(aiPanel, false, document.querySelector("#ai-guide-toggle"));
  setPanelState(morePanel, open, moreButton);
});
document.querySelector("#close-more").addEventListener("click", () => setPanelState(morePanel, false, moreButton));

function addGuideMessage(role, text, loading = false) {
  const message = document.createElement("div");
  message.className = `ai-message ai-message--${role}${loading ? " is-loading" : ""}`;
  if (loading) message.innerHTML = "<i></i><i></i><i></i>";
  else message.textContent = text;
  aiMessages.append(message);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  return message;
}

function localArabicGuide(question) {
  const item = scene.hotspots[activeHotspotIndex];
  const route = sceneTours[sceneKey];
  const nextStop = route?.[activeNodeIndex + 1];
  const facts = {
    desert: { best: "أفضل وقت لوادي رم من أكتوبر إلى أبريل، وخصوصًا الساعتين الأخيرتين قبل الغروب.", practical: "خذ ماءً وقطعة ملابس دافئة للمساء، واختر دليلًا محليًا مرخصًا للمسارات البعيدة." },
    waters: { best: "الموسم الدافئ هو الأنسب عادةً، لكن يجب التأكد من فتح المسار وتحذيرات السيول قبل الانطلاق.", practical: "ارتدِ حذاءً مناسبًا للماء ولا تدخل الوادي عند توقع المطر أو السيول." },
    history: { best: "الوصول عند وقت الافتتاح يمنحك ضوءًا ألطف وحرارة أقل وازدحامًا أخف داخل السيق.", practical: "خصص يومًا كاملًا، والبس حذاء مشي مريحًا واحمل كمية كافية من الماء." },
    food: { best: "بعد الغروب وقت جميل للعشاء البدوي عندما يبرد الجو وتظهر إضاءة المخيم.", practical: "أخبر المضيف مسبقًا عن أي حساسية غذائية، وتناول القهوة أو الشاي باليد اليمنى." },
    nature: { best: "صباحات الربيع هي الأكثر خضرة، بينما يكون الخريف هادئًا ومناسبًا للمشي الطويل.", practical: "التزم بالمسارات المحددة، واحمل الماء وقطعة خفيفة لأن مرتفعات عجلون أبرد من عمّان." },
    local: { best: "من آخر العصر حتى بداية المساء تكون الأسواق أكثر حيوية والطقس ألطف للمشي.", practical: "احتفظ بنقد بسيط، واستأذن قبل تصوير الناس، وانتبه لمقتنياتك مثل أي وسط مدينة." }
  }[scene.exploreCategory || sceneKey];
  if (/التالي|بعدها|بعد ذلك|أروح|اروح|وين/.test(question) && route) return nextStop ? `محطتك التالية هي ${nextStop.title}، وتبعد تقريباً ${nextStop.distance}. اضغط السهم المتجه للأمام للانتقال إليها داخل الجولة.` : "أنت الآن في المحطة الأخيرة من الجولة. يمكنك إضافتها إلى رحلتك أو الرجوع إلى إحدى المحطات السابقة.";
  if (/وقت|متى|افضل|أفضل/.test(question)) return facts.best;
  if (/قريب|الآن|هسا|اعمل|نشاط/.test(question)) return `أقترح أن تبدأ من ${item?.title || scene.title}، وبعدها أستطيع فتح توصيات “ماذا أفعل الآن؟” حسب وقتك وموقعك.`;
  if (/نصيحة|أمان|احتياط|البس|آخذ/.test(question)) return facts.practical;
  if (item) return `${item.title}: ${item.copy} يمكنني أيضًا إعطاؤك أفضل وقت للزيارة أو إضافته مباشرةً إلى رحلتك.`;
  return `${scene.title} يمثل تجربة ${scene.label} في الأردن. اسألني عن أفضل وقت، نصائح الزيارة، أو الأنشطة القريبة.`;
}

function localGuideAnswer(question) {
  const arabic = guideLanguage === "ar" || /[\u0600-\u06ff]/.test(question);
  if (arabic) return { answer: localArabicGuide(question), source: "curated", action: /قريب|الآن|هسا|اعمل|نشاط/.test(question) ? "nearby" : "place" };
  const item = scene.hotspots[activeHotspotIndex];
  const q = question.toLowerCase();
  const route = sceneTours[sceneKey];
  const nextStop = route?.[activeNodeIndex + 1];
  if (/next|continue|where.*go|go next/.test(q) && route) return { answer: nextStop ? `Your next stop is ${nextStop.title} (${nextStop.distance}). Use the forward route arrow to move there.` : "You have reached the final stop. You can revisit an earlier point or add Wadi Mujib to your trip.", source: "curated", action: "place" };
  if (/best time|when|sunset|morning/.test(q)) return { answer: scene.guide.bestTime, source: "curated", action: "place" };
  if (/safe|wear|bring|prepare|practical/.test(q)) return { answer: scene.guide.practical, source: "curated", action: "place" };
  if (/near|now|today|do here|activity/.test(q)) return { answer: `Start with ${item?.title || scene.title}. I can also open live recommendations shaped by your location, time, weather and budget.`, source: "curated", action: "nearby" };
  if (item) return { answer: `${item.title}: ${item.copy} ${scene.guide.practical}`, source: "curated", action: "place" };
  return { answer: `${scene.title} is part of Jordan's ${scene.label.toLowerCase()} experience. ${scene.copy} ${scene.guide.bestTime}`, source: "curated", action: "place" };
}

function readStoredJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") || fallback; }
  catch { return fallback; }
}

function travelerContext() {
  const preferences = readStoredJson("hawaNowPreferences", {});
  const weather = readStoredJson("hawaWeatherCache", {});
  const smartTrip = readStoredJson("hawaSmartTripV1", {});
  const legacyTrip = readStoredJson("hawaTrip", []);
  return {
    localTime: new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Amman", dateStyle: "medium", timeStyle: "short" }).format(new Date()),
    area: typeof preferences.location === "string" ? preferences.location : sceneDestination(),
    availableHours: Number.isFinite(preferences.time) ? preferences.time : null,
    budgetJod: Number.isFinite(preferences.budget) ? preferences.budget : null,
    mood: typeof preferences.mood === "string" ? preferences.mood : null,
    weather: Number.isFinite(weather.temperature) && Date.now() - Number(weather.at || 0) < 21600000 ? { temperatureC: weather.temperature, code: weather.code, windKmh: weather.wind, observedAt: weather.at } : null,
    trip: Array.isArray(smartTrip.itinerary) ? smartTrip.itinerary.slice(0, 12) : legacyTrip.map((item) => item.id).filter(Boolean).slice(0, 12),
    passport: readStoredJson("hawaPassport", []).slice(0, 20)
  };
}

async function remoteGuideAnswer(question) {
  const route = sceneTours[sceneKey];
  const payload = {
    question,
    language: guideLanguage,
    scene: sceneKey,
    heading: Math.round((state.yaw / DEG + 360) % 360),
    hotspot: activeHotspotIndex == null ? null : scene.hotspots[activeHotspotIndex],
    context: { title: scene.title, label: scene.label, copy: scene.copy, bestTime: scene.guide.bestTime, practical: scene.guide.practical, visualSimulation: true },
    route: route ? { stop: activeNodeIndex + 1, totalStops: route.length, stopId: scene.id, nextStop: route[activeNodeIndex + 1]?.title || null } : null,
    traveler: travelerContext()
  };
  try {
    const services = await getFirebaseServices();
    if (services?.functions && services.functionsSdk) {
      const callGuide = services.functionsSdk.httpsCallable(services.functions, "hawaGuide");
      const result = await callGuide(payload);
      if (result.data?.answer) return result.data;
    }
  } catch (error) {
    console.info("Cloud Hawa guide unavailable; trying the local AI gateway.", error?.message || error);
  }
  try {
    const response = await fetch("/api/hawa-guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(22_000)
    });
    if (!response.ok) throw new Error(`Local AI gateway returned ${response.status}`);
    const result = await response.json();
    return result.answer ? result : null;
  } catch (error) {
    console.info("Gemini unavailable; using the curated offline guide.", error?.message || error);
    return null;
  }
}

function renderGuideActions(action = "place") {
  aiActionRow.hidden = false;
  const id = sceneDestination();
  aiActionRow.innerHTML = action === "nearby"
    ? `<a href="now">Open live suggestions</a><button type="button" data-ai-action="add">Add this place</button>`
    : `<a href="destination?id=${encodeURIComponent(id)}">View place</a><button type="button" data-ai-action="add">Add to trip</button>`;
}

async function askGuide(question) {
  const clean = question.trim().slice(0, 280);
  if (!clean) return;
  addGuideMessage("user", clean);
  document.querySelector("#ai-question").value = "";
  const loading = addGuideMessage("guide", "", true);
  const answer = await remoteGuideAnswer(clean) || localGuideAnswer(clean);
  loading.remove();
  addGuideMessage("guide", answer.answer);
  renderGuideActions(answer.action);
  if (voiceReply) speak(answer.answer);
  const arabicUi = guideLanguage === "ar" || /[\u0600-\u06ff]/.test(clean);
  document.querySelector("#ai-disclaimer").textContent = answer.source === "gemini"
    ? (arabicUi ? "إجابة مباشرة من Gemini مبنية على سياق المشهد · تحقّق من المواعيد والتنبيهات المباشرة." : "Live Gemini answer grounded in this scene · Confirm live hours and safety notices.")
    : (arabicUi ? "إجابة محلية محفوظة · Gemini غير متاح حالياً." : "Curated offline answer · Gemini is unavailable right now.");
}

function openAiGuide() {
  endGuidedTour();
  setPanelState(morePanel, false, moreButton);
  setPanelState(aiPanel, true, document.querySelector("#ai-guide-toggle"));
  updateGuideContext();
  const routeSuggestion = document.querySelectorAll("#ai-suggestions button")[2];
  if (sceneTours[sceneKey] && routeSuggestion) {
    routeSuggestion.dataset.guideQuestion = guideLanguage === "ar" ? "وين المحطة التالية؟" : "Where do I go next?";
    routeSuggestion.textContent = guideLanguage === "ar" ? "المحطة التالية" : "Where next?";
  }
  if (!aiMessages.children.length) addGuideMessage("guide", guideLanguage === "ar" ? "أهلًا! أنا هوى. اسألني عن المكان الذي أمامك أو عن أفضل شيء يمكنك فعله الآن." : "Hello! I’m Hawa. Ask about what you see, the best time to visit, or what you can do nearby.");
}

const aiToggle = document.querySelector("#ai-guide-toggle");
aiToggle.addEventListener("click", () => aiPanel.hidden ? openAiGuide() : setPanelState(aiPanel, false, aiToggle));
document.querySelector("#close-ai-guide").addEventListener("click", () => setPanelState(aiPanel, false, aiToggle));
document.querySelector("#ai-guide-form").addEventListener("submit", (event) => { event.preventDefault(); askGuide(document.querySelector("#ai-question").value); });
document.querySelector("#ai-suggestions").addEventListener("click", (event) => { const button = event.target.closest("[data-guide-question]"); if (button) askGuide(button.dataset.guideQuestion); });
aiActionRow.addEventListener("click", (event) => { if (event.target.closest('[data-ai-action="add"]')) addCurrentPlaceToTrip(); });
const aiLanguageButton = document.querySelector("#ai-language");
function setGuideLanguage(language) {
  guideLanguage = language === "ar" ? "ar" : "en";
  aiLanguageButton.textContent = guideLanguage === "en" ? "AR" : "EN";
  aiPanel.dir = guideLanguage === "ar" ? "rtl" : "ltr";
  document.querySelector("#ai-question").placeholder = guideLanguage === "ar" ? "اسأل عن هذا المكان…" : "Ask about this place…";
  const suggestions = guideLanguage === "ar"
    ? [["ماذا أشاهد أمامي؟","ماذا أشاهد؟"],["ما أفضل وقت للزيارة؟","أفضل وقت للزيارة"],["ماذا أستطيع أن أفعل قريبًا الآن؟","ماذا أفعل قريبًا؟"]]
    : [["What am I looking at?","What am I looking at?"],["What is the best time to visit?","Best time to visit"],["What can I do nearby right now?","What can I do nearby?"]];
  document.querySelectorAll("#ai-suggestions button").forEach((button, index) => { button.dataset.guideQuestion = suggestions[index][0]; button.textContent = suggestions[index][1]; });
  if (sceneTours[sceneKey]) {
    const routeSuggestion = document.querySelectorAll("#ai-suggestions button")[2];
    routeSuggestion.dataset.guideQuestion = guideLanguage === "ar" ? "وين المحطة التالية؟" : "Where do I go next?";
    routeSuggestion.textContent = guideLanguage === "ar" ? "المحطة التالية" : "Where next?";
  }
}
aiLanguageButton.addEventListener("click", () => setGuideLanguage(guideLanguage === "en" ? "ar" : "en"));
window.addEventListener("hawa:language-change", (event) => setGuideLanguage(event.detail.language));
setGuideLanguage(window.HawaI18n?.language || "en");

document.querySelector("#ai-voice-output").addEventListener("click", (event) => {
  voiceReply = !voiceReply;
  event.currentTarget.setAttribute("aria-pressed", String(voiceReply));
  event.currentTarget.textContent = voiceReply ? "●" : "◖";
  liveRegion.textContent = voiceReply ? "Guide voice replies enabled." : "Guide voice replies disabled.";
});

document.querySelector("#ai-voice-input").addEventListener("click", () => {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    voiceReply = !voiceReply;
    liveRegion.textContent = voiceReply ? "Voice replies enabled." : "Voice replies disabled.";
    return;
  }
  recognition?.abort();
  recognition = new Recognition();
  recognition.lang = guideLanguage === "ar" ? "ar-JO" : "en-GB";
  recognition.interimResults = false;
  recognition.onresult = (event) => { const text = event.results[0][0].transcript; document.querySelector("#ai-question").value = text; askGuide(text); };
  recognition.onerror = () => { liveRegion.textContent = "Voice input is unavailable. Type your question instead."; };
  recognition.start();
  liveRegion.textContent = "Listening…";
});

document.querySelectorAll("[data-view-mode]").forEach((button) => button.addEventListener("click", () => {
  sessionStorage.setItem("hawa360Welcomed", "1");
  welcome.hidden = true;
  if (button.dataset.viewMode === "guided") startGuidedTour();
  else if (button.dataset.viewMode === "motion") motionButton.click();
  else { hint.classList.remove("is-hidden"); liveRegion.textContent = "Free exploration started. Drag to look around."; }
}));

if ("DeviceOrientationEvent" in window) {
  document.querySelector("#welcome-motion").hidden = false;
  welcome.classList.add("has-motion");
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pagehide", () => { saveView(); stopAudio(); });
document.addEventListener("visibilitychange", () => {
  if (!audioEngine) return;
  if (document.hidden) audioEngine.context.suspend();
  else audioEngine.context.resume();
});
canvas.addEventListener("webglcontextlost", (event) => {
  event.preventDefault();
  fallbackMode = true;
  fallback.style.display = "block";
  liveRegion.textContent = "The compatible panorama view is active.";
});
canvas.addEventListener("webglcontextrestored", () => location.reload());

fallbackMode = !initWebGL();
if (fallbackMode) {
  fallback.style.display = "block";
  canvas.style.display = "none";
}
renderSwitcher();
selectScene(sceneKey, { updateHistory: false });
updateGuideContext();
if (sessionStorage.getItem("hawa360Welcomed") || new URLSearchParams(location.search).get("mode") === "free") welcome.hidden = true;
requestAnimationFrame(renderFrame);
setTimeout(() => hint.classList.add("is-hidden"), 7000);
setTimeout(() => Object.values(scenes).forEach((item) => { if (item.lowImage !== scene.lowImage) { const image = new Image(); image.src = item.lowImage; } }), 2200);
