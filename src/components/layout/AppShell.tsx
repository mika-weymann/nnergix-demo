import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { track } from '../../analytics/track';
import { useDemo, type View } from '../../context/DemoContext';
import { DEMO_DATE, shortDate, weekday } from '../../data/weather';
import { DemoBanner } from '../marketing/DemoBanner';
import { Modal } from '../ui/Modal';
import { Toggle } from '../ui/Toggle';
import { Button } from '../ui/Button';
import { Sidebar } from './Sidebar';

const VIEWS: { id: View; label: string; to: string }[] = [
  { id: 'homeowner', label: 'Homeowner', to: '/app/home' },
  { id: 'retailer', label: 'Retailer', to: '/app/portfolio?view=retailer' },
  { id: 'installer', label: 'Installer', to: '/app/maintenance?view=installer' },
];

const TITLES: Record<string, string> = {
  '/app/home': 'Home',
  '/app/portfolio': 'Portfolio',
  '/app/maintenance': 'Maintenance',
};

export function AppShell() {
  const { view, setView, resetTasks } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();
  const [settings, setSettings] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  const title = location.pathname.startsWith('/app/site') ? 'Site detail' : (TITLES[location.pathname] ?? 'App');

  const switchView = (v: (typeof VIEWS)[number]) => {
    setView(v.id);
    track('demo_role_selected', { role: v.id });
    navigate(v.to);
  };

  return (
    <div className="min-h-screen bg-white">
      <DemoBanner />
      <div className="flex">
        <Sidebar onSettings={() => setSettings(true)} />
        <div className="min-w-0 flex-1 pb-24 md:pb-10">
          <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
            <div>
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="text-xs text-muted">
                Today · {weekday(DEMO_DATE)} {shortDate(DEMO_DATE)}
              </p>
            </div>
            <div role="group" aria-label="Switch view" className="inline-flex rounded-full bg-surface p-1">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={view === v.id}
                  onClick={() => switchView(v)}
                  className={`h-9 rounded-full px-4 text-sm font-medium transition-colors ${
                    view === v.id ? 'bg-white text-ink shadow-card' : 'text-body hover:text-ink'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </header>
          <div className="px-4 pb-6 md:px-8">
            <Outlet />
          </div>
        </div>
      </div>

      <Modal open={settings} onClose={() => setSettings(false)} title="Settings">
        <div className="space-y-5">
          <Toggle checked={emailAlerts} onChange={setEmailAlerts} label="Email me about alerts" />
          <Toggle checked={weeklyReport} onChange={setWeeklyReport} label="Weekly summary report" />
          <p className="text-sm">These settings are for show. Nothing is saved or sent in this prototype.</p>
          <Button variant="secondary" onClick={resetTasks}>
            Clear maintenance tasks
          </Button>
        </div>
      </Modal>
    </div>
  );
}
