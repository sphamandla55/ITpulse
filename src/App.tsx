import { useState } from 'react';
import type { PageKey } from '@/types';
import { ExplainProvider } from '@/context/ExplainContext';
import { ExplainModal } from '@/components/ExplainModal';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { Dashboard } from '@/pages/Dashboard';
import { DeviceHealth } from '@/pages/DeviceHealth';
import { Troubleshoot } from '@/pages/Troubleshoot';
import { SecurityCheck } from '@/pages/SecurityCheck';
import { KnowledgePage } from '@/pages/KnowledgePage';
import { Recommendations } from '@/pages/Recommendations';
import { SettingsPage } from '@/pages/SettingsPage';

const pageTitles: Record<PageKey, { title: string; subtitle: string }> = {
  'dashboard': { title: 'Dashboard', subtitle: 'Overview of your device health' },
  'device-health': { title: 'Device Health', subtitle: 'Detailed metrics and diagnostics' },
  'troubleshoot': { title: 'Troubleshoot', subtitle: 'Guided step-by-step problem solving' },
  'security': { title: 'Security Check', subtitle: 'Assess your device security posture' },
  'knowledge': { title: 'IT Knowledge', subtitle: 'Learn IT concepts in plain language' },
  'recommendations': { title: 'Recommendations', subtitle: 'Personalized actions for your device' },
  'settings': { title: 'Settings', subtitle: 'Customize your experience' },
};

function App() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navigate = (p: PageKey) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { title, subtitle } = pageTitles[page];

  return (
    <ExplainProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar
          current={page}
          onNavigate={navigate}
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            title={title}
            subtitle={subtitle}
            onOpenMobile={() => setMobileNavOpen(true)}
          />
          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-6xl">
              {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
              {page === 'device-health' && <DeviceHealth onNavigate={navigate} />}
              {page === 'troubleshoot' && <Troubleshoot onNavigate={navigate} />}
              {page === 'security' && <SecurityCheck onNavigate={navigate} />}
              {page === 'knowledge' && <KnowledgePage onNavigate={navigate} />}
              {page === 'recommendations' && <Recommendations onNavigate={navigate} />}
              {page === 'settings' && <SettingsPage />}
            </div>
          </main>
        </div>
        <ExplainModal />
      </div>
    </ExplainProvider>
  );
}

export default App;
