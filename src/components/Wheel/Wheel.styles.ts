export const wheelContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
};

export const spinButton: React.CSSProperties = {
  padding: "0.5rem 1.25rem",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(135deg, #ff8a00, #e52e71)",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

export const wheel: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
  gap: "0.75rem",
  width: "100%",
  maxWidth: "480px",
};

export const segment: React.CSSProperties = {
  padding: "0.75rem",
  borderRadius: "0.75rem",
  backgroundColor: "#222",
  color: "#fff",
  textAlign: "center",
};

export const segmentLabel: React.CSSProperties = {
  fontSize: "0.9rem",
  fontWeight: 500,
};

