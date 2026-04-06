const fieldMap = {
  first_name: {
    keywords: ["first name", "firstname", "given name"],
    negative: ["last", "middle", "father", "mother", "company", "college", "university", "employer"]
  },
  last_name: {
    keywords: ["last name", "lastname", "surname", "family name"],
    negative: ["first", "father", "mother", "company"]
  },
  name: {
    keywords: ["full name", "your name", "applicant name", "candidate name", "student name", "first and last name"],
    negative: ["first", "last", "father", "mother", "company", "college", "university", "file", "user", "employer", "alternate", "emergency"]
  },
  email: {
    keywords: ["email", "e-mail", "email address", "mail id"],
    negative: ["alternate", "secondary", "other"]
  },
  phone: {
    keywords: ["phone", "mobile", "contact number", "phone number", "mobile number", "whatsapp"],
    negative: ["alternate", "emergency", "other", "secondary", "father", "mother"]
  },
  alternate_phone: {
    keywords: ["alternate phone", "alternate mobile", "alternate number", "other phone", "secondary phone"],
    negative: []
  },
  location: {
    keywords: ["current location", "present location", "full address", "residential address"],
    negative: ["city", "state", "country", "pin", "zip", "email", "phone"]
  },
  city: {
    keywords: ["city", "town", "current city"],
    negative: ["state", "country"]
  },
  state: {
    keywords: ["state", "province", "region"],
    negative: ["country", "city"]
  },
  country: {
    keywords: ["country", "nation"],
    negative: ["city", "state"]
  },
  github: {
    keywords: ["github", "github profile", "github url", "github link"],
    negative: []
  },
  linkedin: {
    keywords: ["linkedin", "linkedin profile", "linkedin url"],
    negative: []
  },
  portfolio: {
    keywords: ["portfolio", "personal website", "website url", "personal site"],
    negative: ["company", "college"]
  },
  headline: {
    keywords: ["headline", "profile title", "professional title", "current designation"],
    negative: []
  },
  summary: {
    keywords: ["summary", "professional summary", "about yourself", "tell us about", "brief introduction", "profile summary"],
    negative: []
  },
  current_role: {
    keywords: ["current role", "current position", "job title", "designation"],
    negative: ["company", "employer"]
  },
  current_company: {
    keywords: ["current company", "current employer", "current organization", "employer name", "company name"],
    negative: ["previous", "last", "college", "university"]
  },
  experience_years: {
    keywords: ["years of experience", "total experience", "work experience", "experience in years", "how many years"],
    negative: []
  },
  skills: {
    keywords: ["skills", "tech stack", "technologies known", "tools and technologies"],
    negative: ["primary", "key", "core"]
  },
  primary_skills: {
    keywords: ["primary skills", "key skills", "core skills", "top skills"],
    negative: []
  },
  education_degree: {
    keywords: ["degree", "qualification", "highest qualification", "education qualification"],
    negative: ["college", "university", "year", "cgpa", "gpa"]
  },
  education_college: {
    keywords: ["college name", "university name", "institute name", "college", "university"],
    negative: ["degree", "year", "cgpa"]
  },
  education_year: {
    keywords: ["graduation year", "passing year", "year of passing", "year of graduation"],
    negative: []
  },
  cgpa: {
    keywords: ["cgpa", "gpa", "percentage", "aggregate", "marks obtained"],
    negative: []
  },
  projects: {
    keywords: ["projects", "project details", "projects worked on", "key projects"],
    negative: []
  },
  achievement: {
    keywords: ["achievement", "accomplishments", "awards", "leetcode", "competitive programming"],
    negative: []
  },
  notice_period: {
    keywords: ["notice period", "joining period", "available to join", "earliest joining"],
    negative: []
  },
  current_ctc: {
    keywords: ["current ctc", "current salary", "present salary", "current package"],
    negative: ["expected", "desired"]
  },
  expected_ctc: {
    keywords: ["expected ctc", "expected salary", "desired salary", "salary expectation"],
    negative: ["current", "present"]
  },
  willing_to_relocate: {
    keywords: ["willing to relocate", "open to relocation", "relocation", "relocate"],
    negative: []
  },
  cover_letter: {
    keywords: ["cover letter", "why should we hire", "why this company", "motivation letter", "why are you interested"],
    negative: []
  }
};

async function loadData() {
  const res = await fetch(chrome.runtime.getURL("data.json"));
  return res.json();
}

// ── FIXED: Read only the closest label, not the entire listitem ──
function getFieldText(field) {
  let text = "";

  text += " " + (field.getAttribute("aria-label") || "");
  text += " " + (field.getAttribute("placeholder") || "");
  text += " " + (field.getAttribute("type") || "");
  text += " " + (field.name || "");
  text += " " + (field.id || "");

  // Walk up and grab only the direct question title — not the whole card
  const questionCard = field.closest("[data-params]") ||
                       field.closest(".freebirdFormviewerComponentsQuestionBaseRoot") ||
                       field.closest("div[role='listitem']");

  if (questionCard) {
    // Only grab the heading/title element, not all text in the card
    const titleEl = questionCard.querySelector(
      "[data-params] span, .freebirdFormviewerComponentsQuestionBaseTitle, [role='heading']"
    );
    if (titleEl) {
      text += " " + titleEl.innerText;
    } else {
      // Fallback: first 80 chars of card text only — avoids reading neighboring fields
      text += " " + questionCard.innerText.slice(0, 80);
    }
  }

  return text.toLowerCase().trim();
}

// ── Type-based override: trust input[type] over keywords ──
function getValueByInputType(field, data) {
  const type = field.getAttribute("type");
  if (type === "email") return data.email || null;
  if (type === "tel")   return data.phone || null;
  if (type === "url")   return data.portfolio || null;
  return null;
}

function matchField(fieldText, { keywords, negative }) {
  const hasKeyword = keywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    return regex.test(fieldText);
  });

  if (!hasKeyword) return false;

  const hasNegative = negative.some(neg => {
    const regex = new RegExp(`\\b${neg}\\b`, "i");
    return regex.test(fieldText);
  });

  return !hasNegative;
}

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

function fillGoogleField(field, value) {
  field.focus();
  document.execCommand("selectAll", false, null);
  document.execCommand("insertText", false, value);
}

function isAlreadyFilled(field) {
  if (field.tagName === "DIV") return field.innerText?.trim().length > 0;
  return field.value && field.value.length > 0;
}

function applyFill(field, value) {
  if (field.tagName === "DIV") {
    fillGoogleField(field, value);
  } else {
    fillInput(field, value);
  }
}

async function fillForm() {
  const data = await loadData();

  const inputs = document.querySelectorAll(
    "input:not([type='submit']):not([type='hidden']):not([type='checkbox']):not([type='radio']), textarea, div[role='textbox']"
  );

  if (inputs.length === 0) {
    setTimeout(fillForm, 800);
    return;
  }

  inputs.forEach(field => {
    if (isAlreadyFilled(field)) return;

    // ── PRIORITY 1: Trust input[type] attribute directly ──
    const typeValue = getValueByInputType(field, data);
    if (typeValue) {
      applyFill(field, typeValue);
      return; // stop here, don't run keyword matching
    }

    // ── PRIORITY 2: Keyword + negative keyword matching ──
    const fieldText = getFieldText(field);

    for (const [key, config] of Object.entries(fieldMap)) {
      if (!data[key]) continue;
      if (matchField(fieldText, config)) {
        applyFill(field, data[key]);
        break; // ← stop after first match, don't stack multiple fills
      }
    }
  });
}

fillForm();