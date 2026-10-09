import { householdToday, householdTodayTotals } from '../../data/household';
import { kwh } from '../../lib/format';
import { ProductionChart } from '../charts/ProductionChart';
import { Card } from '../ui/Card';
import { Stat } from '../ui/Stat';

export function TodayCard({ compact = false, tone = 'surface' }: { compact?: boolean; tone?: 'surface' | 'white' }) {
  const { soFar, forecastTotal } = householdTodayTotals();
  const data = householdToday();
  return (
    <Card tone={tone} pad="lg">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Stat value={<>{kwh(soFar)} <span className="text-xl font-medium text-muted">kWh</span></>} caption={`produced so far today, of ${kwh(forecastTotal)} kWh forecast`} />
        <div className="flex flex-wrap gap-4 text-xs text-body" aria-hidden>
          <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-sun-500" />Produced</span>
          <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-brand-500" />Forecast</span>
          <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-muted" />Expected</span>
        </div>
      </div>
      <div className="mt-4">
        <ProductionChart
          data={data}
          height={compact ? 190 : 280}
          summary={`Hourly solar production today. ${kwh(soFar)} kWh produced so far, ${kwh(forecastTotal)} kWh forecast for the whole day.`}
        />
      </div>
    </Card>
  );
}
