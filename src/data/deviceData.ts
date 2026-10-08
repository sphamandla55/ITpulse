import type { DeviceMetrics, HealthCategory } from '@/types';

export const healthCategories: HealthCategory[] = [
  {
    key: 'network',
    label: 'Network',
    status: 'good',
    message: 'Internet connection is stable.',
    icon: 'wifi',
  },
  {
    key: 'storage',
    label: 'Storage',
    status: 'attention',
    message: '78% of storage is currently used.',
    icon: 'hard-drive',
  },
  {
    key: 'security',
    label: 'Security',
    status: 'good',
    message: 'No major security problems detected.',
    icon: 'shield',
  },
  {
    key: 'performance',
    label: 'Performance',
    status: 'attention',
    message: 'Some applications may be affecting performance.',
    icon: 'activity',
  },
  {
    key: 'updates',
    label: 'Updates',
    status: 'action',
    message: '3 system updates are available.',
    icon: 'download',
  },
];

export const deviceMetrics: DeviceMetrics = {
  score: 84,
  performance: {
    cpu: 34,
    memory: 67,
    runningApps: [
      { name: 'Microsoft Teams', usage: 18, status: 'attention' },
      { name: 'Google Chrome', usage: 24, status: 'attention' },
      { name: 'Outlook', usage: 8, status: 'good' },
      { name: 'Windows Explorer', usage: 3, status: 'good' },
      { name: 'Antimalware Service', usage: 5, status: 'good' },
    ],
    startupApps: [
      { name: 'Microsoft Teams', impact: 'medium' },
      { name: 'Spotify', impact: 'low' },
      { name: 'Slack', impact: 'medium' },
      { name: 'Dell Update', impact: 'low' },
    ],
  },
  storage: {
    total: 512,
    used: 398,
    breakdown: [
      { label: 'Applications', size: 142, color: 'bg-brand-500' },
      { label: 'System Files', size: 68, color: 'bg-brand-400' },
      { label: 'Documents', size: 52, color: 'bg-sky-400' },
      { label: 'Media', size: 84, color: 'bg-cyan-400' },
      { label: 'Other', size: 52, color: 'bg-slate-300' },
    ],
  },
  network: {
    status: 'good',
    type: 'Wi-Fi (802.11ax)',
    downloadSpeed: 187,
    uploadSpeed: 42,
    latency: 14,
    dns: 'good',
    dnsServer: '10.0.0.1 (Corporate DNS)',
  },
  updates: {
    system: [
      { name: 'Windows 11 Cumulative Update KB5034123', date: '2024-12-10', severity: 'important' },
      { name: '.NET Framework 4.8.1 Security Update', date: '2024-12-10', severity: 'important' },
      { name: 'Intel Graphics Driver Update', date: '2024-12-05', severity: 'optional' },
    ],
    apps: [
      { name: 'Microsoft Teams', current: '2.1.4', available: '2.2.10' },
      { name: 'Zoom', current: '5.16.2', available: '5.17.5' },
      { name: 'Adobe Acrobat', current: '23.006', available: '24.001' },
    ],
    security: [
      { name: 'Microsoft Defender Definition Update', date: '2024-12-12', status: 'pending' },
      { name: 'Firewall Rule Update KB5034441', date: '2024-12-08', status: 'installed' },
    ],
  },
};
