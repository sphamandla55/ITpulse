import { useState } from 'react';
import type { PageKey, EscalationSummary } from '@/types';
import { Modal } from '@/components/Modal';
import {
  Clipboard, ClipboardCheck, AlertTriangle, CheckCircle2,
  Phone, Mail, Clock, MapPin, ArrowLeft, RotateCcw
} from 'lucide-react';

interface StepHistory {
  stepId: string;
  question: string;
  answer: string;
}

interface Props {
  escalation: EscalationSummary;
  flowTitle: string;
  history: StepHistory[];
  onNavigate: (page: PageKey) => void;
  onReset: () => void;
}

export function EscalationScreen({ escalation, flowTitle, history, onNavigate, onReset }: Props) {
  const [copied, setCopied] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const summaryText = buildSummary(escalation, flowTitle, history);

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500">
          <AlertTriangle className="h-7 w-7 text-white" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">We couldn't resolve the problem automatically.</h2>
        <p className="mt-2 text-sm text-slate-600">
          Don't worry — you've already done the hard work. Here's a summary you can share with IT Support to help them fix it faster.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Before contacting IT</h3>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-100"
          >
            {copied ? (
              <>
                <ClipboardCheck className="h-4 w-4 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4" />
                Copy Diagnostic Summary
              </>
            )}
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">What we know</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-start gap-2">
              <span className="text-sm font-semibold text-slate-500">Problem:</span>
              <span className="text-sm font-medium text-slate-800">{escalation.problem}</span>
            </div>
            {escalation.userDescription && (
              <div className="mt-2 flex items-start gap-2">
                <span className="text-sm font-semibold text-slate-500">User description:</span>
                <span className="text-sm text-slate-700 italic">"{escalation.userDescription}"</span>
              </div>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-600">Checks completed:</p>
            <div className="space-y-1.5">
              {escalation.checksCompleted.map((check, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">{i + 1}</span>
                  <span className="text-sm text-slate-700">{check}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <span className="text-sm font-semibold text-amber-700">Possible cause:</span>
              <span className="text-sm text-amber-800">{escalation.possibleCause}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="mb-3 font-semibold text-slate-900">Steps you completed</h3>
        <div className="space-y-2">
          {history.map((h, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">{i + 1}</span>
              <div>
                <p className="text-sm font-medium text-slate-700">{h.question}</p>
                <p className="text-xs text-slate-400">You selected: {h.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-lg">
        <h3 className="text-lg font-bold">Contact IT Support</h3>
        <p className="mt-1 text-sm text-brand-100">
          Share your diagnostic summary with IT so they can help you faster.
        </p>
        <button
          onClick={() => setShowContact(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 shadow-md transition-colors hover:bg-brand-50"
        >
          <Phone className="h-4 w-4" />
          View Contact Options
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="text-lg font-bold text-slate-900">IT Support Handover</h3>
        <p className="mt-1 text-sm text-slate-500">
          Copy this summary and share it with IT Support so they can help you faster.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            {copied ? <ClipboardCheck className="h-4 w-4 text-emerald-300" /> : <Clipboard className="h-4 w-4" />}
            {copied ? 'Diagnostic Summary Copied!' : 'Copy Diagnostic Summary'}
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Start Again
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>
      </div>

      <Modal open={showContact} onClose={() => setShowContact(false)} title="Contact IT Support">
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Here are the ways to reach IT. Remember to paste your diagnostic summary so they can help you faster.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">IT Service Desk</p>
                <p className="text-sm text-slate-500">Ext. 4357 (HELP)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Email Support</p>
                <p className="text-sm text-slate-500">itsupport@company.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Hours</p>
                <p className="text-sm text-slate-500">Mon–Fri, 7:00 AM – 7:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Walk-in Support</p>
                <p className="text-sm text-slate-500">Floor 3, IT Service Center</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            {copied ? <ClipboardCheck className="h-4 w-4 text-emerald-300" /> : <Clipboard className="h-4 w-4" />}
            {copied ? 'Summary Copied!' : 'Copy Diagnostic Summary'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function buildSummary(escalation: EscalationSummary, flowTitle: string, history: StepHistory[]): string {
  const lines = [
    '=== IT PULSE DIAGNOSTIC SUMMARY ===',
    '',
    `Troubleshooter: ${flowTitle}`,
    `Problem: ${escalation.problem}`,
    '',
    `User description: "${escalation.userDescription}"`,
    '',
    'Checks Completed:',
    ...escalation.checksCompleted.map((c, i) => `  ${i + 1}. ${c}`),
    '',
    `Possible Cause: ${escalation.possibleCause}`,
    'Result: Problem not resolved.',
    '',
    'Steps Taken:',
    ...history.map((h, i) => `  ${i + 1}. ${h.question} → ${h.answer}`),
    '',
    'Generated by IT Pulse — Proactive IT Support Assistant',
  ];
  return lines.join('\n');
}
