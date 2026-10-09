import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { IssueKind } from '../data/types';
import { DEMO_DATE, dateOf } from '../data/weather';
import { readJson, writeJson } from '../lib/storage';

export type View = 'homeowner' | 'retailer' | 'installer';
export type TaskStatus = 'todo' | 'scheduled' | 'done';

export interface Task {
  id: string;
  siteId: string;
  siteName: string;
  issue: IssueKind;
  lossKwhDay: number;
  createdOn: string;
  status: TaskStatus;
}

interface DemoState {
  view: View;
  setView: (v: View) => void;
  date: string;
  tasks: Task[];
  addTask: (t: Omit<Task, 'id' | 'createdOn' | 'status'>) => void;
  hasTask: (siteId: string, issue: IssueKind) => boolean;
  moveTask: (id: string, status: TaskStatus) => void;
  resetTasks: () => void;
}

const TASKS_KEY = 'ss_tasks';
const VIEW_KEY = 'ss_view';
const Ctx = createContext<DemoState | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [view, setViewState] = useState<View>(() => readJson<View>(VIEW_KEY, 'homeowner'));
  const [tasks, setTasks] = useState<Task[]>(() => readJson<Task[]>(TASKS_KEY, []));

  const setView = useCallback((v: View) => {
    setViewState(v);
    writeJson(VIEW_KEY, v);
  }, []);

  const save = useCallback((next: Task[]) => {
    setTasks(next);
    writeJson(TASKS_KEY, next);
  }, []);

  const value = useMemo<DemoState>(
    () => ({
      view,
      setView,
      date: DEMO_DATE,
      tasks,
      addTask: (t) => {
        if (tasks.some((x) => x.siteId === t.siteId && x.issue === t.issue)) return;
        save([
          ...tasks,
          { ...t, id: `T-${Date.now().toString(36)}`, createdOn: dateOf(0), status: 'todo' },
        ]);
      },
      hasTask: (siteId, issue) => tasks.some((x) => x.siteId === siteId && x.issue === issue),
      moveTask: (id, status) => save(tasks.map((t) => (t.id === id ? { ...t, status } : t))),
      resetTasks: () => save([]),
    }),
    [view, setView, tasks, save],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo(): DemoState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useDemo must be used inside DemoProvider');
  return ctx;
}
