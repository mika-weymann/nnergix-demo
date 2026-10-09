import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ForecastChart } from '../../components/charts/ForecastChart';
import { HealthChart } from '../../components/charts/HealthChart';
import { ProductionChart } from '../../components/charts/ProductionChart';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { useDemo } from '../../context/DemoContext';
import { siteById, siteDiagnosis, siteHistory, siteTodayCurve, siteWeek } from '../../data/portfolio';
import type { IssueKind, Status } from '../../data/types';

const LABELS: Record<Status, string> = { ok: 'Working', underperforming: 'Underperforming', offline: 'Offline' };
const TONES = { ok: 'ok', underperforming: 'warn', offline: 'alert' } as const;

export default function SiteDetail() {
  const { id } = useParams();
  const { addTask, hasTask } = useDemo();
  const site = siteById(id);

  if (!site) {
    return (
      <EmptyState
        title="Site not found"
        text="This rooftop does not exist in the demo."
        action={<Button to="/app/portfolio">Back to portfolio</Button>}
      />
    );
  }

  const issue: IssueKind | null = site.status === 'offline' ? 'Offline' : site.status === 'underperforming' ? 'Underperforming' : null;
  const created = issue ? hasTask(site.id, issue) : false;

  return (
    <div className="space-y-6">
      <Link to="/app/portfolio" className="inline-flex items-center gap-2 text-sm font-medium text-brand-700">
        <ArrowLeft size={16} strokeWidth={1.5} aria-hidden /> Portfolio
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="h1">{site.name}</h1>
          <p className="mt-2 text-sm">
            {site.id} · {site.kWp.toFixed(1)} kWp · {site.inverterBrand} · installed {site.installYear}
          </p>
        </div>
        <Badge tone={TONES[site.status]}>{LABELS[site.status]}</Badge>
      </div>

      <Card pad="lg">
        <h2 className="h3">Diagnosis</h2>
        <p className="mt-2 text-ink">{siteDiagnosis(site)}</p>
        <div className="mt-5">
          {issue ? (
            <Button disabled={created} onClick={() => addTask({ siteId: site.id, siteName: site.name, issue, lossKwhDay: 0 })}>
              {created ? 'Task created' : 'Create maintenance task'}
            </Button>
          ) : (
            <p className="text-sm">No maintenance needed.</p>
          )}
          {created && (
            <Link to="/app/maintenance" className="ml-4 text-sm font-medium text-brand-700">
              Open maintenance list →
            </Link>
          )}
        </div>
      </Card>

      <Card pad="lg">
        <h2 className="h3 mb-3">Today</h2>
        <ProductionChart data={siteTodayCurve(site)} height={260} summary={`Hourly production today for ${site.name}, actual against expected.`} />
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card pad="lg">
          <h2 className="h3 mb-3">Last 30 days</h2>
          <HealthChart data={siteHistory(site)} height={220} summary={`Daily production for the last 30 days at ${site.name}.`} />
        </Card>
        <Card pad="lg">
          <h2 className="h3">Next 7 days</h2>
          {site.status === 'offline' && <p className="text-xs">Assuming the system is back online.</p>}
          <ForecastChart days={siteWeek(site)} height={260} summary={`Forecast daily production in kWh for the next seven days at ${site.name}.`} />
        </Card>
      </div>
    </div>
  );
}
