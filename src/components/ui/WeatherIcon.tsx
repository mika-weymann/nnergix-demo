import { Cloud, CloudHail, CloudRain, CloudSun, Sun, type LucideProps } from 'lucide-react';
import type { Weather } from '../../data/types';

const ICONS = { sun: Sun, partly: CloudSun, cloud: Cloud, rain: CloudRain } as const;

export const WEATHER_LABEL: Record<Weather, string> = {
  sun: 'Sunny',
  partly: 'Partly cloudy',
  cloud: 'Cloudy',
  rain: 'Rain',
};

export function WeatherIcon({ weather, storm = false, ...props }: { weather: Weather; storm?: boolean } & LucideProps) {
  const Icon = storm ? CloudHail : ICONS[weather];
  return <Icon strokeWidth={1.5} {...props} />;
}
