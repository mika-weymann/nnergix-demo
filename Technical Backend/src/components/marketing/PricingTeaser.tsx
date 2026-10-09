import { Button } from '../ui/Button';

export function PricingTeaser() {
  return (
    <section aria-label="Pricing" className="section pt-0 md:pt-0">
      <div className="container-x">
        <div className="rounded-card bg-brand-100 px-6 py-14 text-center md:px-12">
          <p className="h1 text-brand-900">From EUR 10 per rooftop per year.</p>
          <div className="mt-4 flex justify-center">
            <Button to="/pricing" variant="link">
              See pricing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
