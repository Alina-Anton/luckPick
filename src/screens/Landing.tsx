import React from "react";

interface LandingProps {
  onStart: () => void;
  onCustomize: () => void;
  onWheelOptions: () => void;
}

const Landing: React.FC<LandingProps> = ({
  onStart,
  onCustomize,
  onWheelOptions,
}) => {
  return (
    <main className="lp-landing">
      <div className="lp-landing__content">
        <p className="lp-landing__subtitle">
          <span className="lp-landing__brand">LuckPick</span>
          <br />
          Spin the wheel. Let randomness decide what&apos;s next.
        </p>
        <button
          className="lp-landing__button lp-landing__button--primary"
          onClick={onStart}
        >
          Start spinning
        </button>

        <button
          className="lp-landing__button lp-landing__button--secondary"
          onClick={onWheelOptions}
        >
          Wheel Options
        </button>

        <button
          className="lp-landing__button lp-landing__button--secondary"
          onClick={onCustomize}
        >
          Customize your wheel
        </button>
      </div>
    </main>
  );
};

export default Landing;
