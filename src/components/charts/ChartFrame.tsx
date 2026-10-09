import type { ReactNode } from 'react';

export function ChartFrame({ label, height, children }: { label: string; height: number; children: ReactNode }) {
  return (
    <div role="img" aria-label={label} style={{ height }} className="w-full">
      {children}
    </div>
  );
}

export const AXIS = { fill: '#6B7280', fontSize: 12 } as const;
export const SUN = '#F5A524';
export const BRAND = '#1F7AC0';
export const MUTED = '#9CA3AF';
