import { Link } from 'react-router-dom';

export function Wordmark({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-baseline gap-2" aria-label="Nnergix Sentinel Solar, home">
      <span className={`text-xl font-bold tracking-tight ${onDark ? 'text-white' : 'text-brand-900'}`}>nnergix</span>
      <span className={`text-xs font-medium uppercase tracking-[0.08em] ${onDark ? 'text-brand-100' : 'text-muted'}`}>
        Sentinel Solar
      </span>
    </Link>
  );
}
