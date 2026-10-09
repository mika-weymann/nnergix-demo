import { CheckCircle2 } from 'lucide-react';
import { track } from '../../analytics/track';
import { household } from '../../data/household';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Eyebrow } from '../ui/Eyebrow';
import { TodayCard } from '../app/TodayCard';

export function Hero() {
  return (
    <section className="section pb-16 pt-14 md:pb-24 md:pt-24">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Eyebrow>Sentinel Solar by Nnergix</Eyebrow>
          <h1 className="display">Every rooftop, forecast and monitored.</h1>
          <p className="mt-6 max-w-xl text-lg">
            Production forecasts and health monitoring for rooftop solar. No hardware, no site visits – connected through the inverter in minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button to="/demo" onClick={() => track('cta_clicked', { location: 'hero_demo' })}>
              Try the demo
            </Button>
            <Button to="/pilot" variant="link" onClick={() => track('cta_clicked', { location: 'hero_pilot' })}>
              Request a pilot
            </Button>
          </div>
        </div>
        <Card tone="white" pad="none" className="p-4 md:p-6" aria-label="Preview of the homeowner app">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-2 pt-1">
            <div>
              <p className="text-sm font-semibold text-ink">Good afternoon, {household.name}</p>
              <p className="text-xs text-muted">{household.address}</p>
            </div>
            <Badge tone="ok">
              <CheckCircle2 size={14} strokeWidth={1.5} aria-hidden /> Working as expected
            </Badge>
          </div>
          <TodayCard compact />
        </Card>
      </div>
    </section>
  );
}
