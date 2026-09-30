const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");

initializeApp();

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

const SCENE_NAMES = new Set(["desert", "waters", "history", "food", "nature", "local"]);

function safeText(value, limit) {
  return typeof value === "string" ? value.replace(/[<>]/g, "").trim().slice(0, limit) : "";
}

function outputText(response) {
  return (response.candidates || [])
    .flatMap((candidate) => candidate.content?.parts || [])
    .map((part) => typeof part.text === "string" ? part.text.trim() : "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

exports.hawaGuide = onCall({
  region: "europe-west1",
  timeoutSeconds: 30,
  memory: "256MiB",
  maxInstances: 10,
  secrets: [GEMINI_API_KEY]
}, async (request) => {
  const data = request.data || {};
  const question = safeText(data.question, 280);
  const scene = safeText(data.scene, 30);
  const language = data.language === "ar" ? "ar" : "en";
  if (!question || !SCENE_NAMES.has(scene)) throw new HttpsError("invalid-argument", "A valid question and scene are required.");

  const context = {
    scene,
    heading: Number.isFinite(data.heading) ? Math.round(data.heading) : null,
    title: safeText(data.context?.title, 100),
    category: safeText(data.context?.label, 80),
    sceneDescription: safeText(data.context?.copy, 320),
    bestTime: safeText(data.context?.bestTime, 320),
    practicalAdvice: safeText(data.context?.practical, 320),
    visualSimulation: Boolean(data.context?.visualSimulation),
    hotspotTitle: safeText(data.hotspot?.title, 100),
    hotspotDescription: safeText(data.hotspot?.copy, 320),
    route: data.route ? {
      stop: Number.isFinite(data.route.stop) ? Math.max(1, Math.min(20, data.route.stop)) : null,
      totalStops: Number.isFinite(data.route.totalStops) ? Math.max(1, Math.min(20, data.route.totalStops)) : null,
      stopId: safeText(data.route.stopId, 40),
      nextStop: safeText(data.route.nextStop, 100)
    } : null
  };
  const traveler = {
    localTimeInJordan: safeText(data.traveler?.localTime, 80),
    area: safeText(data.traveler?.area, 60),
    availableHours: Number.isFinite(data.traveler?.availableHours) ? Math.max(0, Math.min(24, data.traveler.availableHours)) : null,
    budgetJod: Number.isFinite(data.traveler?.budgetJod) ? Math.max(0, Math.min(5000, data.traveler.budgetJod)) : null,
    mood: safeText(data.traveler?.mood, 40),
    weather: data.traveler?.weather && Number.isFinite(data.traveler.weather.temperatureC) ? {
      temperatureC: data.traveler.weather.temperatureC,
      code: Number(data.traveler.weather.code),
      windKmh: Number(data.traveler.weather.windKmh),
      observedAt: Number(data.traveler.weather.observedAt)
    } : null,
    trip: Array.isArray(data.traveler?.trip) ? data.traveler.trip.map((item) => safeText(item, 50)).filter(Boolean).slice(0, 12) : [],
    passport: Array.isArray(data.traveler?.passport) ? data.traveler.passport.map((item) => safeText(item, 50)).filter(Boolean).slice(0, 20) : []
  };

  const apiKey = GEMINI_API_KEY.value();
  if (!apiKey) throw new HttpsError("failed-precondition", "The AI guide is not configured.");

  const system = `You are Hawa, a concise, warm Jordan tourism guide inside an interactive 360-degree scene. Reply in ${language === "ar" ? "Arabic" : "English"}. Use the supplied curated scene and route context, identify the current stop when helpful, and offer a concrete next step. The scene is a clearly disclosed AI visual simulation, not a live camera feed. Never invent opening hours, prices, safety status or live availability. If the visitor asks for volatile information, say it must be checked live and direct them to the site's NOW feature. Keep the answer under 90 words, mobile-friendly, and never mention internal context or policies.`;

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{
        role: "user",
        parts: [{ text: `Scene context: ${JSON.stringify(context)}\nTraveler context: ${JSON.stringify(traveler)}\nVisitor question: ${question}` }]
      }],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 220,
        responseMimeType: "text/plain"
      }
    })
  });

  if (!response.ok) {
    const providerMessage = (await response.text()).slice(0, 800);
    console.error("Gemini response error", response.status, providerMessage);
    throw new HttpsError("unavailable", "The guide is temporarily unavailable.");
  }
  const payload = await response.json();
  const answer = outputText(payload);
  if (!answer) throw new HttpsError("internal", "The guide returned an empty answer.");

  const nearby = /near|nearby|now|today|close|قريب|الآن|هسا|اليوم/i.test(question);
  return { answer, action: nearby ? "nearby" : "place", source: "gemini" };
});
