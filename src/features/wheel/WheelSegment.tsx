import React from "react";
import * as styles from "./Wheel.styles";
import type { WheelSegmentData } from "./Wheel";

interface WheelSegmentProps {
  segment: WheelSegmentData;
}

export const WheelSegment: React.FC<WheelSegmentProps> = ({ segment }) => {
  return (
    <div style={{ ...styles.segment, backgroundColor: segment.color ?? styles.segment.backgroundColor }}>
      <span style={styles.segmentLabel}>{segment.label}</span>
    </div>
  );
}

