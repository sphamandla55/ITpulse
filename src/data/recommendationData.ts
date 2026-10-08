import type { Recommendation, ExplainTerm } from '@/types';

export const recommendations: Recommendation[] = [
  {
    id: 'storage',
    icon: 'hard-drive',
    title: 'Free up storage',
    description: 'Your storage is 78% full (398 GB of 512 GB used). Running low on storage can slow down your computer and prevent updates from installing.',
    action: 'Remove unused applications and large files',
    guideType: 'storage',
    priority: 'high',
  },
  {
    id: 'updates',
    icon: 'refresh-cw',
    title: 'Install system updates',
    description: '3 system updates are available, including 2 important security updates. Keeping your system updated is one of the most effective ways to stay protected.',
    action: 'Install pending updates',
    guideType: 'updates',
    priority: 'high',
  },
  {
    id: 'mfa',
    icon: 'key',
    title: 'Improve account security',
    description: 'Multi-factor authentication (MFA) is enabled on your email but not on all corporate applications. Enabling MFA everywhere blocks over 99% of account attacks.',
    action: 'Enable MFA on all work accounts',
    guideType: 'security',
    priority: 'medium',
  },
  {
    id: 'performance',
    icon: 'activity',
    title: 'Optimize startup applications',
    description: 'Several applications start automatically when you log in, which slows down startup time. Disabling unnecessary startup apps can speed up your boot time.',
    action: 'Review and disable startup apps',
    guideType: 'updates',
    priority: 'medium',
  },
  {
    id: 'phishing',
    icon: 'shield-alert',
    title: 'Complete phishing awareness training',
    description: 'You have not completed the latest mandatory phishing awareness training. Phishing is the most common way cyber attacks begin.',
    action: 'Start the phishing training',
    guideType: 'security',
    priority: 'high',
  },
  {
    id: 'browser',
    icon: 'chrome',
    title: 'Close unused browser tabs',
    description: 'Google Chrome is using 24% of your memory. Closing tabs you no longer need can significantly improve your computer\'s performance.',
    action: 'Review open browser tabs',
    guideType: 'storage',
    priority: 'low',
  },
];

export const explainTerms: ExplainTerm[] = [
  {
    term: 'RAM',
    short: 'Your computer\'s short-term memory for active tasks.',
    long: 'RAM (Random Access Memory) is temporary memory that holds the data your computer is actively using. When you open an app, it loads into RAM for fast access. More RAM means you can run more apps at once. Closing apps frees up RAM.',
  },
  {
    term: 'CPU',
    short: 'The "brain" of your computer that processes instructions.',
    long: 'The CPU (Central Processing Unit) carries out the instructions of every program you run. When CPU usage is high, your computer may feel slow. A single app using lots of CPU is often the cause of performance issues.',
  },
  {
    term: 'DNS',
    short: 'A system that translates website names into computer addresses.',
    long: 'DNS (Domain Name System) works like a phonebook for the internet. When you type "company.com", DNS looks up the corresponding numeric address (IP address) so your computer can find the server. DNS problems cause websites to fail to load.',
  },
  {
    term: 'IP Address',
    short: 'A unique number that identifies your device on a network.',
    long: 'An IP address is like a postal address for your computer on a network. It allows data to be sent to the right device. Two devices with the same IP address causes a conflict and connectivity problems.',
  },
  {
    term: 'VPN',
    short: 'A secure, encrypted connection to your company network.',
    long: 'A VPN (Virtual Private Network) creates a secure tunnel between your computer and your company\'s network. When working remotely, a VPN makes it as if your computer is in the office, allowing access to internal systems safely.',
  },
  {
    term: 'Firewall',
    short: 'A security barrier that filters network traffic.',
    long: 'A firewall monitors and controls what data comes in and goes out of your computer. It blocks malicious traffic and unauthorized access. Disabling your firewall, even briefly, exposes your computer to attacks.',
  },
  {
    term: 'MFA',
    short: 'A second way to verify your identity beyond your password.',
    long: 'MFA (Multi-Factor Authentication) requires a second form of verification after your password — like approving a prompt on your phone or entering a code from an app. It stops over 99% of account attacks, even if your password is stolen.',
  },
  {
    term: 'Latency',
    short: 'The time it takes for data to travel and come back.',
    long: 'Latency is the round-trip time for data to travel from your computer to a server and back, measured in milliseconds. High latency causes lag in video calls and slow-loading pages. It is different from bandwidth.',
  },
  {
    term: 'Bandwidth',
    short: 'How much data your connection can transfer at once.',
    long: 'Bandwidth is the maximum amount of data that can travel through your internet connection at one time. Think of it as the width of a pipe. Low bandwidth means slow downloads and poor video call quality, especially when shared.',
  },
  {
    term: 'Cache',
    short: 'Temporary storage that helps things load faster.',
    long: 'Cache stores frequently used data so it can be accessed quickly next time. Your browser caches website images and scripts. If a website looks outdated or broken, clearing the cache forces a fresh download and often fixes the issue.',
  },
];
