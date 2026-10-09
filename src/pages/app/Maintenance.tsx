import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { useDemo, type Task, type TaskStatus } from '../../context/DemoContext';
import { portfolioAlerts } from '../../data/portfolio';
import type { IssueKind } from '../../data/types';
import { shortDate } from '../../data/weather';
import { eur, kwh } from '../../lib/format';

const FILTERS: { id: string; label: string; issue?: IssueKind }[] = [
  { id: 'all', label: 'All' },
  { id: 'offline', label: 'Offline', issue: 'Offline' },
  { id: 'under', label: 'Underperforming', issue: 'Underperforming' },
  { id: 'storm', label: 'Storm check', issue: 'Storm risk' },
];

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To do' },
  { id: 'scheduled', title: 'Scheduled' },
  { id: 'done', title: 'Done' },
];

const TONE = { Offline: 'alert', Underperforming: 'warn', 'Storm risk': 'brand' } as const;

function TaskCard({ task, onMove }: { task: Task; onMove: (s: TaskStatus) => void }) {
  return (
    <li className="rounded-2xl bg-white p-4 shadow-card">
      <p className="text-sm font-medium text-ink">{task.siteName}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Badge tone={TONE[task.issue]}>{task.issue}</Badge>
        {task.lossKwhDay > 0 && <span className="tabular text-xs">{kwh(task.lossKwhDay, 0)} kWh/day · {eur(task.lossKwhDay * 0.2)}/day</span>}
      </div>
      <p className="mt-2 text-xs text-muted">Created {shortDate(task.createdOn)}</p>
      <div className="mt-3">
        {task.status === 'todo' && <Button variant="secondary" className="h-9 px-4 text-sm" onClick={() => onMove('scheduled')}>Schedule</Button>}
        {task.status === 'scheduled' && <Button variant="secondary" className="h-9 px-4 text-sm" onClick={() => onMove('done')}>Mark done</Button>}
        {task.status === 'done' && <Button variant="link" className="text-sm" onClick={() => onMove('todo')}>Reopen</Button>}
      </div>
    </li>
  );
}

export default function Maintenance() {
  const [params] = useSearchParams();
  const { tasks, addTask, hasTask, moveTask, setView } = useDemo();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (params.get('view') === 'installer') setView('installer');
  }, [params, setView]);

  const active = FILTERS.find((f) => f.id === filter);
  const visible = tasks.filter((t) => !active?.issue || t.issue === active.issue);
  const suggestions = portfolioAlerts()
    .filter((a) => a.issue !== 'Storm risk' && !hasTask(a.siteId, a.issue))
    .slice(0, 5);

  return (
    <div>
      <PageHeader title="Maintenance" subtitle="Turn alerts into tasks and keep every rooftop healthy." />
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`h-9 rounded-full px-4 text-sm font-medium ${filter === f.id ? 'bg-brand-700 text-white' : 'bg-surface text-body hover:text-ink'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="No tasks yet" text="Create a task from a suggested alert below, or from any site page." />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {COLUMNS.map((c) => {
            const items = visible.filter((t) => t.status === c.id);
            return (
              <Card key={c.id}>
                <h2 className="mb-3 flex items-center justify-between text-sm font-semibold text-ink">
                  {c.title}
                  <span className="tabular rounded-full bg-white px-2.5 py-0.5 text-xs">{items.length}</span>
                </h2>
                <ul className="space-y-3" aria-label={c.title}>
                  {items.map((t) => (
                    <TaskCard key={t.id} task={t} onMove={(s) => moveTask(t.id, s)} />
                  ))}
                  {items.length === 0 && <li className="rounded-2xl border-2 border-dashed border-white px-4 py-6 text-center text-xs">Nothing here</li>}
                </ul>
              </Card>
            );
          })}
        </div>
      )}

      {suggestions.length > 0 && (
        <Card className="mt-8" pad="lg">
          <h2 className="h3">Suggested from alerts</h2>
          <ul className="mt-4 space-y-2">
            {suggestions.map((a) => (
              <li key={a.siteId + a.issue} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm">
                <span className="min-w-0 text-ink">{a.siteName}</span>
                <span className="flex items-center gap-3">
                  <Badge tone={TONE[a.issue]}>{a.issue}</Badge>
                  <span className="tabular text-muted">{kwh(a.lossKwhDay, 0)} kWh/day</span>
                  <Button variant="secondary" className="h-9 px-4 text-sm" onClick={() => addTask({ siteId: a.siteId, siteName: a.siteName, issue: a.issue, lossKwhDay: a.lossKwhDay })}>
                    Create task
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
