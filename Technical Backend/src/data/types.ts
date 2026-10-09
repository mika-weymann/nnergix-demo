export type Status = 'ok' | 'underperforming' | 'offline';
export type Weather = 'sun' | 'partly' | 'cloud' | 'rain';

export interface Site {
  id: string;
  name: string;
  lat: number;
  lng: number;
  kWp: number;
  inverterBrand: string;
  installYear: number;
  status: Status;
  perfRatio: number;
  issueSince?: string;
  seed: number;
}

export interface HourPoint {
  hour: number;
  actualKwh?: number;
  expectedKwh: number;
  forecastKwh?: number;
  p10?: number;
  p90?: number;
}

export interface DayForecast {
  date: string;
  kwh: number;
  weather: Weather;
  stormRisk?: boolean;
}

export type IssueKind = 'Offline' | 'Underperforming' | 'Storm risk';

export interface AlertRow {
  siteId: string;
  siteName: string;
  issue: IssueKind;
  since: string;
  lossKwhDay: number;
  lossEurDay: number;
}
