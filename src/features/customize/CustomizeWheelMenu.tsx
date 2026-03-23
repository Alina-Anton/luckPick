import React, { useMemo, useState } from "react";
import { useLuckPick } from "../../state/luckpick/useLuckPick";

type CustomizeWheelMenuProps = {
  onDone: () => void;
};

const SECTION_COLORS = [
  "linear-gradient(135deg, rgba(255, 0, 110, 0.88) 0%, rgba(237, 4, 20, 0.7) 60%)",
  "linear-gradient(135deg, rgba(223, 16, 164, 0.94) 0%, rgba(255, 0, 128, 0.9) 55%)",
  "linear-gradient(135deg, rgba(251, 138, 0, 0.92) 0%, rgba(252, 74, 15, 0.66) 55%)",
  "linear-gradient(135deg, rgba(46, 196, 182, 0.92) 0%, rgba(76, 201, 240, 0.82) 100%)",
  "linear-gradient(135deg, rgba(131, 56, 236, 0.82) 0%, rgba(200, 6, 151, 0.78) 60%)",
  "linear-gradient(135deg, rgba(58, 134, 255, 0.92) 0%, rgba(15, 203, 245, 0.78) 70%)",
  "linear-gradient(135deg, rgba(131, 56, 236, 0.78) 0%, rgba(193, 24, 244, 0.86) 55%)",
];

type IconId =
  | "coffee"
  | "house"
  | "leaf"
  | "phone"
  | "spark"
  | "palette"
  | "yoga"
  | "book"
  | "calendar"
  | "default";

const iconIdForOptionName = (name: string): IconId => {
  const n = name.toLowerCase();
  if (n.includes("indoor")) return "house";
  if (n.includes("chill") || n.includes("drink")) return "coffee";
  if (n.includes("outdoor")) return "leaf";
  if (n.includes("social")) return "phone";
  // "spirit" + legacy "spiritual"
  if (n.includes("spirit")) return "spark";
  // "creative" + legacy "artistic"; avoid matching unrelated words via bare "art"
  if (n.includes("artistic") || n.includes("creative")) return "palette";
  // "care" (short label) + legacy "self-care"
  if (n.includes("self-care") || n === "care") return "yoga";
  // "learn" + legacy "learning"
  if (n.includes("learning") || n === "learn") return "book";
  // "plan" + legacy "planning"
  if (n.includes("planning") || n === "plan") return "calendar";
  return "default";
};

const OutlineIcon: React.FC<{ id: IconId; className?: string }> = ({
  id,
  className,
}) => {
  const common = {
    fill: "none",
    stroke: "rgba(255,255,255,0.92)",
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (id) {
    case "coffee":
      return (
        <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
          <path {...common} d="M18 26h28v16c0 9-7 16-14 16s-14-7-14-16V26z" />
          <path {...common} d="M46 32h8c5 0 8 4 8 7s-3 7-8 7h-8" />
          <path {...common} d="M22 30h20" />
          <path {...common} d="M26 16c-3 4-3 7 0 11" />
          <path {...common} d="M34 16c-3 4-3 7 0 11" />
          <path {...common} d="M42 16c-3 4-3 7 0 11" />
          <path {...common} d="M18 54h28" />
        </svg>
      );
    case "house":
      return (
        <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
          <path {...common} d="M14 28L32 14l18 14" />
          <path {...common} d="M18 26v26h28V26" />
          <path {...common} d="M28 52V38h8v14" />
        </svg>
      );
    case "leaf":
      return (
        <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
          <path {...common} d="M32 20a12 12 0 1 0 0.01 0z" />
          <path {...common} d="M32 10v6" />
          <path {...common} d="M32 48v6" />
          <path {...common} d="M10 32h6" />
          <path {...common} d="M48 32h6" />
          <path {...common} d="M18 18l4 4" />
          <path {...common} d="M42 42l4 4" />
          <path {...common} d="M46 18l-4 4" />
          <path {...common} d="M18 46l4-4" />
        </svg>
      );
    case "phone":
      return (
        <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
          <path {...common} d="M18 20a6 6 0 1 0 0.01 0z" />
          <path {...common} d="M32 20a6 6 0 1 0 0.01 0z" />
          <path {...common} d="M46 20a6 6 0 1 0 0.01 0z" />

          <path {...common} d="M10 34h14v22h-6V44H16v12h-6V34z" />
          <path {...common} d="M25 34h14v22h-6V44h-2v12h-6V34z" />
          <path {...common} d="M40 34h14v22h-6V44h-2v12h-6V34z" />
        </svg>
      );
    case "spark":
      return (
        <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
          <path
            {...common}
            d="M32 10l4 16 16 4-16 4-4 16-4-16-16-4 16-4 4-16z"
          />
          <path {...common} d="M48 44l1 7 7 1-7 1-1 7-1-7-7-1 7-1 1-7z" />
        </svg>
      );
    case "palette":
      return (
        <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
          <path {...common} d="M18 18h28v34H18V18z" />
          <path {...common} d="M22 22h20v26H22V22z" />

          <path {...common} d="M46 32a4 4 0 1 0 0.01 0z" />

          <path {...common} d="M24 48l8-14 6 10 4-6 4 10H24z" />
        </svg>
      );
    case "yoga":
      return (
        <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
          <path
            {...common}
            d="M32 50l-14-14c-3-3-3-8 0-11s8-3 11 0l3 3 3-3c3-3 8-3 11 0s3 8 0 11L32 50z"
          />
        </svg>
      );
    case "book":
      return (
        <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
          <path {...common} d="M18 22c4-3 10-3 14 0v30c-4-3-10-3-14 0V22z" />
          <path {...common} d="M46 22c-4-3-10-3-14 0v30c4-3 10-3 14 0V22z" />
          <path {...common} d="M32 22v30" />

          <path {...common} d="M24 30h10" />
          <path {...common} d="M24 36h10" />
        </svg>
      );
    case "calendar":
      return (
        <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
          <path {...common} d="M18 18h28v34H18V18z" />
          <path {...common} d="M22 12v10" />
          <path {...common} d="M42 12v10" />
          <path {...common} d="M18 26h28" />
          <path {...common} d="M26 34h.01" />
          <path {...common} d="M34 34h.01" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
          <path {...common} d="M24 18h16v28H24V18z" />
          <path {...common} d="M26 48h12" />
        </svg>
      );
  }
};

const CustomizeWheelMenu: React.FC<CustomizeWheelMenuProps> = ({ onDone }) => {
  const {
    wheels,
    removedActivitiesByOptionId,
    addWheelActivity,
    removeWheelActivity,
    includeWheelActivity,
  } = useLuckPick();

  const totalItems = useMemo(
    () => wheels.reduce((sum, w) => sum + (w.activities?.length ?? 0), 0),
    [wheels],
  );

  const [flippedOptionId, setFlippedOptionId] = useState<string | null>(null);
  const [newActivityNameByOptionId, setNewActivityNameByOptionId] = useState<
    Record<string, string>
  >({});

  return (
    <div className="lp-customize-overlay">
      <div className="lp-customize-phone">
        <div className="lp-customize-subHeader">
          <div className="lp-customize-subHeaderLeft">{totalItems} Items</div>
          <div
            className="lp-customize-done"
            role="button"
            tabIndex={0}
            onClick={onDone}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onDone();
            }}
          >
            DONE
          </div>
        </div>

        <div className="lp-customize-scroll">
          <div className="lp-customize-cardsGrid">
            {wheels.map((w, idx) => {
              const sectionBg = SECTION_COLORS[idx % SECTION_COLORS.length];
              const iconId = iconIdForOptionName(w.name);
              const isFlipped = w.id === flippedOptionId;

              const removedForOption = removedActivitiesByOptionId[w.id] ?? [];
              const allActivities = [
                ...w.activities,
                ...removedForOption.filter(
                  (a) => !w.activities.some((inc) => inc.id === a.id),
                ),
              ];

              return (
                <div key={w.id} className="lp-customize-cardCell">
                  <div
                    className={`lp-customize-cardInner ${
                      isFlipped ? "lp-customize-cardInner--flipped" : ""
                    }`}
                  >
                    <div
                      className="lp-customize-cardFace lp-customize-cardFace--front"
                      style={{ background: sectionBg }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Flip ${w.name}`}
                      onClick={() =>
                        setFlippedOptionId(isFlipped ? null : w.id)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setFlippedOptionId(isFlipped ? null : w.id);
                        }
                      }}
                    >
                      <div className="lp-customize-cardFrontInner">
                        <OutlineIcon
                          id={iconId}
                          className="lp-customize-cardIconSvg"
                        />
                        <div className="lp-customize-cardFrontTitle">
                          {w.name}
                        </div>
                      </div>
                    </div>

                    <div
                      className="lp-customize-cardFace lp-customize-cardFace--back"
                      style={{ background: sectionBg }}
                      onClick={() => setFlippedOptionId(null)}
                    >
                      <div className="lp-customize-cardBackInner">
                        <div className="lp-customize-subList">
                          {allActivities.map((a) => {
                            const isIncluded = w.activities.some(
                              (inc) => inc.id === a.id,
                            );

                            return (
                              <label
                                key={a.id}
                                className="lp-customize-subRow"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={isIncluded}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      includeWheelActivity(w.id, a.id);
                                    } else {
                                      removeWheelActivity(w.id, a.id);
                                    }
                                  }}
                                />
                                <span
                                  className="lp-customize-subCheck"
                                  aria-hidden="true"
                                />
                                <span className="lp-customize-subLabel">
                                  {a.name}
                                </span>
                              </label>
                            );
                          })}
                        </div>

                        <div className="lp-customize-addRow">
                          <input
                            className="lp-customize-addInput"
                            value={newActivityNameByOptionId[w.id] ?? ""}
                            onChange={(e) =>
                              setNewActivityNameByOptionId((prev) => ({
                                ...prev,
                                [w.id]: e.target.value,
                              }))
                            }
                            placeholder="Your option"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key !== "Enter") return;
                              const name = (
                                newActivityNameByOptionId[w.id] ?? ""
                              ).trim();
                              if (!name) return;
                              addWheelActivity(w.id, name);
                              setNewActivityNameByOptionId((prev) => ({
                                ...prev,
                                [w.id]: "",
                              }));
                            }}
                          />
                          <button
                            type="button"
                            className="lp-customize-addButton"
                            onClick={(e) => {
                              e.stopPropagation();
                              const name = (
                                newActivityNameByOptionId[w.id] ?? ""
                              ).trim();
                              if (!name) return;
                              addWheelActivity(w.id, name);
                              setNewActivityNameByOptionId((prev) => ({
                                ...prev,
                                [w.id]: "",
                              }));
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeWheelMenu;
