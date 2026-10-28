/* ===== QR Code Decoder ===== */
const QRDecoder = (function () {
  let videoStream = null;
  let rafId = null;
  let scanning = false;

  function showResult(text) {
    const result = document.getElementById("decode-result");
    if (result) {
      result.textContent = text;
    }
  }

  function decodeImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1200;
        let { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const code = jsQR(imgData.data, width, height, {
          inversionAttempts: "attemptBoth",
        });
        if (code) {
          showResult(code.data);
        } else {
          showResult(I18N.t("decode.nofound"));
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  async function startCamera() {
    const video = document.getElementById("camera-video");
    const canvas = document.getElementById("camera-canvas");
    const result = document.getElementById("decode-result");
    if (!video || !canvas) return;

    try {
      videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      video.srcObject = videoStream;
      await video.play();
      scanning = true;
      document.getElementById("btn-start-camera").textContent = I18N.t(
        "btn.stopCamera"
      );
      tick();
    } catch (err) {
      console.error(err);
      showResult(I18N.t("decode.nocamera"));
    }
  }

  function tick() {
    if (!scanning) return;
    const video = document.getElementById("camera-video");
    const canvas = document.getElementById("camera-canvas");
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imgData.data, canvas.width, canvas.height, {
        inversionAttempts: "dontInvert",
      });
      if (code) {
        showResult(code.data);
        stopCamera();
        return;
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  function stopCamera() {
    scanning = false;
    if (rafId) cancelAnimationFrame(rafId);
    if (videoStream) {
      videoStream.getTracks().forEach((t) => t.stop());
      videoStream = null;
    }
    const video = document.getElementById("camera-video");
    if (video) video.srcObject = null;
    const btn = document.getElementById("btn-start-camera");
    if (btn) btn.textContent = I18N.t("btn.startCamera");
  }

  async function copyResult() {
    const result = document.getElementById("decode-result");
    if (!result || !result.textContent) return;
    try {
      await navigator.clipboard.writeText(result.textContent);
      const btn = document.getElementById("btn-copy-result");
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = I18N.t("decode.copied");
        setTimeout(() => (btn.textContent = orig), 1500);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  function init() {
    const fileInput = document.getElementById("decode-file");
    const dropArea = document.getElementById("decode-upload");

    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        if (e.target.files[0]) decodeImage(e.target.files[0]);
      });
    }
    if (dropArea) {
      dropArea.addEventListener("click", () => fileInput && fileInput.click());
      dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropArea.style.borderColor = "var(--color-primary)";
      });
      dropArea.addEventListener("dragleave", () => {
        dropArea.style.borderColor = "";
      });
      dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.style.borderColor = "";
        if (e.dataTransfer.files[0]) decodeImage(e.dataTransfer.files[0]);
      });
    }

    const camBtn = document.getElementById("btn-start-camera");
    if (camBtn) {
      camBtn.addEventListener("click", () => {
        if (scanning) stopCamera();
        else startCamera();
      });
    }

    const copyBtn = document.getElementById("btn-copy-result");
    if (copyBtn) copyBtn.addEventListener("click", copyResult);
  }

  return { init };
})();
