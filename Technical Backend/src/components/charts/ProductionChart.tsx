import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { HourPoint } from '../../data/types';
import { DEMO_NOW_HOUR } from '../../data/weather';
import { pad } from '../../lib/format';
import { AXIS, BRAND, ChartFrame, MUTED, SUN } from './ChartFrame';

export function ProductionChart({ data, height = 260, summary }: { data: HourPoint[]; height?: number; summary: string }) {
  const visible = data.filter((p) => p.hour >= 5 && p.hour <= 22);
  return (
    <ChartFrame label={summary} height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={visible} margin={{ top: 16, right: 12, bottom: 0, left: -8 }}>
          <CartesianGrid vertical={false} stroke="#EEF0F3" />
          <XAxis dataKey="hour" type="number" domain={[5, 22]} tickFormatter={pad} ticks={[6, 9, 12, 15, 18, 21]} tick={AXIS} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS} axisLine={false} tickLine={false} width={44} />
          <Tooltip
            formatter={(value, name) => [`${Number(value).toFixed(2)} kWh`, name]}
            labelFormatter={(h) => pad(Number(h))}
            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(16,24,40,.12)' }}
          />
          <Line type="monotone" dataKey="expectedKwh" name="Expected" stroke={MUTED} strokeDasharray="2 4" dot={false} strokeWidth={1.5} />
          <Area type="monotone" dataKey="actualKwh" name="Produced" stroke={SUN} fill={SUN} fillOpacity={0.25} strokeWidth={2} />
          <Line type="monotone" dataKey="forecastKwh" name="Forecast" stroke={BRAND} strokeDasharray="6 4" dot={false} strokeWidth={2} />
          <ReferenceLine x={DEMO_NOW_HOUR - 1} stroke={MUTED} strokeDasharray="3 3" label={{ value: 'Now', fill: '#6B7280', fontSize: 11, position: 'top' }} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
