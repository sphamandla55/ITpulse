import type { KnowledgeArticle } from '@/types';

export const knowledgeCategories = [
  'Networking',
  'Cybersecurity',
  'Windows',
  'Hardware',
  'Cloud',
  'Microsoft 365',
  'Troubleshooting',
];

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'dns',
    category: 'Networking',
    title: 'What is DNS?',
    icon: 'globe',
    explanation:
      'DNS (Domain Name System) is like a phonebook for the internet. When you type a website address like "company.com", DNS translates it into a numeric IP address that computers use to find each other.',
    whyItMatters:
      'Without DNS, you would need to memorize long strings of numbers to visit any website. DNS issues are one of the most common causes of "the internet is not working" problems.',
    commonProblems: [
      'Websites fail to load even though Wi-Fi is connected',
      'Slow browsing due to a slow DNS server',
      'DNS server not responding error messages',
    ],
    quiz: {
      question: 'What does DNS do?',
      options: [
        'It speeds up your internet connection',
        'It translates website names into computer addresses',
        'It protects your computer from viruses',
        'It stores your bookmarks',
      ],
      answer: 1,
      explanation:
        'DNS translates human-readable domain names (like company.com) into IP addresses that computers use to communicate.',
    },
  },
  {
    id: 'ip-address',
    category: 'Networking',
    title: 'What is an IP Address?',
    icon: 'map-pin',
    explanation:
      'An IP address is a unique number assigned to every device on a network. It is like a postal address for your computer — it tells other devices where to send information.',
    whyItMatters:
      'Knowing your IP address helps IT support diagnose network problems. If two devices have the same IP address, it causes a conflict and one or both will lose connectivity.',
    commonProblems: [
      'IP address conflict causing disconnection',
      'No IP address assigned (APIPA 169.254.x.x range)',
      'Incorrect IP settings preventing internet access',
    ],
    quiz: {
      question: 'What is an IP address used for?',
      options: [
        'Storing files on your computer',
        'Identifying a device on a network so data can be sent to it',
        'Encrypting your internet traffic',
        'Compressing files for faster downloads',
      ],
      answer: 1,
      explanation:
        'An IP address uniquely identifies a device on a network, allowing data to be routed to the correct destination.',
    },
  },
  {
    id: 'vpn',
    category: 'Networking',
    title: 'What is a VPN?',
    icon: 'shield',
    explanation:
      'A VPN (Virtual Private Network) creates a secure, encrypted tunnel between your computer and your company network. When you work remotely, a VPN makes it as if your computer is physically connected to the office network.',
    whyItMatters:
      'VPNs protect your data when using public or home Wi-Fi. Most companies require a VPN to access internal systems from outside the office.',
    commonProblems: [
      'VPN won\'t connect — check your internet first',
      'Slow performance while VPN is active',
      'VPN disconnects frequently — may need to reconnect',
    ],
    quiz: {
      question: 'What is the main purpose of a VPN?',
      options: [
        'To make your internet faster',
        'To create a secure encrypted connection to another network',
        'To block advertisements',
        'To store your passwords securely',
      ],
      answer: 1,
      explanation:
        'A VPN creates an encrypted tunnel that securely connects your device to a private network, protecting data in transit.',
    },
  },
  {
    id: 'firewall',
    category: 'Cybersecurity',
    title: 'What is a Firewall?',
    icon: 'shield-check',
    explanation:
      'A firewall is a security system that monitors and controls what traffic comes in and goes out of your computer or network. Think of it as a security guard that checks every piece of data trying to enter or leave.',
    whyItMatters:
      'Firewalls block malicious traffic and unauthorized access attempts. Disabling your firewall, even temporarily, exposes your computer to attacks.',
    commonProblems: [
      'A specific app cannot connect — the firewall may be blocking it',
      'File sharing not working due to firewall rules',
      'VPN connection blocked by a strict firewall policy',
    ],
    quiz: {
      question: 'What does a firewall do?',
      options: [
        'Speeds up your internet by caching websites',
        'Monitors and filters network traffic to block unauthorized access',
        'Compresses files to save storage space',
        'Manages your email inbox',
      ],
      answer: 1,
      explanation:
        'A firewall monitors incoming and outgoing network traffic and blocks unauthorized or potentially malicious connections.',
    },
  },
  {
    id: 'mfa',
    category: 'Cybersecurity',
    title: 'What is MFA?',
    icon: 'key',
    explanation:
      'MFA (Multi-Factor Authentication) means you need more than just a password to log in. After entering your password, you also confirm your identity with a second method — like approving a prompt on your phone or entering a code from an authenticator app.',
    whyItMatters:
      'MFA stops over 99% of account attacks. Even if someone steals your password, they still cannot access your account without the second factor.',
    commonProblems: [
      'Cannot approve MFA prompt — phone may be offline',
      'Authenticator app codes not working — check the time sync',
      'New phone — MFA needs to be re-registered with IT',
    ],
    quiz: {
      question: 'Why is MFA important?',
      options: [
        'It makes logging in faster',
        'It adds a second layer of security beyond your password',
        'It stores your passwords for you',
        'It blocks all websites automatically',
      ],
      answer: 1,
      explanation:
        'MFA requires a second form of verification, so even if a password is compromised, the account remains protected.',
    },
  },
  {
    id: 'ram',
    category: 'Hardware',
    title: 'What is RAM?',
    icon: 'memory-stick',
    explanation:
      'RAM (Random Access Memory) is your computer\'s short-term memory. It holds the data that your computer is actively using right now. When you open an application, it loads into RAM so the processor can access it quickly.',
    whyItMatters:
      'If your computer is running slowly, it may not have enough RAM for all the applications you have open. Closing unused apps frees up RAM and can speed things up.',
    commonProblems: [
      'Computer slows down when many apps are open — low RAM',
      'Apps freeze or crash when memory is exhausted',
      'High memory usage shown in Task Manager',
    ],
    quiz: {
      question: 'What does RAM do?',
      options: [
        'Permanently stores all your files',
        'Holds data that the computer is actively using for quick access',
        'Connects your computer to the internet',
        'Protects your computer from viruses',
      ],
      answer: 1,
      explanation:
        'RAM provides fast, temporary storage for data that applications are actively using, allowing the CPU to access it quickly.',
    },
  },
  {
    id: 'cpu',
    category: 'Hardware',
    title: 'What is a CPU?',
    icon: 'cpu',
    explanation:
      'The CPU (Central Processing Unit) is the brain of your computer. It carries out the instructions of every program you run. When you click, type, or open an app, the CPU processes that action.',
    whyItMatters:
      'If your CPU usage is consistently very high (above 80%), your computer will feel sluggish and may freeze. This usually means a specific app is consuming too many resources.',
    commonProblems: [
      'Computer is slow and unresponsive — high CPU usage',
      'A single app is using most of the CPU',
      'Computer fan is loud — CPU is working hard',
    ],
    quiz: {
      question: 'What is the CPU responsible for?',
      options: [
        'Storing files permanently',
        'Processing instructions and performing calculations',
        'Displaying images on your screen',
        'Connecting to Wi-Fi networks',
      ],
      answer: 1,
      explanation:
        'The CPU executes the instructions of programs, performing the calculations and operations that make your computer work.',
    },
  },
  {
    id: 'latency',
    category: 'Networking',
    title: 'What is Latency?',
    icon: 'timer',
    explanation:
      'Latency is the time it takes for data to travel from your computer to a server and back. It is measured in milliseconds (ms). Lower latency means a more responsive connection.',
    whyItMatters:
      'High latency causes lag in video calls, slow-loading web pages, and delayed responses in online applications. It is different from bandwidth — you can have fast internet but still have high latency.',
    commonProblems: [
      'Video calls are laggy or delayed — high latency',
      'Online applications feel slow despite fast download speeds',
      'Gaming or real-time apps are unresponsive',
    ],
    quiz: {
      question: 'What does latency measure?',
      options: [
        'How much data you can download per second',
        'How long it takes for data to travel to a server and back',
        'How secure your internet connection is',
        'How many devices are on your network',
      ],
      answer: 1,
      explanation:
        'Latency measures the round-trip time for data to travel from your device to a server and back, expressed in milliseconds.',
    },
  },
  {
    id: 'bandwidth',
    category: 'Networking',
    title: 'What is Bandwidth?',
    icon: 'gauge',
    explanation:
      'Bandwidth is the maximum amount of data that can travel through your internet connection in a given time. Think of it as the width of a pipe — a wider pipe can carry more water (data) at once.',
    whyItMatters:
      'Low bandwidth means large files take longer to download and video calls may have poor quality. Multiple people using the same connection share the available bandwidth.',
    commonProblems: [
      'Slow downloads — limited bandwidth or shared connection',
      'Poor video call quality when others are streaming',
      'Websites load slowly during peak hours',
    ],
    quiz: {
      question: 'What is bandwidth?',
      options: [
        'The speed of your CPU',
        'The maximum amount of data your connection can transfer at once',
        'The number of USB ports on your computer',
        'The size of your hard drive',
      ],
      answer: 1,
      explanation:
        'Bandwidth is the maximum data transfer capacity of a connection, determining how much data can flow through it at one time.',
    },
  },
  {
    id: 'cache',
    category: 'Windows',
    title: 'What is Cache?',
    icon: 'database',
    explanation:
      'Cache is temporary storage that helps things load faster. When you visit a website, your browser saves parts of it (images, scripts) so the next visit loads quickly instead of downloading everything again.',
    whyItMatters:
      'Cache speeds up your everyday experience, but it can also cause problems. If a website was updated and your browser shows an old version, clearing the cache usually fixes it.',
    commonProblems: [
      'Website looks outdated or broken — stale cache',
      'Browser is using too much storage — large cache',
      'App shows old data — cache needs to be cleared',
    ],
    quiz: {
      question: 'Why can clearing cache fix a problem?',
      options: [
        'It frees up RAM',
        'It removes outdated stored files so fresh versions are downloaded',
        'It speeds up your CPU',
        'It improves your internet speed',
      ],
      answer: 1,
      explanation:
        'Clearing cache removes outdated or corrupted temporary files, forcing the browser or app to download fresh, correct versions.',
    },
  },
  {
    id: 'windows-update',
    category: 'Windows',
    title: 'Why Do Windows Updates Matter?',
    icon: 'refresh-cw',
    explanation:
      'Windows Updates are patches released by Microsoft that fix security holes, improve performance, and add new features. They keep your computer protected against the latest known threats.',
    whyItMatters:
      'Unpatched computers are the most common way malware spreads in corporate environments. Installing updates promptly is one of the simplest and most effective security practices.',
    commonProblems: [
      'Update won\'t install — try restarting and retrying',
      'Computer is slow during an update — updates use system resources',
      'Update keeps failing — note the error code and contact IT',
    ],
    quiz: {
      question: 'What is the main reason to install Windows Updates?',
      options: [
        'They make your computer look nicer',
        'They fix security vulnerabilities and improve stability',
        'They give you more storage space',
        'They speed up your internet connection',
      ],
      answer: 1,
      explanation:
        'Windows Updates patch security vulnerabilities, fix bugs, and improve system stability, keeping your device protected and reliable.',
    },
  },
  {
    id: 'cloud',
    category: 'Cloud',
    title: 'What is Cloud Storage?',
    icon: 'cloud',
    explanation:
      'Cloud storage means your files are saved on remote servers managed by a provider (like Microsoft OneDrive) instead of only on your computer. You can access them from any device with your login.',
    whyItMatters:
      'Cloud storage means your files are safe even if your computer is lost or damaged. It also makes sharing documents with colleagues easy and enables real-time collaboration.',
    commonProblems: [
      'Files not syncing — check your internet connection',
      'Cannot access cloud files — VPN may be required',
      'Storage is full — delete or archive old files',
    ],
    quiz: {
      question: 'What is the main advantage of cloud storage?',
      options: [
        'It makes your computer faster',
        'Your files are accessible from any device and safe if your computer is lost',
        'It protects against computer viruses',
        'It improves your internet speed',
      ],
      answer: 1,
      explanation:
        'Cloud storage makes files accessible from any device and protects them from local hardware failure or loss.',
    },
  },
  {
    id: 'm365-teams',
    category: 'Microsoft 365',
    title: 'Microsoft Teams Essentials',
    icon: 'message-square',
    explanation:
      'Microsoft Teams is a collaboration platform that combines chat, video meetings, file sharing, and app integration. It is part of the Microsoft 365 suite used by most organizations.',
    whyItMatters:
      'Teams is often the primary communication tool at work. Understanding how to manage notifications, share files, and join meetings ensures smooth collaboration with your team.',
    commonProblems: [
      'Cannot join a meeting — check your camera and microphone permissions',
      'Teams is slow — try clearing the cache or restarting the app',
      'Notifications not working — check your status and notification settings',
    ],
    quiz: {
      question: 'What can you do with Microsoft Teams?',
      options: [
        'Only send text messages',
        'Chat, hold video meetings, and share files in one platform',
        'Only store files in the cloud',
        'Only manage your calendar',
      ],
      answer: 1,
      explanation:
        'Microsoft Teams combines chat, video meetings, file sharing, and app integration into a single collaboration platform.',
    },
  },
  {
    id: 'safe-browsing',
    category: 'Cybersecurity',
    title: 'Safe Browsing Habits',
    icon: 'shield-alert',
    explanation:
      'Safe browsing means being cautious about which websites you visit, which links you click, and what you download. Most cyber attacks start with a user clicking a malicious link or downloading a harmful file.',
    whyItMatters:
      'Your browser is the gateway to the internet — and the gateway for threats. Practicing safe browsing is your first line of defense against phishing, malware, and data breaches.',
    commonProblems: [
      'Pop-up warnings claiming your computer is infected — these are scams',
      'Emails asking you to click a link and enter credentials — phishing',
      'Downloads from unfamiliar websites — may contain malware',
    ],
    quiz: {
      question: 'What should you do if a pop-up says your computer is infected?',
      options: [
        'Click the pop-up to fix the problem',
        'Call the phone number shown in the pop-up',
        'Close the pop-up and do not interact with it — report it to IT',
        'Turn off your computer immediately',
      ],
      answer: 2,
      explanation:
        'Fake infection pop-ups are a common scam. Close them without clicking, and report the incident to IT if it recurs.',
    },
  },
  {
    id: 'restart-fixes',
    category: 'Troubleshooting',
    title: 'Why Does Restarting Fix So Many Problems?',
    icon: 'power',
    explanation:
      'Restarting your computer clears the RAM, stops all running processes, and reloads the operating system from a clean state. This resolves many issues caused by temporary glitches, memory leaks, or stuck processes.',
    whyItMatters:
      "A restart is the first step in almost every troubleshooting guide for a reason — it resolves a surprising number of problems without any technical knowledge required. Always try it first.",
    commonProblems: [
      'App is frozen or unresponsive',
      'Computer is slow after being on for days',
      'Network connection is flaky or intermittent',
    ],
    quiz: {
      question: 'Why does restarting often fix problems?',
      options: [
        'It downloads new software automatically',
        'It clears memory and reloads all software from a clean state',
        'It increases your internet speed',
        'It frees up storage space on your hard drive',
      ],
      answer: 1,
      explanation:
        'Restarting clears RAM, stops stuck processes, and reloads the operating system fresh, resolving many temporary issues.',
    },
  },
];
