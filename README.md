# Hawa Jordan

Sensory tourism experience for Jordan, built with HTML5, CSS3, Vanilla JavaScript, and Firebase.

## Current scope

The implemented experience currently includes:

- Shared design tokens, clearer task-based navigation, page-specific three-step help, mobile menu, and site-wide footer
- Full Arabic/English interface with a persistent header language switch, modern Alexandria Arabic typography, and coordinated RTL/LTR layouts
- Simplified four-item navigation and a clear three-step home journey to reduce repeated choices
- Fully responsive cinematic landing page connected to destinations, planning, stories, and passport experiences
- Dynamic sensory Explore page with animated category transitions, touch dragging, carousel controls, and history-aware URLs
- Immersive Ultra HD WebGL 360° sensory viewer for desert, water, food, nature, local life, plus dedicated Petra, Jerash, Amman Citadel, and Umm Qais history scenes, with progressive 4096×2048 and 8192×4096 textures, touch/pinch, motion viewing, fullscreen, spatial ambience, and remembered camera positions
- Guided 360° tours with camera focus, narration, discovery progress, trip actions, and a Sensory Explorer passport achievement
- Context-aware “Ask Hawa” guide with Arabic/English questions, optional voice input/output, scene-aware offline answers, and a secure Firebase AI enhancement
- Interactive destination detail page with real content tabs and a generative ambient sensory mode
- Real-time “What can I do NOW?” engine using location, available time, budget, mood, sunset context, and live Open-Meteo weather
- Smart, responsive itinerary planner with preference-based route generation, route optimization, drag reordering, local persistence, trip preview, and JSON export
- Live journey companion that reads the saved itinerary, calculates route distance/ETA, supports live geolocation, directions, fullscreen and arrival progress
- Filterable local stories with detail dialogs
- Gamified Hawa Passport with geolocation-based visit verification, collectible destination stamps, achievements, and journey synchronization
- About page
- Firebase-ready email/password authentication with an explicit local guest-preview fallback when Firebase is not configured
- Optional Google and Apple authentication after Firebase providers are configured
- Registration profile creation in Cloud Firestore
- Firestore and Storage security-rule foundations
- Firebase Hosting configuration

Firebase-backed cross-device synchronization remains a later project phase. Local trips, passport progress, NOW preferences, guest access, live weather, location features, Gemini assistance and journey progress work in the current local experience.

## Ask Hawa AI setup

The 360° guide works immediately with curated offline answers. To enable richer AI answers:

### Local Gemini development

Run the secure local gateway from PowerShell. It asks for the Gemini key without saving it to disk:

```powershell
.\start-hawa.ps1
```

Then open `http://localhost:8765/experience360?scene=waters`. The browser calls the same-origin `/api/hawa-guide` endpoint; the API key is never sent to browser JavaScript. Use a newly generated key if a previous key was pasted into chat or committed anywhere.

### Firebase production deployment

1. Complete `js/firebase-config.js` with the Firebase web app configuration.
2. Install the Cloud Functions dependencies:

   ```sh
   cd functions
   npm install
   ```

3. Store the Gemini key in Google Secret Manager. Never place it in browser JavaScript:

   ```sh
   firebase functions:secrets:set GEMINI_API_KEY
   ```

4. The implementation uses `gemini-3.5-flash-lite`. It can optionally be overridden with the server-only `GEMINI_MODEL` environment variable.
5. Deploy the callable guide:

   ```sh
   firebase deploy --only functions:hawaGuide
   ```

Before production launch, enable Firebase App Check enforcement for the callable function and configure budget/rate alerts.

## Visual assets

The home page uses the supplied Petra artwork at `assets/backgrounds/main.png`. The authentication screens use the project-local night scene at `assets/backgrounds/auth-petra-night.jpg`. Explore uses five dedicated, high-resolution water environments for Wadi Mujib, the Dead Sea, Wadi Bin Hammad, Ma'in Hot Springs and Aqaba. Thirteen sensory environments are stored in `assets/panoramas/`, including four destination-specific history panoramas and five destination-specific water panoramas, and rendered as navigable photo spheres by `experience360.html`. The planner uses the cinematic aerial map at `assets/backgrounds/planner-jordan-map.jpg`. The NOW engine, live journey and digital passport use dedicated project-bound scenes at `assets/backgrounds/now-wadi-rum-sunset.png`, `assets/backgrounds/live-road-wadi-rum.png`, and `assets/backgrounds/passport-petra-book.png`. Destination-card photographs are local assets in `assets/images/`.

The NOW engine requests current conditions from the Open-Meteo forecast API and falls back to the most recent local cache when offline. Location is only requested after a traveler explicitly selects a location-powered action.

The supplied transparent logo lives at `assets/logo/hawa-jordan-logo.png` and is used consistently by the shared navigation and authentication screens.

## Firebase setup

1. Create a Firebase web app.
2. Enable Email/Password in Authentication. Enable Google and Apple if those sign-in options are desired.
3. Create a Cloud Firestore database and a Storage bucket.
4. Replace the placeholders in `js/firebase-config.js` with the Firebase web app configuration.
5. Copy `.firebaserc.example` to `.firebaserc` and enter the project ID.
6. Deploy rules and hosting with the Firebase CLI:

   ```sh
   firebase deploy
   ```

Firebase web configuration identifies the project but is not a server secret. Access is protected by the included Firestore and Storage rules.

## Local preview

For the complete local experience, including the Gemini-powered Ask Hawa guide, run:

```powershell
.\start-hawa.ps1
```

The script asks for a Gemini key without saving it, then serves the platform at `http://localhost:8765`. If Gemini is not needed, any static HTTP server can still serve the visual and offline features.
