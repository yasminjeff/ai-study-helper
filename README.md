# StudyMind — AI Study & Homework Helper

An AI-powered web app that helps students study smarter.
Upload your lecture notes or paste any text, then ask questions,
get explanations, and auto-generate quizzes — all grounded in
your own material, not generic AI knowledge.

## Features
- Upload PDF notes or paste text directly
- Ask questions and get streaming AI answers (word-by-word)
- Auto-generate multiple choice quizzes from your notes
- AI stays grounded to your content — no hallucinations
- Multi-turn conversation with context memory

## Tech Stack
- **Frontend** — React, Vite, CSS
- **Backend** — FastAPI, Python
- **AI** — OpenAI GPT-4o-mini with streaming (SSE)
- **PDF parsing** — PyPDF2

## Run locally
# Backend
cd backend && pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend && npm install && npm run dev
