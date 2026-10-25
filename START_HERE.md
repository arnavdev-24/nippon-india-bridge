# 🚀 Evaluation & Launch Guide — Nippon2Bharat

Welcome Judges! You have two instant options to review and evaluate the project:

---

## Option 1: Open Live Interactive Demo (Instant, Zero Setup)

Click the link below to evaluate the fully deployed platform in your browser:

### 👉 [https://nippontwobharat.lovable.app](https://nippontwobharat.lovable.app)

> [!TIP]
> **No login hassle**: Use the **Persona Switcher** in the top-right header (`🇯🇵 Japanese SME`, `🇮🇳 Indian Partner`, `🎓 Expert / Tutor`) to experience all three corridor workflows in real time.

---

# ————— OR —————

---

## Option 2: Run Locally on Your Machine

If you prefer to inspect and run the source code on your local environment:

### Prerequisites
- Node.js 18.x or 20.x+
- npm or bun

### 1. Clone the repository
```bash
git clone https://github.com/arnavdev-24/nippon-india-bridge.git
cd nippon-india-bridge
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The application will start immediately at:  
👉 **`http://localhost:5173`**

*(Environment variables are pre-configured in `.env` connecting to the live backend—no database setup required).*

---

### Run Automated Tests
To inspect code verification and test coverage (45/45 tests passing):
```bash
npm test
```

---

## 🧭 Key Workflows to Test

1. **Role-Based Persona Switcher** (Top right header)
   - Switch between **Japanese SME**, **Indian Partner**, and **Expert/Tutor**.
2. **Dealer Surveys & Fieldwork Engine** (`/surveys`)
   - Click **Compact Multi-Crop Weeder** (`/campaigns/demo-tiller`) to inspect 20 real dealer responses, pricing metrics, margin distributions, and export the PDF report.
   - Test drag-and-drop bulk Excel/TSV upload.
3. **Joint Venture & Technology Exchange** (`/joint-ventures`)
   - Search by country (`Japan` vs `India`) and tech stack (`Robotics`, `AI`, `Clean energy`).
   - Click "Request Collaboration" on any partner.
4. **State Intelligence Heatmap** (`/state-intelligence`)
   - Interactive 17-state ease-of-doing-business and Japanese Industrial Townships (JIT) roadmap.
5. **Tax & CEPA Regulatory Hub** (`/tax-compliance`)
   - Bilateral tariff concessions and vetted CA/CS advisory booking.
