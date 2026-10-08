import type { SecurityCheck } from '@/types';

export const securityChecks: SecurityCheck[] = [
  {
    key: 'password',
    label: 'Password Security',
    status: 'good',
    detail: 'Your password meets corporate complexity requirements.',
    recommendation: 'Continue using strong, unique passwords for each service.',
    demo: false,
  },
  {
    key: 'mfa',
    label: 'Multi-Factor Authentication',
    status: 'attention',
    detail: 'MFA is enabled on your email but not on all corporate applications.',
    recommendation: 'Enable MFA on all work accounts, especially VPN and cloud storage.',
    demo: false,
  },
  {
    key: 'screen-lock',
    label: 'Screen Lock',
    status: 'good',
    detail: 'Auto-lock is set to 5 minutes of inactivity.',
    recommendation: 'Keep your screen lock timeout at 5 minutes or less.',
    demo: false,
  },
  {
    key: 'antivirus',
    label: 'Antivirus Protection',
    status: 'good',
    detail: 'Microsoft Defender is active and definitions are up to date.',
    recommendation: 'Keep real-time protection enabled at all times.',
    demo: true,
  },
  {
    key: 'system-updates',
    label: 'System Updates',
    status: 'attention',
    detail: '3 system updates are pending installation.',
    recommendation: 'Install pending updates during your next break.',
    demo: true,
  },
  {
    key: 'firewall',
    label: 'Firewall',
    status: 'good',
    detail: 'Windows Firewall is active on all network profiles.',
    recommendation: 'Never disable the firewall without IT approval.',
    demo: true,
  },
  {
    key: 'suspicious-apps',
    label: 'Suspicious Applications',
    status: 'good',
    detail: 'No unauthorized or flagged applications detected.',
    recommendation: 'Only install software approved by your IT department.',
    demo: true,
  },
  {
    key: 'phishing',
    label: 'Phishing Awareness',
    status: 'risk',
    detail: 'You have not completed the latest phishing awareness training.',
    recommendation: 'Complete the mandatory phishing training in the learning portal.',
    demo: false,
  },
];

export function calcSecurityScore(checks: SecurityCheck[]): number {
  const weights: Record<string, number> = {
    good: 100,
    attention: 50,
    risk: 0,
    action: 25,
  };
  const total = checks.reduce((sum, c) => sum + weights[c.status], 0);
  return Math.round(total / checks.length);
}
