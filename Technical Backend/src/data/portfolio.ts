import { INVERTER_BRANDS } from './inverters';
import { SEED, between, mulberry32, pick, shuffle } from './random';
import {
  actualSoFar,
  bandFactors,
  dailyExpected,
  dailyForecast,
  forecastKwh,
  todayCurve,
} from './solar';
import type { AlertRow, DayForecast, HourPoint, Site, Status } from './types';
import { DEMO_NOW_HOUR, dateOf, shortDate, stormOf, weatherOf, weekday } from './weather';

export const TARIFF_EUR = 0.2;
const SITE_COUNT = 250;

const DISTRICTS = [
  { name: 'Ciutat Vella', lat: 41.38, lng: 2.176 },
  { name: 'Eixample', lat: 41.389, lng: 2.162 },
  { name: 'Sants', lat: 41.375, lng: 2.135 },
  { name: 'Les Corts', lat: 41.385, lng: 2.113 },
  { name: 'Sarrià', lat: 41.4, lng: 2.115 },
  { name: 'Gràcia', lat: 41.404, lng: 2.158 },
  { name: 'Horta', lat: 41.431, lng: 2.16 },
  { name: 'Nou Barris', lat: 41.442, lng: 2.177 },
  { name: 'Sant Andreu', lat: 41.435, lng: 2.19 },
  { name: 'Sant Martí', lat: 41.41, lng: 2.2 },
  { name: "L'Hospitalet", lat: 41.36, lng: 2.1 },
  { name: 'Badalona', lat: 41.45, lng: 2.225 },
];

const STREETS = [
  'del Sol',
  'Nou',
  'de la Mar',
  "de l'Olivera",
  'del Pi',
  'dels Tilers',
  'de la Rosa',
  'del Roure',
  'de la Llum',
  'dels Ametllers',
  'de la Plana',
  'del Mirador',
];

const UNDERPERFORM_CAUSES = [
  'soiling or partial shading',
  'a failing string or loose connector',
  'inverter derating from overheating',
];

function isLand(lat: number, lng: number): boolean {
  return lng <= 2.11 + (lat - 41.32) * 1.1;
}

function nearestDistrict(lat: number, lng: number): string {
  let best = DISTRICTS[0];
  let bestD = Infinity;
  for (const d of DISTRICTS) {
    const dist = (d.lat - lat) ** 2 + (d.lng - lng) ** 2;
    if (dist < bestD) {
      bestD = dist;
      best = d;
    }
  }
  return best.name;
}

function generateSites(): Site[] {
  const rng = mulberry32(SEED);
  const statuses: Status[] = shuffle(rng, [
    ...Array<Status>(8).fill('offline'),
    ...Array<Status>(22).fill('underperforming'),
    ...Array<Status>(SITE_COUNT - 30).fill('ok'),
  ]);
  const out: Site[] = [];
  for (let i = 0; i < SITE_COUNT; i++) {
    let lat = 0;
    let lng = 0;
    do {
      lat = between(rng, 41.32, 41.47);
      lng = between(rng, 2.05, 2.25);
    } while (!isLand(lat, lng));
    const status = statuses[i];
    const kWp = Math.round((5 + 15 * Math.pow(rng(), 2.2)) * 2) / 2;
    let perfRatio = between(rng, 0.97, 1.02);
    let issueSince: string | undefined;
    if (status === 'underperforming') {
      perfRatio = between(rng, 0.7, 0.9);
      issueSince = dateOf(-Math.floor(between(rng, 3, 15)));
    } else if (status === 'offline') {
      perfRatio = 0;
      issueSince = dateOf(-Math.floor(between(rng, 1, 4)));
    }
    out.push({
      id: `BCN-${String(i + 1).padStart(4, '0')}`,
      name: `${nearestDistrict(lat, lng)} · Carrer ${pick(rng, STREETS)} ${Math.floor(between(rng, 1, 90))}`,
      lat: Math.round(lat * 1e5) / 1e5,
      lng: Math.round(lng * 1e5) / 1e5,
      kWp,
      inverterBrand: pick(rng, INVERTER_BRANDS),
      installYear: Math.floor(between(rng, 2012, 2020)),
      status,
      perfRatio,
      issueSince,
      seed: 1000 + i,
    });
  }
  return out;
}

export const sites: Site[] = generateSites();

export function siteById(id: string | undefined): Site | undefined {
  return sites.find((s) => s.id === id);
}

export function siteTodayKwh(site: Site): number {
  return actualSoFar(site.kWp, site.perfRatio, site.seed);
}

export function sitePerfForForecast(site: Site): number {
  return site.perfRatio === 0 ? 1 : site.perfRatio;
}

export function siteCause(site: Site): string {
  return UNDERPERFORM_CAUSES[site.seed % UNDERPERFORM_CAUSES.length];
}

export function siteDiagnosis(site: Site): string {
  if (site.status === 'ok') {
    return 'Production is in line with similar roofs nearby. No action needed.';
  }
  const since = shortDate(site.issueSince ?? dateOf(-3));
  if (site.status === 'offline') {
    return `No data received since ${since}. Likely cause: the inverter lost its internet connection or tripped.`;
  }
  const pct = Math.round((1 - site.perfRatio) * 100);
  return `Production is ${pct}% below similar roofs nearby since ${since}. Likely cause: ${siteCause(site)}.`;
}

export function siteTodayCurve(site: Site): HourPoint[] {
  return todayCurve(site.kWp, site.perfRatio, site.seed);
}

export function siteHistory(site: Site) {
  const out: { date: string; actual: number; expected: number }[] = [];
  for (let i = -30; i <= -1; i++) {
    const date = dateOf(i);
    const inIssue = site.issueSince !== undefined && date >= site.issueSince;
    const perf = inIssue ? site.perfRatio : 0.99;
    let actual = 0;
    for (let h = 0; h < 24; h++) {
      actual += forecastKwh(site.kWp, perf, i, h) * (1 + (((site.seed + i + h) % 7) - 3) * 0.01);
    }
    out.push({ date, actual, expected: dailyExpected(site.kWp, i) });
  }
  return out;
}

export function siteWeek(site: Site): DayForecast[] {
  return Array.from({ length: 7 }, (_, i) => ({
    date: dateOf(i),
    kwh: dailyForecast(site.kWp, sitePerfForForecast(site), i),
    weather: weatherOf(i),
    stormRisk: stormOf(i),
  }));
}

export interface PortfolioKpis {
  rooftops: number;
  capacityMwp: number;
  forecastTomorrowMwh: number;
  needAttention: number;
}

export function portfolioKpis(): PortfolioKpis {
  const capacity = sites.reduce((s, x) => s + x.kWp, 0);
  const tomorrow = sites.reduce((s, x) => s + dailyForecast(x.kWp, x.perfRatio, 1), 0);
  return {
    rooftops: sites.length,
    capacityMwp: capacity / 1000,
    forecastTomorrowMwh: tomorrow / 1000,
    needAttention: sites.filter((s) => s.status !== 'ok').length,
  };
}

export interface ForecastPoint {
  label: string;
  offset: number;
  mwh: number;
  p10: number;
  p90: number;
  band: [number, number];
}

let forecast48: ForecastPoint[] | null = null;

export function portfolioForecast48(): ForecastPoint[] {
  if (forecast48) return forecast48;
  const out: ForecastPoint[] = [];
  for (let k = 0; k < 48; k++) {
    const abs = DEMO_NOW_HOUR + k;
    const dayIdx = Math.floor(abs / 24);
    const hour = abs % 24;
    let kwh = 0;
    for (const s of sites) kwh += forecastKwh(s.kWp, s.perfRatio, dayIdx, hour);
    const { lo, hi } = bandFactors(Math.max(1, dayIdx));
    const mwh = kwh / 1000;
    out.push({
      label: `${weekday(dateOf(dayIdx))} ${String(hour).padStart(2, '0')}:00`,
      offset: k,
      mwh,
      p10: mwh * lo,
      p90: mwh * hi,
      band: [mwh * lo, mwh * hi],
    });
  }
  forecast48 = out;
  return out;
}

let alertCache: AlertRow[] | null = null;

export function portfolioAlerts(): AlertRow[] {
  if (alertCache) return alertCache;
  const rows: AlertRow[] = [];
  for (const s of sites) {
    if (s.status === 'ok') continue;
    const expected = dailyExpected(s.kWp, 0);
    const loss = s.status === 'offline' ? expected : expected * (1 - s.perfRatio);
    rows.push({
      siteId: s.id,
      siteName: s.name,
      issue: s.status === 'offline' ? 'Offline' : 'Underperforming',
      since: shortDate(s.issueSince ?? dateOf(-3)),
      lossKwhDay: loss,
      lossEurDay: loss * TARIFF_EUR,
    });
  }
  const stormSites = sites
    .filter((s) => s.status === 'ok' && s.lat > 41.43)
    .sort((a, b) => b.kWp - a.kWp)
    .slice(0, 6);
  for (const s of stormSites) {
    const loss = s.kWp * 6.9 * 0.2;
    rows.push({
      siteId: s.id,
      siteName: s.name,
      issue: 'Storm risk',
      since: `Forecast ${weekday(dateOf(1))} ${shortDate(dateOf(1))}`,
      lossKwhDay: loss,
      lossEurDay: loss * TARIFF_EUR,
    });
  }
  rows.sort((a, b) => b.lossEurDay - a.lossEurDay);
  alertCache = rows;
  return rows;
}
