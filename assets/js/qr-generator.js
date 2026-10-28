/* ===== QR Code Generator ===== */
const QRGenerator = (function () {
  let qrInstance = null;
  let debounceTimer = null;
  let currentData = "";

  // 导出图片分辨率：预览用 state.size 足够屏幕显示，但下载的主流二维码图通常
  // 需要更高清晰度，故导出固定用高清 1024px（参考主流二维码平台）。
  const EXPORT_SIZE = 1024;

  const defaults = {
    type: "text",
    size: 320,
    margin: 2,
    ecc: "M",
    fgColor: "#1f2329",
    bgColor: "#ffffff",
    bgTransparent: false,
    dotsType: "square",
    cornerType: "square",
    logo: null,
    logoSize: 0.3,
    logoEmbed: false,
    logoOpacity: 0.9,
  };

  let state = { ...defaults };

  /* ---- Encoding helpers ---- */
  function escapeWiFi(str) {
    return String(str).replace(/([\\;,":])/g, "\\$1");
  }

  function encodeText(f) {
    return f.content || "";
  }

  function encodeWiFi(f) {
    const enc = f.encryption || "WPA";
    const ssid = escapeWiFi(f.ssid || "");
    const pass = enc === "nopass" ? "" : escapeWiFi(f.password || "");
    const hidden = f.hidden ? "true" : "false";
    let str = `WIFI:T:${enc};S:${ssid};`;
    if (enc !== "nopass") str += `P:${pass};`;
    str += `H:${hidden};;`;
    return str;
  }

  function encodeVCard(f) {
    const lines = ["BEGIN:VCARD", "VERSION:2.1"];
    if (f.name) lines.push(`N:${f.name}`);
    if (f.name) lines.push(`FN:${f.name}`);
    if (f.phone) lines.push(`TEL;CELL:${f.phone}`);
    if (f.email) lines.push(`EMAIL:${f.email}`);
    if (f.company) lines.push(`ORG:${f.company}`);
    if (f.title) lines.push(`TITLE:${f.title}`);
    if (f.address) lines.push(`ADR:;;${f.address};;;;`);
    if (f.website) lines.push(`URL:${f.website}`);
    if (f.note) lines.push(`NOTE:${f.note}`);
    lines.push("END:VCARD");
    return lines.join("\n");
  }

  function encodeEmail(f) {
    let str = `mailto:${encodeURIComponent(f.to || "")}`;
    const params = [];
    if (f.subject) params.push(`subject=${encodeURIComponent(f.subject)}`);
    if (f.body) params.push(`body=${encodeURIComponent(f.body)}`);
    if (params.length) str += "?" + params.join("&");
    return str;
  }

  function encodeSMS(f) {
    let str = `sms:${f.number || ""}`;
    if (f.message) str += `?body=${encodeURIComponent(f.message)}`;
    return str;
  }

  function encodePhone(f) {
    return `tel:${f.number || ""}`;
  }

  function encodeLocation(f) {
    return `geo:${f.lat || ""},${f.lng || ""}`;
  }

  function formatDate(d) {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt)) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return (
      dt.getFullYear() +
      pad(dt.getMonth() + 1) +
      pad(dt.getDate()) +
      "T" +
      pad(dt.getHours()) +
      pad(dt.getMinutes()) +
      "00"
    );
  }

  function encodeEvent(f) {
    const lines = [
      "BEGIN:VEVENT",
      `SUMMARY:${f.eventTitle || ""}`,
      `LOCATION:${f.location || ""}`,
      `DTSTART:${formatDate(f.start)}`,
      `DTEND:${formatDate(f.end)}`,
      `DESCRIPTION:${f.description || ""}`,
      "END:VEVENT",
    ];
    return lines.join("\n");
  }

  const encoders = {
    text: encodeText,
    wifi: encodeWiFi,
    vcard: encodeVCard,
    email: encodeEmail,
    sms: encodeSMS,
    phone: encodePhone,
    location: encodeLocation,
    event: encodeEvent,
  };

  /* ---- Build data from form ---- */
  function collectForm() {
    const f = {};
    document
      .querySelectorAll(".type-form:not(.hidden) [data-field]")
      .forEach((el) => {
        const key = el.dataset.field;
        if (el.type === "checkbox") f[key] = el.checked;
        else f[key] = el.value;
      });
    return f;
  }

  function buildData() {
    const f = collectForm();
    const fn = encoders[state.type] || encodeText;
    return fn(f);
  }

  /* ---- QR rendering ---- */
  // 嵌入模式下：背景透明、强制最高容错率、点阵完全不透明
  // Logo 通过 #qr-preview 元素自身的 background-image 显示（库不会清父元素样式）
  function effectiveOpts() {
    const embed = state.logoEmbed && !!state.logo;
    const ecc = embed ? "H" : state.ecc;
    const bgTransparent = embed ? true : state.bgTransparent;
    const bgColor = bgTransparent ? "transparent" : state.bgColor;
    const image = embed ? undefined : state.logo || undefined;
    return {
      qrOptions: { errorCorrectionLevel: ecc },
      backgroundOptions: { color: bgColor },
      dotsColor: state.fgColor,
      image,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 2,
        imageSize: state.logoSize,
      },
    };
  }

  function applyEmbedClass() {
    const el = document.getElementById("qr-preview");
    const bg = document.getElementById("qr-logo-bg");
    if (!el) return;
    if (state.logoEmbed && state.logo) {
      el.classList.add("embed-mode");
      if (bg) {
        bg.src = state.logo;
        bg.style.opacity = String(state.logoOpacity);
      }
    } else {
      el.classList.remove("embed-mode");
      if (bg) {
        bg.src = "";
      }
    }
  }

  function createInstance() {
    const el = document.getElementById("qr-preview");
    const canvasEl = document.getElementById("qr-canvas");
    if (!el || !canvasEl) return;
    canvasEl.innerHTML = "";
    const eff = effectiveOpts();
    qrInstance = new QRCodeStyling({
      width: state.size,
      height: state.size,
      type: "svg",
      data: currentData || " ",
      margin: state.margin,
      qrOptions: eff.qrOptions,
      dotsOptions: {
        color: eff.dotsColor,
        type: state.dotsType,
      },
      cornersSquareOptions: {
        color: state.fgColor,
        type: state.cornerType,
      },
      cornersDotOptions: {
        color: state.fgColor,
        type: state.cornerType,
      },
      backgroundOptions: eff.backgroundOptions,
      image: eff.image,
      imageOptions: eff.imageOptions,
    });
    // 库只操作 #qr-canvas，不会清除兄弟节点 #qr-logo-bg
    qrInstance.append(canvasEl);
    applyEmbedClass();
  }

  function update() {
    if (!qrInstance) createInstance();
    const eff = effectiveOpts();
    const opts = {
      data: currentData || " ",
      margin: state.margin,
      qrOptions: eff.qrOptions,
      dotsOptions: { color: eff.dotsColor, type: state.dotsType },
      cornersSquareOptions: { color: state.fgColor, type: state.cornerType },
      cornersDotOptions: { color: state.fgColor, type: state.cornerType },
      backgroundOptions: eff.backgroundOptions,
      image: eff.image,
      imageOptions: eff.imageOptions,
    };
    qrInstance.update(opts);
    applyEmbedClass();
  }

  function render() {
    currentData = buildData();
    if (!currentData) {
      const el = document.getElementById("qr-preview");
      const canvasEl = document.getElementById("qr-canvas");
      const bg = document.getElementById("qr-logo-bg");
      // 只清空 canvas 容器，保留 logo img 元素
      if (canvasEl)
        canvasEl.innerHTML =
          '<span class="qr-placeholder" data-i18n="preview.empty">' +
          I18N.t("preview.empty") +
          "</span>";
      qrInstance = null;
      // 无内容时移除嵌入模式样式（避免 Logo 背景残留在占位符后）
      if (el) el.classList.remove("embed-mode");
      if (bg) bg.src = "";
      return;
    }
    update();
  }

  function scheduleRender(delay = 120) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(render, delay);
  }

  /* ---- Download / Copy ---- */
  function loadImage(src) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => rej(new Error("image load failed"));
      img.src = src;
    });
  }

  // 嵌入模式：预览 = 透明点阵 + 底层铺满的 logo（object-fit:contain + logoOpacity）。
  // 这里把 logo 合成进导出的 PNG，避免下载/复制缺 logo 而与预览不一致。
  async function getExportPngBlob() {
    const embed = state.logoEmbed && state.logo;
    const size = EXPORT_SIZE;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    // 二维码可扫性需要模块与背景强对比。透明背景在部分扫码器/看图器里会被
    // 合成为黑色或做 alpha 融合，导致识别失败；预览显示在白底所以能扫。
    // 因此导出统一用不透明背景（用户设置的不透明背景色优先，透明/嵌入回退为白）。
    ctx.fillStyle = embed || state.bgTransparent ? "#ffffff" : state.bgColor;
    ctx.fillRect(0, 0, size, size);
    // 嵌入模式下库保存的 SVG 不含 logo，需要手动把 logo 摊上层；非嵌入 logo 已由库画进 SVG
    if (embed && state.logo) {
      const img = await loadImage(state.logo);
      ctx.globalAlpha = state.logoOpacity;
      const scale = Math.min(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      ctx.globalAlpha = 1;
    }
    const svgImg = await loadImage(URL.createObjectURL(await qrInstance.getRawData("svg")));
    ctx.drawImage(svgImg, 0, 0, size, size);
    return new Promise((res) => canvas.toBlob(res, "image/png"));
  }

  // 嵌入模式的 SVG 导出同样内联进 logo，保持与预览一致
  async function getExportSvg() {
    const embed = state.logoEmbed && state.logo;
    const blob = await qrInstance.getRawData("svg");
    if (!embed) return blob;
    const img = await loadImage(state.logo);
    const size = state.size;
    const scale = Math.min(size / img.width, size / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (size - w) / 2;
    const y = (size - h) / 2;
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext("2d").drawImage(img, 0, 0);
    const dataUrl = c.toDataURL("image/png");
    const text = await blob.text();
    const tag =
      '<image href="' +
      dataUrl +
      '" x="' +
      x +
      '" y="' +
      y +
      '" width="' +
      w +
      '" height="' +
      h +
      '" opacity="' +
      state.logoOpacity +
      '" preserveAspectRatio="xMidYMid meet"/>';
    const end = text.indexOf(">");
    const out = text.slice(0, end + 1) + tag + text.slice(end + 1);
    return new Blob([out], { type: "image/svg+xml" });
  }

  async function download(type) {
    if (!qrInstance || !currentData) return;
    const blob = type === "png" ? await getExportPngBlob() : await getExportSvg();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode.${type === "png" ? "png" : "svg"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copyImage() {
    if (!qrInstance || !currentData) return;
    try {
      const pngBlob = await getExportPngBlob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": pngBlob }),
      ]);
      const btn = document.getElementById("btn-copy");
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = I18N.t("btn.copied");
        setTimeout(() => (btn.textContent = orig), 1500);
      }
    } catch (e) {
      console.warn("Copy failed", e);
    }
  }

  /* ---- Init ---- */
  function bindEvents() {
    // Type tabs
    document.querySelectorAll(".type-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document
          .querySelectorAll(".type-tab")
          .forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        state.type = tab.dataset.type;
        document.querySelectorAll(".type-form").forEach((f) => {
          if (f.id === `form-${state.type}`) f.classList.remove("hidden");
          else f.classList.add("hidden");
        });
        scheduleRender(0);
      });
    });

    // Form inputs
    document.querySelectorAll(".type-form").forEach((form) => {
      form.addEventListener("input", () => scheduleRender());
      form.addEventListener("change", () => scheduleRender());
    });

    // Customization
    const size = document.getElementById("opt-size");
    const margin = document.getElementById("opt-margin");
    const ecc = document.getElementById("opt-ecc");
    const fg = document.getElementById("opt-fg");
    const fgText = document.getElementById("opt-fg-text");
    const bg = document.getElementById("opt-bg");
    const bgText = document.getElementById("opt-bg-text");
    const bgTrans = document.getElementById("opt-bg-trans");
    const logoSize = document.getElementById("opt-logo-size");

    size.addEventListener("input", () => {
      state.size = +size.value;
      document.getElementById("val-size").textContent = size.value + "px";
      createInstance();
      update();
    });
    margin.addEventListener("input", () => {
      state.margin = +margin.value;
      document.getElementById("val-margin").textContent = margin.value;
      scheduleRender(0);
    });
    ecc.addEventListener("change", () => {
      state.ecc = ecc.value;
      scheduleRender(0);
    });
    function bindColor(colorEl, textEl, key) {
      const apply = () => {
        state[key] = colorEl.value;
        textEl.value = colorEl.value;
        scheduleRender(0);
      };
      colorEl.addEventListener("input", apply);
      textEl.addEventListener("input", () => {
        if (/^#[0-9a-fA-F]{6}$/.test(textEl.value)) {
          colorEl.value = textEl.value;
          apply();
        }
      });
    }
    bindColor(fg, fgText, "fgColor");
    bindColor(bg, bgText, "bgColor");
    bgTrans.addEventListener("change", () => {
      state.bgTransparent = bgTrans.checked;
      bg.disabled = bgTrans.checked;
      bgText.disabled = bgTrans.checked;
      scheduleRender(0);
    });

    // Dots / corner pills
    document.querySelectorAll(".dots-pills .pill").forEach((p) => {
      p.addEventListener("click", () => {
        document
          .querySelectorAll(".dots-pills .pill")
          .forEach((x) => x.classList.remove("active"));
        p.classList.add("active");
        state.dotsType = p.dataset.type;
        scheduleRender(0);
      });
    });
    document.querySelectorAll(".corner-pills .pill").forEach((p) => {
      p.addEventListener("click", () => {
        document
          .querySelectorAll(".corner-pills .pill")
          .forEach((x) => x.classList.remove("active"));
        p.classList.add("active");
        state.cornerType = p.dataset.type;
        scheduleRender(0);
      });
    });

    // Logo
    const logoInput = document.getElementById("logo-input");
    const logoPreview = document.getElementById("logo-preview");
    const removeLogo = document.getElementById("remove-logo");
    const logoEmbed = document.getElementById("opt-logo-embed");
    const logoSizeRow = document.getElementById("logo-size-row");
    const logoOpacityRow = document.getElementById("logo-opacity-row");
    const logoOpacity = document.getElementById("opt-logo-opacity");
    function syncLogoUi() {
      // 嵌入模式开启且有 Logo 时：隐藏中心 Logo 大小滑块（不再适用），显示背景不透明度滑块
      const embedActive = state.logoEmbed && !!state.logo;
      if (logoSizeRow) logoSizeRow.classList.toggle("hidden", embedActive);
      if (logoOpacityRow) logoOpacityRow.classList.toggle("hidden", !embedActive);
    }
    logoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        state.logo = ev.target.result;
        logoPreview.src = state.logo;
        logoPreview.classList.remove("hidden");
        document.getElementById("logo-upload-text").classList.add("hidden");
        removeLogo.classList.remove("hidden");
        syncLogoUi();
        scheduleRender(0);
      };
      reader.readAsDataURL(file);
    });
    removeLogo.addEventListener("click", () => {
      state.logo = null;
      logoInput.value = "";
      logoPreview.src = "";
      logoPreview.classList.add("hidden");
      document.getElementById("logo-upload-text").classList.remove("hidden");
      removeLogo.classList.add("hidden");
      syncLogoUi();
      scheduleRender(0);
    });
    logoSize.addEventListener("input", () => {
      state.logoSize = +logoSize.value / 100;
      document.getElementById("val-logo-size").textContent = logoSize.value + "%";
      scheduleRender(0);
    });
    logoEmbed.addEventListener("change", () => {
      state.logoEmbed = logoEmbed.checked;
      syncLogoUi();
      scheduleRender(0);
    });
    // 不透明度滑块：直接操作 #qr-logo-bg 的 opacity
    logoOpacity.addEventListener("input", () => {
      state.logoOpacity = +logoOpacity.value / 100;
      document.getElementById("val-logo-opacity").textContent = logoOpacity.value + "%";
      const bg = document.getElementById("qr-logo-bg");
      if (bg) bg.style.opacity = String(state.logoOpacity);
    });

    // Actions
    document
      .getElementById("btn-png")
      .addEventListener("click", () => download("png"));
    document
      .getElementById("btn-svg")
      .addEventListener("click", () => download("svg"));
    document.getElementById("btn-copy").addEventListener("click", copyImage);
  }

  function init() {
    bindEvents();
    render();
  }

  return { init };
})();
