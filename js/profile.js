import "./i18n.js";
import { getFirebaseServices } from "./firebase-config.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Helper: check if Arabic is currently active
function isArabic() {
  const stored = localStorage.getItem("hawaLanguage");
  if (stored) return stored === "ar";
  return document.documentElement.lang === "ar" || document.documentElement.dir === "rtl";
}

function toast(message, type = "info") {
  const region = $("#toast-region");
  if (!region) return;
  const node = document.createElement("div");
  node.className = `toast${type === "error" ? " toast--error" : ""}`;
  node.textContent = message;
  region.append(node);
  setTimeout(() => node.remove(), 4000);
}

// User state
let currentUser = null;
let firebaseUser = null;
let firebaseServices = null;

// Initial Local User loading
function getStoredUser() {
  try {
    const local = localStorage.getItem("hawaLocalUser");
    if (local) return JSON.parse(local);
  } catch (e) {}
  try {
    const profile = localStorage.getItem("hawaUserProfile");
    if (profile) return JSON.parse(profile);
  } catch (e) {}
  return null;
}

function saveUser(user) {
  currentUser = { ...(currentUser || {}), ...user };
  localStorage.setItem("hawaUserProfile", JSON.stringify(currentUser));
  localStorage.setItem("hawaLocalUser", JSON.stringify(currentUser));
  window.dispatchEvent(new CustomEvent("hawa:auth-change", { detail: { user: currentUser } }));
}

// Redirect if not signed in
function checkAuth() {
  const stored = getStoredUser();
  const uid = localStorage.getItem("hawaCurrentUserId");
  if (!stored && !uid) {
    window.location.replace("login?redirect=/profile");
    return false;
  }
  currentUser = stored || { displayName: "Traveler", email: "traveler@hawa.jo" };
  return true;
}

// Populate Profile UI
function renderProfile() {
  if (!currentUser) return;

  const isAr = isArabic();
  const displayName = currentUser.displayName || (currentUser.email ? currentUser.email.split("@")[0] : "Traveler");
  const email = currentUser.email || (currentUser.isGuest ? (isAr ? "محفوظ على هذا المتصفح" : "Saved on this device") : "traveler@hawa.jo");
  const initial = displayName.trim().charAt(0).toUpperCase() || "T";
  const photo = currentUser.photoURL || null;

  // Header card elements
  $("#profile-display-name").textContent = displayName;
  $("#profile-email").textContent = email;
  $("#avatar-initial").textContent = initial;

  const avatarImg = $("#avatar-img");
  const avatarInitial = $("#avatar-initial");
  if (photo) {
    avatarImg.src = photo;
    avatarImg.hidden = false;
    avatarImg.style.display = "block";
    avatarInitial.hidden = true;
    avatarInitial.style.display = "none";
  } else {
    avatarImg.hidden = true;
    avatarImg.style.display = "none";
    avatarImg.removeAttribute("src");
    avatarInitial.hidden = false;
    avatarInitial.style.display = "flex";
  }

  // Provider badge
  const providerChip = $("#auth-provider-chip");
  if (currentUser.isGuest) {
    providerChip.textContent = isAr ? "وضع الضيف" : "Guest Mode";
  } else if (currentUser.provider === "google.com" || firebaseUser?.providerData?.some(p => p.providerId === "google.com")) {
    providerChip.textContent = "Google Account";
    $("#security-provider-banner").hidden = false;
    $("#current-password-group").hidden = true;
  } else {
    providerChip.textContent = isAr ? "البريد وكلمة المرور" : "Email & Password";
    $("#security-provider-banner").hidden = true;
    $("#current-password-group").hidden = false;
  }

  // Bio
  const bio = currentUser.bio || (isAr ? "استكشف الأردن بالإحساس والحكاية والمكان." : "Exploring Jordan through feelings, heritage, and landscapes.");
  $("#profile-bio-display").textContent = bio;
  if ($("#input-bio")) {
    $("#input-bio").value = currentUser.bio || "";
    $("#bio-chars").textContent = (currentUser.bio || "").length;
  }

  // Form Inputs
  if ($("#input-fullname")) $("#input-fullname").value = currentUser.displayName || "";
  if ($("#input-email")) $("#input-email").value = email;
  if ($("#input-phone")) $("#input-phone").value = currentUser.phone || "";
  if ($("#input-country")) $("#input-country").value = currentUser.country || "";

  // Stats
  renderStats();

  // Interests
  const interests = currentUser.interests || JSON.parse(localStorage.getItem("hawaInterests") || "[\"history\",\"nature\"]");
  $$(".interest-chip").forEach(chip => {
    chip.classList.toggle("is-selected", interests.includes(chip.dataset.interest));
  });
}

function renderStats() {
  try {
    const stamps = JSON.parse(localStorage.getItem("hawaPassport") || "[]");
    $("#stat-stamps").textContent = `${stamps.length} / 12`;
  } catch (e) {}

  try {
    const scenes = JSON.parse(localStorage.getItem("hawa360CompletedScenes") || "[]");
    $("#stat-360").textContent = String(scenes.length);
  } catch (e) {}

  try {
    const favs = JSON.parse(localStorage.getItem("hawaNowFavorites") || "[]");
    $("#stat-favs").textContent = String(favs.length);
  } catch (e) {}

  try {
    const trip = JSON.parse(localStorage.getItem("hawaTrip") || "[]");
    const smart = JSON.parse(localStorage.getItem("hawaSmartTripV1") || "null");
    const count = smart?.itinerary?.length || trip.length || 0;
    const isAr = isArabic();
    $("#stat-trip").textContent = `${count} ${count === 1 ? (isAr ? "محطة" : "Stop") : (isAr ? "محطات" : "Stops")}`;
  } catch (e) {}
}

// Client-side image resizing and optimization with HTML5 Canvas
async function resizeImage(file, maxSize = 256) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Export as optimized JPEG/WebP data URL
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Preset avatars map
const presetAvatarUrls = {
  petra: "assets/images/history-jerash.jpg",
  desert: "assets/images/desert-wadi-rum.jpg",
  waters: "assets/images/dead-sea-sunset.jpg",
  nature: "assets/images/nature-ajloun.jpg",
  canyon: "assets/images/waters-wadi-mujib.jpg",
  food: "assets/images/food-jordanian-table.jpg"
};

// Setup Event Listeners
function setupEvents() {
  // Tabs Navigation
  $$(".profile-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const targetTab = tab.dataset.tab;
      $$(".profile-tab").forEach(t => {
        const isActive = t === tab;
        t.classList.toggle("is-active", isActive);
        t.setAttribute("aria-selected", String(isActive));
      });
      $$(".profile-panel").forEach(panel => {
        panel.hidden = panel.id !== `panel-${targetTab}`;
      });
    });
  });

  // Bio Character Count
  const bioInput = $("#input-bio");
  if (bioInput) {
    bioInput.addEventListener("input", () => {
      $("#bio-chars").textContent = bioInput.value.length;
    });
  }

  // Password Reveal Toggle
  $$(".password-toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.toggleFor;
      const input = document.getElementById(targetId);
      if (!input) return;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      btn.textContent = isPassword ? "🙈" : "👁";
      btn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
  });

  // Password Strength Meter
  const newPassInput = $("#input-new-password");
  const strengthWrap = $("#password-strength-wrap");
  const strengthBar = $("#strength-bar");
  const strengthLabel = $("#strength-label");

  if (newPassInput && strengthBar) {
    newPassInput.addEventListener("input", () => {
      const val = newPassInput.value;
      if (!val) {
        strengthWrap.hidden = true;
        return;
      }
      strengthWrap.hidden = false;
      let score = 0;
      if (val.length >= 6) score++;
      if (val.length >= 10) score++;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
      if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score++;

      strengthBar.className = "strength-bar";
      const isAr = isArabic();
      if (score <= 1) {
        strengthBar.classList.add("is-weak");
        strengthLabel.textContent = isAr ? "كلمة المرور ضعيفة" : "Weak password";
      } else if (score <= 3) {
        strengthBar.classList.add("is-medium");
        strengthLabel.textContent = isAr ? "كلمة المرور متوسطة" : "Medium strength";
      } else {
        strengthBar.classList.add("is-strong");
        strengthLabel.textContent = isAr ? "كلمة المرور قوية وممتازة" : "Strong password";
      }
    });
  }

  // Personal Info Form Submit
  const personalForm = $("#personal-info-form");
  if (personalForm) {
    personalForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const saveBtn = $("#save-info-btn");
      const btnText = saveBtn.querySelector(".btn-text");
      const btnSpinner = saveBtn.querySelector(".btn-spinner");
      const isAr = isArabic();

      const fullName = $("#input-fullname")?.value.trim();
      const phone = $("#input-phone")?.value.trim();
      const country = $("#input-country")?.value.trim();
      const bio = $("#input-bio")?.value.trim();

      if (!fullName) {
        toast(isAr ? "يرجى كتابة الاسم الكامل" : "Please enter your full name", "error");
        return;
      }

      btnText.hidden = true;
      btnSpinner.hidden = false;
      saveBtn.disabled = true;

      try {
        const updated = {
          displayName: fullName,
          phone,
          country,
          bio
        };

        // Firebase sync
        if (firebaseServices && firebaseUser) {
          try {
            await firebaseServices.authSdk.updateProfile(firebaseUser, { displayName: fullName });
          } catch (e) {
            console.warn("Could not update auth profile directly", e);
          }
          try {
            const userRef = firebaseServices.firestoreSdk.doc(firebaseServices.db, "users", firebaseUser.uid);
            await firebaseServices.firestoreSdk.setDoc(userRef, updated, { merge: true });
          } catch (e) {
            console.warn("Could not save to firestore", e);
          }
        }

        saveUser(updated);
        renderProfile();
        toast(isAr ? "تم حفظ المعلومات بنجاح ✨" : "Profile information saved successfully ✨");
      } catch (err) {
        toast(err.message || (isAr ? "حدث خطأ أثناء الحفظ" : "Error saving profile"), "error");
      } finally {
        btnText.hidden = false;
        btnSpinner.hidden = true;
        saveBtn.disabled = false;
      }
    });
  }

  // Password Form Submit
  const passwordForm = $("#password-form");
  if (passwordForm) {
    passwordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const updateBtn = $("#update-password-btn");
      const btnText = updateBtn.querySelector(".btn-text");
      const btnSpinner = updateBtn.querySelector(".btn-spinner");
      const isAr = isArabic();

      const newPass = $("#input-new-password")?.value;
      const confirmPass = $("#input-confirm-password")?.value;

      if (!newPass || newPass.length < 6) {
        toast(isAr ? "كلمة المرور يجب أن لا تقل عن 6 أحرف" : "Password must be at least 6 characters", "error");
        return;
      }
      if (newPass !== confirmPass) {
        toast(isAr ? "كلمتا المرور غير متطابقتين" : "Passwords do not match", "error");
        return;
      }

      btnText.hidden = true;
      btnSpinner.hidden = false;
      updateBtn.disabled = true;

      try {
        if (firebaseServices && firebaseUser) {
          await firebaseServices.authSdk.updatePassword(firebaseUser, newPass);
          toast(isAr ? "تم تحديث كلمة المرور بنجاح 🔒" : "Password updated successfully 🔒");
          passwordForm.reset();
          if (strengthWrap) strengthWrap.hidden = true;
        } else {
          // Local guest mode
          saveUser({ passwordUpdated: Date.now() });
          toast(isAr ? "تم تحديث كلمة المرور لهذا الجهاز بنجاح 🔒" : "Password updated for this device 🔒");
          passwordForm.reset();
          if (strengthWrap) strengthWrap.hidden = true;
        }
      } catch (err) {
        if (err.code === "auth/requires-recent-login") {
          toast(isAr ? "يرجى تسجيل الدخول مجدداً لتغيير كلمة المرور لأسباب أمنية" : "Please re-login to change password for security reasons", "error");
        } else {
          toast(err.message || (isAr ? "تعذر تحديث كلمة المرور" : "Could not update password"), "error");
        }
      } finally {
        btnText.hidden = false;
        btnSpinner.hidden = true;
        updateBtn.disabled = false;
      }
    });
  }

  // Send Password Reset Email
  $("#send-reset-email-btn")?.addEventListener("click", async () => {
    const isAr = isArabic();
    const email = currentUser?.email;
    if (!email || currentUser.isGuest) {
      toast(isAr ? "البريد الإلكتروني غير متوفر لإرسال رابط الاستعادة" : "No registered email available for reset link", "error");
      return;
    }

    try {
      if (firebaseServices) {
        await firebaseServices.authSdk.sendPasswordResetEmail(firebaseServices.auth, email);
        toast(isAr ? `تم إرسال رابط إعادة التعيين إلى ${email} ✉️` : `Password reset link sent to ${email} ✉️`);
      } else {
        toast(isAr ? "تم إرسال رابط إعادة تعيين كلمة المرور افتراضياً ✉️" : "Password reset email simulated ✉️");
      }
    } catch (e) {
      toast(e.message || (isAr ? "تعذر إرسال البريد الإلكتروني" : "Could not send reset email"), "error");
    }
  });

  // Avatar Dialog Actions
  const avatarDialog = $("#avatar-dialog");
  const fileInput = $("#avatar-file-input");

  $("#open-avatar-picker")?.addEventListener("click", () => {
    avatarDialog.showModal();
  });
  $("#close-avatar-dialog")?.addEventListener("click", () => {
    avatarDialog.close();
  });
  $("#done-avatar-btn")?.addEventListener("click", () => {
    avatarDialog.close();
  });

  // Trigger browse file
  $("#browse-photo-btn")?.addEventListener("click", () => fileInput?.click());
  $("#avatar-upload-zone")?.addEventListener("click", (e) => {
    if (e.target.id !== "browse-photo-btn") fileInput?.click();
  });

  // Drag & drop upload
  const dropZone = $("#avatar-upload-zone");
  if (dropZone) {
    ["dragenter", "dragover"].forEach(evt => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropZone.classList.add("is-dragover");
      });
    });
    ["dragleave", "drop"].forEach(evt => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropZone.classList.remove("is-dragover");
      });
    });
    dropZone.addEventListener("drop", async (e) => {
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        await handleAvatarFile(files[0]);
      }
    });
  }

  // File input change
  fileInput?.addEventListener("change", async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleAvatarFile(e.target.files[0]);
    }
  });

  async function handleAvatarFile(file) {
    const isAr = isArabic();
    if (!file.type.startsWith("image/")) {
      toast(isAr ? "يرجى اختيار ملف صورة صالح (PNG, JPG, WebP)" : "Please choose a valid image file", "error");
      return;
    }

    $("#avatar-loading").hidden = false;
    try {
      const dataUrl = await resizeImage(file, 256);
      saveUser({ photoURL: dataUrl });
      renderProfile();
      avatarDialog.close();
      toast(isAr ? "تم تحديث الصورة الشخصية بنجاح 📸" : "Profile photo updated successfully 📸");

      // Optional background Firebase sync
      if (firebaseServices && firebaseUser) {
        try {
          await firebaseServices.authSdk.updateProfile(firebaseUser, { photoURL: dataUrl });
          const userRef = firebaseServices.firestoreSdk.doc(firebaseServices.db, "users", firebaseUser.uid);
          await firebaseServices.firestoreSdk.setDoc(userRef, { photoURL: dataUrl }, { merge: true });
        } catch (e) {
          console.warn("Background photo sync error:", e);
        }
      }
    } catch (e) {
      toast(isAr ? "فشل معالجة الصورة" : "Failed to process photo", "error");
    } finally {
      $("#avatar-loading").hidden = true;
    }
  }

  // Preset avatar selection
  $$(".preset-avatar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const isAr = isArabic();
      const presetKey = btn.dataset.preset;
      const url = presetAvatarUrls[presetKey];
      if (!url) return;

      saveUser({ photoURL: url });
      renderProfile();
      avatarDialog.close();
      toast(isAr ? "تم تعيين الصورة الرمزية بنجاح ✨" : "Explorer avatar chosen ✨");

      if (firebaseServices && firebaseUser) {
        firebaseServices.authSdk.updateProfile(firebaseUser, { photoURL: url }).catch(() => {});
        const userRef = firebaseServices.firestoreSdk.doc(firebaseServices.db, "users", firebaseUser.uid);
        firebaseServices.firestoreSdk.setDoc(userRef, { photoURL: url }, { merge: true }).catch(() => {});
      }
    });
  });

  // Remove photo (Reset to initials)
  $("#remove-photo-btn")?.addEventListener("click", () => {
    const isAr = isArabic();
    saveUser({ photoURL: null });
    renderProfile();
    avatarDialog.close();
    toast(isAr ? "تمت إزالة الصورة واستعادة الحروف الأولى" : "Profile photo removed — initials restored");

    if (firebaseServices && firebaseUser) {
      firebaseServices.authSdk.updateProfile(firebaseUser, { photoURL: "" }).catch(() => {});
      const userRef = firebaseServices.firestoreSdk.doc(firebaseServices.db, "users", firebaseUser.uid);
      firebaseServices.firestoreSdk.setDoc(userRef, { photoURL: "" }, { merge: true }).catch(() => {});
    }
  });

  // Interest Chips Click
  $$(".interest-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("is-selected");
      const selected = Array.from($$(".interest-chip.is-selected")).map(c => c.dataset.interest);
      localStorage.setItem("hawaInterests", JSON.stringify(selected));
      saveUser({ interests: selected });
      const isAr = isArabic();
      toast(isAr ? "تم حفظ تفضيلات الاستكشاف" : "Exploration preferences saved");
    });
  });

  // Data Reset Dialog
  const resetDialog = $("#confirm-reset-dialog");
  $("#btn-clear-local-data")?.addEventListener("click", () => resetDialog.showModal());
  $("#cancel-reset-btn")?.addEventListener("click", () => resetDialog.close());
  $("#confirm-reset-btn")?.addEventListener("click", () => {
    localStorage.removeItem("hawaPassport");
    localStorage.removeItem("hawa360CompletedScenes");
    localStorage.removeItem("hawaNowFavorites");
    localStorage.removeItem("hawaTrip");
    localStorage.removeItem("hawaSmartTripV1");
    localStorage.removeItem("hawaJourneyProgress");
    resetDialog.close();
    renderStats();
    const isAr = isArabic();
    toast(isAr ? "تمت إعادة ضبط بيانات الرحلة على هذا الجهاز بنجاح" : "Local journey data was successfully reset");
  });

  // Global Language Change listener
  window.addEventListener("hawa:language-change", () => {
    renderProfile();
  });
}

// Observe Firebase Auth
async function initAuthObserver() {
  try {
    firebaseServices = await getFirebaseServices();
    if (!firebaseServices) return;

    firebaseServices.authSdk.onAuthStateChanged(firebaseServices.auth, async (user) => {
      if (user) {
        firebaseUser = user;
        const profile = {
          displayName: user.displayName || user.email?.split("@")[0] || "Traveler",
          email: user.email,
          photoURL: user.photoURL || null
        };
        try {
          const userRef = firebaseServices.firestoreSdk.doc(firebaseServices.db, "users", user.uid);
          const docSnap = await firebaseServices.firestoreSdk.getDoc(userRef);
          if (docSnap.exists()) {
            Object.assign(profile, docSnap.data());
          }
        } catch (e) {}

        currentUser = profile;
        saveUser(profile);
        renderProfile();
      }
    });
  } catch (e) {
    console.warn("Firebase services not active on profile", e);
  }
}

// Initialize on page load
if (checkAuth()) {
  renderProfile();
  setupEvents();
  initAuthObserver();
}
