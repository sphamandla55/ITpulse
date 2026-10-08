import type { PageKey } from '@/types';
import { recommendations } from '@/data/recommendationData';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { DemoNotice } from '@/components/DemoNotice';
import { ArrowRight, BookOpen, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const priorityConfig = {
  high: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: 'High Priority' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', label: 'Medium Priority' },
  low: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', label: 'Low Priority' },
};

const guideContent: Record<string, { title: string; steps: string[] }> = {
  storage: {
    title: 'How to Free Up Storage Space',
    steps: [
      'Press Windows Key, type "Storage Settings" and press Enter',
      'Click "Temporary files" and check items to remove (temp files, recycle bin, thumbnails)',
      'Click "Remove files" to free up space immediately',
      'Open File Explorer and check your Downloads folder for large files you no longer need',
      'Move large files to OneDrive cloud storage to free up local space',
      'Go to Settings > Apps > Installed apps and uninstall applications you no longer use',
      'Empty your Recycle Bin to permanently free up the space',
    ],
  },
  updates: {
    title: 'How to Install System Updates',
    steps: [
      'Press Windows Key, type "Windows Update" and press Enter',
      'Click "Check for updates"',
      'If updates are found, click "Download and install"',
      'Wait for the download to complete — do not close the window',
      'Click "Restart now" when prompted (save your work first)',
      'Wait for the updates to install during the restart (this may take 10-30 minutes)',
      'After restarting, check Windows Update again to confirm all updates are installed',
    ],
  },
  security: {
    title: 'How to Improve Your Account Security',
    steps: [
      'Go to your company\'s security portal (often at mysecurity.yourcompany.com or aka.ms/mfasetup)',
      'Sign in with your work account',
      'Follow the prompts to register your phone for MFA if not already done',
      'Download the Microsoft Authenticator app from your phone\'s app store',
      'In the security portal, set up the authenticator app as your primary MFA method',
      'Enable MFA on every corporate application that supports it (VPN, cloud storage, etc.)',
      'Complete the mandatory phishing awareness training in the learning portal',
    ],
  },
};

export function Recommendations({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const visibleRecs = recommendations.filter((r) => !dismissed.includes(r.id));

  const handleDismiss = (id: string) => {
    setDismissed([...dismissed, id]);
  };

  const guide = selectedGuide ? guideContent[selectedGuide] : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">My Recommendations</h2>
        <p className="text-sm text-slate-500">
          Personalized actions based on your latest health check results.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-brand-50 border border-brand-100 px-4 py-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-brand-600" />
        <p className="text-sm text-brand-700">
          {visibleRecs.length} recommendations — {visibleRecs.filter((r) => r.priority === 'high').length} are high priority.
        </p>
      </div>

      <div className="space-y-4">
        {visibleRecs.map((rec) => {
          const pc = priorityConfig[rec.priority];
          return (
            <div
              key={rec.id}
              className={`rounded-2xl border ${pc.border} bg-white p-5 shadow-card transition-all hover:shadow-card-hover`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${pc.bg}`}>
                  <Icon name={rec.icon} className={`h-6 w-6 ${pc.text}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{rec.title}</h3>
                    <span className={`rounded-full ${pc.bg} ${pc.text} px-2 py-0.5 text-[10px] font-medium`}>
                      {pc.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{rec.description}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600">Recommended action:</span>
                    <span className="text-sm font-semibold text-slate-800">{rec.action}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => setSelectedGuide(rec.guideType)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      View Guide
                    </button>
                    <button
                      onClick={() => handleDismiss(rec.id)}
                      className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-600"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visibleRecs.length === 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
          <h3 className="mt-3 font-semibold text-emerald-900">All caught up!</h3>
          <p className="mt-1 text-sm text-emerald-700">
            You've dismissed all recommendations. Run a new health check to get fresh recommendations.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div>
          <h4 className="font-semibold text-slate-900">Want to learn more?</h4>
          <p className="mt-0.5 text-sm text-slate-500">Explore IT concepts in plain language.</p>
        </div>
        <button
          onClick={() => onNavigate('knowledge')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          IT Knowledge
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <Modal
        open={!!selectedGuide}
        onClose={() => setSelectedGuide(null)}
        title={guide?.title || ''}
        maxWidth="max-w-lg"
      >
        {guide && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Follow these steps in order. Each step builds on the previous one.
            </p>
            <div className="space-y-2.5">
              {guide.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-700">{step}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setSelectedGuide(null);
                onNavigate('dashboard');
              }}
              className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              Done — Back to Dashboard
            </button>
          </div>
        )}
      </Modal>

      <DemoNotice text="Recommendations are based on simulated health check data. In a production environment, they would be generated from real device metrics and IT policy." />
    </div>
  );
}
