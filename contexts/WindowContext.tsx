// Powered by OnSpace.AI
import React, { createContext, ReactNode, useCallback, useMemo, useState } from 'react';

export type AppKind = 'notes' | 'files' | 'ai' | 'browser';

export interface WindowInstance {
  id: string;
  app: AppKind;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  payload?: Record<string, unknown>;
}

interface WindowContextValue {
  windows: WindowInstance[];
  topZ: number;
  openWindow: (app: AppKind, opts?: Partial<WindowInstance>) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  toggleMinimize: (id: string) => void;
  updatePayload: (id: string, payload: Record<string, unknown>) => void;
}

export const WindowContext = createContext<WindowContextValue | undefined>(undefined);

const defaultFor = (app: AppKind): Partial<WindowInstance> => {
  switch (app) {
    case 'notes':
      return { title: 'Notes', width: 320, height: 380 };
    case 'files':
      return { title: 'Finder', width: 340, height: 400 };
    case 'ai':
      return { title: 'AI Assistant', width: 340, height: 440 };
    case 'browser':
      return { title: 'SandboxNet', width: 340, height: 420 };
  }
};

let seq = 0;
const nextId = () => {
  seq += 1;
  return 'w_' + Date.now().toString(36) + '_' + seq;
};

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [topZ, setTopZ] = useState(10);

  const openWindow = useCallback((app: AppKind, opts: Partial<WindowInstance> = {}) => {
    const id = nextId();
    setTopZ((prev) => {
      const nextZ = prev + 1;
      const base = defaultFor(app);
      const offset = windows.length * 22;
      const w: WindowInstance = {
        id,
        app,
        title: base.title || app,
        x: 24 + offset,
        y: 60 + offset,
        width: base.width || 320,
        height: base.height || 360,
        z: nextZ,
        minimized: false,
        ...opts,
      };
      setWindows((prevWins) => [...prevWins, w]);
      return nextZ;
    });
    return id;
  }, [windows.length]);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setTopZ((prev) => {
      const nextZ = prev + 1;
      setWindows((prevWins) =>
        prevWins.map((w) => (w.id === id ? { ...w, z: nextZ, minimized: false } : w))
      );
      return nextZ;
    });
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const toggleMinimize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w))
    );
  }, []);

  const updatePayload = useCallback((id: string, payload: Record<string, unknown>) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, payload: { ...(w.payload || {}), ...payload } } : w))
    );
  }, []);

  const value = useMemo<WindowContextValue>(
    () => ({
      windows,
      topZ,
      openWindow,
      closeWindow,
      focusWindow,
      moveWindow,
      toggleMinimize,
      updatePayload,
    }),
    [windows, topZ, openWindow, closeWindow, focusWindow, moveWindow, toggleMinimize, updatePayload]
  );

  return <WindowContext.Provider value={value}>{children}</WindowContext.Provider>;
}
