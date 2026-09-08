"use strict";

const DEFAULTS = { enabled: true };
const IS_SUPPORTED_PAGE = location.protocol === "http:" || location.protocol === "https:";

function showNotice(message, kind = "info") {
  const old = document.getElementById("gid-notice");
  if (old) old.remove();
  const notice = document.createElement("div");
  notice.id = "gid-notice";
  notice.dataset.kind = kind;
  notice.textContent = message;
  (document.documentElement || document.body).appendChild(notice);
  window.setTimeout(() => notice.remove(), kind === "error" ? 5500 : 2600);
}

function usableUrl(value) {
  if (!value || typeof value !== "string") return null;
  const cleaned = value.replace(/&amp;/g, "&").replace(/\\u003d/g, "=").replace(/\\u0026/g, "&");
  try {
    const url = new URL(cleaned, location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch (_) {
    return null;
  }
}

function addCandidate(list, value, score) {
  const url = usableUrl(value);
  if (!url) return;
  const existing = list.find((item) => item.url === url);
  if (existing) existing.score = Math.max(existing.score, score);
  else list.push({ url, score });
}

function collectCandidates(img) {
  const candidates = [];
  let node = img;

  for (let depth = 0; node && depth < 7; depth += 1, node = node.parentElement) {
    if (node instanceof HTMLAnchorElement) {
      try {
        const link = new URL(node.href, location.href);
        addCandidate(candidates, link.searchParams.get("imgurl"), 1000);
        addCandidate(candidates, link.searchParams.get("mediaurl"), 950);
        if (/\.(avif|bmp|gif|jpe?g|png|svg|webp)(?:$|[?#])/i.test(link.href)) {
          addCandidate(candidates, link.href, 850);
        }
      } catch (_) {}
    }

    for (const attr of node.attributes || []) {
      if (!/(url|src|image|media)/i.test(attr.name)) continue;
      addCandidate(candidates, attr.value, /original|full|image_url/i.test(attr.name) ? 900 : 650);
      const matches = attr.value.match(/https?:[^\s"'\\]+/g) || [];
      for (const match of matches) addCandidate(candidates, match, 700);
    }

    for (const related of node.querySelectorAll?.("img") || []) {
      const areaBonus = Math.min(200, related.naturalWidth * related.naturalHeight / 5000);
      addCandidate(candidates, related.currentSrc, 300 + areaBonus);
      addCandidate(candidates, related.src, 250 + areaBonus);
      for (const part of (related.srcset || "").split(",")) {
        const [url, descriptor = ""] = part.trim().split(/\s+/);
        addCandidate(candidates, url, 400 + (parseFloat(descriptor) || 1) * 100);
      }
    }

    for (const source of node.querySelectorAll?.("picture source[srcset]") || []) {
      for (const part of source.srcset.split(",")) {
        const [url, descriptor = ""] = part.trim().split(/\s+/);
        addCandidate(candidates, url, 550 + (parseFloat(descriptor) || 1) * 100);
      }
    }
  }

  addCandidate(candidates, img.currentSrc, 200);
  addCandidate(candidates, img.src, 100);
  return candidates.sort((a, b) => b.score - a.score).map((item) => item.url);
}

document.addEventListener("click", async (event) => {
  if (!IS_SUPPORTED_PAGE) return;
  if (event.button !== 0 || !event.ctrlKey) return;
  const img = event.target instanceof Element ? event.target.closest("img") : null;
  if (!img) return;

  const { enabled } = await browser.storage.local.get(DEFAULTS);
  if (!enabled) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  showNotice("Preparing PNG…");

  try {
    const response = await browser.runtime.sendMessage({
      type: "download-image",
      candidates: collectCandidates(img),
      pageTitle: document.title
    });
    if (!response?.ok) throw new Error(response?.error || "The image could not be downloaded.");
    showNotice(`Downloaded ${response.filename}`);
  } catch (error) {
    showNotice(error.message || "The image could not be downloaded.", "error");
  }
}, true);
