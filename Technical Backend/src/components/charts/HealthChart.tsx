import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { shortDate } from '../../data/weather';
import { AXIS, ChartFrame, MUTED, SUN } from './ChartFrame';

export function HealthChart({ data, height = 200, summary }: { data: { date: string; actual: number; expected: number }[]; height?: number; summary: string }) {
  return (
    <ChartFrame label={summary} height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke="#EEF0F3" />
          <XAxis dataKey="date" tickFormatter={shortDate} tick={AXIS} axisLine={false} tickLine={false} interval={6} />
          <YAxis tick={AXIS} axisLine={false} tickLine={false} width={44} />
          <Tooltip
            formatter={(value, name) => [`${Number(value).toFixed(1)} kWh`, name]}
            labelFormatter={(d) => shortDate(String(d))}
            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(16,24,40,.12)' }}
          />
          <Line type="monotone" dataKey="expected" name="Expected" stroke={MUTED} strokeDasharray="2 4" dot={false} strokeWidth={1.5} />
          <Line type="monotone" dataKey="actual" name="Produced" stroke={SUN} dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
