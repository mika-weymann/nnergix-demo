import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import type { DayForecast } from '../../data/types';
import { weekday } from '../../data/weather';
import { WeatherIcon } from '../ui/WeatherIcon';
import { AXIS, ChartFrame, SUN } from './ChartFrame';

interface TickProps {
  x?: number;
  y?: number;
  index?: number;
}

export function ForecastChart({ days, height = 260, summary }: { days: DayForecast[]; height?: number; summary: string }) {
  const data = days.map((d) => ({ ...d, label: weekday(d.date) }));
  const renderTick = ({ x = 0, y = 0, index = 0 }: TickProps) => {
    const day = data[index];
    if (!day) return <g />;
    return (
      <g>
        <WeatherIcon weather={day.weather} storm={day.stormRisk} x={x - 11} y={y - 52} size={22} color={day.stormRisk ? '#B45309' : '#4B5563'} />
        <text x={x} y={y - 12} textAnchor="middle" fill={AXIS.fill} fontSize={12}>
          {day.label}
        </text>
      </g>
    );
  };
  return (
    <ChartFrame label={summary} height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 64, right: 8, bottom: 0, left: 8 }}>
          <XAxis dataKey="label" orientation="top" tick={renderTick} axisLine={false} tickLine={false} interval={0} />
          <YAxis hide domain={[0, 'dataMax + 6']} />
          <Bar dataKey="kwh" name="Forecast" fill={SUN} radius={[10, 10, 0, 0]} maxBarSize={44}>
            <LabelList dataKey="kwh" position="top" formatter={(v: number) => `${Math.round(v)}`} style={{ fill: '#111827', fontSize: 12, fontWeight: 600 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
