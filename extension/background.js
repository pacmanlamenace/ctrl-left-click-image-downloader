"use strict";

function sanitizeFilename(value) {
  const base = (value || "image")
    .replace(/\s+-\s+Google Search.*$/i, "")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
    .replace(/[. ]+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return `${base || "image"}.png`;
}

function filenameFor(url, pageTitle) {
  try {
    const pathName = decodeURIComponent(new URL(url).pathname.split("/").pop() || "");
    const withoutExtension = pathName.replace(/\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i, "");
    if (withoutExtension && withoutExtension.length > 2) return sanitizeFilename(withoutExtension);
  } catch (_) {}
  return sanitizeFilename(pageTitle);
}

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, credentials: "include" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    if (!blob.type.startsWith("image/")) throw new Error("Response is not an image");
    return blob;
  } finally {
    clearTimeout(timer);
  }
}

async function convertToPng(sourceBlob) {
  const bitmap = await createImageBitmap(sourceBlob);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("Canvas is unavailable");
    context.drawImage(bitmap, 0, 0);
    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNG conversion failed")), "image/png");
    });
  } finally {
    bitmap.close();
  }
}

async function downloadFirstAvailable(message) {
  const urls = [...new Set((message.candidates || []).filter((url) => /^https?:\/\//i.test(url)))];
  if (!urls.length) throw new Error("No downloadable image URL was found.");
  const failures = [];

  for (const url of urls.slice(0, 20)) {
    try {
      const source = await fetchWithTimeout(url);
      const png = await convertToPng(source);
      const objectUrl = URL.createObjectURL(png);
      const filename = filenameFor(url, message.pageTitle);
      try {
        await browser.downloads.download({ url: objectUrl, filename, conflictAction: "uniquify", saveAs: false });
      } finally {
        setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
      }
      return { ok: true, filename };
    } catch (error) {
      failures.push(error.message);
    }
  }
  throw new Error(`Google or the image host blocked access (${failures.at(-1) || "unknown error"}).`);
}

browser.runtime.onMessage.addListener((message) => {
  if (message?.type !== "download-image") return undefined;
  return downloadFirstAvailable(message).catch((error) => ({ ok: false, error: error.message }));
});

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get("enabled").then((stored) => {
    if (typeof stored.enabled !== "boolean") browser.storage.local.set({ enabled: true });
  });
});
