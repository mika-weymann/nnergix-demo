import { CheckCircle2, Leaf, TriangleAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { track } from '../../analytics/track';
import { TodayCard } from '../../components/app/TodayCard';
import { ForecastChart } from '../../components/charts/ForecastChart';
import { HealthChart } from '../../components/charts/HealthChart';
import { Sparkline } from '../../components/charts/Sparkline';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Toggle } from '../../components/ui/Toggle';
import { useToast } from '../../components/ui/Toast';
import { useDemo } from '../../context/DemoContext';
import { bestWindow, household, hourlyForecast, householdHealth, householdHistory, householdWeek, monthSavings } from '../../data/household';
import { dateOf, weekday } from '../../data/weather';
import { kwh, pad } from '../../lib/format';

const ALERTS = [
  { id: 'hail', title: 'Hail possible on Thursday 15:00–18:00', text: 'Consider checking your panels afterwards. From Sentinel Weather.' },
  { id: 'heat', title: 'Hot weekend ahead', text: 'Panels lose a little efficiency above 35 °C. Output may dip around midday.' },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function BestTimeRow({ dayIdx, label }: { dayIdx: number; label: string }) {
  const values = hourlyForecast(dayIdx);
  const w = bestWindow(dayIdx);
  const hours = Array.from({ length: 16 }, (_, i) => i + 6);
  const max = Math.max(...values, 0.001);
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="tabular">
          {pad(w.start)}–{pad(w.end)}
        </span>
      </div>
      <div className="flex h-14 items-end gap-0.5" role="img" aria-label={`${label}: best window ${pad(w.start)} to ${pad(w.end)}`}>
        {hours.map((h) => {
          const inWindow = h >= w.start && h < w.end;
          return (
            <div
              key={h}
              className={`flex-1 rounded-t-md ${inWindow ? 'bg-brand-700' : 'bg-white'}`}
              style={{ height: `${Math.max(8, (values[h] / max) * 100)}%` }}
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted">
        <span>06:00</span>
        <span>13:00</span>
        <span>21:00</span>
      </div>
    </div>
  );
}

export function HomeDashboard({ brandName, preview = false }: { brandName?: string; preview?: boolean }) {
  const toast = useToast();
  const [remind, setRemind] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const savings = monthSavings();
  const health = householdHealth();
  const week = householdWeek();
  const w = bestWindow(0);
  const alerts = ALERTS.filter((a) => !dismissed.includes(a.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="h1">
            {greeting()}, {household.name}
          </h1>
          <p className="mt-1 text-sm">
            {brandName ? `${brandName} · ` : ''}
            {household.address}
          </p>
        </div>
        {health.ok ? (
          <Badge tone="ok">
            <CheckCircle2 size={14} strokeWidth={1.5} aria-hidden /> Working as expected
          </Badge>
        ) : (
          <Badge tone="warn">
            <TriangleAlert size={14} strokeWidth={1.5} aria-hidden /> Check your system
          </Badge>
        )}
      </div>

      <TodayCard />

      <Card pad="lg">
        <h2 className="h3 mb-1">Next 7 days</h2>
        <ForecastChart days={week} height={280} summary={`Forecast production in kWh per day for the next seven days, from ${weekday(week[0].date, true)}.`} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card pad="lg">
          <h2 className="h3">Best time to use power</h2>
          <p className="mt-1 text-sm">
            Run the washing machine or charge the car between <strong className="text-ink">{pad(w.start)} and {pad(w.end)}</strong>.
          </p>
          <div className="mt-6 space-y-5">
            <BestTimeRow dayIdx={0} label="Today" />
            <BestTimeRow dayIdx={1} label={`Tomorrow, ${weekday(dateOf(1))}`} />
          </div>
          <div className="mt-6">
            <Toggle
              checked={remind}
              onChange={(on) => {
                setRemind(on);
                track('remind_toggle', { on });
              }}
              label="Remind me"
            />
          </div>
        </Card>

        <Card pad="lg">
          <h2 className="h3">Savings this month</h2>
          <div className="mt-4 flex flex-wrap items-end gap-x-10 gap-y-2">
            <div>
              <p className="tabular text-4xl font-semibold text-ink">EUR {savings.eur.toFixed(0)}</p>
              <p className="text-xs uppercase tracking-[0.08em] text-muted">saved</p>
            </div>
            <div>
              <p className="tabular flex items-center gap-1.5 text-4xl font-semibold text-ink">
                <Leaf size={24} strokeWidth={1.5} className="text-ok" aria-hidden />
                {savings.co2Kg.toFixed(0)}
              </p>
              <p className="text-xs uppercase tracking-[0.08em] text-muted">kg CO₂ avoided</p>
            </div>
          </div>
          <div className="mt-4">
            <Sparkline values={savings.daily} summary="Daily savings in euros so far this month." />
          </div>
          <p className="mt-2 text-xs">Demo values, assuming EUR 0.20/kWh.</p>
        </Card>

        <Card pad="lg">
          <h2 className="h3 mb-3">Alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-sm">No alerts. Everything looks calm.</p>
          ) : (
            <ul className="space-y-3">
              {alerts.map((a) => (
                <li key={a.id} className="flex items-start gap-3 rounded-2xl bg-white p-4">
                  <TriangleAlert size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-warn" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink">{a.title}</p>
                    <p className="text-sm">{a.text}</p>
                  </div>
                  <button type="button" aria-label={`Dismiss: ${a.title}`} onClick={() => setDismissed([...dismissed, a.id])} className="rounded-full p-1.5 hover:bg-surface">
                    <X size={16} strokeWidth={1.5} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card pad="lg">
          <h2 className="h3">Health check</h2>
          <div className="mt-3">
            <HealthChart data={householdHistory()} height={170} summary="Daily production over the last 30 days compared with the expected production." />
          </div>
          <p className="mt-3 text-sm">
            Over the last 30 days your panels made <strong className="text-ink">{Math.round(health.ratio * 100)}%</strong> of what we expect ({kwh(householdHistory().reduce((s, p) => s + p.actual, 0), 0)} kWh). That is normal.
          </p>
        </Card>
      </div>

      {!preview && (
        <Card tone="sun" pad="lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="h3">Unlock 7-day forecasts and storm alerts – EUR 30/year</h2>
              <p className="mt-1 text-sm">Plan ahead and protect your system. This is a prototype test.</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  track('feature_interest', { feature: 'forecast_and_storm_alerts', answer: 'would_pay' });
                  toast('Thanks – this is a prototype, nothing was charged.');
                }}
              >
                I'd pay for this
              </Button>
              <Button variant="secondary" onClick={() => track('feature_interest', { feature: 'forecast_and_storm_alerts', answer: 'not_now' })}>
                Not now
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function Home() {
  const { setView } = useDemo();
  useEffect(() => setView('homeowner'), [setView]);
  return <HomeDashboard />;
}
