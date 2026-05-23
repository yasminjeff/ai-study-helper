# StudyMind — AI Study & Homework Helper

An AI-powered web app where students upload notes or paste text, then ask questions, get explanations, and auto-generate quizzes — all grounded in their own material.

## Tech Stack
- **Frontend**: React + Vite + CSS
- **Backend**: FastAPI (Python)
- **AI**: OpenAI GPT-4o-mini (streaming)
- **PDF parsing**: PyPDF2

## Project Structure
```
study-helper/
├── backend/
│   ├── main.py                  # FastAPI app
│   ├── requirements.txt
│   ├── routers/
│   │   ├── chat.py              # Streaming chat endpoint
│   │   ├── upload.py            # PDF upload + parsing
│   │   └── quiz.py              # Quiz generation
│   └── services/
│       ├── openai_service.py    # LLM calls
│       └── pdf_service.py       # PDF text extraction
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── pages/
    │   │   ├── ChatPage.jsx
    │   │   └── QuizPage.jsx
    │   └── utils/
    │       └── api.js           # Backend API calls
    └── index.html
```

## Getting Started

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Add your OpenAI API key to .env

uvicorn main:app --reload
# Runs on http://localhost:8000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## Features (Week 1)
- [x] Upload PDF → extract text
- [x] Paste notes manually
- [x] Streaming AI chat (word-by-word)
- [x] Context-grounded answers (AI only uses your notes)
- [x] Multi-turn conversation history
- [x] Auto quiz generation (MCQ)
- [x] Score tracking with correct/wrong highlighting

## Deployment
- Frontend → [Vercel](https://vercel.com) (connect GitHub repo, auto-deploys)
- Backend → [Render](https://render.com) (add `OPENAI_API_KEY` as env var, start command: `uvicorn main:app --host 0.0.0.0 --port 8000`)

## Interview talking points
- Chose FastAPI for async streaming support (Django doesn't do this cleanly)
- Used prompt engineering to keep AI grounded to uploaded content only
- Implemented Server-Sent Events for real-time token streaming
- Truncated PDF content to ~12k words to manage context window costs
