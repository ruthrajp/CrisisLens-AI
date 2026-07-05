# CrisisLens AI — Python FastAPI Backend Migration

A full-stack, AI-powered emergency incident response triage system. The application has been migrated from a Node.js API to a Python FastAPI backend while preserving the React + TypeScript frontend and design layout.

## Core Architecture

```
React + TypeScript Frontend (Port 3000)
             ↓ API Requests / Proxy
Python + FastAPI Backend (Port 8000)
             ↓
        Gemini API
             ↓
  Persistent Incident Store (backend/data/incidents.json)
```

1. **Frontend**: React + TypeScript styled with Tailwind CSS, leveraging Lucide Icons and Recharts for maps, tables, and incident analytical views.
2. **Backend**: Python + FastAPI web framework routing. It parses incoming emergency reports (including base64 audio and image uploads), manages crisis severity, routes emergency tickets dynamically to city municipal divisions, and maintains local persistent storage.
3. **AI Core**: Google Gemini model (`gemini-3.5-flash`) via the modern, official `@google/genai` (Node) and `google-genai` (Python) SDKs, extracting incident parameters and transcribing voice records with fallback simulation logic.

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python 3.10+ and `pip`

---

## Local Development (Quick Start)

The primary entry point `server.ts` is configured to **automatically spawn the Python backend** and proxy all API calls seamlessly. You only need to run a single command!

### 1. Configure the Environment
Create a `.env` file in the root directory (and optional copy inside `backend/` directory) and populate your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install dependencies & run (Single Terminal)

```bash
# Install frontend packages
npm install

# Build Python virtual environment & install requirements
cd backend
python3 -m venv venv

# Activate venv:
# On Linux/macOS:
source venv/bin/activate
# On Windows (cmd):
# venv\Scripts\activate.bat
# On Windows (PowerShell):
# venv\Scripts\Activate.ps1

pip install -r requirements.txt
cd ..

# Start full-stack proxy & app
npm run dev
```

Open your browser to `http://localhost:3000` to preview the application.

---

## Manual Execution (Separate Terminals)

If you prefer starting the services in individual shells:

### Terminal 1 — Python Backend

```bash
cd backend
# Create and activate virtualenv
python3 -m venv venv
source venv/bin/activate # or venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload --port 8000
```

### Terminal 2 — React Frontend

```bash
npm install
npm run dev
```

Vite is preconfigured with a built-in proxy in `vite.config.ts` to route all `/api/*` and `/uploads/*` requests to the Python FastAPI server on port `8000`.

---

## Python Backend Directory Structure

```
backend/
├── main.py                # FastAPI Application Entrypoint
├── requirements.txt       # Python Libraries
├── config.py              # Configuration & Dotenv loader
├── schemas.py             # Pydantic schemas (camelCase)
├── database.py            # Persistent JSON Storage & Seeder
├── routers/
│   ├── analysis.py        # Multipart-form API router
│   ├── incidents.py       # Incidents CRUD & Status workflow
│   ├── departments.py     # Municipal departments & routing
│   └── dashboard.py       # Metrics & chart aggregation
└── services/
    ├── gemini_service.py  # Gemini 3.5 Flash Multimodal pipeline
    ├── severity_service.py# Context-aware severity validation
    └── routing_service.py # Smart municipal department dispatcher
```
