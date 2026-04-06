document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggle = document.getElementById("themeToggle");
  const fillBtn = document.getElementById("fillBtn");

  // ── Theme: load saved preference ──
  chrome.storage.local.get("theme", (res) => {
    const theme = res.theme || "dark";
    body.classList.remove("dark", "light");
    body.classList.add(theme);
    toggle.checked = theme === "light";
  });

  // ── Theme: toggle handler ──
  toggle.addEventListener("change", () => {
    const newTheme = toggle.checked ? "light" : "dark";
    body.classList.remove("dark", "light");
    body.classList.add(newTheme);
    chrome.storage.local.set({ theme: newTheme });
  });

  // ── Autofill: button handler ──
  fillBtn.addEventListener("click", async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      if (!tab?.id) {
        console.error("No active tab found");
        return;
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });

      console.log("Autofill script injected");
    } catch (err) {
      console.error("Injection failed:", err);
    }
  });
});