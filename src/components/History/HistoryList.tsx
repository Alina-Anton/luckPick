import React from "react";
import { useLuckPick } from "../../context/LuckPickContext";

export type HistoryEntry = { label: string; timestamp: string };

const HistoryList: React.FC = () => {
  const { history } = useLuckPick();

  if (!history.length) {
    return null;
  }

  return (
    <ul>
      {history.map((item) => (
        <li key={item.id}>
          {item.optionId} &rarr; {item.activityId} (
          {new Date(item.timestamp).toLocaleDateString()})
        </li>
      ))}
    </ul>
  );
};

export default HistoryList;

