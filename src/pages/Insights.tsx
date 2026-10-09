import { useMemo, useState } from 'react';
import { QUESTION_GROUPS, type TrackedEvent } from '../analytics/events';
import { clearEvents, getEvents } from '../analytics/track';
import { Disclaimer } from '../components/layout/Disclaimer';
import { Wordmark } from '../components/layout/Wordmark';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { downloadCsv } from '../lib/csv';

function label(e: TrackedEvent): string {
  const values = e.props ? Object.values(e.props).map(String).join(' / ') : '';
  return values ? `${e.event} · ${values}` : e.event;
}

export default function Insights() {
  const [events, setEvents] = useState<TrackedEvent[]>(() => getEvents());

  const groups = useMemo(
    () =>
      QUESTION_GROUPS.map((g) => {
        const counts = new Map<string, number>();
        for (const e of events) {
          if (!g.events.includes(e.event)) continue;
          counts.set(label(e), (counts.get(label(e)) ?? 0) + 1);
        }
        const data = [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
        return { ...g, data };
      }),
    [events],
  );

  const exportCsv = () =>
    downloadCsv('sentinel-solar-events.csv', [
      ['timestamp', 'session', 'event', 'props'],
      ...events.map((e) => [new Date(e.ts).toISOString(), e.sessionId, e.event, JSON.stringify(e.props ?? {})]),
    ]);

  const reset = () => {
    clearEvents();
    setEvents([]);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="container-x flex h-16 items-center justify-between">
        <Wordmark />
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Insights (hidden)</span>
      </header>
      <main className="container-x py-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="h1">What visitors did</h1>
            <p className="mt-2">{events.length} events recorded in this browser.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={exportCsv} disabled={events.length === 0}>Export CSV</Button>
            <Button variant="secondary" onClick={reset} disabled={events.length === 0}>Reset data</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {groups.map((g) => (
            <Card key={g.id} pad="lg">
              <h2 className="h3">{g.title}</h2>
              <p className="mb-4 text-sm">{g.question}</p>
              {g.data.length === 0 ? (
                <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm">No events yet. Click around the demo first.</p>
              ) : (
                <ul className="space-y-4" aria-label={`${g.title} event counts`}>
                  {g.data.map((d) => (
                    <li key={d.name}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="min-w-0 break-words text-ink">{d.name}</span>
                        <span className="tabular font-semibold text-ink">{d.count}</span>
                      </div>
                      <div className="mt-1.5 h-2 rounded-full bg-white">
                        <div className="h-full rounded-full bg-brand-500" style={{ width: `${(d.count / g.data[0].count) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>

        <Card className="mt-6" pad="lg">
          <h2 className="h3 mb-4">Raw events (latest 50)</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-[0.08em] text-muted">
                  <th className="pb-2 pr-4 font-semibold">Time</th>
                  <th className="pb-2 pr-4 font-semibold">Session</th>
                  <th className="pb-2 pr-4 font-semibold">Event</th>
                  <th className="pb-2 font-semibold">Properties</th>
                </tr>
              </thead>
              <tbody>
                {[...events].reverse().slice(0, 50).map((e, i) => (
                  <tr key={i} className="align-top">
                    <td className="tabular py-1.5 pr-4">{new Date(e.ts).toLocaleTimeString('en-GB')}</td>
                    <td className="py-1.5 pr-4">{e.sessionId}</td>
                    <td className="py-1.5 pr-4 text-ink">{e.event}</td>
                    <td className="py-1.5">{e.props ? JSON.stringify(e.props) : '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Disclaimer className="mt-10" />
      </main>
    </div>
  );
}
