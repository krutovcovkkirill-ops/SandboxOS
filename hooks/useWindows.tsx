// Powered by OnSpace.AI
import { useContext } from 'react';
import { WindowContext } from '@/contexts/WindowContext';

export function useWindows() {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error('useWindows must be used within a WindowProvider');
  return ctx;
}
