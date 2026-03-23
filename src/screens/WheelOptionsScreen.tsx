import React, { useMemo, useState } from "react";
import { useLuckPick } from "../state/luckpick/useLuckPick";
import type { WheelOption } from "../state/luckpick/luckPickCore";

type WheelOptionsScreenProps = {
  onDone: () => void;
};

const WheelOptionsScreen: React.FC<WheelOptionsScreenProps> = ({ onDone }) => {
  const {
    wheels,
    removedWheels,
    addWheelOption,
    removeWheelOption,
    includeWheelOption,
  } = useLuckPick();

  const [name, setName] = useState("");

  const allOptions = useMemo(() => {
    const removedIds = new Set(wheels.map((w) => w.id));
    const uniqueRemoved = removedWheels.filter((r) => !removedIds.has(r.id));
    return [...wheels, ...uniqueRemoved];
  }, [wheels, removedWheels]);

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newOption: WheelOption = {
      id: Date.now().toString(),
      name: trimmed,
      activities: [],
    };
    addWheelOption(newOption);
    setName("");
  };

  return (
    <div className="lp-options-overlay">
      <div className="lp-options-screen">
        <div className="lp-options-header">
          <div className="lp-options-title">Wheel Options</div>
          <button type="button" className="lp-options-done" onClick={onDone}>
            DONE
          </button>
        </div>

        <div className="lp-options-body">
          <div className="lp-options-addRow">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Add new wheel option"
              className="lp-options-input"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
            />
            <button
              type="button"
              className="lp-options-addButton"
              onClick={handleAdd}
            >
              Add
            </button>
          </div>

          <div className="lp-options-list">
            {allOptions.length === 0 ? (
              <div className="lp-options-empty">No options available</div>
            ) : (
              allOptions.map((opt) => {
                const isRemoved = removedWheels.some((r) => r.id === opt.id);
                const checked = !isRemoved;

                return (
                  <label key={opt.id} className="lp-options-row">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) includeWheelOption(opt.id);
                        else removeWheelOption(opt.id);
                      }}
                    />
                    <span className="lp-options-rowLabel">{opt.name}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WheelOptionsScreen;
