import React, { useState } from "react";

const messages = [
  {
    type: "text",
    icon: "💬",
    sender: "Rahul",
    content: "The machine inspection is tomorrow at 10 AM.",
    accessible:
      "Text message from Rahul. The machine inspection is tomorrow at 10 AM.",
  },
  {
    type: "voice",
    icon: "🎤",
    sender: "Ananya",
    content: "Voice note — 0:24",
    accessible:
      "Voice message from Ananya. Duration 24 seconds.",
    explanation:
      "🎤 Transcript: Please bring the inspection checklist.",
  },
  {
    type: "image",
    icon: "🖼️",
    sender: "Arjun",
    content: "Machine condition photo",
    accessible:
      "Image shared by Arjun showing the current condition of the machine.",
    explanation:
      "🖼️ Image description: A machine is shown during an inspection. The image provides visual information about its current condition.",
  },
  {
    type: "video",
    icon: "🎥",
    sender: "Rahul",
    content: "Inspection video — 1:12",
    accessible:
      "Video shared by Rahul showing the machine during operation.",
    explanation:
      "🎥 Video summary: The machine is shown operating during the inspection.",
  },
  {
    type: "document",
    icon: "📄",
    sender: "Ananya",
    content: "Inspection_Report.pdf",
    accessible:
      "PDF document shared by Ananya containing the machine inspection report.",
    explanation:
      "📄 Document summary: The inspection report contains information about the machine condition and inspection findings.",
  },
];

export default function MultimodalConversation() {
  const [selectedMessage, setSelectedMessage] = useState(null);

  return (
    <section
      style={{
        marginTop: "25px",
        padding: "25px",
        borderRadius: "18px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      <h2 style={{ marginTop: 0 }}>
        🌐 Multimodal Conversation
      </h2>

      <p style={{ color: "#64748b" }}>
        Select any message to see its accessible representation.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        {messages.map((message, index) => (
          <button
            key={index}
            onClick={() => setSelectedMessage(message)}
            aria-label={message.accessible}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              padding: "15px",
              borderRadius: "12px",
              background:
                selectedMessage === message ? "#eef2ff" : "#f8fafc",
              border:
                selectedMessage === message
                  ? "2px solid #6366f1"
                  : "1px solid #e2e8f0",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                width: "45px",
                textAlign: "center",
              }}
            >
              {message.icon}
            </div>

            <div style={{ flex: 1 }}>
              <strong>{message.sender}</strong>

              <div
                style={{
                  marginTop: "5px",
                  color: "#475569",
                }}
              >
                {message.content}
              </div>
            </div>

            <span
              style={{
                padding: "5px 10px",
                borderRadius: "20px",
                background: "#e2e8f0",
                fontSize: "12px",
              }}
            >
              {message.type}
            </span>
          </button>
        ))}
      </div>

      {selectedMessage && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "14px",
            background: "#eef2ff",
            border: "1px solid #c7d2fe",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            🧠 Accessible Representation
          </h3>

          <p>
            <strong>{selectedMessage.sender}:</strong>{" "}
            {selectedMessage.accessible}
          </p>

          {selectedMessage.explanation && (
            <p style={{ color: "#475569" }}>
              {selectedMessage.explanation}
            </p>
          )}

          <button
            onClick={() => setSelectedMessage(null)}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              background: "#111827",
              color: "white",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          borderRadius: "12px",
          background: "#f1f5f9",
        }}
      >
        <strong>🧠 Accessibility Layer</strong>

        <p style={{ marginBottom: 0, color: "#475569" }}>
          Voice → transcript &nbsp; | &nbsp;
          Image → description &nbsp; | &nbsp;
          Video → summary &nbsp; | &nbsp;
          Document → key information
        </p>
      </div>
    </section>
  );
}