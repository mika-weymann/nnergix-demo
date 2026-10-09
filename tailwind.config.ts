import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: 'var(--brand-900)',
          700: 'var(--brand-700)',
          500: 'var(--brand-500)',
          100: 'var(--brand-100)',
        },
        sun: { 500: 'var(--sun-500)', 100: 'var(--sun-100)' },
        ink: 'var(--ink)',
        body: 'var(--text)',
        muted: 'var(--muted)',
        surface: 'var(--surface)',
        ok: 'var(--ok)',
        warn: 'var(--warn)',
        alert: 'var(--alert)',
      },
      fontFamily: { sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'] },
      borderRadius: { card: '20px' },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06)',
      },
      maxWidth: { content: '1200px' },
    },
  },
  plugins: [],
} satisfies Config;
