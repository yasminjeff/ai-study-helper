from fastapi import APIRouter
from pydantic import BaseModel
from services.openai_service import generate_quiz

router = APIRouter()

class QuizRequest(BaseModel):
    context: str
    num_questions: int = 5

@router.post("/generate")
async def create_quiz(req: QuizRequest):
    """Generate multiple-choice quiz questions from provided notes."""
    questions = await generate_quiz(req.context, req.num_questions)
    return {"questions": questions}
