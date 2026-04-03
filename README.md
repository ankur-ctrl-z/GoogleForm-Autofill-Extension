# 🚀 Job Form Autofill Chrome Extension

A lightweight Chrome Extension that automatically fills job application forms using predefined user data, reducing repetitive manual input and saving time.

---

## ✨ Features

* 🔹 Auto-fills common fields (Name, Email, Phone, etc.)
* 🔹 Works across multiple platforms (Google Forms, job portals, etc.)
* 🔹 Smart field detection using keyword matching
* 🔹 Supports modern frameworks (React-based forms)
* 🔹 Dark / Light mode toggle
* 🔹 One-click autofill via extension popup

---

## 🛠️ Tech Stack

* JavaScript (Vanilla)
* Chrome Extensions API (Manifest v3)
* DOM Manipulation
* Chrome Storage API

---

## ⚙️ How It Works

1. User clicks the extension
2. Clicks **"Auto Fill Now"**
3. Script scans form fields (`input`, `textarea`, etc.)
4. Matches fields using keywords (e.g., "email", "phone")
5. Injects stored data into matching fields

---

## 📁 Project Structure

```bash
autofill-extension/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
```

---

## 🚀 Installation

1. Clone this repository
2. Open Chrome and go to:

   ```
   chrome://extensions/
   ```
3. Enable **Developer Mode**
4. Click **Load Unpacked**
5. Select the project folder

---

## 📌 Usage

1. Open any job form or Google Form
2. Click the extension icon
3. Click **"Auto Fill Now"**
4. Fields will be filled automatically

---

## 🔮 Future Improvements

* AI-based field detection
* Resume auto-upload
* Editable user profile inside extension
* Dropdown & radio button support
* Multi-profile support

---

## 📎 Author

**Ankur Sharma**

* Portfolio: [https://ankurwork.vercel.app](https://ankurwork.vercel.app)

---

