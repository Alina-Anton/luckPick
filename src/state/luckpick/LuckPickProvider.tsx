import React, { useState, type ReactNode } from "react";
import {
  LuckPickContext,
  type Activity,
  type WheelOption,
  type HistoryItem,
} from "./luckPickCore";

function createDefaultWheels(): WheelOption[] {
  return [
    {
      id: "1",
      name: "Indoor",
      activities: [
        { id: "a1", name: "Movie Night" },
        { id: "a2", name: "Home Workout" },
        { id: "a3", name: "Cook something new" },
      ],
    },
    {
      id: "2",
      name: "Outdoor",
      activities: [
        { id: "a4", name: "Nature Walk" },
        { id: "a5", name: "Beach Time" },
        { id: "a6", name: "Bike Ride" },
        { id: "a7", name: "City Explore" },
      ],
    },
    {
      id: "3",
      name: "Social",
      activities: [
        { id: "a8", name: "Call Friend" },
        { id: "a9", name: "Group Games" },
        { id: "a10", name: "Cafe Visit" },
      ],
    },
    {
      id: "4",
      name: "Spirit",
      activities: [
        { id: "a11", name: "Meditation" },
        { id: "a12", name: "Gratitude" },
        { id: "a13", name: "Calm Music" },
        { id: "a14", name: "Deep Breathing" },
      ],
    },
    {
      id: "5",
      name: "Creative",
      activities: [
        { id: "a15", name: "Sketch Art" },
        { id: "a16", name: "DIY Craft" },
        { id: "a17", name: "Write a Story" },
        { id: "a18", name: "Photo Walk" },
      ],
    },
    {
      id: "6",
      name: "Chill",
      activities: [
        { id: "a19", name: "Power Nap" },
        { id: "a20", name: "Comfort Show" },
        { id: "a21", name: "Read a book" },
        { id: "a22", name: "Do Nothing" },
      ],
    },
    {
      id: "7",
      name: "Care",
      activities: [
        { id: "a23", name: "Skincare" },
        { id: "a24", name: "Take a Bath" },
        { id: "a25", name: "Stretching" },
        { id: "a26", name: "Healthy Snack" },
      ],
    },
    {
      id: "8",
      name: "Learn",
      activities: [
        { id: "a27", name: "Watch Tutorial" },
        { id: "a28", name: "Random Facts" },
        { id: "a29", name: "Skill Practice" },
      ],
    },
    {
      id: "9",
      name: "Plan",
      activities: [
        { id: "a30", name: "Week Plan" },
        { id: "a31", name: "Space Clean" },
        { id: "a32", name: "Goal Setting" },
        { id: "a33", name: "Budget Check" },
      ],
    },
  ];
}

export const LuckPickProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [wheels, setWheels] = useState<WheelOption[]>(() => createDefaultWheels());
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
    if (!selectedOption.activities.length) return;

    const currentIdx = selectedActivity
      ? selectedOption.activities.findIndex((a) => a.id === selectedActivity.id)
      : -1;

    const safeIdx = currentIdx >= 0 ? currentIdx : 0;
    const nextIdx = (safeIdx + 1) % selectedOption.activities.length;
    setSelectedActivity(selectedOption.activities[nextIdx]);
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
      }),
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

        if (
          selectedOption?.id === optionId &&
          selectedActivity?.id === activityId
        ) {
          setSelectedActivity(undefined);
        }
      }

      return nextWheels;
    });
  };

  const includeWheelActivity = (optionId: string, activityId: string) => {
    setRemovedActivitiesByOptionId((prevRemovedMap) => {
      const toInclude = (prevRemovedMap[optionId] ?? []).find(
        (a) => a.id === activityId,
      );
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
        [optionId]: (prevRemovedMap[optionId] ?? []).filter(
          (a) => a.id !== activityId,
        ),
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
