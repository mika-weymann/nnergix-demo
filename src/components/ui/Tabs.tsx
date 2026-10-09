import { useId } from 'react';

interface Tab<T extends string> {
  id: T;
  label: string;
}

interface Props<T extends string> {
  tabs: Tab<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}

export function Tabs<T extends string>({ tabs, value, onChange, label }: Props<T>) {
  const uid = useId();
  return (
    <div role="tablist" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-full bg-surface p-1">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            id={`${uid}-${t.id}`}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={`h-10 rounded-full px-5 text-sm font-medium transition-colors ${
              active ? 'bg-white text-ink shadow-card' : 'text-body hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
