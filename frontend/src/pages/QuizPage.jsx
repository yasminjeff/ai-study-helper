import { useState } from "react";
import { generateQuiz } from "../utils/api";

export default function QuizPage({ notes }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setAnswers({});
    const qs = await generateQuiz(notes, 5);
    setQuestions(qs);
    setLoading(false);
  }

  function handleAnswer(qi, letter) {
    if (answers[qi] !== undefined) return; // already answered
    setAnswers((prev) => ({ ...prev, [qi]: letter }));
  }

  const answered = Object.keys(answers).length;
  const correct = questions.filter((q, i) => answers[i] === q.answer).length;

  return (
    <div className="quiz-wrap">
      <div className="quiz-controls">
        <button className="gen-btn" onClick={handleGenerate} disabled={loading || !notes}>
          {loading ? "Generating…" : "Generate quiz"}
        </button>
        {questions.length > 0 && (
          <span className="q-count">{questions.length} questions from your notes</span>
        )}
      </div>

      {answered === questions.length && questions.length > 0 && (
        <div className="score-bar">
          <span className="score-num">{correct}/{questions.length}</span>
          <span>
            {correct === questions.length
              ? "Perfect score! 🎉"
              : correct >= questions.length / 2
              ? "Good job — review the ones you missed."
              : "Keep studying — you've got this!"}
          </span>
        </div>
      )}

      {questions.map((q, qi) => (
        <div key={qi} className="question-card">
          <p className="q-text">
            {qi + 1}. {q.question}
          </p>
          <div className="options">
            {q.options.map((opt) => {
              const letter = opt[0]; // "A", "B", "C", "D"
              const chosen = answers[qi];
              let cls = "opt-btn";
              if (chosen !== undefined) {
                if (letter === q.answer) cls += " correct";
                else if (letter === chosen) cls += " wrong";
              }
              return (
                <button
                  key={opt}
                  className={cls}
                  onClick={() => handleAnswer(qi, letter)}
                  disabled={chosen !== undefined}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
