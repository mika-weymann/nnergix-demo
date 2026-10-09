import { ArrowRight } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'link' | 'onDark';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  to?: string;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const styles: Record<Variant, string> = {
  primary: `${base} h-11 rounded-full bg-brand-700 px-6 text-white hover:bg-brand-900`,
  secondary: `${base} h-11 rounded-full bg-white px-6 text-ink ring-1 ring-[#E1E4E8] hover:bg-surface`,
  onDark: `${base} h-11 rounded-full bg-white px-6 text-brand-900 hover:bg-brand-100`,
  link: `${base} text-brand-700 hover:text-brand-900`,
};

export function Button({ variant = 'primary', to, children, className = '', ...rest }: Props) {
  const cls = `${styles[variant]} ${className}`;
  const content = (
    <>
      {children}
      {variant === 'link' && <ArrowRight size={16} strokeWidth={1.5} aria-hidden />}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} onClick={rest.onClick as never}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {content}
    </button>
  );
}
