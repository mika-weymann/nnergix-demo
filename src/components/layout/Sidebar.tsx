import { Home, Map, Settings, Wrench, type LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Wordmark } from './Wordmark';

const ITEMS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/app/home', label: 'Home', icon: Home },
  { to: '/app/portfolio', label: 'Portfolio', icon: Map },
  { to: '/app/maintenance', label: 'Maintenance', icon: Wrench },
];

const link = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-100 text-brand-700' : 'text-body hover:bg-surface hover:text-ink'
  }`;

export function Sidebar({ onSettings }: { onSettings: () => void }) {
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col justify-between p-5 md:flex">
        <div>
          <div className="mb-8 px-2 pt-2">
            <Wordmark />
          </div>
          <nav aria-label="App" className="flex flex-col gap-1">
            {ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={link}>
                <Icon size={18} strokeWidth={1.5} aria-hidden />
                {label}
              </NavLink>
            ))}
            <button type="button" onClick={onSettings} className={link({ isActive: false })}>
              <Settings size={18} strokeWidth={1.5} aria-hidden />
              Settings
            </button>
          </nav>
        </div>
      </aside>

      <nav
        aria-label="App"
        className="fixed inset-x-0 bottom-0 z-40 flex justify-around bg-white/95 px-2 py-2 shadow-[0_-1px_0_rgba(16,24,40,.06)] backdrop-blur md:hidden"
      >
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-xs font-medium ${
                isActive ? 'text-brand-700' : 'text-body'
              }`
            }
          >
            <Icon size={20} strokeWidth={1.5} aria-hidden />
            {label}
          </NavLink>
        ))}
        <button type="button" onClick={onSettings} className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5 text-xs font-medium text-body">
          <Settings size={20} strokeWidth={1.5} aria-hidden />
          Settings
        </button>
      </nav>
    </>
  );
}
