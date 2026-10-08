import type { PageKey } from '@/types';
import { deviceMetrics } from '@/data/deviceData';
import { ProgressBar } from '@/components/ProgressBar';
import { StatusBadge } from '@/components/StatusBadge';
import { Icon } from '@/components/Icon';
import { ExplainButton } from '@/components/ExplainModal';
import { DemoNotice } from '@/components/DemoNotice';
import {
  Cpu, MemoryStick, HardDrive, Wifi, Download, RefreshCw,
  Activity, Zap, Clock, ChevronRight
} from 'lucide-react';

interface Props {
  onNavigate: (page: PageKey) => void;
}

export function DeviceHealth({ onNavigate }: Props) {
  const { performance, storage, network, updates } = deviceMetrics;
  const available = storage.total - storage.used;
  const usedPercent = Math.round((storage.used / storage.total) * 100);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-2">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-brand-600" />
            <h3 className="font-semibold text-slate-900">Performance</h3>
            <span className="ml-2"><ExplainButton term="CPU" /></span>
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <ProgressBar label="CPU Usage" value={performance.cpu} />
              <p className="mt-1.5 text-xs text-slate-400">Current processor load</p>
            </div>
            <div>
              <ProgressBar label="Memory (RAM)" value={performance.memory} />
              <p className="mt-1.5 text-xs text-slate-400">
                <ExplainButton term="RAM" />
              </p>
            </div>
          </div>

          <div className="mt-5">
            <h4 className="mb-2 text-sm font-medium text-slate-700">Running Applications</h4>
            <div className="space-y-2">
              {performance.runningApps.map((app) => (
                <div key={app.name} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 truncate text-sm text-slate-600">{app.name}</span>
                  <div className="flex-1">
                    <ProgressBar label="" value={app.usage} showValue={false} />
                  </div>
                  <span className="w-12 shrink-0 text-right text-xs font-medium text-slate-500">{app.usage}%</span>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <h4 className="mb-2 text-sm font-medium text-slate-700">Startup Applications</h4>
            <div className="flex flex-wrap gap-2">
              {performance.startupApps.map((app) => (
                <div key={app.name} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <Zap className={`h-3.5 w-3.5 ${app.impact === 'high' ? 'text-red-500' : app.impact === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`} />
                  <span className="text-sm text-slate-700">{app.name}</span>
                  <span className={`text-xs font-medium ${app.impact === 'high' ? 'text-red-500' : app.impact === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {app.impact} impact
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-brand-600" />
            <h3 className="font-semibold text-slate-900">Storage</h3>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <div className="relative h-32 w-32">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - usedPercent / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{usedPercent}%</span>
                <span className="text-xs text-slate-400">used</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Total</span>
              <span className="font-semibold text-slate-800">{storage.total} GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Used</span>
              <span className="font-semibold text-slate-800">{storage.used} GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Available</span>
              <span className="font-semibold text-emerald-600">{available} GB</span>
            </div>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="flex h-full">
              {storage.breakdown.map((b) => (
                <div key={b.label} className={b.color} style={{ width: `${(b.size / storage.total) * 100}%` }} />
              ))}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {storage.breakdown.map((b) => (
              <div key={b.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className={`h-2 w-2 rounded-sm ${b.color}`} />
                {b.label} ({b.size} GB)
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5">
            <Activity className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-xs text-amber-800">
              Your storage is getting full. Consider removing unused applications or large files.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-brand-600" />
            <h3 className="font-semibold text-slate-900">Network</h3>
            <span className="ml-2"><ExplainButton term="DNS" /></span>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-sm text-slate-500">Connection Status</span>
              <StatusBadge status={network.status} />
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-sm text-slate-500">Connection Type</span>
              <span className="text-sm font-medium text-slate-800">{network.type}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-sm text-slate-500">Download Speed</span>
              <span className="text-sm font-semibold text-emerald-600">{network.downloadSpeed} Mbps</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-sm text-slate-500">Upload Speed</span>
              <span className="text-sm font-semibold text-emerald-600">{network.uploadSpeed} Mbps</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-slate-500">Latency</span>
                <ExplainButton term="Latency" />
              </div>
              <span className="text-sm font-semibold text-slate-800">{network.latency} ms</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-slate-500">DNS Status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{network.dnsServer}</span>
                <StatusBadge status={network.dns} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-brand-600" />
              <h3 className="font-semibold text-slate-900">Updates</h3>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-100">
              <Download className="h-3.5 w-3.5" />
              Check for Updates
            </button>
          </div>

          <div className="mt-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">System Updates</h4>
            <div className="space-y-2">
              {updates.system.map((u) => (
                <div key={u.name} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.date}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${u.severity === 'important' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
                    {u.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Application Updates</h4>
            <div className="space-y-2">
              {updates.apps.map((u) => (
                <div key={u.name} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="text-sm font-medium text-slate-700">{u.name}</span>
                  <span className="text-xs text-slate-400">{u.current} → <span className="font-medium text-brand-600">{u.available}</span></span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Security Updates</h4>
            <div className="space-y-2">
              {updates.security.map((u) => (
                <div key={u.name} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="text-sm font-medium text-slate-700">{u.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {u.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div>
          <h4 className="font-semibold text-slate-900">Need personalized actions?</h4>
          <p className="mt-0.5 text-sm text-slate-500">See recommendations tailored to your device health.</p>
        </div>
        <button
          onClick={() => onNavigate('recommendations')}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          View Recommendations
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <DemoNotice text="These metrics are simulated for demonstration. Real device metrics would be collected by a desktop IT agent with appropriate system permissions." />
    </div>
  );
}
