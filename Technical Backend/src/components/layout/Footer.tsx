import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Disclaimer } from './Disclaimer';
import { Wordmark } from './Wordmark';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { to: '/#how', label: 'How it works' },
      { to: '/#features', label: 'Features' },
    ],
  },
  {
    title: 'Demo',
    links: [
      { to: '/demo', label: 'Try the demo' },
      { to: '/connect', label: 'Connect an inverter' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/pricing', label: 'Pricing' },
      { to: '/pilot', label: 'Request a pilot' },
    ],
  },
];

export function Footer() {
  const [privacy, setPrivacy] = useState(false);
  return (
    <footer className="bg-surface">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm">Sentinel Solar is a product concept by Nnergix, Barcelona.</p>
          </div>
          {COLUMNS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted">{c.title}</p>
              <ul className="space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
                {c.title === 'Company' && (
                  <li>
                    <button type="button" onClick={() => setPrivacy(true)} className="hover:text-ink">
                      Privacy
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 pt-2">
          <Disclaimer />
        </div>
      </div>
      <Modal open={privacy} onClose={() => setPrivacy(false)} title="Privacy">
        <p className="text-sm">
          This prototype does not send personal data anywhere. Everything you type or click stays in this browser
          and can be cleared by emptying your site data.
        </p>
      </Modal>
    </footer>
  );
}
