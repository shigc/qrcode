/* ===== App Entry ===== */
document.addEventListener("DOMContentLoaded", () => {
  Theme.init();
  I18N.init();

  // 每个模块独立容错：任一模块初始化失败不得阻断主流程，
  // 确保二维码功能始终可用。
  const page = document.body.dataset.page;
  if (page === "generator") QRGenerator.init();
  if (page === "decoder") QRDecoder.init();
});

// Re-run text placeholders on language change
window.__onLangChange = function () {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = I18N.t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.placeholder = I18N.t(el.getAttribute("data-i18n-ph"));
  });
};
