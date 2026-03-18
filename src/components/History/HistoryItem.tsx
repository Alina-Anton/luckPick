import React from "react";
import type { HistoryEntry } from "./HistoryList";

interface HistoryItemProps {
  entry: HistoryEntry;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ entry }) => {
  return (
    <li
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.85rem",
        padding: "0.35rem 0.5rem",
        borderRadius: "0.5rem",
        backgroundColor: "rgba(15,23,42,0.7)",
      }}
    >
      <span>{entry.label}</span>
      <span style={{ color: "#6b7280" }}>{entry.timestamp}</span>
    </li>
  );
};

