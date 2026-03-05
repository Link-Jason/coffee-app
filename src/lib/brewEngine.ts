const GRAMS_PER_LITER_WATER = 1000;

function toFiniteNumber(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : NaN;
}

// Mode 1: Water (L) -> Coffee (g)
export function calculateCoffee(liters: number, ratio: number): number {
  const l = toFiniteNumber(liters);
  const r = toFiniteNumber(ratio);
  if (!(l > 0) || !(r > 0)) return NaN;
  return (l * GRAMS_PER_LITER_WATER) / r;
}

// Mode 2: Coffee (g) -> Water (L)
export function calculateWater(grams: number, ratio: number): number {
  const g = toFiniteNumber(grams);
  const r = toFiniteNumber(ratio);
  if (!(g > 0) || !(r > 0)) return NaN;
  const liters = (g * r) / GRAMS_PER_LITER_WATER;
  return parseFloat(liters.toFixed(2)); 
}