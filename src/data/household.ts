import {
  actualSoFar,
  dailyActual,
  dailyExpected,
  dailyForecast,
  forecastKwh,
  todayCurve,
} from './solar';
import { SCENARIO, dateOf, weatherOf } from './weather';
import type { DayForecast, HourPoint } from './types';

export const household = {
  name: 'Ramon',
  kWp: 6,
  district: 'Sant Martí',
  address: 'Rooftop 6.0 kWp · Barcelona',
  inverterBrand: 'Inverter brand C',
  perfRatio: 0.98,
  seed: 42,
  selfConsumption: 0.45,
  tariffEur: 0.2,
  co2KgPerKwh: 0.25,
};

export function householdToday(): HourPoint[] {
  return todayCurve(household.kWp, household.perfRatio, household.seed);
}

export function householdTodayTotals() {
  const soFar = actualSoFar(household.kWp, household.perfRatio, household.seed);
  const forecastTotal = dailyForecast(household.kWp, household.perfRatio, 0);
  return { soFar, forecastTotal };
}

export function householdWeek(): DayForecast[] {
  return SCENARIO.map((s, i) => ({
    date: dateOf(i),
    kwh: dailyForecast(household.kWp, household.perfRatio, i),
    weather: weatherOf(i),
    stormRisk: s.stormRisk,
  }));
}

export interface HistoryPoint {
  date: string;
  actual: number;
  expected: number;
}

export function householdHistory(): HistoryPoint[] {
  const out: HistoryPoint[] = [];
  for (let i = -30; i <= -1; i++) {
    out.push({
      date: dateOf(i),
      actual: dailyActual(household.kWp, household.perfRatio, household.seed, i),
      expected: dailyExpected(household.kWp, i),
    });
  }
  return out;
}

export function householdHealth() {
  const history = householdHistory();
  const actual = history.reduce((s, p) => s + p.actual, 0);
  const expected = history.reduce((s, p) => s + p.expected, 0);
  const ratio = actual / expected;
  return { ratio, ok: ratio >= 0.9 };
}

export function monthSavings() {
  let kwh = actualSoFar(household.kWp, household.perfRatio, household.seed);
  const daily: number[] = [];
  for (let i = -17; i <= -1; i++) {
    const d = dailyActual(household.kWp, household.perfRatio, household.seed, i);
    kwh += d;
    daily.push(d * household.selfConsumption * household.tariffEur);
  }
  const eur = kwh * household.selfConsumption * household.tariffEur;
  return { kwh, eur, co2Kg: kwh * household.co2KgPerKwh, daily };
}

export function bestWindow(dayIdx: number): { start: number; end: number } {
  let best = 8;
  let bestSum = -1;
  for (let start = 8; start <= 18; start++) {
    let sum = 0;
    for (let h = start; h < start + 3; h++) sum += forecastKwh(household.kWp, household.perfRatio, dayIdx, h);
    if (sum > bestSum) {
      bestSum = sum;
      best = start;
    }
  }
  return { start: best, end: best + 3 };
}

export function hourlyForecast(dayIdx: number): number[] {
  const out: number[] = [];
  for (let h = 0; h < 24; h++) out.push(forecastKwh(household.kWp, household.perfRatio, dayIdx, h));
  return out;
}
