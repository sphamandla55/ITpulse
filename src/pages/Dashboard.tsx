import { useState, useEffect } from 'react';
import type { PageKey, Status, TroubleshootHistoryEntry } from '@/types';
import { ScoreCircle } from '@/components/ScoreCircle';
import { StatusBadge, statusColor } from '@/components/StatusBadge';
import { Icon } from '@/components/Icon';
import { ExplainButton } from '@/components/ExplainModal';
import { DemoNotice } from '@/components/DemoNotice';
import { Modal } from '@/components/Modal';
import { healthCategories } from '@/data/deviceData';
import { useTroubleshootHistory } from '@/hooks/useTroubleshootHistory';
import { Play, RotateCw, CheckCircle2, Loader2, ArrowRight, History, X, AlertTriangle, HardDrive, RefreshCw } from 'lucide-react';

interface Props {
  onNavigate: (page: PageKey) => void;
}

const checkSteps = [
  'Checking network...',
  'Checking storage...',
  'Checking security...',
  'Checking performance...',
  'Checking updates...',
];

function formatDate(ts: number): string {
  const now = new Date();
  const date = new Date(ts);
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
}

export function Dashboard({ onNavigate }: Props) {
  const [checking, setChecking] = useState(false);
  const [checkStepIndex, setCheckStepIndex] = useState(-1);
  const [checked, setChecked] = useState(false);
  const [animScore, setAnimScore] = useState(84);
  const { history } = useTroubleshootHistory();
  const [viewingEntry, setViewingEntry] = useState<TroubleshootHistoryEntry | null>(null);

  useEffect(() => {
    if (!checking) return;
    setCheckStepIndex(0);
  }, [checking]);

  useEffect(() => {
    if (checkStepIndex < 0 || checkStepIndex >= checkSteps.length) return;
    const timer = setTimeout(() => {
      if (checkStepIndex < checkSteps.length - 1) {
        setCheckStepIndex(checkStepIndex + 1);
      } else {
        setTimeout(() => {
          setChecking(false);
          setChecked(true);
          setCheckStepIndex(-1);
        }, 600);
      }
    }, 900);
    return () => clearTimeout(timer);
  }, [checkStepIndex, checking]);

  const handleCheck = () => {
    setChecked(false);
    setAnimScore(84);
    setChecking(true);
  };

  const recommendedActions = [
    {
      icon: 'hard-drive',
      title: 'Storage is getting full',
      message: 'Your storage is 78% used.',
      action: 'View Recommendation',
      page: 'recommendations' as PageKey,
      color: 'amber',
    },
    {
      icon: 'refresh-cw',
      title: 'Updates need attention',
      message: '3 updates are available.',
      action: 'View Recommendation',
      page: 'recommendations' as PageKey,
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-lg lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-100">Good morning, Alex!</p>
            <h2 className="mt-1 text-2xl font-bold lg:text-3xl">Your IT Health Score</h2>
            <p className="mt-2 max-w-md text-sm text-brand-100">
              Your device is generally healthy, but a few items need attention.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleCheck}
                disabled={checking}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 shadow-md transition-all hover:bg-brand-50 disabled:opacity-70"
              >
                {checking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : checked ? (
                  <RotateCw className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {checking ? 'Checking...' : checked ? 'Run Again' : 'Run Full Health Check'}
              </button>
              <button
                onClick={() => onNavigate('device-health')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                View Details
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex shrink-0 justify-center">
            <ScoreCircle score={animScore} size={160} label="Health Score" />
          </div>
        </div>
      </div>

      {(checking || (checked && checkStepIndex < 0)) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          {checking ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Running health check...</p>
              {checkSteps.map((step, i) => (
                <div
                  key={step}
                  className={`flex items-center gap-3 text-sm transition-all ${
                    i < checkStepIndex
                      ? 'text-slate-700'
                      : i === checkStepIndex
                      ? 'text-brand-600'
                      : 'text-slate-300'
                  }`}
                >
                  {i < checkStepIndex ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : i === checkStepIndex ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-slate-200" />
                  )}
                  {step}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {checked && !checking && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 animate-slide-up">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-800">
            Health check complete. Your score is {animScore}/100 — a few items need attention.
          </p>
        </div>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Health Overview</h3>
          <button
            onClick={() => onNavigate('recommendations')}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View Recommendations →
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {healthCategories.map((cat) => {
            const c = statusColor(cat.status as Status);
            return (
              <button
                key={cat.key}
                onClick={() => onNavigate('device-health')}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-card transition-all hover:shadow-card-hover hover:border-slate-300"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg}`}>
                    <Icon name={cat.icon} className={`h-5 w-5 ${c.text}`} />
                  </div>
                  <StatusBadge status={cat.status as Status} />
                </div>
                <h4 className="mt-3 font-semibold text-slate-900">{cat.label}</h4>
                <p className="mt-1 text-sm text-slate-500">{cat.message}</p>
                {(cat.key === 'storage' || cat.key === 'performance') && (
                  <div className="mt-2">
                    <ExplainButton term={cat.key === 'storage' ? 'Cache' : 'CPU'} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Actions */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-slate-900">Recommended Actions</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {recommendedActions.map((action, i) => {
            const colorMap: Record<string, { bg: string; text: string }> = {
              amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
              orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
            };
            const cm = colorMap[action.color];
            return (
              <button
                key={i}
                onClick={() => onNavigate(action.page)}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-card transition-all hover:shadow-card-hover"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${cm.bg}`}>
                  {action.icon === 'hard-drive' ? (
                    <HardDrive className={`h-6 w-6 ${cm.text}`} />
                  ) : (
                    <RefreshCw className={`h-6 w-6 ${cm.text}`} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-slate-900">{action.title}</h4>
                  <p className="mt-0.5 text-sm text-slate-500">{action.message}</p>
                  <span className="mt-1 inline-block text-sm font-medium text-brand-600 group-hover:text-brand-700">
                    {action.action} →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Troubleshooting */}
      {history.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <History className="h-5 w-5 text-slate-400" />
              Recent Troubleshooting
            </h3>
            <button
              onClick={() => onNavigate('troubleshoot')}
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              New Troubleshooting →
            </button>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-card">
            {history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setViewingEntry(entry)}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-slate-50"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${entry.outcome === 'solved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {entry.outcome === 'solved' ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{entry.problem}</p>
                  <p className="text-xs text-slate-400">{formatDate(entry.date)}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${entry.outcome === 'solved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {entry.outcome === 'solved' ? '✓ Solved' : '⚠ Escalated'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <button
          onClick={() => onNavigate('troubleshoot')}
          className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-card transition-all hover:shadow-card-hover"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name="wrench" className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Having a problem?</h4>
              <p className="mt-0.5 text-sm text-slate-500">
                Describe your issue and get guided, step-by-step troubleshooting.
              </p>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-slate-300 transition-colors group-hover:text-brand-500" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('knowledge')}
          className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-card transition-all hover:shadow-card-hover"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Icon name="book-open" className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Learn something new</h4>
              <p className="mt-0.5 text-sm text-slate-500">
                Understand IT concepts in plain language with quick quizzes.
              </p>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-slate-300 transition-colors group-hover:text-sky-500" />
          </div>
        </button>
      </div>

      <DemoNotice />

      {/* History Detail Modal */}
      <Modal
        open={!!viewingEntry}
        onClose={() => setViewingEntry(null)}
        title="Troubleshooting Summary"
      >
        {viewingEntry && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${viewingEntry.outcome === 'solved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {viewingEntry.outcome === 'solved' ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{viewingEntry.problem}</h3>
                <p className="text-xs text-slate-400">{formatDate(viewingEntry.date)}</p>
              </div>
              <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ${viewingEntry.outcome === 'solved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {viewingEntry.outcome === 'solved' ? 'Solved' : 'Escalated'}
              </span>
            </div>

            {viewingEntry.userDescription && (
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-400">Your description:</p>
                <p className="mt-1 text-sm italic text-slate-600">"{viewingEntry.userDescription}"</p>
              </div>
            )}

            {viewingEntry.fixCause && (
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-xs font-semibold text-emerald-600">What fixed it:</p>
                <p className="mt-1 text-sm text-slate-700">{viewingEntry.fixCause}</p>
              </div>
            )}

            {viewingEntry.possibleCause && (
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-xs font-semibold text-amber-600">Possible cause:</p>
                <p className="mt-1 text-sm text-slate-700">{viewingEntry.possibleCause}</p>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Steps completed:</p>
              <div className="space-y-1.5">
                {viewingEntry.steps.map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-lg bg-slate-50 px-3 py-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{s.question}</p>
                      <p className="text-xs text-slate-400">You selected: {s.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
