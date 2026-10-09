import { Link } from 'react-router-dom';

export function DemoBanner() {
  return (
    <div className="bg-sun-100 px-4 py-2 text-center text-sm text-ink">
      Demo with simulated data – no real systems are connected.{' '}
      <Link to="/demo" className="font-medium text-brand-700 underline underline-offset-2">
        Back to demo
      </Link>
    </div>
  );
}
