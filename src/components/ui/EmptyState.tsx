import type { ReactNode } from 'react';

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="rounded-card bg-surface px-6 py-12 text-center">
      <p className="h3">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm">{text}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
