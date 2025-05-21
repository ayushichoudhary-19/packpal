# 🎒 PackPal

PackPal is a smart AI-powered travel companion that generates personalized packing checklists and tailored advice based on your destination, travel dates, expected weather, purpose of trip, and packing style. Designed with simplicity and delight in mind, PackPal makes the packing experience efficient, fun, and stress-free.

> ✨ No signup required. Just enter your trip details and get your checklist instantly.

---

### 🚀 Features

* **Personalized Packing List:** Automatically generates packing checklists based on destination, date, weather, travel type (leisure, business, beach, etc.), and packing habits.
* **Smart Advice Engine:** Suggests relevant tips (e.g., organizing chaos, packing light for minimalists).
* **Date Range Picker:** Intuitive calendar to select your travel window.
* **Copy to Clipboard:** Easily copy the entire checklist and advice in one click.
* **Gemini-Powered Generation:** Utilizes Google's Gemini AI to fetch tailored results with a conversational tone.
* **Responsive UI:** Clean, mobile-friendly interface with animated transitions.
* **Theme & Icon Variants:** Supports a visually appealing UX with context-specific icons for travel types.

---

### 📸 Preview

![image](https://github.com/user-attachments/assets/37c0a096-d8c7-4819-9b7e-e0c81727e23b)

--- 
### 🛠️ Tech Stack

* **Frontend:** React, Next.js (App Router), TypeScript
* **Styling:** Tailwind CSS, Lucide Icons, Framer Motion
* **AI Integration:** Google Gemini API (Gemini 2.0 Flash)

---

### 📦 Dependencies

```json
"next": "^14.x",
"react": "^18.x",
"tailwindcss": "^3.x",
"lucide-react": "^0.260.0",
"framer-motion": "^10.x"
```

---

### 🚦 Running Locally

```bash
git clone https://github.com/ayushichoudhary-19/packpal
cd packpal
npm install
npm run dev
```

> 🔑 Add your [Google AI API Key](https://makersuite.google.com/app/apikey) as `NEXT_PUBLIC_GOOGLE_API_KEY` in `.env.local`

---

### 🌟 Usage

1. Select a destination and travel dates.
2. Enter expected weather (e.g., sunny, 25°C).
3. Choose purpose of travel and packing style.
4. (Optional) Add additional context or preferences.
5. Hit **Generate My PackPal List** — and boom!
6. Copy or use the checklist directly.

---

### 🤖 AI Prompt Design

Prompts are designed to:

* Guide Gemini to return structured JSON (schema-enforced)
* Provide both checklist and short advice
* Tailor content by tone (fun but practical)
* Adapt to packing styles: minimalist, chaotic, or normal

---

### 🧠 Why PackPal?

* Tired of forgetting your charger or sunscreen?
* Don't want to overpack for a 3-day trip?
* Love checklists but hate creating them manually?

PackPal solves all of that in seconds. It's like a friend who’s really good at travel prep.


---

### 📮 Contact

Made with 💛 by [Ayushi Choudhary](https://ayushi-links.vercel.app)

GitHub: [@ayushichoudhary-19](https://github.com/ayushichoudhary-19)
Twitter: [@geekyAyushi](https://twitter.com/geekyAyushi)

---

### 📌 License

This project is for educational/demo purposes. If you’d like to use the code or extend it, please credit the author.
