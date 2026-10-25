# Nippon2Bharat (日印ブリッジ) 🇯🇵 × 🇮🇳
### Bilateral SME Market Entry, Fieldwork Verification & Partnership Corridor

[![Live Demo](https://img.shields.io/badge/Live%20Demo-nippontwobharat.lovable.app-FF3366?style=for-the-badge&logo=google-chrome&logoColor=white)](https://nippontwobharat.lovable.app)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/arnavdev-24/nippon-india-bridge)
[![Tests](https://img.shields.io/badge/tests-45%2F45%20passing-brightgreen)](https://github.com/arnavdev-24/nippon-india-bridge)
[![TypeScript](https://img.shields.io/badge/typescript-strict-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-6.x-646CFF)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-18.x-61DAFB)](https://react.dev/)

---

## ⚡ Quick Evaluation for Judges

### 1️⃣ Option A: Open Live Demo (Instant in Browser)
> ### 🌐 **[https://nippontwobharat.lovable.app](https://nippontwobharat.lovable.app)**
> *(Fully deployed and live — use the 1-click **Persona Switcher** in the top header to explore Japanese SME, Indian Partner, and Expert views)*.

### ── OR ──

### 2️⃣ Option B: Run Locally in 3 Steps
```bash
git clone https://github.com/arnavdev-24/nippon-india-bridge.git
cd nippon-india-bridge
npm install && npm run dev
```
> App boots on **`http://localhost:5173`** *(Credentials pre-configured in `.env` — no setup needed)*.  
> 📖 See [`START_HERE.md`](./START_HERE.md) for the complete judge walkthrough guide.

---

## 📌 Executive Summary

While large conglomerates like Maruti-Suzuki, Daikin, and Uniqlo have achieved immense success in India, **Japanese Small and Medium Enterprises (SMEs)** struggle with:
1. **Uncertainty & Lack of Ground Truth**: Difficulty verifying whether their product pricing, technical specs, or engine configurations match diverse Indian regional conditions (soil types, monsoon humidity, dust).
2. **Regulatory & Compliance Maze**: Navigating BIS certification, GST, Foreign Direct Investment (FDI) guidelines, and India–Japan CEPA tariff concessions without costly multinational advisory firms.
3. **Counterparty Trust Deficit**: Sourcing reliable, vetted local distributors, joint venture partners, and bilingual advisors.

**Nippon2Bharat** bridges this gap with an end-to-end corridor platform designed for JETRO-aligned initiatives and bilateral business expansion.

---

## 🌟 Key Platform Capabilities

### 1. 🌾 Ground Fieldwork & Dealer Survey Engine (`/surveys`, `/campaigns/$id`)
- **Survey Campaign Builder**: Configure custom product campaigns with technical localization and commercial questions.
- **Mobile Field Link & QR Code**: Generate zero-friction public forms (`/s/:token`) for on-ground Indian dealers and farmers.
- **Smart Bulk Import (Excel / TSV / CSV)**:
  - Adaptive column and question matching.
  - **Fuzzy Choice Normalization**: Automatically normalizes real-world responses (e.g. `7.0 HP Air-Cooled Diesel` $\rightarrow$ `Single-Cylinder Diesel Demanded`).
  - **State-aware Provisional GSTIN**: Unlocks informal field survey ingestion without validation bottlenecks.
  - **Combined Contact Parser**: Automatically splits merged phone and email columns.
- **Interactive Analytics & Export**: Live price acceptance ratings, dealer margin distributions, pilot batch commitments, geographic heatmaps, and 1-click **PDF Report Export**.

### 2. 🤝 Joint Venture & Technology Exchange (`/joint-ventures`)
- Bilateral matchmaking between Japanese innovators and Indian manufacturing/distribution leaders.
- Video pitch uploads, technology requirement listings, and direct collaboration requests.
- Intelligent multi-variable matching based on complementary capabilities and sector focus.

### 3. 🚚 Distributor Connect Hub (`/distributors`)
- Filter vetted Indian distributors across 28 states and Union Territories.
- Specific filtering for cold-chain logistics, regional warehousing, dealer networks, and after-sales service readiness.

### 4. ⚖️ Tax, Regulatory & Advisory Practice (`/tax-compliance`, `/advisors`)
- Direct consultation scheduling with vetted Indian Chartered Accountants (CA) and Company Secretaries (CS).
- Comprehensive India–Japan Comprehensive Economic Partnership Agreement (CEPA) tariff simulator and DTAA insights.

### 5. 🎌 Language & Cultural Upskilling (`/tutors`)
- Enterprise training booking for Japanese and Hindi corporate instructors.
- Live slot scheduling for JLPT preparation, business Japanese, and workplace cultural etiquette.

### 6. 🔄 Instant Tri-Persona Switcher
- Switch dynamically between **Japanese SME**, **Indian Partner**, and **Expert/Tutor** directly from the top navigation bar to test role-tailored views and permissions with zero friction.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, TypeScript (Strict Mode) |
| **Build & Tooling** | Vite 6, Nitro, Rolldown / Rollup |
| **Routing & Querying** | TanStack Router, TanStack Query v5 |
| **Design System & UI** | Tailwind CSS, Radix UI Primitives, Lucide Icons, Sonner |
| **Data Ingestion & PDF** | SheetJS (XLSX), jsPDF, html2canvas, QRCode |
| **Backend & Auth** | Supabase (PostgreSQL, Row Level Security, Auth, Storage) |
| **Testing** | Vitest (45 automated test cases, unit + integration) |

---

## 🚀 Quickstart for Judges

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

### 3. Start local development server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

> [!NOTE]
> Environment variables are pre-configured in `.env` pointing to the live Supabase project. The application runs immediately without additional database setup.

### 4. Run automated test suite
```bash
npm test
```
All **45 test suites** will execute and pass:
```text
 ✓ src/test/campaigns.test.ts (6 tests)
 ✓ src/test/hubs.test.ts (10 tests)
 ✓ src/test/market-entry.test.ts (6 tests)
 ✓ src/test/sectors.test.ts (3 tests)
 ✓ src/test/states.test.ts (5 tests)
 ✓ src/test/tax-compliance.test.ts (4 tests)
 ✓ src/test/agri-talent.test.ts (6 tests)
 ✓ src/lib/india-heatmap.test.ts (4 tests)
 ✓ src/test/app-routing.test.tsx (1 test)

 Test Files  9 passed (9)
      Tests  45 passed (45)
```

### 5. Verify production build
```bash
npm run build
```

---

## 🧭 Evaluation Walkthrough for Judges

1. **Dashboard & Persona Switcher**:
   - Use the **Persona pill** in the top-right header to switch between `🇯🇵 Japanese SME`, `🇮🇳 Indian Partner`, and `🎓 Expert / Tutor`.
   - Observe how navigation menus, permission boundaries, and actionable cards reconfigure dynamically.

2. **Test Survey & Fieldwork Bulk Upload**:
   - Navigate to **Dealer Surveys** (`/surveys`).
   - Open any fieldwork campaign (e.g. *Micro-Tiller & Inter-Cultivator*).
   - In the **Bulk Upload** card, drop the sample Excel file located in the root or upload your own spreadsheet.
   - Notice the instantaneous smart mapping: fuzzy engine options, split contact info, and generated analytics.

3. **Explore Joint Ventures**:
   - Navigate to **Commercial Listings → Joint Ventures** (`/joint-ventures`).
   - Search by technology (e.g. *AI*, *Robotics*, *Clean energy*) and country.
   - Click **Create company pitch** to test the verified profile modal.

4. **Tax & State Intelligence**:
   - Navigate to **State Intelligence** (`/state-intelligence`) for state-level Japanese Industrial Township (JIT) incentives and infrastructure ratings.
   - Check **Tax & Regulations** (`/tax-compliance`) for CEPA tariff schedules.

---

## 📄 License
Built for the JETRO Japan–India SME Innovation Hackathon. Licensed under the MIT License.
