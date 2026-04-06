const fieldMap = {
  name:        ["name", "full name"],
  email:       ["email", "e-mail"],
  phone:       ["phone", "mobile", "contact"],
  github:      ["github"],
  portfolio:   ["portfolio", "website"],
  experience_years: ["experience", "years"],   // ← fixed key mismatch
  location:    ["location", "city"]
};

async function loadData() {
  const res = await fetch(chrome.runtime.getURL("data.json"));
  return res.json();
}

function getFieldText(field) {
  let text = "";
  text += field.getAttribute("aria-label") || "";
  text += field.getAttribute("placeholder") || "";
  text += field.name || "";
  text += field.id || "";

  // textContent is only useful for div[role='textbox'], skip for inputs
  if (field.tagName === "DIV") {
    // don't use textContent for identification — use parent label instead
  }

  const parent = field.closest("div[role='listitem']");
  if (parent) text += parent.innerText;

  return text.toLowerCase();
}

function matchField(fieldText, keywords) {
  return keywords.some(keyword => fieldText.includes(keyword));
}

// ── For React-controlled <input> and <textarea> ──
function fillInput(field, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;

  field.focus();
  nativeInputValueSetter.call(field, value);
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
}

// ── For Google Forms div[role='textbox'] (React-controlled) ──
function fillGoogleField(field, value) {
  field.focus();

  // Select all existing content and replace via execCommand
  // This triggers React's synthetic event system properly
  document.execCommand("selectAll", false, null);
  document.execCommand("insertText", false, value);
}

// ── Check if field is already filled (handles both input and div) ──
function isAlreadyFilled(field) {
  if (field.tagName === "DIV") {
    return field.innerText?.trim().length > 0;
  }
  return field.value && field.value.length > 0;
}

async function fillForm() {
  const data = await loadData();

  // ── Wait for Google Forms to fully render (MutationObserver safety net) ──
  const inputs = document.querySelectorAll(
    "input, textarea, div[role='textbox']"
  );

  if (inputs.length === 0) {
    // Form not rendered yet — retry after a short delay
    setTimeout(fillForm, 800);
    return;
  }

  inputs.forEach(field => {
    if (isAlreadyFilled(field)) return; // ← fixed: covers div fields too

    const fieldText = getFieldText(field);

    Object.entries(fieldMap).forEach(([key, keywords]) => {
      if (!data[key]) return;

      if (matchField(fieldText, keywords)) {
        if (field.tagName === "DIV") {
          fillGoogleField(field, data[key]);
        } else {
          fillInput(field, data[key]);
        }
      }
    });
  });
}

fillForm();