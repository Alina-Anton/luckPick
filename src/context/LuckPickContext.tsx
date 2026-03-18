import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

export type Activity = { id: string; name: string };
export type WheelOption = { id: string; name: string; activities: Activity[] };
export type HistoryItem = {
  id: string;
  optionId: string;
  activityId: string;
  timestamp: number;
  rating?: number;
};

type LuckPickContextType = {
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

const LuckPickContext = createContext<LuckPickContextType | undefined>(
  undefined,
);

export const useLuckPick = () => {
  const ctx = useContext(LuckPickContext);
  if (!ctx) {
    throw new Error("useLuckPick must be used within LuckPickProvider");
  }
  return ctx;
};

export const LuckPickProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wheels, setWheels] = useState<WheelOption[]>([]);
  const [removedWheels, setRemovedWheels] = useState<WheelOption[]>([]);
  const [removedActivitiesByOptionId, setRemovedActivitiesByOptionId] = useState<
    Record<string, Activity[]>
  >({});
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<
    WheelOption | undefined
  >();
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >();

  useEffect(() => {
    const defaultWheel: WheelOption[] = [
      {
        id: "1",
        name: "Indoor",
        activities: [
          { id: "a1", name: "Relax at home" },
          { id: "a2", name: "Indoor workout" },
        ],
      },
      {
        id: "2",
        name: "Autdoor",
        activities: [
          { id: "a3", name: "Short outdoor walk" },
          { id: "a4", name: "Fresh air break" },
        ],
      },
      {
        id: "3",
        name: "Social",
        activities: [
          { id: "a5", name: "Message a friend" },
          { id: "a6", name: "Quick catch-up" },
        ],
      },
      {
        id: "4",
        name: "Spiritual",
        activities: [
          { id: "a7", name: "Meditate 5 minutes" },
          { id: "a8", name: "Gratitude journaling" },
        ],
      },
      {
        id: "5",
        name: "Artistic",
        activities: [
          { id: "a9", name: "Draw something" },
          { id: "a10", name: "Creative sketch session" },
        ],
      },
      {
        id: "6",
        name: "Chill",
        activities: [
          { id: "a11", name: "Chill music + breathe" },
          { id: "a12", name: "Unwind for a bit" },
        ],
      },
      {
        id: "7",
        name: "Self-Care",
        activities: [
          { id: "a13", name: "Take a quick stretch" },
          { id: "a14", name: "Skincare routine" },
        ],
      },
      {
        id: "8",
        name: "Learning",
        activities: [
          { id: "a15", name: "Watch a tutorial" },
          { id: "a16", name: "Read one chapter" },
        ],
      },
      {
        id: "9",
        name: "Planning",
        activities: [
          { id: "a17", name: "Make a quick plan" },
          { id: "a18", name: "Organize your day" },
        ],
      },
    ];
    setWheels(defaultWheel);
    setRemovedWheels([]);
    setRemovedActivitiesByOptionId({});
  }, []);

  const spinWheel = (targetIndex?: number) => {
    if (!wheels.length) return;
    const index =
      targetIndex == null
        ? Math.floor(Math.random() * wheels.length)
        : Math.min(Math.max(0, Math.floor(targetIndex)), wheels.length - 1);
    const option = wheels[index];
    setSelectedOption(option);
    setSelectedActivity(
      option.activities[Math.floor(Math.random() * option.activities.length)],
    );
  };

  const nextActivity = () => {
    if (!selectedOption) return;
    const next =
      selectedOption.activities[
        Math.floor(Math.random() * selectedOption.activities.length)
      ];
    setSelectedActivity(next);
  };

  const addHistoryItem = (activityId: string) => {
    if (!selectedOption) return;
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      optionId: selectedOption.id,
      activityId,
      timestamp: Date.now(),
    };
    setHistory((prev) => [...prev, newItem]);
  };

  const addWheelOption = (option: WheelOption) => {
    setWheels((prev) => [...prev, option]);
  };

  const addWheelActivity = (optionId: string, activityName: string) => {
    const trimmed = activityName.trim();
    if (!trimmed) return;

    setWheels((prev) =>
      prev.map((opt) => {
        if (opt.id !== optionId) return opt;
        return {
          ...opt,
          activities: [
            ...opt.activities,
            {
              id: Date.now().toString(),
              name: trimmed,
            },
          ],
        };
      })
    );
  };

  const removeWheelOption = (optionId: string) => {
    setWheels((prevWheels) => {
      const toRemove = prevWheels.find((o) => o.id === optionId);
      if (!toRemove) return prevWheels;

      setRemovedWheels((prevRemoved) => {
        if (prevRemoved.some((o) => o.id === optionId)) return prevRemoved;
        return [...prevRemoved, toRemove];
      });

      if (selectedOption?.id === optionId) {
        setSelectedOption(undefined);
        setSelectedActivity(undefined);
      }

      return prevWheels.filter((o) => o.id !== optionId);
    });
  };

  const includeWheelOption = (optionId: string) => {
    setRemovedWheels((prevRemoved) => {
      const toInclude = prevRemoved.find((o) => o.id === optionId);
      if (!toInclude) return prevRemoved;

      setWheels((prevWheels) => {
        if (prevWheels.some((o) => o.id === optionId)) return prevWheels;
        return [...prevWheels, toInclude];
      });
      return prevRemoved.filter((o) => o.id !== optionId);
    });
  };

  const removeWheelActivity = (optionId: string, activityId: string) => {
    setWheels((prevWheels) => {
      let movedActivity: Activity | undefined;

      const nextWheels = prevWheels.map((opt) => {
        if (opt.id !== optionId) return opt;
        const toRemove = opt.activities.find((a) => a.id === activityId);
        if (!toRemove) return opt;
        movedActivity = toRemove;
        return {
          ...opt,
          activities: opt.activities.filter((a) => a.id !== activityId),
        };
      });

      if (movedActivity) {
        setRemovedActivitiesByOptionId((prev) => {
          const prevList = prev[optionId] ?? [];
          if (prevList.some((a) => a.id === movedActivity!.id)) return prev;
          return { ...prev, [optionId]: [...prevList, movedActivity!] };
        });

        if (selectedOption?.id === optionId && selectedActivity?.id === activityId) {
          setSelectedActivity(undefined);
        }
      }

      return nextWheels;
    });
  };

  const includeWheelActivity = (optionId: string, activityId: string) => {
    setRemovedActivitiesByOptionId((prevRemovedMap) => {
      const toInclude = (prevRemovedMap[optionId] ?? []).find((a) => a.id === activityId);
      if (!toInclude) return prevRemovedMap;

      setWheels((prevWheels) => {
        return prevWheels.map((opt) => {
          if (opt.id !== optionId) return opt;
          if (opt.activities.some((a) => a.id === activityId)) return opt;
          return { ...opt, activities: [...opt.activities, toInclude] };
        });
      });

      return {
        ...prevRemovedMap,
        [optionId]: (prevRemovedMap[optionId] ?? []).filter((a) => a.id !== activityId),
      };
    });
  };

  return (
    <LuckPickContext.Provider
      value={{
        wheels,
        removedWheels,
        removedActivitiesByOptionId,
        history,
        selectedOption,
        selectedActivity,
        spinWheel,
        nextActivity,
        addHistoryItem,
        addWheelOption,
        addWheelActivity,
        removeWheelOption,
        includeWheelOption,
        removeWheelActivity,
        includeWheelActivity,
      }}
    >
      {children}
    </LuckPickContext.Provider>
  );
};
