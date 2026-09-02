// Powered by OnSpace.AI
import { useContext } from 'react';
import { VFSContext } from '@/contexts/VFSContext';

export function useVFS() {
  const ctx = useContext(VFSContext);
  if (!ctx) throw new Error('useVFS must be used within a VFSProvider');
  return ctx;
}
