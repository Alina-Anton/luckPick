import React from "react";
import type { WheelSegmentData } from "../Wheel/Wheel";

interface SegmentEditorProps {
  segment: WheelSegmentData;
  onChange: (segment: WheelSegmentData) => void;
  onRemove: () => void;
}

export const SegmentEditor: React.FC<SegmentEditorProps> = ({
  segment,
  onChange,
  onRemove,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 110px auto",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        value={segment.label}
        onChange={(e) => onChange({ ...segment, label: e.target.value })}
        placeholder="Label"
        style={{
          padding: "0.4rem 0.55rem",
          borderRadius: "0.5rem",
          border: "1px solid rgba(148,163,184,0.6)",
          backgroundColor: "#020617",
          color: "#e5e7eb",
          fontSize: "0.85rem",
        }}
      />
      <input
        type="color"
        value={segment.color ?? "#0ea5e9"}
        onChange={(e) => onChange({ ...segment, color: e.target.value })}
        style={{ width: "100%", height: "32px", borderRadius: "0.5rem", border: "none" }}
      />
      <button
        type="button"
        onClick={onRemove}
        style={{
          padding: "0.35rem 0.75rem",
          borderRadius: "999px",
          border: "1px solid rgba(239,68,68,0.7)",
          backgroundColor: "transparent",
          color: "#fecaca",
          fontSize: "0.8rem",
          cursor: "pointer",
        }}
      >
        Remove
      </button>
    </div>
  );
};

