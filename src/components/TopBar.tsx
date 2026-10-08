import { Menu, Bell, Clock } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  onOpenMobile: () => void;
}

export function TopBar({ title, subtitle, onOpenMobile }: Props) {
  const now = new Date();
  const hours = now.getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3.5 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobile}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 lg:text-xl">{title}</h2>
            {subtitle && <p className="hidden text-sm text-slate-500 sm:block">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 md:flex">
            <Clock className="h-3.5 w-3.5" />
            {greeting}, Alex
          </div>
          <button className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}
