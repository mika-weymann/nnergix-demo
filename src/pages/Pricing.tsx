import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { track } from '../analytics/track';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Tabs } from '../components/ui/Tabs';

type Audience = 'homeowner' | 'portfolio';

const TIERS = [
  { id: 'basic', name: 'Basic', price: 10, features: ['Production monitoring', 'Health check'] },
  { id: 'plus', name: 'Plus', price: 30, popular: true, features: ['Everything in Basic', '7-day forecast', 'Best time to use power', 'Storm & hail alerts'] },
  { id: 'pro', name: 'Pro', price: 50, features: ['Everything in Plus', 'Savings tracker', 'Monthly report', 'One-click maintenance request'] },
];

const PORTFOLIO_EXTRAS: Record<string, string[]> = {
  basic: [],
  plus: ['White-label app for your customers'],
  pro: ['White-label app for your customers', 'API access'],
};

const FAQ = [
  { q: 'Do I need new hardware?', a: 'No. Sentinel Solar reads data from your inverter through its software interface, with your consent.' },
  { q: 'Which inverters are supported?', a: 'We start with the most common brands. Tell us yours in the connect flow and we will let you know.' },
  { q: 'Who can see my data?', a: 'You do. Retailers and installers only see systems whose owners have given consent.' },
  { q: 'Can I cancel anytime?', a: 'Yes. You can revoke access to your inverter at any moment.' },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [audience, setAudience] = useState<Audience>('homeowner');
  const [plan, setPlan] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(0);

  const choose = (id: string) => {
    track('pricing_plan_clicked', { plan: id, audience });
    setPlan(id);
  };

  return (
    <section className="section">
      <div className="container-x">
        <h1 className="display text-center">Simple pricing per rooftop.</h1>
        <div className="mt-10 flex justify-center">
          <Tabs
            label="Who are you?"
            value={audience}
            onChange={(a: Audience) => {
              setAudience(a);
              track('pricing_audience_toggled', { audience: a });
            }}
            tabs={[
              { id: 'homeowner', label: "I'm a homeowner" },
              { id: 'portfolio', label: 'I manage many rooftops' },
            ]}
          />
        </div>
        <p className="mt-4 text-center text-sm">
          {audience === 'portfolio' ? 'Per rooftop, per year. Volume discounts from 1,000 rooftops.' : 'Per rooftop, per year.'}
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {TIERS.map((t) => (
            <Card key={t.id} tone={t.popular ? 'white' : 'surface'} pad="lg" className={`flex flex-col ${t.popular ? 'ring-2 ring-brand-700' : ''}`}>
              <div className="flex items-center justify-between">
                <h2 className="h3">{t.name}</h2>
                {t.popular && <Badge tone="brand">Most chosen</Badge>}
              </div>
              <p className="tabular mt-4 text-5xl font-semibold text-ink">
                €{t.price}
                <span className="text-base font-normal text-muted"> / year</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {[...t.features, ...(audience === 'portfolio' ? PORTFOLIO_EXTRAS[t.id] : [])].map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-brand-700" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button variant={t.popular ? 'primary' : 'secondary'} className="w-full" onClick={() => choose(t.id)}>
                  Choose plan
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mx-auto mt-24 max-w-2xl">
          <h2 className="h2 mb-6">Questions</h2>
          <ul className="space-y-2">
            {FAQ.map((f, i) => (
              <li key={f.q} className="rounded-2xl bg-surface">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open === i}
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-ink"
                  >
                    {f.q}
                    <ChevronDown size={18} strokeWidth={1.5} className={`shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} aria-hidden />
                  </button>
                </h3>
                {open === i && <p className="px-5 pb-5 text-sm">{f.a}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Modal open={plan !== null} onClose={() => setPlan(null)} title="This is a prototype">
        <p>Nothing is charged. Would you like us to contact you about a pilot?</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => navigate(`/pilot?plan=${plan}&audience=${audience}`)}>Yes, request a pilot</Button>
          <Button variant="secondary" onClick={() => setPlan(null)}>
            No thanks
          </Button>
        </div>
      </Modal>
    </section>
  );
}
