import type { ReactNode } from 'react';

export function Table({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="overflow-x-auto">
      <table aria-label={label} className="w-full min-w-[640px] border-separate border-spacing-y-2 text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function Th({ children, align = 'left' }: { children?: ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      scope="col"
      className={`px-4 pb-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted ${
        align === 'right' ? 'text-right' : ''
      }`}
    >
      {children}
    </th>
  );
}

export function Tr({ children }: { children: ReactNode }) {
  return <tr className="group bg-surface [&>td:first-child]:rounded-l-2xl [&>td:last-child]:rounded-r-2xl">{children}</tr>;
}

export function Td({ children, align = 'left' }: { children?: ReactNode; align?: 'left' | 'right' }) {
  return <td className={`px-4 py-3 text-ink ${align === 'right' ? 'text-right tabular' : ''}`}>{children}</td>;
}
