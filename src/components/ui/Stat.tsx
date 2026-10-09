import type { ReactNode } from 'react';

interface Props {
  value: ReactNode;
  caption: string;
  size?: 'lg' | 'md';
  onDark?: boolean;
}

export function Stat({ value, caption, size = 'md', onDark = false }: Props) {
  return (
    <div>
      <div
        className={`tabular font-semibold tracking-tight ${onDark ? 'text-white' : 'text-ink'} ${
          size === 'lg' ? 'text-6xl md:text-7xl' : 'text-3xl md:text-4xl'
        }`}
      >
        {value}
      </div>
      <div
        className={`mt-2 text-xs font-medium uppercase tracking-[0.08em] ${
          onDark ? 'text-brand-100' : 'text-muted'
        }`}
      >
        {caption}
      </div>
    </div>
  );
}
