import { useContext } from 'react';
import { StoreContext } from '@/contexts/StoreContext';

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
}
