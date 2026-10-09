import { mulberry32 } from './random';
import { DEMO_NOW_HOUR, dayFactor, stormOf } from './weather';
import type { HourPoint } from './types';

export const SUNRISE = 6 + 20 / 60;
export const SUNSET = 21 + 25 / 60;
// Tuned so a 6 kWp roof gives roughly 38-41 kWh on a clear June day.
const PEAK_YIELD = 0.78;

export function clearSky(kWp: number, hour: number): number {
  const t = hour + 0.5;
  if (t < SUNRISE || t > SUNSET) return 0;
  const x = Math.sin((Math.PI * (t - SUNRISE)) / (SUNSET - SUNRISE));
  return kWp * PEAK_YIELD * Math.pow(x, 1.3);
}

function intraday(dayIdx: number, hour: number): number {
  return stormOf(dayIdx) && hour >= 15 && hour < 18 ? 0.6 : 1;
}

export function expectedKwh(kWp: number, dayIdx: number, hour: number): number {
  return clearSky(kWp, hour) * dayFactor(dayIdx) * intraday(dayIdx, hour);
}

function noise(seed: number, dayIdx: number, hour: number): number {
  return 1 + (mulberry32(seed * 7919 + (dayIdx + 400) * 37 + hour)() * 2 - 1) * 0.06;
}

export function actualKwh(kWp: number, perf: number, seed: number, dayIdx: number, hour: number) {
  if (perf === 0) return 0;
  return expectedKwh(kWp, dayIdx, hour) * perf * noise(seed, dayIdx, hour);
}

export function forecastKwh(kWp: number, perf: number, dayIdx: number, hour: number): number {
  return expectedKwh(kWp, dayIdx, hour) * perf;
}

export function dailyExpected(kWp: number, dayIdx: number): number {
  let sum = 0;
  for (let h = 0; h < 24; h++) sum += expectedKwh(kWp, dayIdx, h);
  return sum;
}

export function dailyForecast(kWp: number, perf: number, dayIdx: number): number {
  return dailyExpected(kWp, dayIdx) * perf;
}

export function dailyActual(kWp: number, perf: number, seed: number, dayIdx: number): number {
  let sum = 0;
  for (let h = 0; h < 24; h++) sum += actualKwh(kWp, perf, seed, dayIdx, h);
  return sum;
}

export function actualSoFar(kWp: number, perf: number, seed: number): number {
  let sum = 0;
  for (let h = 0; h < DEMO_NOW_HOUR; h++) sum += actualKwh(kWp, perf, seed, 0, h);
  return sum;
}

export function bandFactors(daysAhead: number): { lo: number; hi: number } {
  const extra = Math.max(0, daysAhead - 1) * 0.03;
  return { lo: 0.85 - extra, hi: 1.1 + extra };
}

export function todayCurve(kWp: number, perf: number, seed: number): HourPoint[] {
  const points: HourPoint[] = [];
  for (let hour = 0; hour < 24; hour++) {
    const p: HourPoint = { hour, expectedKwh: expectedKwh(kWp, 0, hour) };
    if (hour < DEMO_NOW_HOUR) p.actualKwh = actualKwh(kWp, perf, seed, 0, hour);
    if (hour === DEMO_NOW_HOUR - 1) p.forecastKwh = p.actualKwh;
    if (hour >= DEMO_NOW_HOUR) p.forecastKwh = forecastKwh(kWp, perf, 0, hour);
    points.push(p);
  }
  return points;
}
