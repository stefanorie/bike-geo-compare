/** Rounds to 1 decimal and drops trailing ".0", avoiding floating-point artifacts like -17.600000000000023. */
export function formatDelta(delta: number): string {
  const rounded = Math.round(delta * 10) / 10;
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
}
