# Relief Goods Meal Planner & Child Growth Tracker 🇵🇭

An interactive, responsive full-stack assistant designed for **Barangay Nutrition Scholars (BNS)** and community health workers in the Philippines. This tool empowers localized nutrition officers to easily draft personalized, budget-friendly child meal plans by safely augmenting dry relief goods with fresh backyard garden harvests, as well as tracking critical growth milestones using World Health Organization (WHO) benchmarks.

---

## 🌟 Core Features

### 1. **Relief Goods & Backyard Harvest Recipe Planner**
* **Safe Dry Food Integration**: Guides users on transforming standard dry relief packages (e.g., canned sardines, instant noodles) into nutritionally fortified meals.
* **Backyard Gardening Enhancements**: Intuitively suggests incorporating local, easy-to-grow leafy greens and vegetables (e.g., *malunggay*, *kalabasa* / squash, sweet potato tops) to bridge micronutrient gaps.
* **Barangay Nutrition Scholar Guidelines**: Formulated around local pediatric standards, ensuring high-yield, budget-conscious meal recommendations.

### 2. **WHO-Standard Child Growth Tracker**
* **Interactive Growth Charts**: Multi-tab visualization for **Weight** and **Height** using WHO standard percentile curves (Median, Extreme -1 SD, -2 SD, and -3 SD lines).
* **Live Assessment Highlight**: Interactive overlay placing the child's live metrics directly against regional risk boundaries, helping spot mild or severe malnourishment instantly.
* **Personalized Milestones**: Plotting historical records directly into visual, high-contrast graphs.

### 3. **Trilingual Localization (`en` / `tl` / `bis`)**
* Fully supports toggle switching between **English**, **Tagalog (Filipino)**, and **Bisaya (Cebuano)** to facilitate clear communication between BNS supervisors and local parents in provincial households.

### 4. **Rural food Safety & Rural Hygiene Module**
* **DIY Running Water Tip**: Best-practice guidelines for proper 20-second soap handwashing without running taps (utilizing *tabo* pouring to avoid standing *palanggana* buckets).
* **Safe Water Storage**: Instructions on sealing and elevating drinking containers off the floor, avoiding pest contamination, and using long-handled ladles.
* **Ingredient Washing & Pest Control**: Safe washing of backyard ingredients under clean, flowing water, and using traditional *tudong* covers to safeguard dining tables.

### 5. **High-Contrast Low-Data Sharing Support**
* Built-in standalone generator creating a lightweight, high-contrast, text-only digital flyer of the hygiene guidelines.
* Styled specifically for fast screenshot captures or PDF printing, designed to be easily distributed over low-data or high-compression messaging platforms (e.g., Messenger, Viber, WhatsApp) in areas with poor cellular service.

---

## 🛠️ Project Structure

* `/src/App.tsx` — Main application dashboard, handling layout transitions, trilingual configuration, and print pamphlet generator.
* `/src/components/GrowthTracker.tsx` — WHO-compliant interactive chart and history plotter.
* `/src/components/RecipeCard.tsx` — Modular, print-safe container displaying relief recipe guidelines and macro metrics.
* `/src/lib/translation.ts` — Translation engine and local terminology database for Tagalog and Bisaya languages.
* `/server.ts` — Full-stack entry point utilizing robust Node integration and serving Vite development middleware.

---

## ⚡ Setup & Development

### Clean Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local server in development mode:
   ```bash
   npm run dev
   ```
   The development server runs on `http://localhost:3000`.

### Production Build
To build and bundle the client assets and the server-side TypeScript files:
```bash
npm run build
```
The compiled single CJS package is built into `dist/server.cjs` with optimized cold-starts.

---

## 🎨 Design & Accessibility Principles
* **Mobile-First Responsive Layout**: Optimized for low-end cellular phones frequently used by field-working scholars. 
* **High-Contrast Print Output**: Fully integrated physical pamphlet media stylesheets, ensuring easy offline distribution for families without active internet access.
* **Architectural Clarity**: No mock status boards or simulation overlays; focusing purely on genuine, accessible regional utility.
