export interface SizingTargets {
  stackMin: number;
  stackMax: number;
  reachMin: number;
  reachMax: number;
}

// Estimates target stack/reach range from body measurements.
// Based on common bike fitting proportions.
export function calcSizingTargets(heightCm: number, inseamCm: number): SizingTargets {
  const torsoLength = heightCm - inseamCm;

  // Stack: roughly 67-70% of inseam in mm
  const stackBase = inseamCm * 6.8;
  // Reach: roughly based on torso + arm length approximation
  const reachBase = (torsoLength * 0.45 + heightCm * 0.1) * 10 * 0.5;

  const tolerance = 15;

  return {
    stackMin: Math.round(stackBase - tolerance),
    stackMax: Math.round(stackBase + tolerance),
    reachMin: Math.round(reachBase - tolerance),
    reachMax: Math.round(reachBase + tolerance),
  };
}
