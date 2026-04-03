const data = {
  name: "Ankur Sharma",
  email: "your@email.com",
  phone: "9999999999",
  github: "https://github.com/ankur-ctrl-z",
  portfolio: "https://ankurwork.vercel.app",
  experience: "1+ years"
};

function matchField(field, key) {
  const text = (
    field.name +
    field.id +
    field.placeholder +
    field.outerHTML
  ).toLowerCase();

  return text.includes(key);
}

function fillForm() {
  const inputs = document.querySelectorAll("input, textarea");

  inputs.forEach(input => {
    Object.keys(data).forEach(key => {
      if (matchField(input, key)) {
        input.value = data[key];
      }
    });
  });
}

fillForm();