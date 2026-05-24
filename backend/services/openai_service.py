import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv

from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

client = AsyncOpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

SYSTEM_PROMPT = """You are a helpful study assistant.
When the user provides notes or text, answer ONLY based on that content.
If the answer is not in the provided material, say so clearly — do not make things up.
Be concise, clear, and student-friendly."""

async def stream_chat_response(message: str, context: str, history: list[dict]):
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

    for msg in history[-10:]:
        messages.append(msg)

    messages.append({"role": "user", "content": message})

    stream = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        stream=True,
    )

    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield f"data: {json.dumps({'token': delta})}\n\n"

    yield "data: [DONE]\n\n"


async def generate_quiz(context: str, num_questions: int) -> list[dict]:
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
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )

    raw = response.choices[0].message.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(raw)