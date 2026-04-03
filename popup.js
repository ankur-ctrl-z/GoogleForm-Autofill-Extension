document.addEventListener("DOMContentLoaded", () => {
  const fillBtn = document.getElementById("fillBtn");

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