import { Suspense, lazy } from 'react';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Card } from '../components/ui/Card';
import { Reveal } from '../components/ui/Reveal';
import { BigStats } from '../components/marketing/BigStats';
import { ClosingCta } from '../components/marketing/ClosingCta';
import { FeatureGrid } from '../components/marketing/FeatureGrid';
import { Hero } from '../components/marketing/Hero';
import { HowItWorks } from '../components/marketing/HowItWorks';
import { LogoStrip } from '../components/marketing/LogoStrip';
import { PricingTeaser } from '../components/marketing/PricingTeaser';

const AudienceTabs = lazy(() => import('../components/marketing/AudienceTabs').then((m) => ({ default: m.AudienceTabs })));

const PROBLEMS = [
  { who: 'Homeowners', text: "Don't know if their panels work as they should." },
  { who: 'Retailers', text: "Must buy energy without knowing what their customers' roofs will produce." },
  { who: 'Installers', text: 'Check hundreds of roofs, each with a different inverter brand.' },
];

const NEXT = [
  { title: 'Flexibility aggregators', text: 'Area-level forecasts for flexibility bids. Coming soon.' },
  { title: 'Grid operators', text: 'Area-level forecasts for grid planning. Coming soon.' },
];

export default function Landing() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <section className="section">
        <div className="container-x">
          <Eyebrow>The problem</Eyebrow>
          <h2 className="h1 mb-12 max-w-2xl">Millions of small solar systems. No one sees them.</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {PROBLEMS.map((p, i) => (
              <Reveal key={p.who} delay={i * 0.06}>
                <Card className="h-full">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-700">{p.who}</p>
                  <p className="h3 mt-3">{p.text}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <HowItWorks />
      <Suspense fallback={<div className="section container-x min-h-[640px]" aria-hidden />}>
        <AudienceTabs />
      </Suspense>
      <BigStats />
      <FeatureGrid />
      <section className="section pt-0 md:pt-0">
        <div className="container-x">
          <Eyebrow>Coming next</Eyebrow>
          <div className="grid gap-4 md:grid-cols-2">
            {NEXT.map((n) => (
              <Card key={n.title} className="opacity-80">
                <h3 className="h3">{n.title}</h3>
                <p className="mt-1 text-sm">{n.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <PricingTeaser />
      <ClosingCta />
    </>
  );
}
