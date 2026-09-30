import "./i18n.js";
import { getFirebaseServices, isFirebaseConfigured } from "./firebase-config.js";

const page = document.body.dataset.page;
const form = document.querySelector("#login-form, #register-form");
const alertBox = document.querySelector("#form-alert");
const firebaseNote = document.querySelector("#firebase-note");

export function redirectAfterAuth() {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");
  if (redirect) {
    try {
      const url = new URL(redirect, window.location.origin);
      if (url.origin === window.location.origin) {
        window.location.assign(url.pathname + url.search + url.hash);
        return;
      }
    } catch {
      if (redirect.startsWith("/") || !redirect.includes("://")) {
        window.location.assign(redirect);
        return;
      }
    }
  }
  window.location.assign("/");
}

// If already logged in, redirect away from login/register page
if ((page === "login" || page === "register") && (localStorage.getItem("hawaCurrentUserId") || localStorage.getItem("hawaLocalUser"))) {
  redirectAfterAuth();
}

// Preserve redirect query parameter and display helpful notice
const redirectParam = new URLSearchParams(window.location.search).get("redirect");
if (redirectParam) {
  document.querySelectorAll(".auth-switch a").forEach((link) => {
    const raw = link.getAttribute("href");
    if (raw && !raw.includes("redirect=")) {
      link.href = `${raw}${raw.includes("?") ? "&" : "?"}redirect=${encodeURIComponent(redirectParam)}`;
    }
  });
  const subtitle = document.querySelector(".auth-subtitle");
  if (subtitle && page === "login") {
    subtitle.innerHTML = `Please sign in first to access this page<br><span style="font-size:0.86em;color:var(--gold-bright,#e8ad4a);font-weight:500;">يرجى تسجيل الدخول أولاً للمتابعة</span>`;
  }
}

const authErrorMessages = {
  "auth/invalid-credential": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "auth/invalid-email": "يرجى إدخال بريد إلكتروني صالح.",
  "auth/email-already-in-use": "يوجد حساب مسجل بالفعل بهذا البريد.",
  "auth/weak-password": "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
  "auth/popup-closed-by-user": "تم إغلاق نافذة تسجيل الدخول بواسطة جوجل قبل إكمالها.",
  "auth/popup-blocked": "قام المتصفح بحظر نافذة تسجيل الدخول المنبثقة.",
  "auth/operation-not-allowed": "تسجيل الدخول بواسطة جوجل أو كلمة المرور غير مفعل في Firebase Console. يرجى تفعيله من Authentication -> Sign-in method.",
  "auth/configuration-not-found": "تسجيل الدخول بواسطة جوجل غير مفعل في لوحة تحكم Firebase بعد.",
  "auth/unauthorized-domain": "النطاق localhost غير مضاف في قائمة النطاقات المسموح بها في Firebase Console.",
  "auth/too-many-requests": "محاولات كثيرة جداً. يرجى الانتظار قليلاً والمحاولة مجدداً.",
  "auth/network-request-failed": "تعذر الاتصال بالشبكة. تحقق من اتصالك بالإنترنت."
};

function announce(message, type = "info") {
  const region = document.querySelector("#toast-region");
  if (!region) return;
  const toast = document.createElement("div");
  toast.className = `toast${type === "error" ? " toast--error" : ""}`;
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => toast.remove(), 4400);
}

function showAlert(message) {
  if (!alertBox) {
    announce(message, "error");
    return;
  }
  alertBox.textContent = message;
  alertBox.hidden = false;
}

function clearAlert() {
  if (!alertBox) return;
  alertBox.textContent = "";
  alertBox.hidden = true;
}

function fieldError(name, message = "") {
  const error = document.querySelector(`[data-error-for="${name}"]`);
  const input = form?.elements[name];
  if (error) error.textContent = message;
  input?.closest(".input-wrap")?.classList.toggle("has-error", Boolean(message));
  if (input) input.setAttribute("aria-invalid", String(Boolean(message)));
}

function validate() {
  if (!form) return false;
  let valid = true;
  [...form.querySelectorAll(".field-error")].forEach((node) => { node.textContent = ""; });
  [...form.querySelectorAll(".input-wrap")].forEach((node) => node.classList.remove("has-error"));

  const email = form.elements.email;
  const password = form.elements.password;
  if (!email.value.trim() || !email.validity.valid) {
    fieldError("email", "Enter a valid email address.");
    valid = false;
  }
  if (password.value.length < 6) {
    fieldError("password", "Password must be at least 6 characters.");
    valid = false;
  }

  if (page === "register") {
    if (form.elements.fullName.value.trim().length < 2) {
      fieldError("fullName", "Enter your full name.");
      valid = false;
    }
    if (form.elements.confirmPassword.value !== password.value) {
      fieldError("confirmPassword", "Passwords do not match.");
      valid = false;
    }
    if (!form.elements.terms.checked) {
      fieldError("terms", "You must accept the Terms and Privacy Policy.");
      valid = false;
    }
  }
  return valid;
}

function setLoading(button, loading, label) {
  if (!button) return;
  const text = button.classList.contains("social-auth")
    ? button.querySelector("span:last-child")
    : button.querySelector("span");
  if (loading) button.dataset.originalLabel = text?.textContent || label;
  if (text) text.textContent = loading ? "Please wait…" : button.dataset.originalLabel || label;
  button.disabled = loading;
  button.setAttribute("aria-busy", String(loading));
}

function friendlyError(error) {
  console.error("Firebase Authentication Error:", error);
  return authErrorMessages[error?.code] || error?.message || "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.";
}

export function clearTravelerData() {
  const keys = [
    "hawaPassport",
    "hawaTrip",
    "hawaSmartTripV1",
    "hawaJourneyProgress",
    "hawa360CompletedScenes",
    "hawaNowFavorites",
    "hawaNowPreferences",
    "hawaLocalUser",
    "hawaUserProfile"
  ];
  keys.forEach((key) => localStorage.removeItem(key));
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i);
    if (k && (k.startsWith("hawaDiscovered_") || k.startsWith("hawaCam_") || k.startsWith("hawaState_"))) {
      localStorage.removeItem(k);
    }
  }
}

async function signInWithEmail(event) {
  event.preventDefault();
  clearAlert();
  if (!validate()) return;
  const submit = form.querySelector("[data-submit]");
  setLoading(submit, true, "Sign In");
  try {
    const services = await getFirebaseServices();
    if (!services) throw Object.assign(new Error("Firebase is not configured"), { code: "hawa/not-configured" });
    const persistence = form.elements.remember.checked
      ? services.authSdk.browserLocalPersistence
      : services.authSdk.browserSessionPersistence;
    await services.authSdk.setPersistence(services.auth, persistence);
    const credential = await services.authSdk.signInWithEmailAndPassword(
      services.auth,
      form.elements.email.value.trim(),
      form.elements.password.value
    );
    const user = credential.user;
    if (localStorage.getItem("hawaCurrentUserId") !== user.uid) {
      clearTravelerData();
      localStorage.setItem("hawaCurrentUserId", user.uid);
    }
    localStorage.setItem("hawaUserProfile", JSON.stringify({
      displayName: user.displayName || user.email?.split("@")[0] || "Traveler",
      email: user.email,
      photoURL: user.photoURL || null
    }));
    redirectAfterAuth();
  } catch (error) {
    showAlert(error.code === "hawa/not-configured" ? "Add your Firebase project settings in js/firebase-config.js first." : friendlyError(error));
  } finally {
    setLoading(submit, false, "Sign In");
  }
}

async function registerWithEmail(event) {
  event.preventDefault();
  clearAlert();
  if (!validate()) return;
  const submit = form.querySelector("[data-submit]");
  setLoading(submit, true, "Create Account");
  try {
    const services = await getFirebaseServices();
    if (!services) throw Object.assign(new Error("Firebase is not configured"), { code: "hawa/not-configured" });
    const credential = await services.authSdk.createUserWithEmailAndPassword(
      services.auth,
      form.elements.email.value.trim(),
      form.elements.password.value
    );
    const fullName = form.elements.fullName.value.trim();
    await services.authSdk.updateProfile(credential.user, { displayName: fullName });
    
    // Ensure all traveler data starts completely clean and zeroed out
    clearTravelerData();
    localStorage.setItem("hawaCurrentUserId", credential.user.uid);
    localStorage.setItem("hawaUserProfile", JSON.stringify({
      displayName: fullName || credential.user.email?.split("@")[0] || "Traveler",
      email: credential.user.email,
      photoURL: null
    }));

    try {
      await services.firestoreSdk.setDoc(
        services.firestoreSdk.doc(services.db, "users", credential.user.uid),
        {
          fullName,
          email: credential.user.email,
          createdAt: services.firestoreSdk.serverTimestamp(),
          preferences: {},
          budget: null,
          visitedPlaces: [],
          unlockedBadges: [],
          completedScenes: [],
          favorites: [],
          trips: []
        }
      );
    } catch (firestoreError) {
      console.warn("Firestore profile save skipped (check if Firestore is created in console):", firestoreError);
    }
    redirectAfterAuth();
  } catch (error) {
    showAlert(error.code === "hawa/not-configured" ? "Add your Firebase project settings in js/firebase-config.js first." : friendlyError(error));
  } finally {
    setLoading(submit, false, "Create Account");
  }
}

async function signInWithGoogle() {
  const button = document.querySelector("#google-signin");
  clearAlert();
  setLoading(button, true, "Google");
  try {
    const services = await getFirebaseServices();
    if (!services) throw Object.assign(new Error("Firebase is not configured"), { code: "hawa/not-configured" });
    const result = await services.authSdk.signInWithPopup(services.auth, new services.authSdk.GoogleAuthProvider());
    try {
      const userRef = services.firestoreSdk.doc(services.db, "users", result.user.uid);
      const userSnapshot = await services.firestoreSdk.getDoc(userRef);
      if (!userSnapshot.exists()) {
        // Brand new account: zero out all progress
        clearTravelerData();
        await services.firestoreSdk.setDoc(userRef, {
          fullName: result.user.displayName || "Traveler",
          email: result.user.email,
          createdAt: services.firestoreSdk.serverTimestamp(),
          preferences: {},
          budget: null,
          visitedPlaces: [],
          unlockedBadges: [],
          completedScenes: [],
          favorites: [],
          trips: []
        });
      }
      localStorage.setItem("hawaCurrentUserId", result.user.uid);
      localStorage.setItem("hawaUserProfile", JSON.stringify({
        displayName: result.user.displayName || result.user.email?.split("@")[0] || "Traveler",
        email: result.user.email,
        photoURL: result.user.photoURL || null
      }));
    } catch (firestoreError) {
      console.warn("Firestore profile sync skipped (check if Firestore is created in console):", firestoreError);
    }
    redirectAfterAuth();
  } catch (error) {
    showAlert(error.code === "hawa/not-configured" ? "Add your Firebase project settings in js/firebase-config.js first." : friendlyError(error));
  } finally {
    setLoading(button, false, "Google");
  }
}

async function signInWithApple() {
  const button = document.querySelector("#apple-signin");
  clearAlert();
  setLoading(button, true, "Apple");
  try {
    const services = await getFirebaseServices();
    if (!services) throw Object.assign(new Error("Firebase is not configured"), { code: "hawa/not-configured" });
    const provider = new services.authSdk.OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");
    const result = await services.authSdk.signInWithPopup(services.auth, provider);
    try {
      const userRef = services.firestoreSdk.doc(services.db, "users", result.user.uid);
      const userSnapshot = await services.firestoreSdk.getDoc(userRef);
      if (!userSnapshot.exists()) {
        // Brand new account: zero out all progress
        clearTravelerData();
        await services.firestoreSdk.setDoc(userRef, {
          fullName: result.user.displayName || "Traveler",
          email: result.user.email,
          createdAt: services.firestoreSdk.serverTimestamp(),
          preferences: {},
          budget: null,
          visitedPlaces: [],
          unlockedBadges: [],
          completedScenes: [],
          favorites: [],
          trips: []
        });
      }
      localStorage.setItem("hawaCurrentUserId", result.user.uid);
    } catch (firestoreError) {
      console.warn("Firestore profile sync skipped (check if Firestore is created in console):", firestoreError);
    }
    redirectAfterAuth();
  } catch (error) {
    showAlert(error.code === "hawa/not-configured" ? "Add your Firebase project settings in js/firebase-config.js first." : friendlyError(error));
  } finally {
    setLoading(button, false, "Apple");
  }
}

async function sendPasswordReset(event) {
  event.preventDefault();
  clearAlert();
  const email = form?.elements.email.value.trim();
  if (!email || !form.elements.email.validity.valid) {
    fieldError("email", "Enter your email first, then select Forgot Password.");
    return;
  }
  try {
    const services = await getFirebaseServices();
    if (!services) throw Object.assign(new Error("Firebase is not configured"), { code: "hawa/not-configured" });
    await services.authSdk.sendPasswordResetEmail(services.auth, email);
    announce("Password reset email sent.");
  } catch (error) {
    showAlert(error.code === "hawa/not-configured" ? "Add your Firebase project settings first." : friendlyError(error));
  }
}

function setupPasswordToggles() {
  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.togglePassword);
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.classList.toggle("is-visible", show);
      button.setAttribute("aria-label", `${show ? "Hide" : "Show"} password`);
    });
  });
}

function setupLogoFallback() {
  document.querySelectorAll(".auth-logo").forEach((logo) => {
    const markLoaded = () => logo.parentElement?.classList.add("is-loaded");
    if (logo.complete && logo.naturalWidth) markLoaded();
    else logo.addEventListener("load", markLoaded, { once: true });
  });
}

function localGuest() {
  try { return JSON.parse(localStorage.getItem("hawaLocalUser") || "null"); }
  catch { return null; }
}

function continueAsGuest() {
  const user = { displayName: "Guest Traveler", email: "Saved on this device", isGuest: true };
  localStorage.setItem("hawaLocalUser", JSON.stringify(user));
  localStorage.setItem("hawaUserProfile", JSON.stringify(user));
  redirectAfterAuth();
}

function setupLegalDialog() {
  const dialog = document.querySelector("#legal-dialog");
  if (!dialog) return;
  const content = {
    terms: ["TERMS OF SERVICE", "Simple travel terms", "Hawa Jordan is a trip-planning companion. Recommendations are informational and do not replace official opening, weather, road or safety guidance. Check live conditions and local instructions before traveling."],
    privacy: ["PRIVACY", "Your data, clearly explained", "Trips, passport progress and guest access are stored on this device in preview mode. Location is requested only after you choose a location feature. When Firebase is enabled, account data is handled by the configured Firebase project."]
  };
  document.querySelectorAll("[data-legal]").forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    const [kicker, title, copy] = content[link.dataset.legal];
    document.querySelector("#legal-kicker").textContent = kicker;
    document.querySelector("#legal-title").textContent = title;
    document.querySelector("#legal-copy").innerHTML = `<p>${copy}</p>`;
    dialog.showModal();
  }));
  document.querySelector("#close-legal")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
}

async function observeAuth() {
  try {
    const services = await getFirebaseServices();
    if (!services) {
      const user = localGuest();
      if (user) window.dispatchEvent(new CustomEvent("hawa:auth-change", { detail: { user } }));
      document.addEventListener("click", (event) => {
        if (!event.target.closest('[data-auth-action="signout"]')) return;
        clearTravelerData();
        localStorage.removeItem("hawaLocalUser");
        localStorage.removeItem("hawaCurrentUserId");
        localStorage.removeItem("hawaUserProfile");
        window.location.assign("/");
      });
      return;
    }
    services.authSdk.onAuthStateChanged(services.auth, async (user) => {
      if (user) {
        localStorage.setItem("hawaUserProfile", JSON.stringify({
          displayName: user.displayName || user.email?.split("@")[0] || "Traveler",
          email: user.email,
          photoURL: user.photoURL || null
        }));
        const lastUid = localStorage.getItem("hawaCurrentUserId");
        if (lastUid !== user.uid) {
          clearTravelerData();
          localStorage.setItem("hawaCurrentUserId", user.uid);
          try {
            const userRef = services.firestoreSdk.doc(services.db, "users", user.uid);
            const userDoc = await services.firestoreSdk.getDoc(userRef);
            if (userDoc.exists()) {
              const data = userDoc.data();
              if (Array.isArray(data.visitedPlaces) && data.visitedPlaces.length > 0) {
                localStorage.setItem("hawaPassport", JSON.stringify(data.visitedPlaces));
              }
              if (Array.isArray(data.completedScenes) && data.completedScenes.length > 0) {
                localStorage.setItem("hawa360CompletedScenes", JSON.stringify(data.completedScenes));
              }
              if (Array.isArray(data.favorites) && data.favorites.length > 0) {
                localStorage.setItem("hawaNowFavorites", JSON.stringify(data.favorites));
              }
              if (Array.isArray(data.trips) && data.trips.length > 0) {
                localStorage.setItem("hawaTrip", JSON.stringify(data.trips));
              }
            }
          } catch (e) {
            console.warn("Could not load user data from Firestore:", e);
          }
        }
      } else {
        if (localStorage.getItem("hawaCurrentUserId")) {
          clearTravelerData();
          localStorage.removeItem("hawaCurrentUserId");
          localStorage.removeItem("hawaUserProfile");
        }
      }
      window.dispatchEvent(new CustomEvent("hawa:auth-change", { detail: { user } }));
    });
    document.addEventListener("click", async (event) => {
      const signOutButton = event.target.closest('[data-auth-action="signout"]');
      if (!signOutButton) return;
      await services.authSdk.signOut(services.auth);
      clearTravelerData();
      localStorage.removeItem("hawaCurrentUserId");
      localStorage.removeItem("hawaLocalUser");
      localStorage.removeItem("hawaUserProfile");
      window.location.assign("/");
    });
  } catch (error) {
    console.warn("Firebase authentication could not initialize.", error);
  }
}

if (firebaseNote && !isFirebaseConfigured()) {
  firebaseNote.hidden = false;
  document.body.classList.add("auth-preview-mode");
}
form?.addEventListener("submit", page === "register" ? registerWithEmail : signInWithEmail);
document.querySelector("#google-signin")?.addEventListener("click", signInWithGoogle);
document.querySelector("#apple-signin")?.addEventListener("click", signInWithApple);
document.querySelector("#forgot-password")?.addEventListener("click", sendPasswordReset);
document.querySelector("#continue-guest")?.addEventListener("click", continueAsGuest);
setupPasswordToggles();
setupLogoFallback();
setupLegalDialog();
observeAuth();
