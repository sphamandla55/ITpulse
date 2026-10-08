import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DemoNotice } from '@/components/DemoNotice';
import { Bell, Moon, Globe, Shield, Monitor, Volume2, Check } from 'lucide-react';

interface UserPrefs {
  notifications: boolean;
  autoHealthCheck: boolean;
  darkMode: boolean;
  compactView: boolean;
  language: string;
}

const defaultPrefs: UserPrefs = {
  notifications: true,
  autoHealthCheck: false,
  darkMode: false,
  compactView: false,
  language: 'English',
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-slate-200'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export function SettingsPage() {
  const [prefs, setPrefs] = useLocalStorage<UserPrefs>('it-pulse-prefs', defaultPrefs);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof UserPrefs, value: boolean | string) => {
    setPrefs({ ...prefs, [key]: value });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500">Customize IT Pulse to your preferences.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
          <Bell className="h-5 w-5 text-brand-600" />
          Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <p className="text-sm font-medium text-slate-700">Health alerts</p>
              <p className="text-xs text-slate-400">Get notified when items need attention</p>
            </div>
            <Toggle checked={prefs.notifications} onChange={() => update('notifications', !prefs.notifications)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Automatic health checks</p>
              <p className="text-xs text-slate-400">Run a health check when you open the app</p>
            </div>
            <Toggle checked={prefs.autoHealthCheck} onChange={() => update('autoHealthCheck', !prefs.autoHealthCheck)} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
          <Monitor className="h-5 w-5 text-brand-600" />
          Appearance
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <p className="text-sm font-medium text-slate-700">Dark mode</p>
              <p className="text-xs text-slate-400">Use a darker color scheme (coming soon)</p>
            </div>
            <Toggle checked={prefs.darkMode} onChange={() => update('darkMode', !prefs.darkMode)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Compact view</p>
              <p className="text-xs text-slate-400">Reduce spacing to fit more on screen</p>
            </div>
            <Toggle checked={prefs.compactView} onChange={() => update('compactView', !prefs.compactView)} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
          <Globe className="h-5 w-5 text-brand-600" />
          Language & Region
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">Display language</p>
            <p className="text-xs text-slate-400">The language used throughout the app</p>
          </div>
          <select
            value={prefs.language}
            onChange={(e) => update('language', e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option>English</option>
            <option>Español</option>
            <option>Français</option>
            <option>Deutsch</option>
            <option>日本語</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
          <Shield className="h-5 w-5 text-brand-600" />
          About
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Version</span>
            <span className="font-medium text-slate-800">1.0.0 (Prototype)</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Mode</span>
            <span className="font-medium text-slate-800">Demo / Prototype</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Data source</span>
            <span className="font-medium text-slate-800">Local (browser storage)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Support</span>
            <span className="font-medium text-slate-800">Internal IT Department</span>
          </div>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 animate-slide-up">
          <Check className="h-4 w-4 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-700">Settings saved automatically.</p>
        </div>
      )}

      <DemoNotice text="Your preferences are saved in your browser's local storage. In a production environment, these would sync to your IT profile." />
    </div>
  );
}
