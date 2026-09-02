# GrowSmart - Smart Agriculture Platform

A comprehensive full-stack web application for Indian farmers — featuring weather intelligence, crop recommendations, disease detection, live mandi prices, equipment rental, government scheme information, and multi-language support.

## Architecture

```
Smart-Agri-Tech-Platform/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/             # DB, Redis, environment config
│   │   ├── middleware/          # Auth (JWT), RBAC, validation
│   │   ├── routes/             # All API endpoints
│   │   │   ├── auth.ts         # OTP login, JWT, PIN, refresh
│   │   │   ├── weather.ts      # Open-Meteo integration + insights
│   │   │   ├── crops.ts        # Crop recommendation + IoT data
│   │   │   ├── disease.ts      # Disease detection (mock ML)
│   │   │   ├── mandi.ts        # Mandi price comparison
│   │   │   ├── equipment.ts    # Equipment rental
│   │   │   ├── schemes.ts      # Govt scheme matching
│   │   │   ├── news.ts         # Agri news feed
│   │   │   ├── dashboard.ts    # Dashboard summary
│   │   │   └── admin.ts        # Admin CRUD
│   │   ├── services/           # OTP, JWT services
│   │   └── app.ts / index.ts   # Express server
│   ├── prisma/
│   │   ├── schema.prisma       # 15 tables, full schema
│   │   └── seed.ts             # Demo data (3 farmers, prices, etc.)
│   └── Dockerfile
├── components/                  # React frontend (Vite + TypeScript)
│   ├── pages/
│   │   ├── AuthPage.tsx        # OTP-based login/signup
│   │   ├── Onboarding.tsx      # New user profile setup
│   │   ├── FarmerDashboard.tsx  # Dashboard with charts
│   │   └── AdminPanel.tsx       # Admin CRUD interface
│   ├── i18n/                    # react-i18next setup
│   │   ├── locales/en.json      # English
│   │   ├── locales/hi.json      # Hindi (हिन्दी)
│   │   └── locales/mr.json      # Marathi (मराठी)
│   ├── weather/                  # Weather intelligence
│   ├── crop/                     # Crop recommendation
│   ├── mandi/                    # Digital mandi prices
│   ├── equipment/                # Equipment rental
│   ├── schemes/                  # Govt scheme recommender
│   └── farmer-news/              # Agri news
├── contexts/
│   └── AuthContext.tsx            # Auth state management
├── services/
│   └── api.ts                    # Typed API client
├── i18n/                         # i18next configuration
├── docker-compose.yml            # Postgres + Redis + Backend + Frontend
└── scripts/setup.sh              # One-command setup
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS 4.2 |
| i18n | react-i18next (English, Hindi, Marathi) |
| Data Fetching | React Query (TanStack Query) |
| Charts | Recharts |
| Animations | Framer Motion |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL (via Prisma ORM) |
| Cache | Redis (weather, mandi price caching) |
| Auth | JWT (access + refresh tokens) + OTP (mock) |
| File Storage | Local disk (S3-ready abstraction) |
| Deployment | Docker Compose |

## Quick Start

### Option 1: Full Setup (Recommended)

```bash
# Clone and run setup script (installs deps, creates DB, seeds data)
chmod +x scripts/setup.sh
./scripts/setup.sh

# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)
npm run dev
```

### Option 2: Docker Compose

```bash
# Start everything with one command
docker-compose up -d

# Run migrations + seed
docker-compose exec backend npx prisma db push
docker-compose exec backend npx tsx prisma/seed.ts
```

### Option 3: Manual Setup

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Set up database (requires PostgreSQL running)
cp backend/.env.example backend/.env
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# Start services
cd .. && npm run dev  # Frontend on :3000
cd backend && npm run dev  # Backend on :4000
```

## Demo Accounts

After running the seed script:

| Role | Mobile | 4-digit PIN | Name |
|---|---|---|---|
| Farmer | `9876543210` | `1234` | Rajesh Patil (Pune) |
| Farmer | `9876543211` | `1234` | Suresh Kumar (Pune) |
| Farmer | `9876543212` | `1234` | Priya Deshmukh (Sindhudurg) |
| Admin | `9000000001` | `0001` | Admin User |
| Field Officer | `9000000002` | `0002` | Field Officer Sharma |

> **OTP Login:** In development, OTPs are logged to the server console (look for the box in terminal output). No SMS provider is configured — the code is structured so Twilio/MSG91 can be plugged in by updating `backend/src/services/otp.ts`.

## Features

### Authentication
- Mobile number + OTP login (mock — logs OTP to console)
- JWT access tokens (15min) + refresh tokens (30 days, httpOnly)
- 4-digit PIN for quick repeat login
- Role-based access: `farmer`, `dealer`, `field_officer`, `admin`
- Onboarding flow for first-time users

### Weather Intelligence
- Real-time data from Open-Meteo API (free, no API key)
- 7-day forecast with hourly breakdowns
- Rule-based farming insights (delay spraying, frost alerts, irrigation advice)
- Cached in Redis (1hr TTL)
- Browser geolocation or manual village/district search

### Crop Recommendation
- Input: N/P/K, temperature, humidity, pH, rainfall
- Rule-based scoring against 15 crop profiles
- Ranked list with suitability scores and breakdown
- IoT sensor data endpoint ready (ESP32/Blynk integration)

### Disease Detection
- Image upload (camera or file picker)
- Mock disease prediction (6 diseases) — structured for CNN model swap
- Treatment recommendations and prevention tips
- Full i18n support (disease names in English, Hindi, Marathi)

### Mandi Prices
- Realistic seeded data for Indian mandis (Pune, Nashik, Nagpur)
- Cross-mandi price comparison
- Best price highlighting
- 30-day historical price data

### Equipment Rental
- Equipment listings with rental rates, availability, GPS location
- Haversine distance-based proximity matching
- Booking flow (creates pending booking)

### Government Schemes
- 10 seeded schemes (PM-KISAN, PMFBY, KCC, etc.)
- Eligibility matching based on farmer profile
- Match score and personalized reasons
- Required documents checklist

### News Feed
- Agricultural news articles
- Filter by category and language
- 12 seeded articles in English, Hindi, and Marathi

### Admin Panel
- User management (read-only in v1)
- Scheme CRUD
- News CRUD
- Equipment management

## API Endpoints

```
POST   /api/auth/request-otp      # Send OTP to mobile
POST   /api/auth/verify-otp       # Verify OTP code
POST   /api/auth/signup           # Create new account
POST   /api/auth/pin-login        # Login with 4-digit PIN
POST   /api/auth/set-pin          # Set PIN for quick login
POST   /api/auth/refresh          # Refresh access token
POST   /api/auth/logout           # Revoke session
GET    /api/auth/me                # Get current user
PUT    /api/auth/profile           # Update profile

GET    /api/weather                # Current weather + forecast
GET    /api/weather/insights       # Farming insights

POST   /api/crops/recommend        # Crop recommendation
GET    /api/crops/profiles         # Crop requirement profiles
POST   /api/crops/farms            # Create farm
GET    /api/crops/farms            # List user's farms
POST   /api/crops/sensor-data      # Store IoT sensor data

POST   /api/disease/detect         # Upload image, get prediction
GET    /api/disease/history        # User's detection history

GET    /api/mandi/prices           # List mandi prices
GET    /api/mandi/compare/:crop    # Compare prices across mandis
GET    /api/mandi/crops            # List available crops

GET    /api/equipment              # List equipment
GET    /api/equipment/:id          # Equipment details
POST   /api/equipment              # Create listing (owner)
POST   /api/equipment/:id/book     # Request rental

GET    /api/schemes                # List all schemes
GET    /api/schemes/match          # Personalized scheme matches
GET    /api/schemes/:id            # Scheme details

GET    /api/news                   # List news articles
GET    /api/news/categories        # Available categories

GET    /api/dashboard              # Dashboard summary

GET    /api/admin/users            # [Admin] List users
GET    /api/admin/stats            # [Admin] Platform stats
CRUD   /api/admin/schemes          # [Admin] Scheme management
CRUD   /api/admin/news             # [Admin] News management
CRUD   /api/admin/equipment        # [Admin] Equipment management
```

## What's Mocked / Stubbed

This is a demo/portfolio project. The following are mocked and documented for future production implementation:

| Component | Current State | Production Implementation |
|---|---|---|
| **OTP/SMS** | Logged to console | Twilio/MSG91 integration in `services/otp.ts` |
| **Disease Detection** | Random mock from 6 diseases | CNN model (ResNet50) via Python FastAPI service |
| **Crop Recommendation** | Rule-based scoring | Trained ML model (Random Forest/XGBoost) |
| **Mandi Prices** | Seeded static data | Government mandi price API or data.gov.in scraping |
| **Weather Insights** | Rule-based logic | ML-based crop-specific predictions |
| **File Storage** | Local disk (`/uploads`) | AWS S3 or compatible (abstraction layer in place) |
| **Notifications** | Database only | Push notifications (FCM) + email service |
| **Payments** | Sandbox only | Razorpay/UPI integration |

## Environment Variables

### Backend (`.env`)

```bash
DATABASE_URL="postgresql://growsmart:growsmart_secret@localhost:5432/growsmart?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="change-this-in-production"
JWT_REFRESH_SECRET="change-this-in-production"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="30d"
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
UPLOAD_DIR="./uploads"
```

### Frontend (`.env`)

```bash
VITE_API_URL="http://localhost:4000/api"
VITE_GEMINI_API_KEY=your_api_key_here
VITE_NEWSDATA_API_KEY=your_api_key_here
```

## Development

```bash
# Run both frontend and backend concurrently
cd backend && npm run dev  # :4000
npm run dev                # :3000

# Database management
cd backend && npx prisma studio    # Visual DB browser
cd backend && npx prisma db push   # Apply schema changes
cd backend && npx tsx prisma/seed.ts  # Re-seed data
```

## License

This project is for educational purposes.
