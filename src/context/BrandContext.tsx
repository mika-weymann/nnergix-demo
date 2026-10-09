import { createContext, useContext, useState, type CSSProperties, type ReactNode } from 'react';

export interface Brand {
  name: string;
  vars: Record<string, string>;
}

export const NNERGIX_BRAND: Brand = { name: 'Nnergix Sentinel Solar', vars: {} };

export const SUNVOLT_BRAND: Brand = {
  name: 'Sunvolt Energy',
  vars: {
    '--brand-900': '#06403f',
    '--brand-700': '#0f766e',
    '--brand-500': '#14a39a',
    '--brand-100': '#ddf4f1',
  },
};

interface BrandState {
  whiteLabel: boolean;
  setWhiteLabel: (on: boolean) => void;
}

const Ctx = createContext<BrandState | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [whiteLabel, setWhiteLabel] = useState(false);
  return <Ctx.Provider value={{ whiteLabel, setWhiteLabel }}>{children}</Ctx.Provider>;
}

export function useBrand(): BrandState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useBrand must be used inside BrandProvider');
  return ctx;
}

export function BrandScope({ brand, children }: { brand: Brand; children: ReactNode }) {
  return <div style={brand.vars as CSSProperties}>{children}</div>;
}
