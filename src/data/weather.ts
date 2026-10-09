import { SEED, mulberry32 } from './random';
import type { Weather } from './types';

export const DEMO_DATE = '2025-06-18';
export const DEMO_NOW_HOUR = 11;

const RANGE: Record<Weather, [number, number]> = {
  sun: [0.92, 1],
  partly: [0.6, 0.8],
  cloud: [0.3, 0.5],
  rain: [0.15, 0.3],
};

interface Scenario {
  weather: Weather;
  stormRisk?: boolean;
}

// Day 0 is Wednesday 18 June 2025. The hail warning falls on Thursday (day 1).
export const SCENARIO: Scenario[] = [
  { weather: 'sun' },
  { weather: 'rain', stormRisk: true },
  { weather: 'partly' },
  { weather: 'partly' },
  { weather: 'sun' },
  { weather: 'sun' },
  { weather: 'sun' },
];

export function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function dateOf(dayIdx: number): string {
  return addDays(DEMO_DATE, dayIdx);
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function weekday(iso: string, long = false): string {
  const idx = new Date(`${iso}T12:00:00Z`).getUTCDay();
  return long ? WEEKDAYS_LONG[idx] : WEEKDAYS[idx];
}

export function shortDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

function pastWeather(dayIdx: number): Weather {
  const r = mulberry32(SEED + 7919 * (dayIdx + 200))();
  if (r < 0.6) return 'sun';
  if (r < 0.85) return 'partly';
  if (r < 0.95) return 'cloud';
  return 'rain';
}

export function weatherOf(dayIdx: number): Weather {
  if (dayIdx >= 0 && dayIdx < SCENARIO.length) return SCENARIO[dayIdx].weather;
  if (dayIdx < 0) return pastWeather(dayIdx);
  return 'sun';
}

export function stormOf(dayIdx: number): boolean {
  return Boolean(SCENARIO[dayIdx]?.stormRisk);
}

export function dayFactor(dayIdx: number): number {
  const [lo, hi] = RANGE[weatherOf(dayIdx)];
  return lo + (hi - lo) * mulberry32(SEED * 3 + dayIdx * 131 + 17)();
}
