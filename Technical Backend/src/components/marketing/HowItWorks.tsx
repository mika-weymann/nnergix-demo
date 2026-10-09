import { BellRing, LineChart, Plug } from 'lucide-react';
import { Eyebrow } from '../ui/Eyebrow';
import { Reveal } from '../ui/Reveal';

const STEPS = [
  { icon: Plug, title: 'Connect', text: "Link the inverter with the owner's consent. No hardware." },
  { icon: LineChart, title: 'Forecast', text: 'Machine learning predicts production up to 7 days ahead, per rooftop.' },
  { icon: BellRing, title: 'Act', text: 'Get alerts, best hours to use power and maintenance tasks automatically.' },
];

export function HowItWorks() {
  return (
    <section id="how" className="section bg-brand-900 text-white">
      <div className="container-x">
        <Eyebrow onDark>How it works</Eyebrow>
        <h2 className="h1 max-w-2xl text-white">Three steps. No site visit.</h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.06}>
                <div className="flex items-center gap-4">
                  <span className="tabular text-sm font-semibold text-brand-100">0{i + 1}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                    <Icon size={22} strokeWidth={1.5} aria-hidden />
                  </span>
                </div>
                <h3 className="h3 mt-6 text-white">{title}</h3>
                <p className="mt-2 text-brand-100">{text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
