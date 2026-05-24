from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, upload, quiz

app = FastAPI(title="Study Helper API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://ai-study-helper-drab.vercel.app",
    ],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(upload.router, prefix="/upload", tags=["upload"])
app.include_router(quiz.router, prefix="/quiz", tags=["quiz"])

@app.get("/")
def root():
    return {"status": "Study Helper API is running"}
