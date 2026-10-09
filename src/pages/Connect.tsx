import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { track } from '../analytics/track';
import { Wordmark } from '../components/layout/Wordmark';
import { DemoBanner } from '../components/marketing/DemoBanner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { INVERTER_BRANDS } from '../data/inverters';
import { readJson, writeJson } from '../lib/storage';

const OTHER = 'Other';

export default function Connect() {
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step !== 3) return;
    setProgress(0);
    const start = window.setTimeout(() => setProgress(100), 50);
    const done = window.setTimeout(() => {
      setStep(4);
      track('connect_completed', { brand: brand ?? 'unknown' });
    }, 2500);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(done);
    };
  }, [step, brand]);

  const submitEmail = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    writeJson('ss_waitlist', [...readJson<string[]>('ss_waitlist', []), email]);
    track('connect_brand_unsupported');
    setNotified(true);
  };

  const dots = [1, 2, 3];
  const current = Math.min(step, 3);

  return (
    <div className="min-h-screen bg-white">
      <DemoBanner />
      <header className="container-x flex h-16 items-center">
        <Wordmark />
      </header>
      <main className="container-x max-w-2xl py-10">
        <ol className="mb-10 flex items-center justify-center gap-3" aria-label="Progress">
          {dots.map((d) => (
            <li key={d} aria-current={d === current ? 'step' : undefined} className={`h-2.5 rounded-full transition-all ${d <= current ? 'w-8 bg-brand-700' : 'w-2.5 bg-surface'}`}>
              <span className="sr-only">Step {d}</span>
            </li>
          ))}
        </ol>

        {step === 1 && (
          <Card pad="lg">
            <h1 className="h1">Choose your inverter brand</h1>
            <p className="mt-2">Sentinel Solar reads production data through the inverter's software interface.</p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[...INVERTER_BRANDS, OTHER].map((b) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={brand === b}
                  onClick={() => setBrand(b)}
                  className={`rounded-2xl px-4 py-5 text-left text-sm font-medium transition-colors ${
                    brand === b ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-700' : 'bg-white text-ink hover:bg-brand-100'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {brand === OTHER ? (
              <div className="mt-8 rounded-2xl bg-white p-5">
                {notified ? (
                  <p className="flex items-center gap-2 text-ink">
                    <CheckCircle2 size={20} className="text-ok" aria-hidden /> Thanks. We'll email you when your brand is supported.
                  </p>
                ) : (
                  <>
                    <p className="text-ink">We'll let you know when your brand is supported.</p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <label className="flex-1">
                        <span className="sr-only">Email</span>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="h-11 w-full rounded-full bg-surface px-5 text-ink placeholder:text-muted"
                        />
                      </label>
                      <Button onClick={submitEmail} disabled={!/^\S+@\S+\.\S+$/.test(email)}>
                        Notify me
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="mt-8">
                <Button
                  disabled={!brand}
                  onClick={() => {
                    track('connect_started');
                    setStep(2);
                  }}
                >
                  Continue
                </Button>
              </div>
            )}
          </Card>
        )}

        {step === 2 && (
          <Card pad="lg">
            <h1 className="h1">Give consent</h1>
            <p className="mt-2">You are connecting {brand}.</p>
            <label className="mt-8 flex cursor-pointer items-start gap-3 text-ink">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1.5 h-5 w-5 accent-[var(--brand-700)]" />
              <span>I allow Nnergix to read production data from my inverter. I can revoke this anytime.</span>
            </label>
            <div className="mt-8 flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button disabled={!consent} onClick={() => setStep(3)}>
                Connect
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card pad="lg">
            <h1 className="h1">Connecting…</h1>
            <p className="mt-2" role="status">Talking to {brand} and building your first forecast.</p>
            <div className="mt-8 h-3 overflow-hidden rounded-full bg-white" role="progressbar" aria-label="Connecting" aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-brand-700 transition-[width] duration-[2400ms] ease-out" style={{ width: `${progress}%` }} />
            </div>
          </Card>
        )}

        {step === 4 && (
          <Card pad="lg">
            <CheckCircle2 size={40} strokeWidth={1.5} className="text-ok" aria-hidden />
            <h1 className="h1 mt-4">Connected.</h1>
            <p className="mt-2">Your first forecast is ready.</p>
            <div className="mt-8">
              <Button to="/app/home">Open my dashboard</Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
