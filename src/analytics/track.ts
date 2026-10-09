import type { EventName, EventProps, TrackedEvent } from './events';

const KEY = 'ss_events';
const SESSION_KEY = 'ss_session';

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2, 10);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'no-session';
  }
}

export function getEvents(): TrackedEvent[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TrackedEvent[]) : [];
  } catch {
    return [];
  }
}

export function clearEvents(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
}

export function track(event: EventName, props?: EventProps): void {
  const entry: TrackedEvent = { event, props, ts: Date.now(), sessionId: sessionId() };
  try {
    localStorage.setItem(KEY, JSON.stringify([...getEvents(), entry]));
  } catch {
    /* storage unavailable */
  }
  const plausible = (window as unknown as { plausible?: (name: string, o?: unknown) => void })
    .plausible;
  if (plausible) plausible(event, { props });
}
