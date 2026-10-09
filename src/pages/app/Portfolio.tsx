import { Download } from 'lucide-react';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { track } from '../../analytics/track';
import { PageHeader } from '../../components/layout/PageHeader';
import { PortfolioForecastChart } from '../../components/charts/PortfolioForecastChart';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Stat } from '../../components/ui/Stat';
import { Table, Td, Th, Tr } from '../../components/ui/Table';
import { Toggle } from '../../components/ui/Toggle';
import { BrandScope, SUNVOLT_BRAND, useBrand } from '../../context/BrandContext';
import { useDemo } from '../../context/DemoContext';
import { dailyForecast } from '../../data/solar';
import { portfolioAlerts, portfolioForecast48, portfolioKpis, sites } from '../../data/portfolio';
import { dateOf, weekday } from '../../data/weather';
import { downloadCsv } from '../../lib/csv';
import { eur, kwh } from '../../lib/format';
import { HomeDashboard } from './Home';

const PortfolioMap = lazy(() => import('../../components/map/PortfolioMap'));

const ISSUE_TONE = { Offline: 'alert', Underperforming: 'warn', 'Storm risk': 'brand' } as const;
const INSTALLER_ORDER = { Offline: 0, Underperforming: 1, 'Storm risk': 2 } as const;

export default function Portfolio() {
  const [params] = useSearchParams();
  const { addTask, hasTask, setView } = useDemo();
  const { whiteLabel, setWhiteLabel } = useBrand();
  const installer = params.get('view') === 'installer';
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const v = params.get('view');
    if (v === 'installer' || v === 'retailer') setView(v);
  }, [params, setView]);

  const kpis = portfolioKpis();
  const forecast = portfolioForecast48();
  const rows = useMemo(() => {
    const all = [...portfolioAlerts()];
    if (installer) all.sort((a, b) => INSTALLER_ORDER[a.issue] - INSTALLER_ORDER[b.issue] || b.lossEurDay - a.lossEurDay);
    return all;
  }, [installer]);
  const shown = showAll ? rows : rows.slice(0, 10);

  const exportCsv = () => {
    const header = ['site_id', 'name', 'kWp', ...Array.from({ length: 7 }, (_, i) => `${dateOf(i)}_kWh`)];
    const body = sites.map((s) => [
      s.id,
      s.name,
      s.kWp,
      ...Array.from({ length: 7 }, (_, i) => dailyForecast(s.kWp, s.perfRatio === 0 ? 1 : s.perfRatio, i).toFixed(1)),
    ]);
    downloadCsv('sentinel-solar-forecast.csv', [header, ...body]);
    track('csv_exported');
  };

  return (
    <div>
      <PageHeader
        title={installer ? 'Rooftops needing attention' : 'Portfolio'}
        subtitle={`${kpis.rooftops} rooftops around Barcelona, all inverter brands in one view.`}
        actions={
          <>
            <Toggle
              checked={whiteLabel}
              onChange={(on) => {
                setWhiteLabel(on);
                track('whitelabel_toggled', { on });
              }}
              label="Show homeowner app in your brand"
            />
            <Button variant="secondary" onClick={exportCsv}>
              <Download size={16} strokeWidth={1.5} aria-hidden /> Download forecast (CSV)
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { value: kpis.rooftops, caption: 'Rooftops connected' },
          { value: kpis.capacityMwp.toFixed(2), caption: 'Total capacity (MWp)' },
          { value: kpis.forecastTomorrowMwh.toFixed(1), caption: 'Forecast tomorrow (MWh)' },
        ].map((k) => (
          <Card key={k.caption}>
            <Stat value={k.value} caption={k.caption} />
          </Card>
        ))}
        <Card>
          <Stat value={<span className="text-warn">{kpis.needAttention}</span>} caption="Systems needing attention" />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7" pad="lg">
          <h2 className="h3 mb-4">Map</h2>
          <Suspense fallback={<div className="h-[460px] rounded-card bg-white" aria-busy="true" />}>
            <PortfolioMap sites={sites} />
          </Suspense>
        </Card>
        <Card className="lg:col-span-5" pad="lg">
          <h2 className="h3">Portfolio forecast, next 48 hours</h2>
          <p className="mb-4 mt-1 text-sm">
            {installer ? 'Total expected production in MWh, with the P10 to P90 range.' : 'Use this when buying energy for tomorrow.'}
          </p>
          <PortfolioForecastChart data={forecast} height={300} summary="Forecast of total portfolio production in MWh for the next 48 hours, with an uncertainty range." />
          <p className="mt-3 text-xs">
            Tomorrow ({weekday(dateOf(1))}) is lower because of rain and a hail warning from 15:00 to 18:00.
          </p>
        </Card>
      </div>

      <Card className="mt-6" pad="lg">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="h3">{installer ? 'Open issues' : 'Alerts ranked by expected loss'}</h2>
            <p className="text-sm">{rows.length} alerts across the portfolio.</p>
          </div>
        </div>
        <Table label="Alerts">
          <thead>
            <tr>
              <Th>Site</Th>
              <Th>Issue</Th>
              <Th>Since</Th>
              <Th align="right">Expected loss</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <Tr key={r.siteId + r.issue}>
                <Td>
                  <Link to={`/app/site/${r.siteId}`} className="font-medium hover:text-brand-700">
                    {r.siteName}
                  </Link>
                </Td>
                <Td>
                  <Badge tone={ISSUE_TONE[r.issue]}>{r.issue}</Badge>
                </Td>
                <Td>{r.since}</Td>
                <Td align="right">
                  {kwh(r.lossKwhDay, 0)} kWh/day · {eur(r.lossEurDay)}/day
                </Td>
                <Td align="right">
                  <Button
                    variant="secondary"
                    className="h-9 px-4 text-sm"
                    disabled={hasTask(r.siteId, r.issue)}
                    onClick={() => addTask({ siteId: r.siteId, siteName: r.siteName, issue: r.issue, lossKwhDay: r.lossKwhDay })}
                  >
                    {hasTask(r.siteId, r.issue) ? 'Task created' : 'Create task'}
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        {rows.length > 10 && (
          <div className="mt-3">
            <Button variant="link" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show fewer' : `Show all ${rows.length}`}
            </Button>
          </div>
        )}
      </Card>

      <Modal open={whiteLabel} onClose={() => setWhiteLabel(false)} title="Homeowner app in your brand" wide>
        <BrandScope brand={SUNVOLT_BRAND}>
          <div className="mb-6 flex items-center justify-between rounded-2xl bg-brand-900 px-5 py-4 text-white">
            <span className="text-lg font-bold tracking-tight">sunvolt</span>
            <span className="text-xs uppercase tracking-[0.08em] text-brand-100">Solar by Sunvolt Energy</span>
          </div>
          <HomeDashboard brandName={SUNVOLT_BRAND.name} preview />
        </BrandScope>
      </Modal>
    </div>
  );
}
