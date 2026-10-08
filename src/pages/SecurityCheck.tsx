import { useState } from 'react';
import type { PageKey, SecurityCheck } from '@/types';
import { securityChecks, calcSecurityScore } from '@/data/securityData';
import { ScoreCircle } from '@/components/ScoreCircle';
import { StatusBadge } from '@/components/StatusBadge';
import { Icon } from '@/components/Icon';
import { ExplainButton } from '@/components/ExplainModal';
import { DemoNotice } from '@/components/DemoNotice';
import { ShieldCheck, ShieldAlert, RefreshCw } from 'lucide-react';

const checkIcons: Record<string, string> = {
  'password': 'lock',
  'mfa': 'key',
  'screen-lock': 'monitor',
  'antivirus': 'shield',
  'system-updates': 'refresh-cw',
  'firewall': 'shield-check-2',
  'suspicious-apps': 'shield-alert',
  'phishing': 'shield-alert',
};

export function SecurityCheck({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  const [checks] = useState<SecurityCheck[]>(securityChecks);
  const [scanning, setScanning] = useState(false);
  const score = calcSecurityScore(checks);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card lg:col-span-1">
          <div className="flex flex-col items-center">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-600" />
              <h3 className="font-semibold text-slate-900">How secure is your device?</h3>
            </div>
            <ScoreCircle score={score} size={140} label="Security Score" />
            <p className="mt-3 text-center text-sm text-slate-500">
              {score >= 80
                ? 'Your device is well-protected. Keep it up!'
                : score >= 60
                ? 'Your device has some security gaps to address.'
                : 'Your device needs immediate security attention.'}
            </p>
            <button
              onClick={handleScan}
              disabled={scanning}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-70"
            >
              <RefreshCw className={`h-4 w-4 ${scanning ? 'animate-spin' : ''}`} />
              {scanning ? 'Scanning...' : 'Re-run Security Check'}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card lg:col-span-2">
          <h3 className="mb-4 font-semibold text-slate-900">Security Checklist</h3>
          <div className="space-y-3">
            {checks.map((check) => (
              <div
                key={check.key}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Icon name={checkIcons[check.key] || 'shield'} className="h-5 w-5 text-slate-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-800">{check.label}</h4>
                    {check.demo && (
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-600">
                        Demo Check
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">{check.detail}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <StatusBadge status={check.status} />
                    {(check.key === 'mfa' || check.key === 'firewall') && (
                      <ExplainButton term={check.key === 'mfa' ? 'MFA' : 'Firewall'} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h4 className="font-semibold text-amber-900">Items Needing Attention</h4>
            <p className="mt-1 text-sm text-amber-800">
              {checks.filter((c) => c.status !== 'good').length} security items need your attention.
              Visit the Recommendations page for specific actions you can take.
            </p>
            <button
              onClick={() => onNavigate('recommendations')}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-700"
            >
              View Recommendations →
            </button>
          </div>
        </div>
      </div>

      <DemoNotice text="Security checks marked as 'Demo Check' are simulated for this prototype. A real security scan would require a desktop IT agent or endpoint management software with appropriate permissions." />
    </div>
  );
}
