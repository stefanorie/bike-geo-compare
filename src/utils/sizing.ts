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

  // Reach: primarily driven by height, calibrated against manufacturer size
  // charts (reach ~= height * 1.05 + 199, fit against real geometry data).
  // A small adjustment accounts for a torso longer/shorter than the average
  // proportion (~50.5% of height) for that height.
  const expectedTorsoForHeight = heightCm * 0.505;
  const torsoAdjustment = (torsoLength - expectedTorsoForHeight) * 3;
  const reachBase = heightCm * 1.05 + 199 + torsoAdjustment;

  const tolerance = 15;

  return {
    stackMin: Math.round(stackBase - tolerance),
    stackMax: Math.round(stackBase + tolerance),
    reachMin: Math.round(reachBase - tolerance),
    reachMax: Math.round(reachBase + tolerance),
  };
}
