import React from "react";

export type FooterProps = {
  onGoBack?: () => void;
};

export const Footer: React.FC<FooterProps> = ({ onGoBack }) => {
  if (!onGoBack) return null;

  return (
    <footer className="lp-footer">
      <div className="lp-footer__inner">
        <button type="button" className="lp-footer__link" onClick={onGoBack}>
          Go Back
        </button>
      </div>
    </footer>
  );
};
