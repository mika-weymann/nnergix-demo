import type { HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  tone?: 'surface' | 'white' | 'dark' | 'sun';
  pad?: 'md' | 'lg' | 'none';
  children: ReactNode;
}

const tones = {
  surface: 'bg-surface',
  white: 'bg-white shadow-card',
  dark: 'bg-brand-900 text-white',
  sun: 'bg-sun-100',
};

const pads = { md: 'p-6', lg: 'p-6 md:p-8', none: '' };

export function Card({ tone = 'surface', pad = 'md', className = '', children, ...rest }: Props) {
  return (
    <div className={`rounded-card ${tones[tone]} ${pads[pad]} ${className}`} {...rest}>
      {children}
    </div>
  );
}
