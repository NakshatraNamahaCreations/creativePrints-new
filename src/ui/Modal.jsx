// Modal.js
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      aria-modal="true"
      role="dialog"
      style={{
        position: "fixed", inset: 0, display: "grid", placeItems: "center",
        background: "rgba(0,0,0,.5)", padding: 16, zIndex: 9999,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.(); // close on backdrop
      }}
    >
      <div style={{ background: "#fff", borderRadius: 14, padding: 16, maxHeight: "90vh", overflow: "auto" }}>
        {children}
      </div>
    </div>,
    document.body
  );
}
