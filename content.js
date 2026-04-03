const fieldMap = {
  name: ["name", "full name"],
  email: ["email", "e-mail"],
  phone: ["phone", "mobile", "contact"],
  github: ["github"],
  portfolio: ["portfolio", "website"],
  experience: ["experience", "years"],
  location: ["location", "city"]
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
  text += field.textContent || "";

  const parent = field.closest("div[role='listitem']");
  if (parent) text += parent.innerText;

  return text.toLowerCase();
}

function matchField(fieldText, keywords) {
  return keywords.some(keyword => fieldText.includes(keyword));
}

function fillInput(field, value) {
  field.focus();
  field.value = value;

  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
}

function fillGoogleField(field, value) {
  field.focus();

  const event = new InputEvent("input", {
    bubbles: true,
    cancelable: true,
    data: value
  });

  field.textContent = value;
  field.dispatchEvent(event);
}

async function fillForm() {
  const data = await loadData();

  const inputs = document.querySelectorAll(
    "input, textarea, div[role='textbox']"
  );

  inputs.forEach(field => {
    const fieldText = getFieldText(field);

    if (field.value && field.value.length > 0) return;

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