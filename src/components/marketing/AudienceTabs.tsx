import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { track } from '../../analytics/track';
import { portfolioAlerts, portfolioForecast48, portfolioKpis } from '../../data/portfolio';
import { householdWeek } from '../../data/household';
import { kwh } from '../../lib/format';
import { ForecastChart } from '../charts/ForecastChart';
import { PortfolioForecastChart } from '../charts/PortfolioForecastChart';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Eyebrow } from '../ui/Eyebrow';
import { Stat } from '../ui/Stat';
import { Tabs } from '../ui/Tabs';

type TabId = 'homeowners' | 'retailers' | 'installers';

const TABS: { id: TabId; label: string }[] = [
  { id: 'homeowners', label: 'Homeowners' },
  { id: 'retailers', label: 'Energy retailers' },
  { id: 'installers', label: 'Installers' },
];

const COPY: Record<TabId, { title: string; bullets: string[]; to: string }> = {
  homeowners: {
    title: 'Know your roof is working.',
    bullets: [
      'See today\'s production and a 7-day forecast.',
      'Use more of your own power at the best hours.',
      'Get a heads-up before storms and hail.',
    ],
    to: '/app/home',
  },
  retailers: {
    title: 'See every rooftop at once.',
    bullets: [
      'Forecast hundreds of small systems when you buy energy.',
      'Rank alerts by the energy you expect to lose.',
      'Offer customers the app in your own brand.',
    ],
    to: '/app/portfolio?view=retailer',
  },
  installers: {
    title: 'Fix faults before customers call.',
    bullets: [
      'One screen for every inverter brand.',
      'Spot offline and underperforming systems early.',
      'Turn each alert into a maintenance task.',
    ],
    to: '/app/maintenance?view=installer',
  },
};

function Preview({ tab }: { tab: TabId }) {
  if (tab === 'homeowners') {
    return (
      <Card tone="white" pad="lg">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Next 7 days</p>
          <Badge tone="ok">
            <CheckCircle2 size={14} strokeWidth={1.5} aria-hidden /> Working as expected
          </Badge>
        </div>
        <ForecastChart days={householdWeek()} height={250} summary="Daily production forecast in kWh for the next seven days." />
      </Card>
    );
  }
  if (tab === 'retailers') {
    const k = portfolioKpis();
    return (
      <Card tone="white" pad="lg">
        <div className="mb-4 grid grid-cols-2 gap-4">
          <Stat value={k.rooftops} caption="rooftops connected" />
          <Stat value={k.forecastTomorrowMwh.toFixed(1)} caption="MWh forecast tomorrow" />
        </div>
        <PortfolioForecastChart data={portfolioForecast48()} height={200} summary="Forecast of total portfolio production in MWh for the next 48 hours." />
      </Card>
    );
  }
  const rows = portfolioAlerts().slice(0, 4);
  return (
    <Card tone="white" pad="lg">
      <p className="mb-3 text-sm font-semibold text-ink">Needs attention</p>
      <ul className="space-y-2">
        {rows.map((r) => (
          <li key={r.siteId + r.issue} className="flex items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3 text-sm">
            <span className="min-w-0 truncate text-ink">{r.siteName}</span>
            <span className="flex shrink-0 items-center gap-3">
              <Badge tone={r.issue === 'Offline' ? 'alert' : 'warn'}>{r.issue}</Badge>
              <span className="tabular hidden text-muted sm:inline">{kwh(r.lossKwhDay, 0)} kWh/day</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function AudienceTabs() {
  const [params] = useSearchParams();
  const initial = TABS.some((t) => t.id === params.get('tab')) ? (params.get('tab') as TabId) : 'homeowners';
  const [tab, setTab] = useState<TabId>(initial);

  useEffect(() => {
    const requested = params.get('tab');
    if (TABS.some((t) => t.id === requested)) setTab(requested as TabId);
  }, [params]);

  useEffect(() => {
    track('audience_tab_viewed', { tab });
  }, [tab]);

  const copy = COPY[tab];
  return (
    <section id="views" className="section scroll-mt-16">
      <div className="container-x">
        <Eyebrow>One platform, three views</Eyebrow>
        <h2 className="h1 mb-8 max-w-2xl">The same data, shown for each job.</h2>
        <Tabs tabs={TABS} value={tab} onChange={setTab} label="Choose an audience" />
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h3 className="h2">{copy.title}</h3>
            <ul className="mt-6 space-y-3">
              {copy.bullets.map((b) => (
                <li key={b} className="flex gap-3">
                  <CheckCircle2 size={20} strokeWidth={1.5} className="mt-1 shrink-0 text-brand-700" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button to={copy.to} variant="link" onClick={() => track('cta_clicked', { location: `audience_${tab}` })}>
                See this view
              </Button>
            </div>
          </div>
          <Preview tab={tab} />
        </div>
      </div>
    </section>
  );
}
