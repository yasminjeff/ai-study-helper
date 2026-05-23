import { useState, useRef, useEffect } from "react";
import { streamChat } from "../utils/api";
import { parsePdf } from "../utils/api";

export default function ChatPage({ notes, setNotes }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [fileName, setFileName] = useState("");
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const text = await parsePdf(file);
    setNotes(text);
  }

  async function handleSend() {
    if (!input.trim() || streaming) return;
    const userMsg = { role: "user", content: input };
    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "", streaming: true }]);
    setInput("");
    setStreaming(true);

    let fullReply = "";
    await streamChat(input, notes, history, (token) => {
      fullReply += token;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: fullReply, streaming: true };
        return updated;
      });
    });

    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = { role: "assistant", content: fullReply, streaming: false };
      return updated;
    });
    setStreaming(false);
  }

  return (
    <div className="chat-wrap">
      {/* Notes panel */}
      <div className="notes-panel">
        <div className="notes-label">
          <span>◈</span> Study material
        </div>
        <div className="upload-row">
          <input type="file" accept=".pdf" ref={fileRef} style={{ display: "none" }} onChange={handleUpload} />
          <button className="upload-btn" onClick={() => fileRef.current.click()}>
            Upload PDF
          </button>
          {fileName && <span className="file-name">{fileName}</span>}
        </div>
        <textarea
          className="notes-input"
          placeholder="…or paste your notes here directly"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Messages */}
      <div className="messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="icon">◈</div>
            <p>Upload your notes above, then ask anything.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role === "user" ? "user" : "ai"}`}>
            <div className="avatar">{m.role === "user" ? "U" : "AI"}</div>
            <div className={`bubble ${m.streaming ? "streaming" : ""}`}>{m.content}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="input-row">
        <input
          className="chat-input"
          placeholder="Ask a question about your notes…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={streaming}
        />
        <button className="send-btn" onClick={handleSend} disabled={streaming || !input.trim()}>
          {streaming ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
