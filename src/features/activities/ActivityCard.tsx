import React, { useRef, useState } from "react";
import { useLuckPick } from "../../state/luckpick/useLuckPick";

const SWIPE_THRESHOLD_PX = 50;

const ActivityCard: React.FC = () => {
  const { selectedActivity, nextActivity } = useLuckPick();
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
      key={selectedActivity.id}
      className="activity-card activity-card--choicePulseIn"
      style={style}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="activity-card__titleRow">
        <h2 className="activity-card__title">{selectedActivity.name}</h2>
        <button
          type="button"
          className="activity-card__button activity-card__button--next"
          onClick={nextActivity}
          aria-label="Next Activity"
        >
          <span className="activity-card__arrow" aria-hidden="true">
            &gt;
          </span>
        </button>
      </div>
      <p className="activity-card__hint">
        Swipe left or right to shuffle activities
      </p>
    </div>
  );
};

export default ActivityCard;
