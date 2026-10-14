import { WA_MESSAGES, waUrl } from "./wa.js";
import { MENU_ITEMS } from "./menu.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. WhatsApp links (data-wa)
  document.querySelectorAll("a[data-wa]").forEach((a) => {
    const msg = WA_MESSAGES[a.dataset.wa];
    if (!msg) return;
    a.href = waUrl(msg);
    a.target = "_blank";
    a.rel = "noopener";
  });

  // 2. View switching (Navigation data-target)
  const views = {
    home: document.getElementById("home-view"),
    menu: document.getElementById("menu-view"),
    about: document.getElementById("about-view"),
  };

  const switchView = (target, pushHistory = true) => {
    Object.keys(views).forEach((key) => {
      if (views[key]) {
        views[key].style.display = key === target ? "block" : "none";
      }
    });

    // Update active state on nav links
    document.querySelectorAll("[data-target]").forEach((el) => {
      if (el.dataset.target === target) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Close mobile nav if open
    const mobileNav = document.querySelector(".mobile-nav");
    const backdrop = document.querySelector(".mobile-overlay-backdrop");
    if (mobileNav) mobileNav.classList.remove("active");
    if (backdrop) backdrop.classList.remove("active");

    if (pushHistory) {
      const state = { view: target };
      const url = target === "home" ? window.location.pathname + window.location.search : `#${target}`;
      history.pushState(state, "", url);
    }
  };

  // Handle browser back/forward buttons (phone back button)
  window.addEventListener("popstate", (e) => {
    let target = "home";
    if (e.state && e.state.view && views[e.state.view]) {
      target = e.state.view;
    } else {
      const hash = window.location.hash.replace("#", "");
      if (views[hash]) {
        target = hash;
      }
    }
    switchView(target, false);
  });

  // On initial load, check hash or set initial state
  const initialHash = window.location.hash.replace("#", "");
  if (views[initialHash]) {
    switchView(initialHash, false);
    history.replaceState({ view: initialHash }, "", window.location.hash);
  } else {
    history.replaceState({ view: "home" }, "", window.location.pathname + window.location.search);
  }

  document.addEventListener("click", (e) => {
    const targetEl = e.target.closest("[data-target]");
    if (!targetEl) return;
    e.preventDefault();
    const target = targetEl.dataset.target;
    if (views[target]) {
      switchView(target);
    }
  });

  // 3. Mobile Menu Toggle
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const mobileNav = document.querySelector(".mobile-nav");
  const backdrop = document.querySelector(".mobile-overlay-backdrop");

  if (hamburgerBtn && mobileNav && backdrop) {
    hamburgerBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("active");
      backdrop.classList.toggle("active");
    });
    backdrop.addEventListener("click", () => {
      mobileNav.classList.remove("active");
      backdrop.classList.remove("active");
    });
  }

  // 4. Render Full Menu
  const menuContainer = document.getElementById("full-menu-container");
  if (menuContainer) {
    const renderMenu = (filter = "all") => {
      menuContainer.innerHTML = "";
      const filtered =
        filter === "all"
          ? MENU_ITEMS
          : MENU_ITEMS.filter((item) => item.category === filter);

      filtered.forEach((item) => {
        const article = document.createElement("article");
        article.className = "card";
        article.innerHTML = `
          <div class="card-img-wrapper">
            <img src="${item.img}" alt="${item.name}" loading="lazy" />
            <span class="card-badge">${item.badge}</span>
          </div>
          <div class="card-content-wrap">
            <h3>${item.name}</h3>
            <p>${item.desc}</p>
            <div class="card-footer-info">
              <strong>${item.price}</strong>
              <button class="card-order-btn" title="Commander sur WhatsApp" aria-label="Commander ${item.name}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          </div>
        `;
        menuContainer.appendChild(article);
      });
    };

    renderMenu("all");

    // Category filter buttons
    document.querySelectorAll(".cat-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderMenu(btn.dataset.filter);
      });
    });
  }
});

// === Click event for order buttons (+) on cards ===
document.addEventListener(
  "click",
  (e) => {
    const btn = e.target.closest(".card-order-btn");
    if (!btn) return;
    e.stopPropagation();
    e.preventDefault();
    const dish =
      btn.closest(".card")?.querySelector("h3")?.textContent.trim() ||
      "un plat";
    window.open(waUrl(WA_MESSAGES.order(dish)), "_blank", "noopener");
  },
  true,
);
