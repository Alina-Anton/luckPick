import React from "react";

interface LandingProps {
  onStart: () => void;
  onCustomize: () => void;
  onWheelOptions: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart, onCustomize, onWheelOptions }) => {
  return (
    <main className="lp-landing">
      <div className="lp-landing__content">
        <h1 className="lp-landing__title">Ready to Spin?</h1>
        <p className="lp-landing__subtitle">
          LuckPick
          <br />
          Spin the wheel. Let randomness decide your next move.
        </p>
        <button className="lp-landing__button lp-landing__button--primary" onClick={onStart}>
          Start spinning
        </button>

        <button className="lp-landing__button lp-landing__button--secondary" onClick={onWheelOptions}>
          Wheel Options
        </button>

        <button className="lp-landing__button lp-landing__button--secondary" onClick={onCustomize}>
          Customize your wheel
        </button>
      </div>
    </main>
  );
};

export default Landing;
