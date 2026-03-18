import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLuckPick } from "../../context/LuckPickContext";

// Used by the (optional) custom wheel editor components.
export type WheelSegmentData = { id: string; label: string; color?: string };

const SPIN_DURATION_MS = 2400;
const FULL_TURNS = 6;
const SEGMENT_START_DEG = -90; // slice 0 starts at 12 o'clock
const POINTER_ANGLE_DEG = -90; // pointer on the left side

// Purple -> light blue only
const SOFT_PALETTE = [
  "#B794F4",
  "#9B5CF6",
  "#A78BFA",
  "#7DD3FC",
  "#60A5FA",
  "#93C5FD",
];

function buildConicGradient(count: number) {
  const slice = 360 / Math.max(1, count);
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const c = SOFT_PALETTE[i % SOFT_PALETTE.length];
    const start = i * slice;
    const end = (i + 1) * slice;
    parts.push(`${c} ${start}deg ${end}deg`);
  }
  return `conic-gradient(from ${SEGMENT_START_DEG}deg, ${parts.join(", ")})`;
}

function buildSeparatorGradient(count: number) {
  const slice = 360 / Math.max(1, count);
  const sep = Math.max(1, slice * 0.06);
  // Transparent everywhere except thin white-ish separator wedges.
  return `repeating-conic-gradient(from ${SEGMENT_START_DEG}deg, rgba(255,255,255,0.85) 0deg ${sep}deg, transparent ${sep}deg ${slice}deg)`;
}

const Wheel: React.FC = () => {
  const { wheels, spinWheel } = useLuckPick();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelDisplayRef = useRef<HTMLDivElement | null>(null);
  const [wheelSizePx, setWheelSizePx] = useState(340);
  const rotationRef = useRef(0);

  useEffect(() => {
    const el = wheelDisplayRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setWheelSizePx(entry.contentRect.width);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  const textMetrics = useMemo(() => {
    if (!wheels.length || wheelSizePx <= 0)
      return { fontSizePx: 16, maxArcWidthPx: 180 };

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return { fontSizePx: 16, maxArcWidthPx: 180 };

    const n = Math.max(1, wheels.length);
    const sliceAngleRad = (Math.PI * 2) / n;
    const labelRadiusPx = wheelSizePx * 0.34;
    const maxArcWidthPx = labelRadiusPx * sliceAngleRad * 0.82;

    const measureTextWidth = (text: string, fontSize: number) => {
      ctx.font = `700 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;
      return ctx.measureText(text).width;
    };

    const computeFontSizeToFit = (text: string, maxWidth: number) => {
      const upper = 26;
      const lower = 10;
      let lo = lower;
      let hi = upper;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        if (measureTextWidth(text, mid) <= maxWidth) lo = mid;
        else hi = mid;
      }
      return lo;
    };

    // Pick the "widest" label to guarantee all labels fit at the same font size.
    const upperProbe = 22;
    ctx.font = `700 ${upperProbe}px system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;
    const widest = wheels.reduce((a, b) => {
      const aw = ctx.measureText(a.name.toUpperCase()).width;
      const bw = ctx.measureText(b.name.toUpperCase()).width;
      return aw >= bw ? a : b;
    });
    const fontSizePx = computeFontSizeToFit(
      widest.name.toUpperCase(),
      maxArcWidthPx,
    );

    return { fontSizePx, maxArcWidthPx };
  }, [wheels, wheelSizePx]);

  const handleSpin = () => {
    if (isSpinning || !wheels.length) return;
    setIsSpinning(true);

    const targetIndex = Math.floor(Math.random() * wheels.length);
    spinWheel(targetIndex);

    const sliceDeg = 360 / wheels.length;
    const jitter = (Math.random() - 0.5) * (sliceDeg * 0.35); // keep a bit of randomness
    const targetCenterDeg =
      SEGMENT_START_DEG + targetIndex * sliceDeg + sliceDeg / 2;

    // Make the selected slice center land exactly on the fixed pointer.
    const current = rotationRef.current;
    const currentNormalized = ((current % 360) + 360) % 360;
    const desiredNormalized =
      (((POINTER_ANGLE_DEG - targetCenterDeg) % 360) + 360) % 360;
    const deltaToDesired = (desiredNormalized - currentNormalized + 360) % 360;

    // Add forward spins so it feels like a real wheel.
    const finalDelta = deltaToDesired + 360 * FULL_TURNS + jitter;
    setRotation((prev) => prev + finalDelta);
    window.setTimeout(() => setIsSpinning(false), SPIN_DURATION_MS);
  };

  return (
    <div className="wheel-container">
      <div className="wheel-wrapper">
        <div
          className="wheel-display"
          ref={wheelDisplayRef}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`
              : "transform 200ms ease-out",
            backgroundImage: `${buildSeparatorGradient(wheels.length)}, ${buildConicGradient(wheels.length)}`,
          }}
        >
          {wheels.map((w, index) => {
            const sliceDeg = 360 / wheels.length;
            const centerDeg =
              SEGMENT_START_DEG + index * sliceDeg + sliceDeg / 2;
            const radiusPx = wheelSizePx * 0.34;
            const { fontSizePx, maxArcWidthPx } = textMetrics;

            return (
              <div
                key={w.id}
                className="wheel-label"
                style={{
                  // Position label along slice center line.
                  // The inner span rotates to follow the slice direction (tangent).
                  transform: `translate(-50%, -50%) rotate(${centerDeg}deg) translateY(-${radiusPx}px)`,
                  fontSize: `${fontSizePx}px`,
                  maxWidth: `${maxArcWidthPx}px`,
                }}
              >
                <span className="wheel-label__text">{w.name}</span>
              </div>
            );
          })}
        </div>
        <div className="wheel-pointer" aria-hidden="true" />
        <div
          className="wheel-center"
          role="button"
          tabIndex={0}
          aria-label="Spin"
          onClick={handleSpin}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleSpin();
          }}
          style={{
            cursor: isSpinning || !wheels.length ? "default" : "pointer",
          }}
        >
          <div className="wheel-center__text">
            {isSpinning ? "Spinning..." : "Spin"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wheel;
