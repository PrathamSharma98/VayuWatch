# 🌬️ VayuWatch

**VayuWatch** is an India-focused, ward-wise air quality monitoring and pollution action dashboard designed to support citizens and government authorities with localized, data-driven insights.

---

## 🚀 Project Overview

Air pollution in Indian cities varies significantly at the **ward level**, but actionable, localized insights are often missing.  
VayuWatch bridges this gap by providing:

- Ward-wise pollution visibility
- City and state-level comparisons
- Actionable mitigation recommendations
- Citizen-friendly health advisories
- Government-ready decision support

---

## 🗺️ Scope & Coverage

- **Country:** India  
- **Administrative hierarchy:**  
  India → State / UT → City → Municipal Corporation → Ward
- Designed for Indian urban density and governance models
- Sample focus cities:
  - Delhi
  - Mumbai
  - Bengaluru
  - Chennai
  - Kolkata

---

## 📊 Key Features

- Interactive India map with drill-down (State → City → Ward)
- Indian AQI standards (CPCB-compliant)
- Ward-wise pollution visualization
- City detail pages with trends and hotspots
- Actionable recommendations for:
  - Citizens
  - Municipal Corporations
  - Pollution Control Boards
- Alerts and downloadable reports (ward, city, state)

---

## 🏭 Pollution Metrics (Indian Standards)

- PM2.5
- PM10
- NO₂
- SO₂
- CO
- O₃
- NH₃
- Pb

**Indian AQI Categories (CPCB):**
- Good (0–50)
- Satisfactory (51–100)
- Moderate (101–200)
- Poor (201–300)
- Very Poor (301–400)
- Severe (401–500)

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript
- **Build Tool:** Vite
- **UI:** Tailwind CSS, shadcn/ui
- **Data Handling:** React Query
- **Maps:** Open-source mapping (no paid API keys)
- **Deployment:** GitHub Pages

---

## 💻 Local Development

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/PrathamSharma98/vayuwatch.git

# Navigate to project directory
cd vayuwatch

# Install dependencies
npm install

# Start development server
npm run dev
