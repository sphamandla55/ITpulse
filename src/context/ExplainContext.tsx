import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { explainTerms } from '@/data/recommendationData';

interface ExplainContextValue {
  openExplain: (term: string) => void;
  isOpen: boolean;
  currentTerm: string | null;
  closeExplain: () => void;
}

const ExplainContext = createContext<ExplainContextValue | null>(null);

export function ExplainProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTerm, setCurrentTerm] = useState<string | null>(null);

  const openExplain = useCallback((term: string) => {
    setCurrentTerm(term);
    setIsOpen(true);
  }, []);

  const closeExplain = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ExplainContext.Provider value={{ openExplain, isOpen, currentTerm, closeExplain }}>
      {children}
    </ExplainContext.Provider>
  );
}

export function useExplain() {
  const ctx = useContext(ExplainContext);
  if (!ctx) throw new Error('useExplain must be used within ExplainProvider');
  return ctx;
}

export function findTerm(term: string) {
  return explainTerms.find(
    (t) => t.term.toLowerCase() === term.toLowerCase()
  );
}
