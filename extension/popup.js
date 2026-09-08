"use strict";

const toggle = document.getElementById("enabled");
const status = document.getElementById("status");

browser.storage.local.get({ enabled: true }).then(({ enabled }) => {
  toggle.checked = enabled;
  status.textContent = enabled ? "Enabled on websites" : "Disabled";
});

toggle.addEventListener("change", async () => {
  await browser.storage.local.set({ enabled: toggle.checked });
  status.textContent = toggle.checked ? "Enabled on websites" : "Disabled";
});
