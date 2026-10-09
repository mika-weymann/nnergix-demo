import { CheckCircle2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { track } from '../analytics/track';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { readJson, writeJson } from '../lib/storage';

const ROLES = ['Homeowner', 'Energy retailer', 'Installer', 'Aggregator', 'Grid operator', 'Other'];
const ROOFTOPS = ['1', '2–50', '51–1,000', '1,000+'];
const FEATURES = ['Forecasts', 'Health & maintenance', 'Branded app for customers', 'Other'];

const input = 'h-11 w-full rounded-full bg-white px-5 text-ink placeholder:text-muted';

export default function RequestPilot() {
  const [params] = useSearchParams();
  const plan = params.get('plan');
  const audience = params.get('audience');
  const [form, setForm] = useState({
    name: '',
    company: '',
    role: audience === 'portfolio' ? 'Energy retailer' : 'Homeowner',
    rooftops: audience === 'portfolio' ? '51–1,000' : '1',
    feature: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Please tell us your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email.';
    if (!form.feature) next.feature = 'Pick the feature that matters most.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const entry = { ...form, plan, ts: Date.now() };
    writeJson('ss_pilots', [...readJson<unknown[]>('ss_pilots', []), entry]);
    track('pilot_submitted', { role: form.role, rooftops: form.rooftops, feature: form.feature });
    track('feature_interest', { feature: form.feature, source: 'pilot_form' });
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
    if (endpoint) {
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entry) }).catch(() => undefined);
    }
    setDone(true);
  };

  if (done) {
    return (
      <section className="section">
        <div className="container-x max-w-xl text-center">
          <CheckCircle2 size={48} strokeWidth={1.5} className="mx-auto text-ok" aria-hidden />
          <h1 className="h1 mt-6">Thanks – we'll be in touch.</h1>
          <p className="mt-3">Your request is stored in this browser only. This is a prototype.</p>
          <div className="mt-8 flex justify-center">
            <Button to="/demo">Try the demo</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container-x max-w-2xl">
        <h1 className="display">Request a pilot.</h1>
        <p className="mt-4">Tell us a little about you. No payment, no commitment.</p>
        {plan && (
          <div className="mt-4">
            <Badge tone="brand">Plan: {plan.charAt(0).toUpperCase() + plan.slice(1)}</Badge>
          </div>
        )}
        <Card className="mt-10" pad="lg">
          <form onSubmit={submit} noValidate className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">Name</label>
                <input id="name" className={input} value={form.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} />
                {errors.name && <p id="name-err" className="mt-1 text-sm text-alert">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="company" className="mb-2 block text-sm font-medium text-ink">Company (optional)</label>
                <input id="company" className={input} value={form.company} onChange={(e) => set('company', e.target.value)} />
              </div>
              <div>
                <label htmlFor="role" className="mb-2 block text-sm font-medium text-ink">Role</label>
                <select id="role" className={input} value={form.role} onChange={(e) => set('role', e.target.value)}>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="rooftops" className="mb-2 block text-sm font-medium text-ink">Number of rooftops</label>
                <select id="rooftops" className={input} value={form.rooftops} onChange={(e) => set('rooftops', e.target.value)}>
                  {ROOFTOPS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-ink">Most valuable feature</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {FEATURES.map((f) => (
                  <label key={f} className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white px-4 py-3 text-ink">
                    <input type="radio" name="feature" value={f} checked={form.feature === f} onChange={() => set('feature', f)} className="h-4 w-4 accent-[var(--brand-700)]" />
                    {f}
                  </label>
                ))}
              </div>
              {errors.feature && <p className="mt-1 text-sm text-alert">{errors.feature}</p>}
            </fieldset>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">Email</label>
              <input id="email" type="email" className={input} value={form.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} />
              {errors.email && <p id="email-err" className="mt-1 text-sm text-alert">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink">Message (optional)</label>
              <textarea id="message" rows={4} className="w-full rounded-3xl bg-white px-5 py-3 text-ink" value={form.message} onChange={(e) => set('message', e.target.value)} />
            </div>
            <Button type="submit">Send request</Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
