import React, { useState } from "react";
import {
  useLuckPick,
  type WheelOption,
} from "../../context/LuckPickContext";

const CustomWheelEditor: React.FC = () => {
  const {
    wheels,
    removedWheels,
    addWheelOption,
    removeWheelOption,
    includeWheelOption,
  } = useLuckPick();
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (!name) return;
    const newOption: WheelOption = {
      id: Date.now().toString(),
      name,
      activities: [],
    };
    addWheelOption(newOption);
    setName("");
  };

  const allOptions = [...wheels, ...removedWheels.filter((r) => !wheels.some((w) => w.id === r.id))];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 400, maxWidth: "100%", margin: "0 auto" }}>
      <details
        className="lp-custom-wheel-editor-details"
        open={false}
        style={{
          width: "100%",
          borderRadius: 12,
          border: "1px solid rgba(148,163,184,0.35)",
          background: "rgba(255,255,255,0.04)",
          padding: "0.55rem 0.65rem",
        }}
      >
        <summary style={{ cursor: "pointer", fontWeight: 900, marginBottom: 8 }}>
          Wheel Options
        </summary>

        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add new wheel option"
            style={{
              flex: 1,
              padding: "0.55rem 0.75rem",
              borderRadius: 10,
              border: "1px solid rgba(148,163,184,0.6)",
              backgroundColor: "rgba(255,255,255,0.06)",
              color: "inherit",
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              padding: "0.55rem 0.85rem",
              borderRadius: 10,
              border: "none",
              background:
                "linear-gradient(135deg, var(--lp-primary), var(--lp-purple))",
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Add
          </button>
        </div>

        {allOptions.length === 0 ? (
          <div style={{ color: "rgba(15,23,42,0.65)" }}>None</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {allOptions.map((opt) => {
              const isRemoved = removedWheels.some((r) => r.id === opt.id);
              return (
              <label
                key={opt.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0.35rem 0.25rem",
                  cursor: "pointer",
                  userSelect: "none",
                  fontWeight: 800,
                }}
              >
                <input
                  type="checkbox"
                  checked={isRemoved}
                  onChange={(e) => {
                    if (e.target.checked) removeWheelOption(opt.id);
                    else includeWheelOption(opt.id);
                  }}
                />
                <span style={isRemoved ? { textDecoration: "line-through", opacity: 0.85 } : undefined}>
                  {opt.name}
                </span>
              </label>
              );
            })}
          </div>
        )}
      </details>
    </div>
  );
};

export default CustomWheelEditor;
