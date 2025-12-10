// EditorShell.jsx
import React, { useState } from "react";
import { FiType, FiUploadCloud, FiImage } from "react-icons/fi";

export default function EditorShell({ children }) {
  const [activeTool, setActiveTool] = useState("uploads"); // "text" | "uploads" | "graphics"

  return (
    <div className="editor-shell">
      {/* LEFT TOOL RAIL */}
      <aside className="tool-rail">
        <ToolButton
          icon={<FiType size={18} />}
          label="Text"
          active={activeTool === "text"}
          onClick={() => setActiveTool("text")}
        />
        <ToolButton
          icon={<FiUploadCloud size={18} />}
          label="Uploads"
          active={activeTool === "uploads"}
          onClick={() => setActiveTool("uploads")}
        />
        <ToolButton
          icon={<FiImage size={18} />}
          label="Graphics"
          active={activeTool === "graphics"}
          onClick={() => setActiveTool("graphics")}
        />
      </aside>

      {/* SIDE PANEL (changes with active tool) */}
      <aside className="side-panel">
        {activeTool === "uploads" && <UploadsPanel />}
        {activeTool === "text" && <TextPanel />}
        {activeTool === "graphics" && <GraphicsPanel />}
      </aside>

      {/* CANVAS AREA */}
      <main className="canvas-area">
        {children /* your Fabric canvas goes here */}
      </main>
    </div>
  );
}

function ToolButton({ icon, label, active, onClick }) {
  return (
    <button
      className={`tool-button ${active ? "tool-button-active" : ""}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Simple placeholder panels:

function UploadsPanel() {
  return (
    <div className="panel-inner">
      <h3>Uploads</h3>
      <button className="primary-btn">Upload from this device</button>

      <p className="panel-caption">Recently uploaded</p>
      <div className="thumb-grid">
        {/* map your uploaded images here */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="thumb-box">
            {/* <img src={...} alt="" /> */}
          </div>
        ))}
      </div>
    </div>
  );
}

function TextPanel() {
  return (
    <div className="panel-inner">
      <h3>Text</h3>
      <button className="primary-btn">Add text</button>
    </div>
  );
}

function GraphicsPanel() {
  return (
    <div className="panel-inner">
      <h3>Graphics</h3>
      <p className="panel-caption">Coming soon…</p>
    </div>
  );
}
    