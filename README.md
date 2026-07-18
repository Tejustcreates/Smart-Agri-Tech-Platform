<div align="center">

# 🌾 GrowSmart

### *Everything a Farmer Needs, One Smart Platform*

A comprehensive AI-powered web application for Indian farmers — featuring weather intelligence, crop disease detection, live agricultural news, digital mandi prices, government scheme recommendations, crop advisory, and a community equipment rental marketplace.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat&logo=vite&logoColor=white)

</div>

---

## Features

### 1. Weather Intelligence
Real-time weather dashboard with ML-powered farming advisories powered by Open-Meteo API.
- Current conditions (temperature, humidity, wind, UV, cloud cover)
- 48-hour hourly forecast with charts
- 7-day daily forecast
- AI rain probability prediction using custom Random Forest model
- Smart farming advisories (irrigation, spraying, harvesting, planting)
- Automatic weather alerts (heavy rain, frost, high UV, disease risk)
- Agricultural health score (0–100)
- GPS auto-detection with search fallback for villages/small towns

### 2. Smart Crop Recommendation
AI-powered crop recommendation based on soil and climate data with IoT sensor integration.
- **Manual Mode** — Input N/P/K, pH, temperature, humidity, rainfall, moisture, light, EC
- **IoT Smart Farm Mode** — Simulated ESP32 sensor hub with live-updating data
- Custom Random Forest classifier (25 trees, 13 crop profiles)
- Confidence scores, yield estimates, and water requirements
- NPK balance radar charts and feature importance analysis

### 3. Crop Disease Detection
Multi-step wizard to identify crop diseases from observed symptoms.
- 10 crop options, 24 symptoms across 4 categories
- Matches against 8 diseases (Leaf Blight, Powdery Mildew, Bacterial Spot, Root Rot, Rust Fungus, Mosaic Virus, Anthracnose, Fusarium Wilt)
- Severity assessment with confidence scores
- Detailed treatment recommendations (organic, fungicide, pesticide, fertilizer)
- Prevention tips and crop care guidelines

### 4. Personalized Farmer News
AI-curated agricultural news with multi-level personalization.
- 7 categories: Market Prices, Weather, Government Schemes, Crops, Disease, Technology, MSP
- Filter by state, crop, and category
- Live news from NewsData.io API with 5-minute cache
- Fallback to Gemini AI-generated news
- Relevance scoring based on selected filters

### 5. Government Scheme Recommender
Personalized government scheme recommendations based on farmer profile.
- 10+ popular schemes (PM-KISAN, PMFBY, KCC, Soil Health Card, etc.)
- Match scoring algorithm (category, irrigation, income, crop type)
- Farmer categories: Small, Marginal, Medium, Large
- Farmer types: Individual, FPO, SHG, Organic, Tenant
- Integration with data.gov.in API
- Gemini AI-generated state-specific schemes

### 6. Digital Mandi (Market Intelligence)
Live agricultural market prices with AI-powered predictions.
- Live prices across 14+ mandis (Pune, Nashik, Delhi, Rajkot, etc.)
- 30-day price history with 7-day forecast charts
- Smart mandi recommendation (crop, quantity, transport budget)
- Transport cost estimation and net price calculation
- Best deal finder with extra profit estimation

### 7. Community Equipment Rental
GPS-based farming equipment marketplace.
- 9 equipment categories (Tractor, Harvester, Rotavator, Seeder, Sprayer, etc.)
- Haversine distance-based proximity matching
- Multi-factor scoring (40% distance, 20% availability, 15% price, 10% rating, etc.)
- Equipment registration for owners
- Availability calendar and contact info

### 8. Agri-Market Hub
E-commerce marketplace with cart and checkout.
- Equipment Rentals, Fertilizers, Seeds, Pesticides
- Cart with quantity management and 5% tax calculation
- Sandbox payment flow
- localStorage persistence

### 9. Multi-Language Support
Google Translate integration supporting 12+ Indian languages:
Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Urdu, Odia

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6.2 |
| Styling | Tailwind CSS 4.2 |
| Routing | React Router DOM 7.18 |
| Animation | Framer Motion 12.42 |
| Charts | Recharts 3.9 |
| AI/ML | Google Gemini 2.5 Flash, TensorFlow.js, Custom Random Forest |
| HTTP | Axios |
| Notifications | React Hot Toast |
| Excel Export | xlsx |
| Icons | Lucide React, Font Awesome |

### APIs & Services

| API | Purpose |
|---|---|
| Open-Meteo | Real-time weather data + geocoding |
| Google Gemini 2.5 Flash | AI news & scheme generation |
| NewsData.io | Live agricultural news |
| data.gov.in | Government scheme data |
| Nominatim / OpenStreetMap | Reverse geocoding (village-level) |
| Geoapify | Fallback geocoding provider |
| Google Translate Widget | Multi-language support |

---

## Project Structure

```
Smart-Agri-Tech-Platform/
├── components/
│   ├── pages/          # HomePage, LoginPage, SignupPage, CartPage, PaymentPage
│   ├── weather/        # Weather dashboard & sub-components
│   ├── crop/           # Crop recommendation & IoT dashboard
│   ├── mandi/          # Digital Mandi & price prediction
│   ├── schemes/        # Government scheme recommender
│   ├── equipment/      # Community equipment rental
│   ├── farmer-news/    # Personalized news section
│   └── img/            # Product images
├── services/
│   ├── weather/        # Open-Meteo API, geocoding (3-tier cascade)
│   ├── ml/             # Random Forest, rain prediction, disease risk
│   ├── cropRecommendation/  # Crop RF model, IoT service
│   ├── mandi/          # Mandi prices, predictions, recommendations
│   ├── equipment/      # Equipment search, Haversine matching
│   └── news/           # NewsData.io integration
├── hooks/              # useWeatherData, useGpsLocation, useLocationSearch, useMLPredictions
├── types/              # TypeScript types (weather, mandi, equipment, scheme, etc.)
├── constants.ts        # Routes, crop data, equipment data
├── types.ts            # Shared types
└── App.tsx             # Root with routing
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Smart-Agri-Tech-Platform.git
   cd Smart-Agri-Tech-Platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   NEWSDATA_API_KEY=your_newsdata_api_key
   DATA_GOV_IN_API_KEY=your_data_gov_in_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## How It Works

- **Mock-first architecture** — Every feature works fully offline with mock data. Real APIs activate when keys are configured in `.env.local`.
- **Dual Random Forest models** — One for crop recommendation (25 trees, 13 crops, 10 features) and one for rain prediction (15 trees, 18 features), both trained entirely in the browser on synthetic data.
- **3-tier geocoding cascade** — Location search gracefully falls back through Open-Meteo → Nominatim → Geoapify for village-level coverage across India.
- **localStorage persistence** — User sessions, cart, and user data persist across page refreshes.
- **Sandbox payment** — Checkout flow is for demonstration purposes only; no real payment processing occurs.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Shift + A` | Export registered users to Excel (GrowSmart_Registered_Users.xlsx) |

---

## License

This project is for educational purposes.

---

<div align="center">
  <b>Built with ❤️ for Indian Farmers</b>
</div>
