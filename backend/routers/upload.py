from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_service import extract_text_from_pdf

router = APIRouter()

@router.post("/pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Accept a PDF, extract its text, return it to the frontend."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    contents = await file.read()
    text = extract_text_from_pdf(contents)

    if not text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from this PDF.")

    # Truncate to ~12,000 words to stay within context limits
    words = text.split()
    if len(words) > 12000:
        text = " ".join(words[:12000]) + "\n\n[Content truncated to fit context window]"

    return {"text": text, "word_count": len(words)}
