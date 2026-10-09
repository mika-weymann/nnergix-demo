import { Building2, Network, Zap, type LucideIcon } from 'lucide-react';

const ITEMS: { label: string; icon: LucideIcon }[] = [
  { label: 'Energy trader', icon: Zap },
  { label: 'System operator', icon: Network },
  { label: 'Asset owner', icon: Building2 },
  { label: 'Utility', icon: Zap },
  { label: 'Plant operator', icon: Building2 },
];

export function LogoStrip() {
  return (
    <section aria-label="Who the forecasting is built for" className="pb-8 md:pb-16">
      <div className="container-x">
        <p className="mb-8 text-center text-sm">
          Built on forecasting trusted by energy traders, grid operators and plant owners
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {ITEMS.map(({ label, icon: Icon }) => (
            <li key={label} className="flex items-center gap-2 text-sm font-medium text-muted">
              <Icon size={20} strokeWidth={1.5} aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
