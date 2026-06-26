# Healix — AI Healthcare Companion

Healix is an AI-powered healthcare assistant designed to bring trusted medical guidance, symptom analysis, government health scheme discovery, and health misinformation verification directly to citizens in their preferred local languages.

---

## 📂 Project Directory Structure

```text
Healix/
├── Backend/                    # Node.js & Express REST API Server
│   ├── src/
│   │   ├── config/             # Database & environment configurations (e.g. db.js)
│   │   ├── models/             # Mongoose schemas (e.g. assessment.js)
│   │   ├── routes/             # Express routing handlers
│   │   │   ├── assessmentRoutes.js
│   │   │   ├── awarenessRoutes.js
│   │   │   ├── chatRoutes.js
│   │   │   ├── languageRoutes.js
│   │   │   ├── medicineRoutes.js
│   │   │   ├── misinfoRoutes.js
│   │   │   └── placesRoutes.js
│   │   └── services/           # Business logic and external API integrations
│   │       ├── aiService.js         # Groq LLM integration
│   │       ├── awarenessService.js
│   │       ├── languageService.js
│   │       ├── medicineService.js
│   │       └── riskService.js
│   ├── server.js               # Backend Entry Point (Port 5001)
│   └── package.json
│
├── Frontend/                   # React (Vite) + Tailwind CSS Single Page Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/      # Portal components & layouts (Portal.tsx, Sidebar.tsx)
│   │   │   ├── features/       # Feature widgets (ProfileSettings.tsx)
│   │   │   ├── home/           # Landing page & Auth tabs (LandingPage.tsx, LoginScreen.tsx)
│   │   │   └── translations.ts # Multi-language localization dictionary
│   │   ├── App.tsx             # Main routing & application state
│   │   ├── main.tsx            # React application mounting
│   │   └── types.ts            # TypeScript interfaces
│   ├── server.ts               # Custom Vite & Express server for development proxying (Port 5000)
│   └── package.json
│
└── README.md                   # System documentation
```

---

## ⚡ Core Features

1. **AI Symptom Assessment & Risk Calculator**: Multi-stage diagnostic flow evaluating symptoms, lifestyle inputs, and vitals to generate a risk score and risk level (LOW/MEDIUM/HIGH) alongside AI recommendations.
2. **Multilingual Voice & Text Assistant**: Interactive ChatGPT-like interface supporting regional Indian languages (English & Hindi) powered by high-performance Large Language Models (LLMs) via the Groq SDK.
3. **Misinformation & Claim Verifier**: Instantly verify online health claims, news, or forwards to prevent dangerous self-medication trends.
4. **Healthcare Resource Finder**: Interactive map rendering nearby clinics, pharmacies, and hospitals using Google Places API (with OpenStreetMap fallbacks).
5. **Government Schemes Discovery**: Matches patient profile characteristics (age, location, income) with public health schemes (e.g. Ayushman Bharat).
6. **Smart Medicine Guide**: Demystifies doctor prescriptions, detailing side effects, contraindications, and schedules.

---

## ⚙️ Local Development Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* [MongoDB](https://www.mongodb.com/) (running locally or using MongoDB Atlas)

---

### Step 1: Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend/` directory and configure the environment variables:
   ```env
   PORT=5001
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/health-ai?retryWrites=true&w=majority
   GROQ_API_KEY=your_groq_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   GOOGLE_MAPS_API_KEY=your_google_maps_key_here
   ```
4. Start the development backend:
   ```bash
   npm run dev
   ```

---

### Step 2: Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server (via custom Express server proxy):
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **`http://localhost:5000`**.

---

## 🔗 Key API Routes

### 1. AI Assistant & Risk Evaluation
* `POST /api/assessment` — Evaluates user multi-stage inputs to compute risk levels.
* `POST /api/healix/chat` — Queries Groq LLM model (`llama-3.1-8b-instant`) with custom system prompts for medical advice.

### 2. Information & Claims Verifier
* `POST /api/healix/misinfo` — Checks medical claims and classifies them as true, false, or misleading.

### 3. Resource Finder
* `POST /api/healix/places` — Proxies searches to Google Places API to discover facilities near latitude/longitude coordinates.

---

## 📦 Deployment Overview

### Backend (Render / Railway)
* **Build Command**: `npm install`
* **Start Command**: `node server.js`
* Ensure `MONGO_URI`, `GROQ_API_KEY`, and `GOOGLE_MAPS_API_KEY` are defined in your deployment dashboard's Env settings.

### Frontend (Vercel / Netlify)
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Environment Variables**:
  * Set `VITE_API_BASE_URL` to point to your deployed production backend API.
