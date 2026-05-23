from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.openai_service import stream_chat_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: str = ""          # uploaded notes/text pasted in
    history: list[dict] = []   # previous messages for multi-turn

@router.post("/stream")
async def chat_stream(req: ChatRequest):
    """Stream AI response word-by-word."""
    return StreamingResponse(
        stream_chat_response(req.message, req.context, req.history),
        media_type="text/event-stream",
    )
