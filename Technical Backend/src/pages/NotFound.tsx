import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-x text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-700">404</p>
        <h1 className="display mt-4">This page took the day off.</h1>
        <p className="mt-4">The page you are looking for does not exist.</p>
        <div className="mt-8 flex justify-center">
          <Button to="/">Back to home</Button>
        </div>
      </div>
    </section>
  );
}
