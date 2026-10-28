/* ===== Theme System ===== */
const Theme = (function () {
  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function getSavedTheme() {
    return localStorage.getItem("qr_theme") || "auto";
  }

  function resolveTheme() {
    const saved = getSavedTheme();
    return saved === "auto" ? getSystemTheme() : saved;
  }

  function apply() {
    document.documentElement.setAttribute("data-theme", resolveTheme());
  }

  function cycle() {
    const saved = getSavedTheme();
    const next = saved === "light" ? "dark" : saved === "dark" ? "auto" : "light";
    localStorage.setItem("qr_theme", next);
    apply();
    updateBtn(next);
  }

  function updateBtn(mode) {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const label = document.querySelector(".lang-switch, .header-actions");
    const icon = btn.querySelector("svg");
    if (!icon) return;
    const icons = {
      light:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
      dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
      auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0 0 20 2 2 0 0 0 0-4 8 8 0 0 1 0-16 2 2 0 0 0 0-4z"/></svg>',
    };
    icon.outerHTML = icons[mode] || icons.light;
    btn.title = I18N.t("theme.toggle");
  }

  function init() {
    apply();
    updateBtn(getSavedTheme());
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.addEventListener("click", cycle);

    // Listen to system changes if in auto mode
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (getSavedTheme() === "auto") apply();
      });
  }

  return { init };
})();
