const BASE = "http://localhost:8000";

/**
 * Stream chat tokens from the backend.
 * Calls `onToken(token)` for each chunk, resolves when done.
 */
export async function streamChat(message, context, history, onToken) {
  const res = await fetch(`${BASE}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, context, history }),
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value).split("\n");
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (payload === "[DONE]") return;
      try {
        const { token } = JSON.parse(payload);
        onToken(token);
      } catch {}
    }
  }
}

/**
 * Upload a PDF file and return extracted text.
 */
export async function parsePdf(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/upload/pdf`, { method: "POST", body: form });
  const data = await res.json();
  return data.text ?? "";
}

/**
 * Generate quiz questions from notes.
 */
export async function generateQuiz(context, numQuestions = 5) {
  const res = await fetch(`${BASE}/quiz/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ context, num_questions: numQuestions }),
  });
  const data = await res.json();
  return data.questions ?? [];
}
