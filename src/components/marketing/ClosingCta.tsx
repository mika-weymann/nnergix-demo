import { track } from '../../analytics/track';
import { Button } from '../ui/Button';

export function ClosingCta() {
  return (
    <section aria-label="Request a pilot" className="section">
      <div className="container-x text-center">
        <h2 className="display mx-auto max-w-3xl">
          Small roofs.
          <br />
          Big picture.
        </h2>
        <div className="mt-10 flex justify-center">
          <Button to="/pilot" onClick={() => track('cta_clicked', { location: 'closing' })}>
            Request a pilot
          </Button>
        </div>
      </div>
    </section>
  );
}
