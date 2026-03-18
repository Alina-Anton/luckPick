import React, { useRef, useState } from "react";
import { useLuckPick } from "../../context/LuckPickContext";

const SWIPE_THRESHOLD_PX = 50;

const ActivityCard: React.FC = () => {
  const { selectedActivity, nextActivity, addHistoryItem } = useLuckPick();
  const [isSwiping, setIsSwiping] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (!selectedActivity) {
    return null;
  }

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    setIsSwiping(true);
  };

  const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX.current == null) return;
    const currentX = e.touches[0].clientX;
    setOffsetX(currentX - touchStartX.current);
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (Math.abs(offsetX) > SWIPE_THRESHOLD_PX) {
      // Swipe left or right -> show next activity
      nextActivity();
    }
    setIsSwiping(false);
    setOffsetX(0);
    touchStartX.current = null;
  };

  const style: React.CSSProperties = {
    transform: `translateX(${offsetX}px)`,
    transition: isSwiping ? "none" : "transform 0.2s ease-out",
  };

  return (
    <div
      className="activity-card"
      style={style}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h2 className="activity-card__title">{selectedActivity.name}</h2>
      <div className="activity-card__actions">
        <button className="activity-card__button activity-card__button--secondary" onClick={nextActivity}>
          Next Activity
        </button>
        <button
          className="activity-card__button activity-card__button--primary"
          onClick={() => addHistoryItem(selectedActivity.id)}
        >
          Done / Save
        </button>
      </div>
      <p className="activity-card__hint">Swipe left or right to shuffle activities</p>
    </div>
  );
};

export default ActivityCard;

