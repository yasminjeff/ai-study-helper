import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """You are a helpful study assistant.
When the user provides notes or text, answer ONLY based on that content.
If the answer is not in the provided material, say so clearly — do not make things up.
Be concise, clear, and student-friendly."""

async def stream_chat_response(message: str, context: str, history: list[dict]):
    """Stream tokens from OpenAI as Server-Sent Events."""
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    if context:
        messages.append({
            "role": "user",
            "content": f"Here are my study notes:\n\n{context}"
        })
        messages.append({
            "role": "assistant",
            "content": "Got it! I'll answer your questions based on these notes."
        })

    # Append conversation history
    for msg in history[-10:]:  # keep last 10 turns to manage tokens
        messages.append(msg)

    messages.append({"role": "user", "content": message})

    stream = await client.chat.completions.create(
        model="gpt-4o-mini",   # cheap + fast, swap to gpt-4o for better quality
        messages=messages,
        stream=True,
    )

    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield f"data: {json.dumps({'token': delta})}\n\n"

    yield "data: [DONE]\n\n"


async def generate_quiz(context: str, num_questions: int) -> list[dict]:
    """Generate MCQ quiz questions from study notes."""
    prompt = f"""
Create {num_questions} multiple-choice quiz questions based ONLY on the content below.

Return a JSON array with this exact format:
[
  {{
    "question": "...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "answer": "A"
  }}
]

Return ONLY the JSON array, no other text.

Content:
{context[:8000]}
"""
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )

    raw = response.choices[0].message.content.strip()
    # Strip markdown fences if present
    raw = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(raw)
