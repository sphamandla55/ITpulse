import type { PageKey } from '@/types';
import { Icon } from './Icon';
import { Activity, X } from 'lucide-react';
import { useExplain } from '@/context/ExplainContext';

interface NavItem {
  key: PageKey;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { key: 'device-health', label: 'Device Health', icon: 'heart-pulse' },
  { key: 'troubleshoot', label: 'Troubleshoot', icon: 'wrench' },
  { key: 'security', label: 'Security Check', icon: 'shield-check' },
  { key: 'knowledge', label: 'IT Knowledge', icon: 'book-open' },
  { key: 'recommendations', label: 'Recommendations', icon: 'lightbulb' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

interface Props {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }: Props) {
  const { openExplain } = useExplain();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">IT Pulse</h1>
              <p className="text-[10px] text-slate-400">Proactive IT Support</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          {navItems.map((item) => {
            const active = current === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  onCloseMobile();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon name={item.icon} className={`h-5 w-5 ${active ? 'text-brand-600' : 'text-slate-400'}`} />
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <button
            onClick={() => openExplain('RAM')}
            className="flex w-full items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100"
          >
            <Icon name="book-open" className="h-4 w-4 text-slate-400" />
            Need a term explained?
          </button>
          <p className="mt-3 px-3 text-[10px] text-slate-300">
            Demo Prototype v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
