const GRAMS_PER_LITER_WATER = 1000;

function toFiniteNumber(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Ratio is interpreted as grams of water per gram of coffee (e.g. 16 means 16:1).
 * Liters are converted using 1 L water ≈ 1000 g.
 */
export function calculateCoffee(liters: number, ratio: number): number {
  const l = toFiniteNumber(liters);
  const r = toFiniteNumber(ratio);
  if (!(l > 0) || !(r > 0)) return NaN;
  return (l * GRAMS_PER_LITER_WATER) / r;
}

export function calculateWater(grams: number, ratio: number): number {
  const g = toFiniteNumber(grams);
  const r = toFiniteNumber(ratio);
  if (!(g > 0) || !(r > 0)) return NaN;
  return (g * r) / GRAMS_PER_LITER_WATER;
}

export function calculateRatio(liters: number, grams: number): number {
  const l = toFiniteNumber(liters);
  const g = toFiniteNumber(grams);
  if (!(l > 0) || !(g > 0)) return NaN;
  return (l * GRAMS_PER_LITER_WATER) / g;
}

