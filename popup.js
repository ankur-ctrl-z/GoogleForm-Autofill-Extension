document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggle = document.getElementById("themeToggle");
  const label = document.querySelector(".toggle-container span");

  // load theme
  chrome.storage.local.get("theme", (res) => {
    const theme = res.theme || "dark";

    body.classList.add(theme);
    toggle.checked = theme === "light";

    label.textContent = theme === "dark" ? "Dark Mode" : "Light Mode";
  });

  // toggle change
  toggle.addEventListener("change", () => {
    const newTheme = toggle.checked ? "light" : "dark";

    body.classList.remove("dark", "light");
    body.classList.add(newTheme);

    chrome.storage.local.set({ theme: newTheme });

    // update label (THIS WAS MISSING)
    label.textContent = newTheme === "dark" ? "Dark Mode" : "Light Mode";
  });
});