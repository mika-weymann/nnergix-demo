import { Activity, CloudHail, Clock, PiggyBank, TrendingUp, Wrench } from 'lucide-react';
import { Card } from '../ui/Card';
import { Eyebrow } from '../ui/Eyebrow';
import { Reveal } from '../ui/Reveal';

const FEATURES = [
  { icon: TrendingUp, title: 'Production forecast', text: 'Hour-by-hour, up to 7 days ahead.' },
  { icon: Activity, title: 'Health check', text: 'Actual against expected, in plain words.' },
  { icon: Clock, title: 'Best time to use power', text: 'Run big appliances when the sun is strongest.' },
  { icon: PiggyBank, title: 'Savings tracker', text: 'Euros saved and CO₂ avoided each month.' },
  { icon: CloudHail, title: 'Storm & hail alerts', text: 'Early warnings from Sentinel Weather.' },
  { icon: Wrench, title: 'Maintenance list', text: 'Faults become tasks, ranked by lost energy.' },
];

export function FeatureGrid() {
  return (
    <section id="features" className="section scroll-mt-16 pt-0 md:pt-0">
      <div className="container-x">
        <Eyebrow>What you get</Eyebrow>
        <h2 className="h1 mb-12 max-w-2xl">Six things, done well.</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.06}>
              <Card className="h-full">
                <Icon size={24} strokeWidth={1.5} className="text-brand-700" aria-hidden />
                <h3 className="h3 mt-5">{title}</h3>
                <p className="mt-1 text-sm">{text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
