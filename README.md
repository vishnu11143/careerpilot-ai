# CareerPilot AI — AI-Powered Career Operating System

<div align="center">
  <h3>Next-Generation Career Acceleration Platform Powered by Google Gemini AI & Supabase</h3>
  <p>Plan roadmaps, optimize resumes, practice AI mock interviews, analyze GitHub profiles, and receive 1-on-1 AI mentorship tailored to your dream career.</p>
</div>

---

## 🚀 Overview

**CareerPilot AI** is a comprehensive, production-ready career operating system designed to guide software engineers, data scientists, and tech professionals from early learning stages to elite job placement. Powered by **Google Gemini 2.5 Flash** through an isolated, secure backend service and authenticated via **Supabase**, CareerPilot AI equips students and professionals with actionable intelligence.

---

## ✨ Key Features

- **🤖 AI Career Mentor**: Real-time conversational mentorship with personalized career advice, tech stack transition guidance, and strategic next steps.
- **📄 Resume Intelligence & Bullet Rewriter**: Deep ATS analysis, keyword optimization, and active verb-driven impact rewriting.
- **🎙️ AI Mock Interview Studio**: Interactive technical and behavioral interview simulations with real-time feedback, grading, and answer breakdowns.
- **🗺️ Interactive Career Roadmap**: Personalized milestone tracking with curated courses, certifications, and hands-on project milestones.
- **📊 Technical Skill Gap Matrix**: Radar charts and proficiency comparisons between current competencies and target role expectations.
- **💼 Internship & Job Opportunity Radar**: Curated opportunities categorized by match percentage, remote availability, and skill alignment.
- **🐙 GitHub Profile & Repository Analyzer**: Automated scan of repository architecture, commit consistency, and portfolio presentation.
- **🔐 Enterprise Authentication**: Supabase-powered authentication with email/password signup, login, session persistence, and instant demo bypass.

---

## 🏗️ Architecture

```
careerpilot-ai/
├── src/                          # Frontend Application (React 18 + Vite)
│   ├── components/               # Reusable UI components & Dashboard Layout
│   ├── pages/                    # 11+ feature-rich dashboards & landing views
│   ├── services/                 # Frontend AI service client & Supabase connector
│   └── lib/                      # Supabase client initialization & utils
├── server/                       # Backend Proxy API (Node.js + Express)
│   ├── routes/                   # /api/ai endpoints (chat, mock interviews, resume)
│   ├── services/                 # Centralized Google Gemini SDK Integration (@google/genai)
│   └── index.js                  # Express API server (Port 5000)
├── supabase/                     # Supabase schema definitions
├── .env.example                  # Environment configuration template
└── README.md
```

### 🔒 Security-First AI Proxy Architecture
- **Zero API Key Leakage**: The client frontend **never** holds or exposes the `GEMINI_API_KEY`.
- **Backend Isolation**: All Gemini requests route through the Express proxy server (`server/services/geminiService.js`), safely invoking `@google/genai` using `gemini-2.5-flash`.
- **Supabase Auth**: Frontend communicates with Supabase strictly using public credentials (`VITE_SUPABASE_PUBLISHABLE_KEY`).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide React, Tailwind CSS / Vanilla CSS design system
- **Backend**: Node.js, Express, CORS, Dotenv
- **AI Engine**: Google GenAI SDK (`@google/genai`) with Gemini 2.5 Flash
- **Database & Auth**: Supabase Auth & PostgreSQL
- **Linting & Code Quality**: Oxlint & ESLint

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js** v18+ installed
- A **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))
- A **Supabase Project** (from [Supabase](https://supabase.com/))

### 2. Clone the Repository
```bash
git clone https://github.com/vishnu11143/careerpilot-ai.git
cd careerpilot-ai
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Fill in your configuration:
```env
# Frontend Config
VITE_API_URL=http://localhost:5000/api
VITE_APP_ENV=development

# Supabase Auth
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key

# Backend Gemini AI (NEVER expose to client)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### 4. Install Dependencies
Install frontend and backend packages:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 5. Launch the Application
Run both frontend and backend servers:

**Terminal 1 — Backend AI Proxy:**
```bash
cd server
node index.js
# Backend starts at http://localhost:5000
```

**Terminal 2 — Frontend Application:**
```bash
npm run dev
# Frontend starts at http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Testing & Verification

- **Lint Code**: `npm run lint`
- **Build Production**: `npm run build`
- **Backend Healthcheck**: `GET http://localhost:5000/api/ai/health`

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
