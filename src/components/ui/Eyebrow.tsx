import type { ReactNode } from 'react';

export function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <p
      className={`mb-4 text-xs font-semibold uppercase tracking-[0.08em] ${
        onDark ? 'text-brand-100' : 'text-brand-700'
      }`}
    >
      {children}
    </p>
  );
}
