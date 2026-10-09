import { Stat } from '../ui/Stat';
import { Reveal } from '../ui/Reveal';

export function BigStats() {
  return (
    <section aria-label="Key facts" className="section pt-0 md:pt-0">
      <div className="container-x grid gap-12 md:grid-cols-3">
        {[
          { value: '0', caption: 'hardware to install' },
          { value: '7 days', caption: 'production forecast per rooftop' },
          { value: '1 view', caption: 'for every inverter brand' },
        ].map((s, i) => (
          <Reveal key={s.caption} delay={i * 0.06}>
            <Stat size="lg" value={s.value} caption={s.caption} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
