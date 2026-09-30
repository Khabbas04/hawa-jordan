const destinationData = {
  petra: { title:"Petra", subtitle:"The Rose-Red City", category:"History", rating:"4.8", location:"Ma'an, Jordan", tags:["History","Culture","Hiking","Photography"], description:"A timeless city carved into rose-red cliffs. Walk through history and feel the stories in every stone.", image:"assets/panoramas/history-petra-360-4k-v3.jpg", panoramaScene:"history" },
  "wadi-rum": { title:"Wadi Rum", subtitle:"The Valley of the Moon", category:"Desert", rating:"4.9", location:"Aqaba, Jordan", tags:["Desert","Adventure","Stargazing","Culture"], description:"Travel across immense sandstone valleys where silence, stars and Bedouin hospitality shape an unforgettable night.", image:"assets/images/desert-wadi-rum.jpg" },
  "wadi-rum-sunset": { title:"Sunset Point", subtitle:"Wadi Rum in Gold", category:"Desert", rating:"4.9", location:"Wadi Rum, Jordan", tags:["Sunset","Desert","Photography"], description:"Watch the desert change color as the last light moves across Wadi Rum's cliffs and open sand.", image:"assets/backgrounds/now-wadi-rum-sunset.png" },
  "wadi-mujib": { title:"Wadi Mujib", subtitle:"Jordan's Grand Canyon", category:"Waters", rating:"4.8", location:"Madaba, Jordan", tags:["Waters","Canyoning","Adventure","Nature"], description:"Follow cool water through towering sandstone walls in one of Jordan's most exhilarating natural adventures.", image:"assets/panoramas/waters-wadi-mujib-360-4k-v3.jpg", panoramaScene:"waters" },
  "dead-sea": { title:"Dead Sea", subtitle:"Float Below Sea Level", category:"Waters", rating:"4.7", location:"Jordan Valley", tags:["Wellness","Water","Sunset"], description:"Float effortlessly in mineral-rich water and watch the sun settle across the lowest point on Earth.", image:"assets/panoramas/waters-dead-sea-360-4k-v3.jpg", panoramaScene:"waters-dead-sea" },
  jerash: { title:"Jerash", subtitle:"The City of Columns", category:"History", rating:"4.7", location:"Jerash, Jordan", tags:["History","Roman","Architecture","Culture"], description:"Walk along colonnaded streets and plazas that preserve one of the world's most complete Roman cities.", image:"assets/panoramas/history-jerash-360-4k-v3.jpg", panoramaScene:"history-jerash" },
  ajloun: { title:"Ajloun", subtitle:"Jordan's Green Highlands", category:"Nature", rating:"4.6", location:"Ajloun, Jordan", tags:["Nature","Hiking","Forest","Views"], description:"Breathe among oak forests, quiet trails and rolling highlands in Jordan's lush northern landscape.", image:"assets/images/nature-ajloun.jpg" },
  mansaf: { title:"Mansaf Experience", subtitle:"Jordan at the Table", category:"Food", rating:"4.9", location:"Amman, Jordan", tags:["Food","Culture","Local Life"], description:"Share Jordan's national dish around a generous table and discover the meaning of local hospitality.", image:"assets/images/food-jordanian-table.jpg" },
  "bedouin-camp": { title:"Bedouin Camp", subtitle:"A Night Beneath the Stars", category:"Local Life", rating:"4.9", location:"Wadi Rum, Jordan", tags:["Bedouin","Stargazing","Culture","Desert"], description:"Gather around the fire, share stories and experience the warmth of Bedouin hospitality beneath Wadi Rum's open sky.", image:"assets/backgrounds/auth-petra-night.jpg" },
  "little-petra": { title:"Little Petra", subtitle:"The Hidden Caravan Stop", category:"History", rating:"4.6", location:"Al Beidha, Jordan", tags:["History","Nabataean","Architecture","Hiking"], description:"Enter a quieter Nabataean settlement where carved facades and narrow passages preserve the memory of ancient trade routes.", image:"assets/backgrounds/main.png" },
  "wadi-bin-hammad": { title:"Wadi Bin Hammad", subtitle:"A Garden Between Canyons", category:"Waters", rating:"4.7", location:"Karak, Jordan", tags:["Canyon","Water","Hiking","Nature"], description:"Walk through flowing water, hanging gardens and warm canyon walls in one of southern Jordan's most refreshing escapes.", image:"assets/panoramas/waters-bin-hammad-360-4k-v3.jpg", panoramaScene:"waters-bin-hammad" },
  "main-hot-springs": { title:"Ma'in Hot Springs", subtitle:"Water Born from the Mountains", category:"Wellness", rating:"4.7", location:"Madaba, Jordan", tags:["Thermal","Wellness","Waterfalls","Relaxation"], description:"Rest beneath mineral-rich waterfalls that descend through a dramatic volcanic landscape near the Dead Sea.", image:"assets/panoramas/waters-main-hot-springs-360-4k-v3.jpg", panoramaScene:"waters-main-hot-springs" },
  aqaba: { title:"Aqaba Red Sea", subtitle:"Jordan's Window to the Sea", category:"Waters", rating:"4.8", location:"Aqaba, Jordan", tags:["Red Sea","Diving","Beach","Coral"], description:"Discover clear water, colorful reefs and warm coastal evenings on Jordan's southern shore.", image:"assets/panoramas/waters-aqaba-360-4k-v3.jpg", panoramaScene:"waters-aqaba" },
  "amman-citadel": { title:"Amman Citadel", subtitle:"Above the White City", category:"History", rating:"4.7", location:"Amman, Jordan", tags:["History","Archaeology","Views","Culture"], description:"Stand among layers of Roman, Byzantine and Umayyad history while modern Amman unfolds across the surrounding hills.", image:"assets/panoramas/history-amman-citadel-360-4k-v3.jpg", panoramaScene:"history-amman-citadel" },
  "umm-qais": { title:"Umm Qais", subtitle:"Stone, Village and Valley", category:"History", rating:"4.7", location:"Irbid, Jordan", tags:["Decapolis","Village","Views","Local Life"], description:"Explore basalt ruins, welcoming village life and sweeping views over the Jordan Valley and Sea of Galilee.", image:"assets/panoramas/history-umm-qais-360-4k-v3.jpg", panoramaScene:"history-umm-qais" },
  "amman-food": { title:"Amman Food Walk", subtitle:"The City, One Bite at a Time", category:"Food", rating:"4.8", location:"Amman, Jordan", tags:["Street Food","Markets","Culture","Walking"], description:"Follow the aromas of downtown bakeries, falafel counters and spice shops through Amman's lively streets.", image:"assets/panoramas/amman-market-360-preview-v2.jpg" },
  "bedouin-dinner": { title:"Bedouin Dinner", subtitle:"Fire, Flavor and Welcome", category:"Food", rating:"4.9", location:"Wadi Rum, Jordan", tags:["Food","Bedouin","Desert","Culture"], description:"Share zarb cooked beneath the sand and a generous evening shaped by desert hospitality.", image:"assets/panoramas/bedouin-table-360-preview-v2.jpg" },
  "jerash-kitchen": { title:"Local Kitchen", subtitle:"Recipes Shared in Jerash", category:"Food", rating:"4.8", location:"Jerash, Jordan", tags:["Cooking","Family","Tradition","Local Life"], description:"Cook seasonal Jordanian dishes with a local family and learn the stories carried in every recipe.", image:"assets/images/jerash-local-kitchen-v2.jpg" },
  dana: { title:"Dana Reserve", subtitle:"From Highlands to Desert", category:"Nature", rating:"4.9", location:"Tafilah, Jordan", tags:["Nature","Hiking","Wildlife","Views"], description:"Follow ancient trails through a remarkable biosphere that descends from cool stone villages to the Araba desert.", image:"assets/images/dana-reserve-v2.jpg" },
  dibbeen: { title:"Dibbeen Forest", subtitle:"Among Pine and Oak", category:"Nature", rating:"4.6", location:"Jerash, Jordan", tags:["Forest","Picnic","Hiking","Nature"], description:"Breathe beneath Aleppo pine and evergreen oak in one of Jordan's most peaceful northern forests.", image:"assets/panoramas/ajloun-360-preview-v2.jpg" },
  salt: { title:"Old Salt", subtitle:"Hills of Hospitality", category:"Local Life", rating:"4.7", location:"Al-Salt, Jordan", tags:["Heritage","Community","Architecture","Food"], description:"Walk golden-stone lanes and meet a city celebrated for neighborly warmth, shared tables and living heritage.", image:"assets/images/history-jerash.jpg" },
  "amman-market": { title:"Amman Markets", subtitle:"The Rhythm of Downtown", category:"Local Life", rating:"4.7", location:"Amman, Jordan", tags:["Markets","Shopping","Food","City Life"], description:"Move through colorful produce stalls, spice shops and busy streets where everyday Amman comes vividly to life.", image:"assets/panoramas/amman-market-360-preview-v2.jpg" }
};

const fallback = { ...destinationData.petra };
const id = new URLSearchParams(location.search).get("id") || "petra";
const destination = destinationData[id] || { ...fallback, title: id.split("-").map(part=>part.charAt(0).toUpperCase()+part.slice(1)).join(" ") };

document.querySelector("#destination-title").textContent=destination.title;
document.querySelector("#destination-subtitle").textContent=destination.subtitle;
document.querySelector("#breadcrumb-category").textContent=destination.category;
document.querySelector("#destination-rating").textContent=destination.rating;
document.querySelector("#destination-location").textContent=destination.location;
document.querySelector("#destination-description").textContent=destination.description;
document.querySelector("#destination-backdrop").style.backgroundImage=`url("${destination.image}")`;
document.querySelector("#destination-tags").innerHTML=destination.tags.slice(0,3).map(tag=>`<span>${tag}</span>`).join("");
document.title=`${destination.title} — Hawa Jordan`;

const historyGallery=[
  destination.image,
  "assets/panoramas/history-petra-360-preview-v3.jpg",
  "assets/panoramas/history-jerash-360-preview-v3.jpg",
  "assets/panoramas/history-amman-citadel-360-preview-v3.jpg",
  "assets/panoramas/history-umm-qais-360-preview-v3.jpg"
];
const watersGallery=[
  destination.image,
  "assets/panoramas/waters-wadi-mujib-360-preview-v3.jpg",
  "assets/panoramas/waters-dead-sea-360-preview-v3.jpg",
  "assets/panoramas/waters-bin-hammad-360-preview-v3.jpg",
  "assets/panoramas/waters-main-hot-springs-360-preview-v3.jpg",
  "assets/panoramas/waters-aqaba-360-preview-v3.jpg"
];
const mediaImages=destination.category==="History"
  ? [...new Set(historyGallery)].slice(0,4)
  : ["Waters","Wellness"].includes(destination.category)
    ? [...new Set(watersGallery)].slice(0,4)
    : [destination.image,"assets/images/desert-wadi-rum.jpg","assets/panoramas/waters-wadi-mujib-360-preview-v3.jpg","assets/images/history-jerash.jpg"];
document.querySelector("#media-rail").innerHTML=mediaImages.map((image,index)=>`<button class="media-thumb${index===0?" is-active":""}" type="button" aria-label="View image ${index+1}"><img src="${image}" alt="" loading="lazy"></button>`).join("");
document.querySelectorAll(".media-thumb").forEach((button)=>button.addEventListener("click",()=>{
  document.querySelectorAll(".media-thumb").forEach(item=>item.classList.remove("is-active"));
  button.classList.add("is-active");
  document.querySelector("#destination-backdrop").style.backgroundImage=`url("${button.querySelector("img").src}")`;
}));

function toast(message){const region=document.querySelector("#toast-region");const node=document.createElement("div");node.className="toast";node.textContent=message;region.append(node);setTimeout(()=>node.remove(),3500)}

document.querySelector("#trip-button").addEventListener("click",()=>{
  const trip=JSON.parse(localStorage.getItem("hawaTrip")||"[]");
  if(!trip.some(item=>item.id===id)) trip.push({id,title:destination.title,image:destination.image});
  localStorage.setItem("hawaTrip",JSON.stringify(trip));
  const smart=JSON.parse(localStorage.getItem("hawaSmartTripV1")||"null");
  if(smart?.itinerary&&!smart.itinerary.includes(id)){smart.itinerary.push(id);localStorage.setItem("hawaSmartTripV1",JSON.stringify(smart))}
  document.querySelector("#trip-button span:last-child").textContent="Added to Trip";
  toast(`${destination.title} added to your trip.`);
});

const sensory=document.querySelector("#sensory-overlay");
let audioContext=null,ambientSource=null,ambientGain=null;
function startAmbient(){
  audioContext=new (window.AudioContext||window.webkitAudioContext)();
  const length=audioContext.sampleRate*2,buffer=audioContext.createBuffer(1,length,audioContext.sampleRate),data=buffer.getChannelData(0);
  for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(.22+.08*Math.sin(i/1500));
  ambientSource=audioContext.createBufferSource();ambientSource.buffer=buffer;ambientSource.loop=true;
  const filter=audioContext.createBiquadFilter();filter.type="lowpass";filter.frequency.value=destination.category==="Waters"?1350:destination.category==="Desert"?420:780;
  ambientGain=audioContext.createGain();ambientGain.gain.value=.045;ambientSource.connect(filter).connect(ambientGain).connect(audioContext.destination);ambientSource.start();
}
function stopAmbient(){try{ambientSource?.stop();audioContext?.close()}catch{}ambientSource=null;audioContext=null}
document.querySelector("#experience-button").addEventListener("click",()=>{
  const sceneByCategory={Desert:"desert",Waters:"waters",Wellness:"waters",History:"history",Food:"food",Nature:"nature","Local Life":"local"};
  window.location.href=`experience360?scene=${destination.panoramaScene||sceneByCategory[destination.category]||"history"}`;
});
document.querySelector("#stop-experience").addEventListener("click",()=>{sensory.hidden=true;document.querySelector(".destination-main").classList.remove("is-sensory");stopAmbient()});

const drawer=document.querySelector("#destination-drawer");
const drawerData={
  experiences:{title:"Experiences made for this place",cards:[[`Golden-hour walk`,`A guided route shaped around the best light at ${destination.title}.`],["Local table","Meet a host and taste the flavors connected to this landscape."],["Sensory pause","A quieter moment for sound, texture and atmosphere."]]},
  photos:{title:"Frames from the journey",images:mediaImages.slice(0,3)},
  videos:{title:"Watch the place come alive",cards:[["60-second atmosphere","A short visual preview with generative ambient sound."],["Local perspective","Stories and practical insight from people who know the place."],["Route preview","See the terrain before adding it to your itinerary."]]},
  tips:{title:"Know before you go",cards:[["Best time","Arrive early morning or 90 minutes before sunset."],["Bring with you","Water, comfortable shoes and a light layer after sunset."],["Travel gently","Stay on marked paths and ask before photographing people."]]},
  nearby:{title:"Continue nearby",cards:[["Local experience","A highly rated stop within your wider route."],["Nature pause","A landscape contrast chosen from your interests."],["Next destination","Open the planner to optimize your next drive."]]}
};
function openDrawer(tab){
  if(tab==="overview"){drawer.hidden=true;return}
  const data=drawerData[tab];document.querySelector("#drawer-kicker").textContent=tab.toUpperCase();document.querySelector("#drawer-title").textContent=data.title;
  document.querySelector("#drawer-content").innerHTML=data.images?data.images.map(image=>`<article class="drawer-card"><img src="${image}" alt="${destination.title}"></article>`).join(""):data.cards.map(([title,copy])=>`<article class="drawer-card"><strong>${title}</strong><p>${copy}</p></article>`).join("");drawer.hidden=false;
}
document.querySelector("#close-destination-drawer").addEventListener("click",()=>{drawer.hidden=true});
document.querySelectorAll("[data-tab]").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll("[data-tab]").forEach(item=>item.classList.remove("is-active"));button.classList.add("is-active");openDrawer(button.dataset.tab)}));
window.addEventListener("pagehide",stopAmbient);
