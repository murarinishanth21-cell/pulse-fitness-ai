# ⚡ PulseAI - Personal Fitness & Nutrition Brain

> **AI-Powered Health & Workout Platform** engineered with Next.js App Router, Tailwind CSS, Framer Motion, and Google Gemini Generative AI.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=google)](https://aistudio.google.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

---

## 🌐 Live Site & Repository

- 🚀 **Live Deployed Site**: [https://pulse-fitness-ai.vercel.app](https://pulse-fitness-ai.vercel.app) *(or your active Vercel domain)*
- 💻 **GitHub Repository**: [https://github.com/murarinishanth21-cell/pulse-fitness-ai](https://github.com/murarinishanth21-cell/pulse-fitness-ai)

---

## 📖 Brief Overview

**PulseAI** is an intelligent, full-stack fitness and nutrition web application designed to help users build custom workout splits, analyze dietary habits for macronutrient deficits, generate goal-aligned 1-day meal plans, and track daily exercise schedules in real time.

All user data, workouts, checkmarks, meal blueprints, and chat logs are **encrypted and persisted directly to browser `localStorage`**, guaranteeing zero data loss across refreshes with zero server database maintenance costs.

---

## 🚀 Key Features

### 1. 👤 Dynamic User Profile
- Customize age, weight (kg), height (cm), activity level, dietary restrictions, and primary fitness goals.
- Quick 1-click preset scenarios (*Fat Loss & Lean Muscle*, *Hypertrophy & Strength*, *Endurance & Clean Energy*).

### 2. 🥗 AI Diet & Macronutrient Analysis
- Diagnostic engine evaluating daily eating habits against user goals.
- Compares estimated current vs. ideal target macros (Calories, Protein, Carbs, Fats).
- Calculates goal alignment scores (1–100) and detects nutritional gaps (e.g. low protein, skipping meals).

### 3. 🍳 Tailored 1-Day Meal Plan
- Complete daily meal breakdown (**Breakfast, Lunch, Dinner, and Snacks**).
- Full ingredient lists, preparation time estimates, exact macro counts, and smart grocery prep tips.

### 4. 🏋️ AI Workout Routine Generator
- Custom split routines (Upper Body, Lower Body, Push, Pull, HIIT/Core, Full Body).
- Tailored for available equipment (Gym, Dumbbells, Bodyweight / Home).
- Includes dynamic warm-up, cool-down, sets, reps, rest timers, and form cues.
- **One-Click Sync**: Instantly transfers the routine into the active tracker.

### 5. 📅 Today's Schedule & Workout Tracker
- Interactive checklist with smooth **Framer Motion strikethrough animations**.
- Real-time progress ring with completion percentages.
- Add custom exercises, reset checks, or delete items on the fly.
- Celebratory completion trophy banner when all daily exercises are finished.

### 6. 💬 Plain-English AI Coach Chat
- Interactive conversational AI coach with your profile context.
- Formatted without complicated medical jargon or asterisk clutter.
- Quick prompt chips for breakfast swaps, water targets, pre-workout snacks, and recovery advice.

### 7. 💾 Zero-Loss Browser Persistence
- Full `localStorage` persistence across all tabs and components.
- Preserves active tab, current workout checks, custom added items, diet drafts, and chat history.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Server Actions)
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, Custom Glassmorphism UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Brain**: Google Gemini Generative AI SDK (`@google/generative-ai`)
- **Storage**: Browser LocalStorage
- **Deployment**: Vercel

---

## 💻 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/murarinishanth21-cell/pulse-fitness-ai.git
cd pulse-fitness-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root folder:
```env
GEMINI_API_KEY=your_free_google_gemini_api_key_here
```
*(Get a free API key at [Google AI Studio](https://aistudio.google.com/))*

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the repo into [Vercel](https://vercel.com/new).
3. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = `your_gemini_api_key`
4. Click **Deploy**.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
