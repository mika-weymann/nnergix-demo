import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { track } from '../../analytics/track';
import { Button } from '../ui/Button';
import { Wordmark } from './Wordmark';

const LINKS = [
  { to: '/#how', label: 'Product' },
  { to: '/?tab=homeowners#views', label: 'For homeowners' },
  { to: '/?tab=retailers#views', label: 'For retailers' },
  { to: '/?tab=installers#views', label: 'For installers' },
  { to: '/pricing', label: 'Pricing' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/85 backdrop-blur transition-shadow ${
        scrolled ? 'shadow-[0_1px_0_rgba(16,24,40,.06)]' : ''
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-6">
        <Wordmark />
        <nav aria-label="Main" className="hidden items-center gap-6 whitespace-nowrap xl:flex">
          {LINKS.map((l) => (
            <Link key={l.label} to={l.to} className="text-sm font-medium text-body hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 whitespace-nowrap xl:flex">
          <Link to="/demo" className="text-sm font-medium text-ink hover:text-brand-700">
            Try the demo
          </Link>
          <Button to="/pilot" onClick={() => track('cta_clicked', { location: 'navbar' })}>
            Request a pilot
          </Button>
        </div>
        <button
          type="button"
          className="rounded-full p-2 text-ink hover:bg-surface xl:hidden"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white xl:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="container-x flex h-16 items-center justify-between">
            <Wordmark />
            <button type="button" className="rounded-full p-2 hover:bg-surface" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          <nav aria-label="Mobile" className="container-x flex flex-1 flex-col gap-1 pt-6">
            {LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="rounded-2xl px-2 py-3 text-2xl font-semibold text-ink">
                {l.label}
              </Link>
            ))}
            <Link to="/demo" className="rounded-2xl px-2 py-3 text-2xl font-semibold text-ink">
              Try the demo
            </Link>
            <div className="mt-6">
              <Button to="/pilot" className="w-full" onClick={() => track('cta_clicked', { location: 'mobile_menu' })}>
                Request a pilot
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
