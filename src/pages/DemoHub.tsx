import { Building2, Home, Wrench, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { track } from '../analytics/track';
import { useDemo, type View } from '../context/DemoContext';
import { Card } from '../components/ui/Card';

const ROLES: { id: View; title: string; text: string; to: string; icon: LucideIcon }[] = [
  { id: 'homeowner', title: 'Homeowner', text: 'See my own panels, forecast and savings.', to: '/app/home', icon: Home },
  { id: 'retailer', title: 'Energy retailer', text: 'Forecast and monitor a portfolio of rooftops.', to: '/app/portfolio?view=retailer', icon: Building2 },
  { id: 'installer', title: 'Installer', text: 'Find faults and plan maintenance across roofs.', to: '/app/maintenance?view=installer', icon: Wrench },
];

export default function DemoHub() {
  const { setView } = useDemo();
  return (
    <section className="section">
      <div className="container-x">
        <h1 className="display text-center">Who are you?</h1>
        <p className="mx-auto mt-4 max-w-lg text-center">Pick a role to open the demo. All data is simulated.</p>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {ROLES.map(({ id, title, text, to, icon: Icon }) => (
            <Link
              key={id}
              to={to}
              onClick={() => {
                setView(id);
                track('demo_role_selected', { role: id });
              }}
              className="group block rounded-card"
            >
              <Card className="h-full transition-colors group-hover:bg-brand-100" pad="lg">
                <Icon size={32} strokeWidth={1.5} className="text-brand-700" aria-hidden />
                <h2 className="h2 mt-8">{title}</h2>
                <p className="mt-2">{text}</p>
              </Card>
            </Link>
          ))}
        </div>
        <p className="mt-10 text-center text-sm">
          First time?{' '}
          <Link to="/connect" className="font-medium text-brand-700 underline underline-offset-2">
            See how a system is connected →
          </Link>
        </p>
      </div>
    </section>
  );
}
