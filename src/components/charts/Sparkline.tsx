import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { BRAND } from './ChartFrame';

export function Sparkline({ values, height = 56, summary }: { values: number[]; height?: number; summary: string }) {
  const data = values.map((v, i) => ({ i, v }));
  return (
    <div role="img" aria-label={summary} style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Area type="monotone" dataKey="v" stroke={BRAND} strokeWidth={2} fill={BRAND} fillOpacity={0.12} dot={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
