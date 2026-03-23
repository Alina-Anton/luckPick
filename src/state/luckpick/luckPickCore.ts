import { createContext } from "react";

export type Activity = { id: string; name: string };
export type WheelOption = { id: string; name: string; activities: Activity[] };
export type HistoryItem = {
  id: string;
  optionId: string;
  activityId: string;
  timestamp: number;
  rating?: number;
};

export type LuckPickContextType = {
  wheels: WheelOption[];
  removedWheels: WheelOption[];
  removedActivitiesByOptionId: Record<string, Activity[]>;
  history: HistoryItem[];
  selectedOption?: WheelOption;
  selectedActivity?: Activity;
  spinWheel: (targetIndex?: number) => void;
  nextActivity: () => void;
  addHistoryItem: (activityId: string) => void;
  addWheelOption: (option: WheelOption) => void;
  addWheelActivity: (optionId: string, activityName: string) => void;
  removeWheelOption: (optionId: string) => void;
  includeWheelOption: (optionId: string) => void;
  removeWheelActivity: (optionId: string, activityId: string) => void;
  includeWheelActivity: (optionId: string, activityId: string) => void;
};

export const LuckPickContext = createContext<LuckPickContextType | undefined>(
  undefined,
);
