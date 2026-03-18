import React from "react";

export const Footer: React.FC<{ onCustomize?: () => void }> = ({ onCustomize }) => {
  return (
    <footer
      style={{
        padding: "0.75rem 1.5rem 1.25rem",
        fontSize: "0.8rem",
        color: "var(--lp-text-secondary)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderTop: "1px solid var(--lp-border)",
        marginTop: "auto",
      }}
    >
      <span
        role={onCustomize ? "button" : undefined}
        tabIndex={onCustomize ? 0 : undefined}
        onClick={onCustomize}
        onKeyDown={(e) => {
          if (!onCustomize) return;
          if (e.key === "Enter" || e.key === " ") onCustomize();
        }}
        style={{
          cursor: onCustomize ? "pointer" : "default",
          color: "var(--lp-text-secondary)",
          textDecoration: onCustomize ? "underline" : "none",
        }}
        aria-label="Customize your wheel anytime"
      >
        Customize your wheel anytime
      </span>
    </footer>
  );
};

