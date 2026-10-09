import type { ReactNode } from 'react';

export type Tone = 'ok' | 'warn' | 'alert' | 'brand' | 'neutral';

const tones: Record<Tone, string> = {
  ok: 'bg-[color-mix(in_srgb,var(--ok)_10%,white)] text-ok',
  warn: 'bg-[color-mix(in_srgb,var(--warn)_10%,white)] text-warn',
  alert: 'bg-[color-mix(in_srgb,var(--alert)_10%,white)] text-alert',
  brand: 'bg-brand-100 text-brand-700',
  neutral: 'bg-surface text-body',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
