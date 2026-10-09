import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ForecastPoint } from '../../data/portfolio';
import { AXIS, BRAND, ChartFrame } from './ChartFrame';

export function PortfolioForecastChart({ data, height = 260, summary }: { data: ForecastPoint[]; height?: number; summary: string }) {
  return (
    <ChartFrame label={summary} height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid vertical={false} stroke="#EEF0F3" />
          <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} interval={11} />
          <YAxis tick={AXIS} axisLine={false} tickLine={false} width={44} />
          <Tooltip
            formatter={(value, name) => {
              if (Array.isArray(value)) return [`${Number(value[0]).toFixed(2)} to ${Number(value[1]).toFixed(2)} MWh`, name];
              return [`${Number(value).toFixed(2)} MWh`, name];
            }}
            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(16,24,40,.12)' }}
          />
          <Area type="monotone" dataKey="band" name="P10 to P90" stroke="none" fill={BRAND} fillOpacity={0.14} />
          <Line type="monotone" dataKey="mwh" name="Forecast" stroke={BRAND} strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
