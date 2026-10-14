import { useState } from "react";
import AccessibilityControls from "./AccessibilityControls";
import MultimodalConversation from "./MultimodalConversation";
import {
  Brain,
  MessageSquare,
  Volume2,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Save,
  FileText,
  FileJson,
  Image,
  Globe,
  Database,
} from "lucide-react";

function App() {
  const languages = [
  "English",
  "Hindi",
  "Telugu",
  "Tamil",
  "Kannada",
  "Malayalam",
];
  const [fontSize, setFontSize] = useState(16);
const [highContrast, setHighContrast] = useState(false);
const [simpleLanguage, setSimpleLanguage] = useState(false);

const [conversation, setConversation] = useState("");
const [analysis, setAnalysis] = useState(null);

// LANGUAGE SETTINGS
const [inputLanguage, setInputLanguage] = useState("English");
const [outputLanguage, setOutputLanguage] = useState("English");
const [translatedConversation, setTranslatedConversation] = useState("");
  // --------------------------------------------------
  // DEMO CONVERSATION
  // --------------------------------------------------

  const loadDemo = () => {
    const demo = `Rahul: Meeting tomorrow at 10 AM.
Ananya: I will prepare the project report.
Arjun: I will create the presentation.
Rahul: Please make sure the final document is ready.
Ananya: The deadline is tomorrow evening.
Arjun: We should review everything before the meeting.`;

    setConversation(demo);
    setAnalysis(null);
  };

  // --------------------------------------------------
  // SIMPLE LANGUAGE HELPER
  // --------------------------------------------------

  const simplifyText = (text) => {
    return text
      .replace(/\bplease\b/gi, "")
      .replace(/\bkindly\b/gi, "")
      .replace(/\bmake sure\b/gi, "ensure")
      .replace(/\bin order to\b/gi, "to")
      .replace(/\bapproximately\b/gi, "about")
      .replace(/\butilize\b/gi, "use")
      .replace(/\bassist\b/gi, "help")
      .replace(/\bcommence\b/gi, "start")
      .replace(/\bprior to\b/gi, "before")
      .replace(/\bregarding\b/gi, "about")
      .replace(/\brequired to\b/gi, "must")
      .replace(/\badditional\b/gi, "extra")
      .replace(/\bcurrently\b/gi, "now")
      .replace(/\bimmediately\b/gi, "now")
      .replace(/\btherefore\b/gi, "so")
      .replace(/\bhowever\b/gi, "but")
      .replace(/\bassist\b/gi, "help")
      .replace(/\s+/g, " ")
      .trim();
  };

  // --------------------------------------------------
  // CONVERSATION ANALYSIS
  // --------------------------------------------------

  const analyzeConversation = (useSimpleLanguage = simpleLanguage) => {
    if (!conversation.trim()) {
      alert("Please enter a conversation first.");
      return;
    }

    const lines = conversation
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const messages = lines.map((line) => {
      const match = line.match(/^([^:]+):\s*(.*)$/);

      return {
        sender: match ? match[1].trim() : "Someone",
        text: match ? match[2].trim() : line,
      };
    });

    // --------------------------------------------------
    // KEYWORD DETECTION
    // --------------------------------------------------

    const actionKeywords =
      /\b(i'll|i will|we'll|we will|need to|needs to|must|should|have to|prepare|bring|complete|finish|send|submit|upload|call|check|create|make|review|attend|join|book|buy|collect|share|update|fix|work on|handle|organize|arrange|schedule|do)\b/i;

    const timeKeywords =
      /\b(today|tomorrow|tonight|morning|afternoon|evening|night|deadline|due|by|before|after|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}(:\d{2})?\s?(am|pm)|\d{1,2}\/\d{1,2}\/\d{2,4})\b/i;

    const importantKeywords =
      /\b(important|urgent|critical|priority|must|warning|alert|final|deadline|emergency|issue|problem|cancelled|canceled|confirmed|required|necessary|attention|risk|danger|remember)\b/i;

    const actionMessages = messages.filter((message) =>
      actionKeywords.test(message.text)
    );

    const deadlineMessages = messages.filter((message) =>
      timeKeywords.test(message.text)
    );

    const importantMessages = messages.filter((message) =>
      importantKeywords.test(message.text)
    );

    // --------------------------------------------------
    // REMOVE DUPLICATES
    // --------------------------------------------------

    const uniqueMessages = (list) => {
      return [
        ...new Map(
          list.map((message) => [
            `${message.sender}:${message.text}`,
            message,
          ])
        ).values(),
      ];
    };

    const actions = uniqueMessages(actionMessages);
    const deadlines = uniqueMessages(deadlineMessages);
    const important = uniqueMessages(importantMessages);

    // --------------------------------------------------
    // NORMAL RESULTS
    // --------------------------------------------------

    const normalActions =
      actions.length > 0
        ? actions.map(
            (message) => `${message.sender}: ${message.text}`
          )
        : ["No specific action items detected."];

    const normalDeadlines =
      deadlines.length > 0
        ? deadlines.map(
            (message) => `${message.sender}: ${message.text}`
          )
        : ["No specific deadlines or time information detected."];

    const normalImportant =
      important.length > 0
        ? important.map(
            (message) => `${message.sender}: ${message.text}`
          )
        : ["No critical information detected."];

    // --------------------------------------------------
    // SIMPLE LANGUAGE RESULTS
    // --------------------------------------------------

    const simpleActions =
      actions.length > 0
        ? actions.map((message) => {
            let text = simplifyText(message.text);

            text = text
              .replace(/^I['’]ll\s+/i, "")
              .replace(/^I will\s+/i, "")
              .replace(/^we['’]ll\s+/i, "")
              .replace(/^we will\s+/i, "");

            return `${message.sender}: ${text}`;
          })
        : ["No action items found."];

    const simpleDeadlines =
      deadlines.length > 0
        ? deadlines.map((message) => simplifyText(message.text))
        : ["No deadlines or important times found."];

    const simpleImportant =
      important.length > 0
        ? important.map((message) => simplifyText(message.text))
        : ["No important information found."];

    // --------------------------------------------------
    // SUMMARY
    // --------------------------------------------------

    const normalSummary =
      `This conversation contains ${messages.length} messages. ` +
      `It includes ${
        actions.length > 0
          ? `${actions.length} action item(s)`
          : "no clearly detected action items"
      }, ${
        deadlines.length > 0
          ? `${deadlines.length} time or deadline-related message(s)`
          : "no clearly detected deadlines"
      }, and ${
        important.length > 0
          ? `${important.length} potentially important message(s)`
          : "no clearly detected critical information"
      }.`;

    const simpleSummary =
      `There are ${messages.length} messages. ` +
      `${
        actions.length > 0
          ? `${actions.length} task(s) need to be done. `
          : "No clear tasks were found. "
      }` +
      `${
        deadlines.length > 0
          ? `${deadlines.length} message(s) contain a time or deadline. `
          : "No clear deadline was found. "
      }` +
      `${
        important.length > 0
          ? `${important.length} important message(s) were found.`
          : "No important information was found."
      }`;

    // --------------------------------------------------
    // SAVE ANALYSIS
    // --------------------------------------------------

    setAnalysis({
      summary: useSimpleLanguage
        ? simpleSummary
        : normalSummary,

      important: useSimpleLanguage
        ? simpleImportant
        : normalImportant,

      actions: useSimpleLanguage
        ? simpleActions
        : normalActions,

      deadlines: useSimpleLanguage
        ? simpleDeadlines
        : normalDeadlines,

      messageCount: messages.length,
      generatedAt: new Date().toISOString(),
    });
  };

  // --------------------------------------------------
  // SIMPLE LANGUAGE TOGGLE
  // --------------------------------------------------

  const toggleSimpleLanguage = () => {
    const newValue = !simpleLanguage;

    setSimpleLanguage(newValue);

    if (conversation.trim()) {
      analyzeConversation(newValue);
    }
  };

  // --------------------------------------------------
  // READ SUMMARY ALOUD
  // --------------------------------------------------

  const readSummary = () => {
    if (!analysis) {
      alert("Please understand the conversation first.");
      return;
    }

    const speech = new SpeechSynthesisUtterance(
      analysis.summary
    );

    speech.rate = 0.9;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // --------------------------------------------------
  // SUMMARY DATA
  // --------------------------------------------------

  const getSummaryData = () => {
    if (!analysis) return null;

    return {
      title: "AccessTalk - Accessible Conversation Summary",
      summary: analysis.summary,
      importantInformation: analysis.important,
      actionItems: analysis.actions,
      deadlinesAndTime: analysis.deadlines,
      originalConversation: conversation,
      messageCount: analysis.messageCount,
      generatedBy: "AccessTalk",
      generatedAt: analysis.generatedAt,
    };
  };

  // --------------------------------------------------
  // DOWNLOAD HELPER
  // --------------------------------------------------

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], {
      type: mimeType,
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------
  // TXT
  // --------------------------------------------------

  const saveTXT = () => {
    const data = getSummaryData();

    if (!data) {
      alert("Please understand the conversation first.");
      return;
    }

    const content = `
ACCESS TALK
Accessible Conversation Summary
================================

SUMMARY
${data.summary}

IMPORTANT INFORMATION
${data.importantInformation
  .map((item) => `• ${item}`)
  .join("\n")}

ACTION ITEMS
${data.actionItems
  .map((item) => `• ${item}`)
  .join("\n")}

DEADLINES & TIME
${data.deadlinesAndTime
  .map((item) => `• ${item}`)
  .join("\n")}

MESSAGE COUNT
${data.messageCount}

GENERATED BY
${data.generatedBy}

GENERATED AT
${data.generatedAt}
`;

    downloadFile(
      content,
      "AccessTalk-Summary.txt",
      "text/plain"
    );
  };

  // --------------------------------------------------
  // HTML
  // --------------------------------------------------

  const saveHTML = () => {
    const data = getSummaryData();

    if (!data) {
      alert("Please understand the conversation first.");
      return;
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>AccessTalk Summary</title>

<style>

body {
  font-family: Arial, sans-serif;
  background: #f5f7fb;
  padding: 40px;
  color: #172033;
}

.container {
  max-width: 900px;
  margin: auto;
  background: white;
  padding: 40px;
  border-radius: 20px;
}

h1 {
  color: #111827;
}

.box {
  background: #f8f9fc;
  padding: 20px;
  margin: 20px 0;
  border-radius: 12px;
}

li {
  margin: 8px 0;
}

</style>
</head>

<body>

<div class="container">

<h1>🧠 AccessTalk</h1>

<h2>Accessible Conversation Summary</h2>

<div class="box">
<h3>Conversation Summary</h3>
<p>${escapeHTML(data.summary)}</p>
</div>

<div class="box">
<h3>⚠️ Important Information</h3>

<ul>
${data.importantInformation
  .map((item) => `<li>${escapeHTML(item)}</li>`)
  .join("")}
</ul>

</div>

<div class="box">
<h3>✅ Action Items</h3>

<ul>
${data.actionItems
  .map((item) => `<li>${escapeHTML(item)}</li>`)
  .join("")}
</ul>

</div>

<div class="box">
<h3>📅 Deadlines & Time</h3>

<ul>
${data.deadlinesAndTime
  .map((item) => `<li>${escapeHTML(item)}</li>`)
  .join("")}
</ul>

</div>

<p>
Generated by AccessTalk
</p>

</div>

</body>
</html>
`;

    downloadFile(
      html,
      "AccessTalk-Summary.html",
      "text/html"
    );
  };

  // --------------------------------------------------
  // JSON
  // --------------------------------------------------

  const saveJSON = () => {
    const data = getSummaryData();

    if (!data) {
      alert("Please understand the conversation first.");
      return;
    }

    downloadFile(
      JSON.stringify(data, null, 2),
      "AccessTalk-Summary.json",
      "application/json"
    );
  };

  // --------------------------------------------------
  // BSON ENCODER
  // --------------------------------------------------

  const encodeCString = (text) => {
    const encoder = new TextEncoder();

    const bytes = encoder.encode(text);

    const result = new Uint8Array(bytes.length + 1);

    result.set(bytes);

    result[bytes.length] = 0;

    return result;
  };

  const encodeString = (text) => {
    const encoder = new TextEncoder();

    const bytes = encoder.encode(text);

    const buffer = new ArrayBuffer(4);

    const view = new DataView(buffer);

    view.setInt32(0, bytes.length + 1, true);

    return combineBytes([
      new Uint8Array(buffer),
      bytes,
      new Uint8Array([0]),
    ]);
  };

  const combineBytes = (arrays) => {
    const totalLength = arrays.reduce(
      (sum, array) => sum + array.length,
      0
    );

    const result = new Uint8Array(totalLength);

    let offset = 0;

    arrays.forEach((array) => {
      result.set(array, offset);
      offset += array.length;
    });

    return result;
  };

  const encodeBSONValue = (key, value) => {
    const keyBytes = encodeCString(key);

    // String
    if (typeof value === "string") {
      return combineBytes([
        new Uint8Array([0x02]),
        keyBytes,
        encodeString(value),
      ]);
    }

    // Number
    if (typeof value === "number") {
      const buffer = new ArrayBuffer(8);

      const view = new DataView(buffer);

      view.setFloat64(0, value, true);

      return combineBytes([
        new Uint8Array([0x01]),
        keyBytes,
        new Uint8Array(buffer),
      ]);
    }

    // Array
    if (Array.isArray(value)) {
      return combineBytes([
        new Uint8Array([0x04]),
        keyBytes,
        encodeBSONDocument(
          Object.fromEntries(
            value.map((item, index) => [
              String(index),
              item,
            ])
          )
        ),
      ]);
    }

    // Object
    if (typeof value === "object" && value !== null) {
      return combineBytes([
        new Uint8Array([0x03]),
        keyBytes,
        encodeBSONDocument(value),
      ]);
    }

    return new Uint8Array();
  };

  const encodeBSONDocument = (object) => {
    const elements = Object.entries(object).map(
      ([key, value]) =>
        encodeBSONValue(key, value)
    );

    const content = combineBytes(elements);

    const lengthBuffer = new ArrayBuffer(4);

    const lengthView = new DataView(lengthBuffer);

    lengthView.setInt32(
      0,
      content.length + 5,
      true
    );

    return combineBytes([
      new Uint8Array(lengthBuffer),
      content,
      new Uint8Array([0]),
    ]);
  };

  // --------------------------------------------------
  // BSON
  // --------------------------------------------------

  const saveBSON = () => {
    const data = getSummaryData();

    if (!data) {
      alert("Please understand the conversation first.");
      return;
    }

    const bsonData = encodeBSONDocument(data);

    const blob = new Blob([bsonData], {
      type: "application/bson",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "AccessTalk-Summary.bson";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------
  // PDF
  // --------------------------------------------------

  const savePDF = () => {
    const data = getSummaryData();

    if (!data) {
      alert("Please understand the conversation first.");
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

    if (!printWindow) {
      alert(
        "Please allow pop-ups in your browser to save the PDF."
      );
      return;
    }

    printWindow.document.write(`
<!DOCTYPE html>

<html>

<head>

<title>AccessTalk Summary</title>

<style>

body {
  font-family: Arial, sans-serif;
  padding: 40px;
  color: #172033;
}

h1 {
  font-size: 30px;
}

h2 {
  margin-top: 30px;
}

.box {
  margin: 20px 0;
  padding: 20px;
  background: #f5f7fb;
  border-radius: 12px;
}

li {
  margin: 8px 0;
}

@media print {

  body {
    padding: 20px;
  }

}

</style>

</head>

<body>

<h1>🧠 AccessTalk</h1>

<h2>Accessible Conversation Summary</h2>

<div class="box">

<h3>Conversation Summary</h3>

<p>
${escapeHTML(data.summary)}
</p>

</div>

<div class="box">

<h3>⚠️ Important Information</h3>

<ul>

${data.importantInformation
  .map(
    (item) =>
      `<li>${escapeHTML(item)}</li>`
  )
  .join("")}

</ul>

</div>

<div class="box">

<h3>✅ Action Items</h3>

<ul>

${data.actionItems
  .map(
    (item) =>
      `<li>${escapeHTML(item)}</li>`
  )
  .join("")}

</ul>

</div>

<div class="box">

<h3>📅 Deadlines & Time</h3>

<ul>

${data.deadlinesAndTime
  .map(
    (item) =>
      `<li>${escapeHTML(item)}</li>`
  )
  .join("")}

</ul>

</div>

<p>
Generated by AccessTalk
</p>

</body>

</html>
`);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // --------------------------------------------------
  // IMAGE GENERATOR
  // --------------------------------------------------

  const createSummaryCanvas = () => {
    const data = getSummaryData();

    if (!data) {
      alert("Please understand the conversation first.");
      return null;
    }

    const canvas = document.createElement("canvas");

    canvas.width = 1400;
    canvas.height = 1600;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#f5f7fb";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    ctx.fillStyle = "#ffffff";

    ctx.roundRect(
      70,
      60,
      1260,
      1480,
      30,
      30
    );

    ctx.fill();

    ctx.fillStyle = "#111827";

    ctx.font = "bold 48px Arial";

    ctx.fillText(
      "AccessTalk",
      120,
      140
    );

    ctx.font = "bold 34px Arial";

    ctx.fillText(
      "Accessible Conversation Summary",
      120,
      205
    );

    let y = 290;

    // Summary

    ctx.fillStyle = "#eef2ff";

    ctx.roundRect(
      110,
      y,
      1180,
      180,
      20,
      20
    );

    ctx.fill();

    ctx.fillStyle = "#111827";

    ctx.font = "bold 28px Arial";

    ctx.fillText(
      "🧠 Summary",
      140,
      y + 50
    );

    ctx.font = "24px Arial";

    drawWrappedText(
      ctx,
      data.summary,
      140,
      y + 95,
      1100,
      34
    );

    y += 230;

    // Important

    y = drawImageSection(
      ctx,
      "⚠️ Important Information",
      data.importantInformation,
      y
    );

    y += 30;

    // Actions

    y = drawImageSection(
      ctx,
      "✅ Action Items",
      data.actionItems,
      y
    );

    y += 30;

    // Deadlines

    drawImageSection(
      ctx,
      "📅 Deadlines & Time",
      data.deadlinesAndTime,
      y
    );

    return canvas;
  };

  const drawWrappedText = (
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight
  ) => {
    const words = text.split(" ");

    let line = "";

    for (let i = 0; i < words.length; i++) {
      const testLine =
        line + words[i] + " ";

      const width =
        ctx.measureText(testLine).width;

      if (
        width > maxWidth &&
        i > 0
      ) {
        ctx.fillText(line, x, y);

        line =
          words[i] + " ";

        y += lineHeight;
      } else {
        line = testLine;
      }
    }

    ctx.fillText(line, x, y);

    return y + lineHeight;
  };

  const drawImageSection = (
    ctx,
    title,
    items,
    y
  ) => {
    const height =
      Math.max(150, items.length * 55 + 100);

    ctx.fillStyle = "#f8f9fc";

    ctx.roundRect(
      110,
      y,
      1180,
      height,
      20,
      20
    );

    ctx.fill();

    ctx.fillStyle = "#111827";

    ctx.font = "bold 28px Arial";

    ctx.fillText(
      title,
      140,
      y + 50
    );

    ctx.font = "23px Arial";

    let itemY = y + 95;

    items.forEach((item) => {
      itemY = drawWrappedText(
        ctx,
        "• " + item,
        150,
        itemY,
        1100,
        32
      );

      itemY += 5;
    });

    return y + height;
  };

  // --------------------------------------------------
  // PNG
  // --------------------------------------------------

  const savePNG = () => {
    const canvas = createSummaryCanvas();

    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "AccessTalk-Summary.png";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    }, "image/png");
  };

  // --------------------------------------------------
  // JPEG
  // --------------------------------------------------

  const saveJPEG = () => {
    const canvas = createSummaryCanvas();

    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          "AccessTalk-Summary.jpeg";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      },
      "image/jpeg",
      0.95
    );
  };

  // --------------------------------------------------
  // HTML ESCAPE
  // --------------------------------------------------

  function escapeHTML(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --------------------------------------------------
  // SAVE BUTTON COMPONENT
  // --------------------------------------------------

  const SaveButton = ({
    icon,
    label,
    onClick,
  }) => {
    return (
      <button
        onClick={onClick}
        style={
          highContrast
            ? styles.saveButtonHighContrast
            : styles.saveButton
        }
      >
        {icon}
        {label}
      </button>
    );
  };

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <div
      style={{
        ...styles.app,
        fontSize: `${fontSize}px`,
        background: highContrast
          ? "#000000"
          : "#f5f7fb",
        color: highContrast
          ? "#ffffff"
          : "#172033",
      }}
    >
      {/* HEADER */}

      <header
        style={{
          ...styles.header,
          background: highContrast
            ? "#000000"
            : "#ffffff",
          color: highContrast
            ? "#ffffff"
            : "#172033",
          borderBottom: highContrast
            ? "1px solid #ffffff"
            : "1px solid #e5e7eb",
        }}
      >
        <div style={styles.logo}>
          <Brain size={32} />

          <div>
            <h1 style={styles.logoTitle}>
              AccessTalk
            </h1>

            <p
              style={{
                ...styles.logoSubtitle,
                color: highContrast
                  ? "#ffffff"
                  : "#667085",
              }}
            >
              Making conversations accessible
            </p>
            {/* LANGUAGE SELECTION */}

<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "18px",
  }}
>
  {/* FROM LANGUAGE */}

  <div style={{ flex: 1, minWidth: "220px" }}>
    <label
      style={{
        display: "block",
        marginBottom: "7px",
        fontWeight: "600",
      }}
    >
      🌐 From Language
    </label>

    <select
      value={inputLanguage}
      onChange={(event) =>
        setInputLanguage(event.target.value)
      }
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: highContrast
          ? "2px solid #ffffff"
          : "2px solid #e5e7eb",
        background: highContrast
          ? "#000000"
          : "#ffffff",
        color: highContrast
          ? "#ffffff"
          : "#172033",
        fontSize: "16px",
      }}
    >
      {languages.map((language) => (
        <option key={language} value={language}>
          {language}
        </option>
      ))}
    </select>
  </div>

  {/* TO LANGUAGE */}

  <div style={{ flex: 1, minWidth: "220px" }}>
    <label
      style={{
        display: "block",
        marginBottom: "7px",
        fontWeight: "600",
      }}
    >
      🔄 Translate To
    </label>

    <select
      value={outputLanguage}
      onChange={(event) =>
        setOutputLanguage(event.target.value)
      }
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "10px",
        border: highContrast
          ? "2px solid #ffffff"
          : "2px solid #e5e7eb",
        background: highContrast
          ? "#000000"
          : "#ffffff",
        color: highContrast
          ? "#ffffff"
          : "#172033",
        fontSize: "16px",
      }}
    >
      {languages.map((language) => (
        <option key={language} value={language}>
          {language}
        </option>
      ))}
    </select>
  </div>
</div>
          </div>
        </div>
      </header>

      <main
        style={{
          ...styles.main,
          background: highContrast
            ? "#000000"
            : "transparent",
          color: highContrast
            ? "#ffffff"
            : "#172033",
        }}
      >
        {/* ACCESSIBILITY CONTROLS */}

        <AccessibilityControls
          fontSize={fontSize}
          setFontSize={setFontSize}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
          simpleLanguage={simpleLanguage}
          setSimpleLanguage={
            toggleSimpleLanguage
          }
          onReadAloud={readSummary}
        />

        {/* MULTIMODAL DEMO */}

        <MultimodalConversation />

        {/* HERO */}

        <section style={styles.hero}>
          <h2 style={styles.heroTitle}>
            Understand the conversation,
            <br />
            not just the message.
          </h2>

          <p style={styles.heroText}>
            AccessTalk transforms complex
            conversations into accessible
            context, important information
            and actionable tasks.
          </p>
        </section>

        {/* CONVERSATION INPUT */}

        <section
          style={{
            ...styles.card,
            background: highContrast
              ? "#111111"
              : "#ffffff",
            color: highContrast
              ? "#ffffff"
              : "#172033",
            border: highContrast
              ? "1px solid #ffffff"
              : "none",
          }}
        >
          <div style={styles.sectionTitle}>
            <MessageSquare size={24} />

            <h2>Conversation</h2>
          </div>

          <p
            style={{
              ...styles.description,
              color: highContrast
                ? "#ffffff"
                : "#667085",
            }}
          >
            Paste any group conversation
            below.
          </p>

          <textarea
            value={conversation}
            onChange={(event) =>
              setConversation(
                event.target.value
              )
            }
            placeholder="Paste your conversation here..."
            style={{
              ...styles.textarea,
              background: highContrast
                ? "#000000"
                : "#ffffff",
              color: highContrast
                ? "#ffffff"
                : "#172033",
              border: highContrast
                ? "2px solid #ffffff"
                : "2px solid #e5e7eb",
            }}
          />

          <div style={styles.buttons}>
            <button
              onClick={loadDemo}
              style={styles.secondaryButton}
            >
              Load Demo
            </button>
            <button
  onClick={() =>
    analyzeConversation(
      simpleLanguage
    )
  }
  style={styles.primaryButton}
>
  <Brain size={18} />
  Understand Conversation
</button>
            <button
              onClick={() =>
                analyzeConversation(
                  simpleLanguage
                )
              }
              style={styles.primaryButton}
            >
              <Brain size={18} />

              Understand Conversation
            </button>
          </div>
        </section>

        {/* ANALYSIS */}

        <section
          style={{
            ...styles.card,
            background: highContrast
              ? "#111111"
              : "#ffffff",
            color: highContrast
              ? "#ffffff"
              : "#172033",
            border: highContrast
              ? "1px solid #ffffff"
              : "none",
          }}
        >
          <div style={styles.sectionTitle}>
            <Brain size={24} />

            <h2>
              Accessible Conversation
            </h2>
          </div>

          <p
            style={{
              ...styles.description,
              color: highContrast
                ? "#ffffff"
                : "#667085",
            }}
          >
            Your conversation will be
            transformed into an
            easy-to-understand view.
          </p>

          {!analysis && (
            <div
              style={{
                ...styles.emptyBox,
                color: highContrast
                  ? "#ffffff"
                  : "#667085",
                background:
                  highContrast
                    ? "#000000"
                    : "#f8f9fc",
              }}
            >
              Enter a conversation and
              click{" "}
              <strong>
                Understand Conversation
              </strong>{" "}
              to generate a summary.
            </div>
          )}

          {analysis && (
            <div style={styles.analysisArea}>
              {/* SUMMARY */}

              <div
                style={{
                  ...styles.summaryBox,
                  background:
                    highContrast
                      ? "#000000"
                      : "#eef2ff",
                  color: highContrast
                    ? "#ffffff"
                    : "#172033",
                  border:
                    highContrast
                      ? "1px solid #ffffff"
                      : "none",
                }}
              >
                <h3>
                  🧠 Conversation Summary
                </h3>

                <p>
                  {analysis.summary}
                </p>
              </div>

              {/* IMPORTANT */}

              <div
                style={{
                  ...styles.resultBox,
                  background:
                    highContrast
                      ? "#000000"
                      : "#f8f9fc",
                  color: highContrast
                    ? "#ffffff"
                    : "#172033",
                  border:
                    highContrast
                      ? "1px solid #ffffff"
                      : "none",
                }}
              >
                <div style={styles.resultHeader}>
                  <AlertTriangle size={22} />

                  <h3>
                    Important Information
                  </h3>
                </div>

                {analysis.important.map(
                  (item, index) => (
                    <p key={index}>
                      • {item}
                    </p>
                  )
                )}
              </div>

              {/* ACTIONS */}

              <div
                style={{
                  ...styles.resultBox,
                  background:
                    highContrast
                      ? "#000000"
                      : "#f8f9fc",
                  color: highContrast
                    ? "#ffffff"
                    : "#172033",
                  border:
                    highContrast
                      ? "1px solid #ffffff"
                      : "none",
                }}
              >
                <div style={styles.resultHeader}>
                  <CheckCircle size={22} />

                  <h3>
                    Action Items
                  </h3>
                </div>

                {analysis.actions.map(
                  (item, index) => (
                    <p key={index}>
                      • {item}
                    </p>
                  )
                )}
              </div>

              {/* DEADLINES */}

              <div
                style={{
                  ...styles.resultBox,
                  background:
                    highContrast
                      ? "#000000"
                      : "#f8f9fc",
                  color: highContrast
                    ? "#ffffff"
                    : "#172033",
                  border:
                    highContrast
                      ? "1px solid #ffffff"
                      : "none",
                }}
              >
                <div style={styles.resultHeader}>
                  <Calendar size={22} />

                  <h3>
                    Deadlines & Time
                  </h3>
                </div>

                {analysis.deadlines.map(
                  (item, index) => (
                    <p key={index}>
                      • {item}
                    </p>
                  )
                )}
              </div>

              {/* READ ALOUD */}

              <div
                style={{
                  ...styles.resultBox,
                  background:
                    highContrast
                      ? "#000000"
                      : "#f8f9fc",
                  color: highContrast
                    ? "#ffffff"
                    : "#172033",
                  border:
                    highContrast
                      ? "1px solid #ffffff"
                      : "none",
                }}
              >
                <div style={styles.resultHeader}>
                  <Volume2 size={22} />

                  <h3>
                    Accessible Read-Aloud
                  </h3>
                </div>

                <button
                  onClick={readSummary}
                  style={styles.primaryButton}
                >
                  <Volume2 size={18} />

                  Read Summary Aloud
                </button>
              </div>

              {/* SAVE SUMMARY */}

              <div
                style={{
                  ...styles.saveSection,
                  background:
                    highContrast
                      ? "#000000"
                      : "#f8f9fc",
                  color: highContrast
                    ? "#ffffff"
                    : "#172033",
                  border:
                    highContrast
                      ? "1px solid #ffffff"
                      : "1px solid #e5e7eb",
                }}
              >
                <div style={styles.resultHeader}>
                  <Save size={24} />

                  <h3>
                    Save Summary
                  </h3>
                </div>

                <p
                  style={{
                    color: highContrast
                      ? "#ffffff"
                      : "#667085",
                  }}
                >
                  Save the generated
                  summary in your preferred
                  format.
                </p>

                <div
                  style={styles.saveButtons}
                >
                  <SaveButton
                    icon={<FileText size={17} />}
                    label="TXT"
                    onClick={saveTXT}
                  />

                  <SaveButton
                    icon={<FileText size={17} />}
                    label="PDF"
                    onClick={savePDF}
                  />

                  <SaveButton
                    icon={<Image size={17} />}
                    label="PNG"
                    onClick={savePNG}
                  />

                  <SaveButton
                    icon={<Image size={17} />}
                    label="JPEG"
                    onClick={saveJPEG}
                  />

                  <SaveButton
                    icon={<Globe size={17} />}
                    label="HTML"
                    onClick={saveHTML}
                  />

                  <SaveButton
                    icon={<FileJson size={17} />}
                    label="JSON"
                    onClick={saveJSON}
                  />

                  <SaveButton
                    icon={<Database size={17} />}
                    label="BSON"
                    onClick={saveBSON}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = {
  app: {
    minHeight: "100vh",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  header: {
    padding: "20px 8%",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logoTitle: {
    margin: 0,
    fontSize: "24px",
  },

  logoSubtitle: {
    margin: "4px 0 0",
  },

  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 20px 70px",
  },

  hero: {
    textAlign: "center",
    marginBottom: "40px",
  },

  heroTitle: {
    fontSize: "42px",
    lineHeight: "1.15",
    marginBottom: "18px",
  },

  heroText: {
    maxWidth: "700px",
    margin: "0 auto",
    color: "#667085",
    fontSize: "18px",
    lineHeight: "1.6",
  },

  card: {
    borderRadius: "18px",
    padding: "28px",
    marginBottom: "24px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)",
  },

  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  description: {
    lineHeight: "1.5",
  },

  textarea: {
    width: "100%",
    minHeight: "220px",
    padding: "18px",
    borderRadius: "12px",
    resize: "vertical",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
    outline: "none",
  },

  buttons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "16px",
  },

  primaryButton: {
    background: "#111827",
    color: "#ffffff",
    border: "none",
    padding: "13px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  secondaryButton: {
    background: "#eef2f7",
    color: "#172033",
    border: "none",
    padding: "13px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
  },

  analysisArea: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "16px",
    marginTop: "20px",
  },

  summaryBox: {
    gridColumn: "1 / -1",
    padding: "20px",
    borderRadius: "12px",
  },

  resultBox: {
    padding: "20px",
    borderRadius: "12px",
  },

  resultHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  emptyBox: {
    marginTop: "20px",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
  },

  saveSection: {
    gridColumn: "1 / -1",
    padding: "22px",
    borderRadius: "14px",
  },

  saveButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "15px",
  },

  saveButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "11px 15px",
    borderRadius: "9px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#172033",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  saveButtonHighContrast: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "11px 15px",
    borderRadius: "9px",
    border: "1px solid #ffffff",
    background: "#000000",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
};

export default App;