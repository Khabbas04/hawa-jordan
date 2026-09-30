import "./i18n.js";

export function isAuthenticated() {
  return Boolean(
    localStorage.getItem("hawaCurrentUserId") ||
    localStorage.getItem("hawaLocalUser")
  );
}

const rawSegment = location.pathname.split("/").pop().toLowerCase() || "index.html";
const cleanSegment = rawSegment.endsWith(".html") ? rawSegment : `${rawSegment}.html`;
const publicPages = new Set(["index.html", "login.html", "register.html", "", "index"]);

// 1. Direct Page Access Guard: if opening any protected page while not logged in, redirect to login
if (!isAuthenticated() && !publicPages.has(cleanSegment) && !publicPages.has(rawSegment)) {
  const returnUrl = encodeURIComponent(location.pathname + location.search + location.hash);
  window.location.replace(`login?redirect=${returnUrl}`);
}

// 2. Global Link Click Interceptor: whenever anyone clicks on ANY page before logging in, show login page first
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link) return;

  const rawHref = link.getAttribute("href");
  if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("javascript:") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
    return;
  }

  if (isAuthenticated()) return;

  try {
    const targetUrl = new URL(link.href, window.location.origin);
    if (targetUrl.origin !== window.location.origin) return;

    const path = targetUrl.pathname.replace(/^\/+/, "").toLowerCase();
    if (!path || path === "index.html") {
      if (!targetUrl.search) return; // Allow clicking home/logo without query params
    }

    if (path === "login" || path === "login.html" || path === "register" || path === "register.html") {
      return;
    }

    // Intercept navigation to any page before login
    event.preventDefault();
    event.stopPropagation();
    const returnUrl = encodeURIComponent(targetUrl.pathname + targetUrl.search + targetUrl.hash);
    window.location.assign(`login?redirect=${returnUrl}`);
  } catch (err) {
    console.error("Navigation auth intercept error:", err);
  }
}, true);

const header = document.querySelector("#site-header");
const currentPage = document.body.dataset.page || "";

const navItems = [
  { label: "Explore Places", hint: "Find places by feeling", href: "explore", page: "explore" },
  { label: "Plan a Trip", hint: "Build your route", href: "planner", page: "planner" },
  { label: "Nearby Now", hint: "Suggestions for this moment", href: "now", page: "now" },
  { label: "My Journey", hint: "Follow your route live", href: "journey", page: "journey" }
];

const pageGuides = {
  "index.html": {
    eyebrow: "START HERE", title: "Choose what you need",
    copy: "Hawa Jordan has three simple paths. Pick one now—you can switch anytime.",
    steps: ["Explore places", "Build a trip", "Find something nearby"],
    action: { label: "Explore places", href: "explore" }
  },
  "explore.html": {
    eyebrow: "EXPLORE", title: "Find a place by feeling",
    copy: "You do not need to know Jordan's regions. Start with the atmosphere you want.",
    steps: ["Choose a feeling", "Open a place", "Try its 360° view"],
    action: { label: "See the places", href: "#destination-strip" }
  },
  "destination.html": {
    eyebrow: "PLACE PAGE", title: "Decide if this place fits",
    copy: "Get the essential story first, then look around or add the place to your route.",
    steps: ["Read the overview", "Look around in 360°", "Add it to your trip"],
    action: { label: "Look around", target: "#experience-button" }
  },
  "planner.html": {
    eyebrow: "TRIP PLANNER", title: "Turn ideas into a route",
    copy: "The map starts with a sample route. Replace it with a trip shaped around your days and interests.",
    steps: ["Build your route", "Add or reorder stops", "Preview and start the journey"],
    action: { label: "Build my trip", target: "#open-settings" }
  },
  "now.html": {
    eyebrow: "NEARBY NOW", title: "Get three useful options",
    copy: "Choose your area, free time and budget. Live weather improves the suggestions when available.",
    steps: ["Set your area", "Add time and budget", "Choose one experience"],
    action: { label: "Set my moment", target: "#open-now-settings" }
  },
  "journey.html": {
    eyebrow: "LIVE JOURNEY", title: "Follow your route on the road",
    copy: "If you have not built a trip yet, a starter route is shown. Live location is optional and only starts after you allow it.",
    steps: ["Choose the next stop", "Open directions", "Confirm when you arrive"],
    action: { label: "Use live location", target: "#toggle-live" }
  },
  "passport.html": {
    eyebrow: "TRAVEL PASSPORT", title: "Collect real visits",
    copy: "Stamps begin locked. When you are near a destination, verify your location to collect its stamp.",
    steps: ["Visit a destination", "Verify within 5 km", "Unlock stamps and badges"],
    action: { label: "Verify a visit", target: "#verify-nearest" }
  },
  "stories.html": {
    eyebrow: "LOCAL STORIES", title: "Meet the people behind the place",
    copy: "Filter by what interests you, then open any card to read the full short story.",
    steps: ["Choose a topic", "Open a story", "Discover its place"],
    action: { label: "Browse stories", href: "#story-grid" }
  },
  "about.html": {
    eyebrow: "ABOUT HAWA", title: "The story of Hawa Jordan",
    copy: "A sensory journey designed to make exploring Jordan unforgettable and personal.",
    steps: ["Read our story", "Discover the experience", "Plan your adventure"],
    action: { label: "Explore places", href: "explore" }
  }
};

const pageGuide = pageGuides[cleanSegment] || pageGuides[rawSegment];

function searchIcon() {
  return '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg>';
}

function userIcon() {
  return '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>';
}

function globeIcon() {
  return '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 4.4 6.2 4.4 9S15 17.8 12 21c-3-3.2-4.4-6.2-4.4-9S9 6.2 12 3Z"/></svg>';
}

function menuIcon() {
  return '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
}

function getStoredUser() {
  try {
    const local = localStorage.getItem("hawaLocalUser");
    if (local) return JSON.parse(local);
  } catch (e) {}
  try {
    const profile = localStorage.getItem("hawaUserProfile");
    if (profile) return JSON.parse(profile);
  } catch (e) {}
  if (isAuthenticated()) {
    return { displayName: "Traveler", email: "Traveler", photoURL: null };
  }
  return null;
}

function renderNavigation(user = null) {
  if (!header) return;
  const activeUser = user || getStoredUser();
  const initial = (activeUser?.displayName || activeUser?.email || "T").trim().charAt(0).toUpperCase() || "T";
  const userDisplayName = activeUser?.displayName || activeUser?.email || "Traveler";
  const avatarUrl = activeUser?.photoURL || null;

  header.innerHTML = `
    <div class="nav-shell">
      <a class="brand" href="/" aria-label="Hawa Jordan home">
        <img src="assets/logo/hawa-jordan-logo.png" alt="Hawa Jordan" decoding="sync" fetchpriority="high">
      </a>
      <nav class="nav-links" id="nav-links" aria-label="Main menu">
        ${navItems.map((item) => `<a class="nav-link${currentPage === item.page ? " is-active" : ""}" href="${item.href}"><span>${item.label}</span><small>${item.hint}</small></a>`).join("")}
      </nav>
      <div class="nav-tools">
        <button class="language-button" type="button" data-language-toggle data-i18n-ignore>
          ${globeIcon()}<span data-language-code>AR</span><span class="language-name" data-language-label>العربية</span>
        </button>
        ${pageGuide ? `<button class="page-help-button" type="button" aria-label="How this page works" aria-expanded="false"><b>?</b><span>How it works</span></button>` : ""}
        ${activeUser ? `
          <div class="user-menu">
            <button class="profile-button" type="button" aria-label="Open profile menu" aria-expanded="false" title="${escapeAttribute(userDisplayName)}">
              ${avatarUrl ? `<img class="profile-avatar" src="${escapeAttribute(avatarUrl)}" alt="${escapeAttribute(userDisplayName)}">` : `<span class="profile-initial">${escapeHtml(initial)}</span>`}
            </button>
            <div class="profile-popover" hidden>
              <div class="profile-info">
                <span class="profile-popover-name">${escapeHtml(userDisplayName)}</span>
                ${activeUser.email && activeUser.email !== userDisplayName ? `<small class="profile-popover-email">${escapeHtml(activeUser.email)}</small>` : ""}
              </div>
              <div class="profile-divider"></div>
              <a href="profile" class="profile-popover-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>My Profile</span>
              </a>
              <a href="passport" class="profile-popover-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>
                <span>My Passport</span>
              </a>
              <a href="journey" class="profile-popover-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                <span>My Journey</span>
              </a>
              <div class="profile-divider"></div>
              <button type="button" class="profile-popover-link profile-signout-btn" data-auth-action="signout">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span>Sign out</span>
              </button>
            </div>
          </div>` : `<a class="sign-in-link" href="login">Sign In</a>`}
        <button class="menu-toggle" type="button" aria-label="Open menu" aria-controls="nav-links" aria-expanded="false">${menuIcon()}</button>
      </div>
    </div>
  `;

  // Attach guide directly to document.body so it is NEVER trapped in header's backdrop-filter or overflow!
  document.querySelector("#page-guide-backdrop")?.remove();
  document.querySelector("#page-guide")?.remove();

  if (pageGuide) {
    const guideMarkup = `
      <div class="page-guide-backdrop" id="page-guide-backdrop" hidden></div>
      <aside class="page-guide" id="page-guide" role="dialog" aria-modal="true" aria-labelledby="page-guide-title" hidden>
        <button class="page-guide-close" type="button" aria-label="Close guide">×</button>
        <div class="page-guide-badge"><span>✦</span> ${escapeHtml(pageGuide.eyebrow)}</div>
        <h2 id="page-guide-title">${escapeHtml(pageGuide.title)}</h2>
        <p class="page-guide-desc">${escapeHtml(pageGuide.copy)}</p>
        <ol class="page-guide-steps">${pageGuide.steps.map((step) => `<li><span>${escapeHtml(step)}</span></li>`).join("")}</ol>
        ${pageGuide.action.href ? `<a class="page-guide-action" href="${pageGuide.action.href}"><span>${escapeHtml(pageGuide.action.label)}</span> <span aria-hidden="true">→</span></a>` : `<button class="page-guide-action" type="button" data-guide-target="${pageGuide.action.target}"><span>${escapeHtml(pageGuide.action.label)}</span> <span aria-hidden="true">→</span></button>`}
      </aside>
    `;
    document.body.insertAdjacentHTML("beforeend", guideMarkup);
  }

  bindNavigation();
}

function escapeHtml(value) {
  const span = document.createElement("span");
  span.textContent = value;
  return span.innerHTML;
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}

function bindNavigation() {
  const menuButton = header?.querySelector(".menu-toggle");
  menuButton?.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    document.body.classList.toggle("menu-is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  header?.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("menu-open");
      document.body.classList.remove("menu-is-open");
    });
  });

  const profileButton = header?.querySelector(".profile-button");
  const popover = header?.querySelector(".profile-popover");
  profileButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = popover.hidden;
    popover.hidden = !open;
    profileButton.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", (event) => {
    if (popover && !popover.hidden && !event.target.closest(".user-menu")) {
      popover.hidden = true;
      profileButton?.setAttribute("aria-expanded", "false");
    }
  });

  header?.querySelector("[data-open-search]")?.addEventListener("click", () => {
    const search = document.querySelector("#destination-query");
    if (search) {
      search.focus();
    } else {
      window.location.assign("/#destination-search");
    }
  });

  const helpButton = header?.querySelector(".page-help-button");
  const guide = document.querySelector("#page-guide");
  const backdrop = document.querySelector("#page-guide-backdrop");

  const setGuide = (open) => {
    if (!guide) return;
    guide.hidden = !open;
    if (backdrop) backdrop.hidden = !open;
    if (helpButton) helpButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("guide-is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };

  helpButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    setGuide(guide ? guide.hidden : false);
  });

  backdrop?.addEventListener("click", () => setGuide(false));
  guide?.querySelector(".page-guide-close")?.addEventListener("click", () => setGuide(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && guide && !guide.hidden) {
      setGuide(false);
    }
  });

  guide?.querySelector(".page-guide-action")?.addEventListener("click", (event) => {
    const targetSelector = event.currentTarget.dataset.guideTarget;
    setGuide(false);
    if (!targetSelector) return;
    event.preventDefault();
    const target = document.querySelector(targetSelector);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => target?.click(), 220);
  });
}

function renderFooter() {
  if (document.querySelector(".site-footer")) return;
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-shell">
      <div class="footer-brand">
        <a href="/" aria-label="Hawa Jordan home"><img src="assets/logo/hawa-jordan-logo.png" alt="Hawa Jordan"></a>
        <p>Travel through Jordan by feeling, story and place.</p>
      </div>
      <div class="footer-links">
        <div>
          <h2>Discover</h2>
          <a href="explore">Explore Jordan</a>
          <a href="planner">Plan a trip</a>
          <a href="now">What can I do now?</a>
        </div>
        <div>
          <h2>More</h2>
          <a href="passport">My passport</a>
          <a href="stories">Local stories</a>
          <a href="about">About us</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} Hawa Jordan</span>
      <span>Made with care for Jordan</span>
    </div>`;
  const main = document.querySelector("main");
  if (main) main.insertAdjacentElement("afterend", footer);
  else document.body.append(footer);
}

renderNavigation();
renderFooter();
window.addEventListener("hawa:auth-change", (event) => renderNavigation(event.detail?.user));
