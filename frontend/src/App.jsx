import { useState } from "react";
import ChatPage from "./pages/ChatPage";
import QuizPage from "./pages/QuizPage";
import "./index.css";

export default function App() {
  const [notes, setNotes] = useState("");
  const [tab, setTab] = useState("chat"); // "chat" | "quiz"

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">StudyMind</span>
          </div>
          <nav className="tabs">
            <button
              className={`tab-btn ${tab === "chat" ? "active" : ""}`}
              onClick={() => setTab("chat")}
            >
              Ask AI
            </button>
            <button
              className={`tab-btn ${tab === "quiz" ? "active" : ""}`}
              onClick={() => setTab("quiz")}
              disabled={!notes}
              title={!notes ? "Upload notes first" : ""}
            >
              Quiz me
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {tab === "chat" ? (
          <ChatPage notes={notes} setNotes={setNotes} />
        ) : (
          <QuizPage notes={notes} />
        )}
      </main>
    </div>
  );
}
