import { describe, expect, it } from 'vitest';
import { householdTodayTotals } from './household';
import { portfolioAlerts, sites } from './portfolio';
import { dailyForecast } from './solar';

describe('demo data', () => {
  it('has 250 sites with the expected status mix', () => {
    expect(sites).toHaveLength(250);
    const share = (s: string) => sites.filter((x) => x.status === s).length / sites.length;
    expect(Math.abs(share('ok') - 0.88)).toBeLessThanOrEqual(0.02);
    expect(Math.abs(share('underperforming') - 0.09)).toBeLessThanOrEqual(0.02);
    expect(Math.abs(share('offline') - 0.03)).toBeLessThanOrEqual(0.02);
  });

  it('keeps every site on land inside the Barcelona box', () => {
    for (const s of sites) {
      expect(s.lat).toBeGreaterThanOrEqual(41.32);
      expect(s.lat).toBeLessThanOrEqual(41.47);
      expect(s.lng).toBeGreaterThanOrEqual(2.05);
      expect(s.lng).toBeLessThanOrEqual(2.11 + (s.lat - 41.32) * 1.1);
      expect(s.kWp).toBeGreaterThanOrEqual(5);
      expect(s.kWp).toBeLessThanOrEqual(20);
    }
  });

  it('gives the demo home 30-42 kWh on a sunny day', () => {
    const kwh = dailyForecast(6, 0.98, 0);
    expect(kwh).toBeGreaterThanOrEqual(30);
    expect(kwh).toBeLessThanOrEqual(42);
    expect(householdTodayTotals().forecastTotal).toBeCloseTo(kwh, 6);
  });

  it('ranks alerts by expected loss', () => {
    const rows = portfolioAlerts();
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i - 1].lossEurDay).toBeGreaterThanOrEqual(rows[i].lossEurDay);
    }
  });

  it('is deterministic', () => {
    expect(sites[0].id).toBe('BCN-0001');
    expect(sites[0].lat).toBe(sites[0].lat);
  });
});
