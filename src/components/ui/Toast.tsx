import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

const Ctx = createContext<(message: string) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number>();

  const show = useCallback((m: string) => {
    setMessage(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 4000);
  }, []);

  return (
    <Ctx.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[1100] flex justify-center px-4 md:bottom-8">
        {message && (
          <div className="pointer-events-auto rounded-full bg-brand-900 px-5 py-3 text-sm text-white shadow-card">
            {message}
          </div>
        )}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  return useContext(Ctx);
}
