import { useExplain, findTerm } from '@/context/ExplainContext';
import { X, BookOpen } from 'lucide-react';

export function ExplainModal() {
  const { isOpen, currentTerm, closeExplain } = useExplain();
  const term = currentTerm ? findTerm(currentTerm) : null;

  if (!isOpen || !term) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-fade-in"
      onClick={closeExplain}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{term.term}</h3>
              <p className="text-xs text-slate-500">Plain-language explanation</p>
            </div>
          </div>
          <button
            onClick={closeExplain}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <p className="text-sm font-medium text-slate-700">{term.short}</p>
          <div className="h-px bg-slate-100" />
          <p className="text-sm leading-relaxed text-slate-600">{term.long}</p>
        </div>
        <button
          onClick={closeExplain}
          className="mt-5 w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export function ExplainButton({ term }: { term: string }) {
  const { openExplain } = useExplain();
  return (
    <button
      onClick={() => openExplain(term)}
      className="inline-flex items-center gap-1 rounded-md border border-brand-200 bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-100"
    >
      <BookOpen className="h-3 w-3" />
      Explain This
    </button>
  );
}
