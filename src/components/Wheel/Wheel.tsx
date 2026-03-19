import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLuckPick } from "../../context/LuckPickContext";

// Used by the (optional) custom wheel editor components.
export type WheelSegmentData = { id: string; label: string; color?: string };

const SPIN_DURATION_MS = 2400;
const FULL_TURNS = 6;
const SEGMENT_START_DEG = -90; // slice 0 starts at 12 o'clock
const POINTER_ANGLE_DEG = -90; // pointer on the left side

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

// Juicy palette: pink, purple, blue, orange
const SOFT_PALETTE = ["#FF1C77", "#C77DFF", "#4CC9F0", "#FF9F1C"];

// Keep label font size consistent regardless of how many options exist.
// We size labels against a fixed reference slice count so the wheel doesn't
// "breathe" when wheels.length changes.
const TEXT_REFERENCE_SLICE_COUNT = 14;

function buildConicGradient(count: number) {
  const slice = 360 / Math.max(1, count);
  const parts: string[] = [];

  // Smooth per-slice gradient: palette[i] -> palette[i+1].
  // Adjacent slices share the same boundary color to avoid seams.
  for (let i = 0; i < count; i++) {
    const c1 = SOFT_PALETTE[i % SOFT_PALETTE.length];
    const c2 = SOFT_PALETTE[(i + 1) % SOFT_PALETTE.length];
    const start = i * slice;
    const end = (i + 1) * slice;

    // conic-gradient interpolates between these stops across the arc.
    parts.push(`${c1} ${start}deg, ${c2} ${end}deg`);
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
  const [showSparkles, setShowSparkles] = useState(false);
  const [sparkles, setSparkles] = useState<
    Array<{
      id: string;
      leftPct: number;
      topPct: number;
      sizePx: number;
      rotateDeg: number;
      delayMs: number;
      durationMs: number;
    }>
  >([]);

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

    const sliceAngleRad = (Math.PI * 2) / TEXT_REFERENCE_SLICE_COUNT;
    const labelRadiusPx = wheelSizePx * 0.34;
    // Allow slightly wider labels so we can render bigger text.
    const maxArcWidthPx = labelRadiusPx * sliceAngleRad * 0.88;

    const measureTextWidth = (text: string, fontSize: number) => {
      ctx.font = `700 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;
      return ctx.measureText(text).width;
    };

    const computeFontSizeToFit = (text: string, maxWidth: number) => {
      const upper = 30;
      const lower = 12;
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

    window.setTimeout(() => {
      setIsSpinning(false);

      // Sparkles when the wheel stops.
      const count = Math.min(40, Math.max(18, Math.round(wheels.length * 2.2)));
      const maxRadiusPct = 46; // fill more of the wheel area
      const next = Array.from({ length: count }).map((_, i) => {
        let dx = 0;
        let dy = 0;
        // Pick a random point inside a circle using rejection sampling.
        do {
          dx = (Math.random() * 2 - 1) * maxRadiusPct;
          dy = (Math.random() * 2 - 1) * maxRadiusPct;
        } while (dx * dx + dy * dy > maxRadiusPct * maxRadiusPct);

        const sizePx = Math.max(
          6,
          Math.round(
            clamp(wheelSizePx * 0.035, 6, 14) * (0.75 + Math.random() * 0.6),
          ),
        );

        return {
          id: `${Date.now()}-${i}`,
          leftPct: 50 + dx,
          topPct: 50 + dy,
          sizePx,
          rotateDeg: Math.round(Math.random() * 360),
          delayMs: Math.round(Math.random() * 220),
          durationMs: 900 + Math.round(Math.random() * 350),
        };
      });

      setSparkles(next);
      setShowSparkles(true);
      window.setTimeout(() => setShowSparkles(false), 1400);
    }, SPIN_DURATION_MS);
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
        {showSparkles && (
          <div className="wheel-sparkles" aria-hidden="true">
            {sparkles.map((s) => (
              <div
                key={s.id}
                className="wheel-sparkle"
                style={
                  {
                    left: `${s.leftPct}%`,
                    top: `${s.topPct}%`,
                    width: `${s.sizePx}px`,
                    height: `${s.sizePx}px`,
                    // CSS vars for the animation.
                    "--spark-rot": `${s.rotateDeg}deg`,
                    "--spark-delay": `${s.delayMs}ms`,
                    "--spark-dur": `${s.durationMs}ms`,
                  } as React.CSSProperties & Record<string, string>
                }
              />
            ))}
          </div>
        )}
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
            {isSpinning ? "Ready?" : "Spin"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wheel;
