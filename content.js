const data = {
  name: "Ankur Sharma",
  email: "ankur.code.dev@email.com",
  phone: "9565530262",
  github: "https://github.com/ankur-ctrl-z",
  portfolio: "https://ankurwork.vercel.app",
  experience: "1+ years",
  location: "Noida, India"
};

// field aliases (handles real-world variations)
const fieldMap = {
  name: ["name", "full name", "your name"],
  email: ["email", "e-mail", "mail"],
  phone: ["phone", "mobile", "contact", "number"],
  github: ["github"],
  portfolio: ["portfolio", "website"],
  experience: ["experience", "years", "work experience"],
  location: ["location", "city", "address"]
};

// extract all possible text signals from field
function getFieldText(field) {
  const label = document.querySelector(`label[for="${field.id}"]`);

  return (
    (field.name || "") +
    (field.id || "") +
    (field.placeholder || "") +
    (field.getAttribute("aria-label") || "") +
    (label ? label.innerText : "")
  ).toLowerCase();
}

// check if field matches any keyword
function matchField(fieldText, keywords) {
  return keywords.some(keyword => fieldText.includes(keyword));
}

// normal input fill (React-safe)
function fillInput(field, value) {
  field.focus();
  field.value = value;

  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
}

// Google Forms support
function fillGoogleField(field, value) {
  field.innerText = value;

  field.dispatchEvent(new Event("input", { bubbles: true }));
}

// main function
function fillForm() {
  const inputs = document.querySelectorAll(
    "input, textarea, div[role='textbox']"
  );

  inputs.forEach(field => {
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

// run autofill
fillForm();