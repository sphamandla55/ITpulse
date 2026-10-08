import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { TroubleshootHistoryEntry } from '@/types';

export function useTroubleshootHistory() {
  const [history, setHistory] = useLocalStorage<TroubleshootHistoryEntry[]>('it-pulse-history', []);

  const addEntry = useCallback((entry: TroubleshootHistoryEntry) => {
    setHistory([entry, ...history].slice(0, 10));
  }, [history, setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return { history, addEntry, clearHistory };
}
