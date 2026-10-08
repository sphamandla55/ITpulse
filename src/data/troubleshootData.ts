import type { TroubleshootFlow, Recommendation, ExplainTerm } from '@/types';

export const troubleshootCategories = [
  { id: 'internet', label: 'Internet', icon: 'wifi' },
  { id: 'slow-computer', label: 'Slow Computer', icon: 'gauge' },
  { id: 'no-sound', label: 'No Sound', icon: 'volume-2' },
  { id: 'printer', label: 'Printer', icon: 'printer' },
  { id: 'keyboard', label: 'Keyboard', icon: 'keyboard' },
  { id: 'mouse', label: 'Mouse', icon: 'mouse' },
  { id: 'email', label: 'Email', icon: 'mail' },
  { id: 'login', label: 'Login & Password', icon: 'lock' },
  { id: 'display', label: 'Display', icon: 'monitor' },
  { id: 'files', label: 'Files & Storage', icon: 'folder' },
  { id: 'teams', label: 'Microsoft Teams', icon: 'message-square' },
  { id: 'power', label: 'Power & Battery', icon: 'battery-charging' },
];

export const troubleshootFlows: Record<string, TroubleshootFlow> = {
  internet: {
    id: 'internet',
    title: 'Internet Connection Troubleshooter',
    icon: 'wifi',
    problemLabel: 'Internet connection',
    startStep: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        question: "Are you connected to Wi-Fi or Ethernet?",
        description: 'This helps us narrow down where the issue might be.',
        options: [
          { label: 'Wi-Fi', next: 'step-2-wifi' },
          { label: 'Ethernet', next: 'step-2-ethernet' },
          { label: "I'm not sure", next: 'step-2-unsure' },
        ],
      },
      'step-2-wifi': {
        id: 'step-2-wifi',
        question: 'Can you open any website at all?',
        description: 'Try opening a common website like google.com in your browser.',
        options: [
          { label: 'Yes, some sites work', next: 'step-3' },
          { label: 'No, nothing loads', action: {
            title: 'Check your Wi-Fi connection',
            steps: [
              'Click the Wi-Fi icon in the bottom-right corner of your screen',
              'Make sure Wi-Fi is turned ON',
              'Check that you are connected to the correct network (not a guest network)',
              'Try disconnecting and reconnecting to the Wi-Fi network',
              'Wait 10 seconds for the connection to re-establish',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-2-ethernet': {
        id: 'step-2-ethernet',
        question: 'Is the Ethernet cable firmly plugged in on both ends?',
        description: 'Check the cable going from your computer to the wall or router. You should hear a click when it is fully inserted.',
        options: [
          { label: 'Yes, it is firmly connected', next: 'step-3' },
          { label: 'No, it was loose', action: {
            title: 'Reseat the Ethernet cable',
            steps: [
              'Unplug the Ethernet cable from your computer',
              'Unplug the other end from the wall or router',
              'Plug the cable back into the wall/router firmly until you hear a click',
              'Plug the cable back into your computer firmly until you hear a click',
              'Wait 5 seconds for the connection to be detected',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-2-unsure': {
        id: 'step-2-unsure',
        question: 'Let\'s find out. Do you see a Wi-Fi icon or a computer-cable icon in the bottom-right of your screen?',
        description: 'A fan-shaped icon means Wi-Fi. A small monitor with a cable means Ethernet.',
        options: [
          { label: 'I see a Wi-Fi icon', next: 'step-2-wifi' },
          { label: 'I see a cable icon', next: 'step-2-ethernet' },
          { label: 'I see a globe with a warning', action: {
            title: 'You appear to be disconnected',
            steps: [
              'Click the network icon in the bottom-right corner',
              'If Wi-Fi is off, turn it ON',
              'Select your company network and click Connect',
              'If you use Ethernet, check that the cable is plugged in at both ends',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-3': {
        id: 'step-3',
        question: 'Is the problem happening on other devices too?',
        description: 'If other devices on the same network also cannot connect, the issue is likely with the router or network, not your computer.',
        options: [
          { label: 'Yes, other devices are also affected', action: {
            title: 'Restart your router',
            steps: [
              'Find your router or wireless access point',
              'Unplug the power cable from the back of the router',
              'Wait 30 seconds',
              'Plug the power cable back in',
              'Wait 1-2 minutes for the router to fully restart',
              'Check if your devices can now connect',
            ],
          }, cause: 'Network or router problem — the issue affects all devices on the network.', outcome: 'escalate' },
          { label: 'No, only this computer is affected', action: {
            title: 'Restart your network adapter',
            steps: [
              'Press Windows Key + R to open the Run dialog',
              'Type "ncpa.cpl" and press Enter',
              'Right-click your active connection and select Disable',
              'Wait 5 seconds, then right-click again and select Enable',
              'Wait 10 seconds for the connection to re-establish',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-check': {
        id: 'step-check',
        question: 'Can you now open a website in your browser?',
        description: 'Try opening a website you have not visited recently.',
        options: [
          { label: "Yes, it's fixed!", outcome: 'fixed', cause: 'The network connection was re-established.' },
          { label: 'No, still not working', next: 'step-dns' },
        ],
      },
      'step-dns': {
        id: 'step-dns',
        question: 'Can you open a website by typing its IP address directly?',
        description: 'Open a browser and type: 142.250.80.46 (this is Google\'s IP). If this loads but normal websites don\'t, you have a DNS issue.',
        options: [
          { label: 'Yes, the IP address works', action: {
            title: 'Flush your DNS cache',
            steps: [
              'Press Windows Key, type "cmd", right-click Command Prompt and select Run as Administrator',
              'Type: ipconfig /flushdns and press Enter',
              'Wait for the "Successfully flushed" message',
              'Close Command Prompt and try opening websites again',
            ],
          }, cause: 'DNS (Domain Name System) was not resolving website names correctly.', next: 'step-check-dns' },
          { label: 'No, that does not work either', cause: 'Complete network connectivity loss — the computer cannot reach any external server.', outcome: 'escalate' },
        ],
      },
      'step-check-dns': {
        id: 'step-check-dns',
        question: 'Can you now open websites by their normal names (e.g. google.com)?',
        options: [
          { label: "Yes, it's fixed!", outcome: 'fixed', cause: 'The DNS cache was cleared and is now resolving correctly.' },
          { label: 'No, still not working', cause: 'Persistent network connectivity issue that may require IT to check network configuration.', outcome: 'escalate' },
        ],
      },
    },
  },

  'slow-computer': {
    id: 'slow-computer',
    title: 'Slow Computer Troubleshooter',
    icon: 'gauge',
    problemLabel: 'Slow computer',
    startStep: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        question: 'When did the computer start running slowly?',
        description: 'This helps us determine if a recent change caused the issue.',
        options: [
          { label: 'It gradually got slower over time', next: 'step-2' },
          { label: 'It started suddenly today', next: 'step-sudden' },
          { label: "It's slow every time I start it", next: 'step-startup' },
        ],
      },
      'step-2': {
        id: 'step-2',
        question: 'How many applications do you typically have open at once?',
        description: 'Having many apps open uses up your computer\'s memory (RAM).',
        options: [
          { label: '5 or more apps at once', action: {
            title: 'Close unnecessary applications',
            steps: [
              'Press Ctrl + Shift + Esc to open Task Manager',
              'Click the "Memory" column header to sort by memory usage',
              'Identify apps you are not actively using',
              'Select each unused app and click "End Task"',
              'Notice how much memory was freed',
            ],
          }, next: 'step-check' },
          { label: 'Only 1 or 2 apps', next: 'step-3' },
        ],
      },
      'step-sudden': {
        id: 'step-sudden',
        question: 'Did you install any new software or updates recently?',
        description: 'A recent installation may be causing a conflict.',
        options: [
          { label: 'Yes, I installed something recently', action: {
            title: 'Check recently installed programs',
            steps: [
              'Press Windows Key, type "Add or remove programs" and press Enter',
              'Sort by "Date installed" to see recent additions',
              'If you see an unfamiliar or recently added program, consider uninstalling it',
              'Restart your computer after uninstalling',
            ],
          }, next: 'step-check' },
          { label: 'No, nothing new', action: {
            title: 'Restart your computer',
            steps: [
              'Save all your work',
              'Click Start > Power > Restart (not Shut down)',
              'Wait for the computer to fully restart',
              'Check if it is faster after restarting',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-startup': {
        id: 'step-startup',
        question: 'Do many applications open automatically when you log in?',
        description: 'Startup apps slow down boot time and use resources from the moment you log in.',
        options: [
          { label: 'Yes, several apps open automatically', action: {
            title: 'Disable unnecessary startup apps',
            steps: [
              'Press Ctrl + Shift + Esc to open Task Manager',
              'Click the "Startup" tab (or the speedometer icon)',
              'Review the list of apps that start automatically',
              'Right-click apps you do not need at startup and select "Disable"',
              'Restart your computer for the change to take effect',
            ],
          }, next: 'step-check' },
          { label: 'No, nothing opens automatically', action: {
            title: 'Run a quick restart',
            steps: [
              'Save all your work',
              'Click Start > Power > Restart',
              'Wait for the restart to complete',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-3': {
        id: 'step-3',
        question: 'When did you last restart your computer?',
        description: 'Computers left on for days accumulate temporary issues that a restart fixes.',
        options: [
          { label: 'More than a week ago', action: {
            title: 'Restart your computer',
            steps: [
              'Save all your work',
              'Click Start > Power > Restart (not Shut down)',
              'Wait for the computer to fully restart',
              'Log back in and check if it is faster',
            ],
          }, next: 'step-check' },
          { label: 'Within the last few days', action: {
            title: 'Check your storage space',
            steps: [
              'Open File Explorer and click "This PC"',
              'Check how much free space is on your C: drive',
              'If your drive is more than 85% full, this can slow down your computer',
              'Consider deleting large files or moving them to cloud storage',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-check': {
        id: 'step-check',
        question: 'Is your computer running faster now?',
        description: 'Try opening a few apps and switching between them.',
        options: [
          { label: "Yes, it's much better!", outcome: 'fixed', cause: 'Freeing up resources by closing apps and restarting resolved the performance issue.' },
          { label: 'No, still slow', cause: 'Persistent performance issue that may require hardware assessment or malware scan by IT.', outcome: 'escalate' },
        ],
      },
    },
  },

  'no-sound': {
    id: 'no-sound',
    title: 'No Sound Troubleshooter',
    icon: 'volume-2',
    problemLabel: 'No sound',
    startStep: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        question: 'Is your volume turned up and not muted?',
        description: 'Check the speaker icon in the bottom-right corner of your screen.',
        options: [
          { label: 'Yes, volume is up and not muted', next: 'step-2' },
          { label: 'No, it was muted or low', action: {
            title: 'Adjust your volume',
            steps: [
              'Click the speaker icon in the bottom-right corner',
              'Drag the volume slider to at least 50%',
              'Make sure the speaker icon does not have an X (muted)',
              'Try playing a video or audio file to test',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-2': {
        id: 'step-2',
        question: 'What type of audio device are you using?',
        description: 'This helps us check the right output device.',
        options: [
          { label: 'Built-in speakers', next: 'step-3' },
          { label: 'Headphones or headset (3.5mm jack)', next: 'step-3' },
          { label: 'USB or Bluetooth headset', next: 'step-bt' },
          { label: 'External monitor speakers', next: 'step-3' },
        ],
      },
      'step-bt': {
        id: 'step-bt',
        question: 'Is your Bluetooth device connected and paired?',
        description: 'Check that your Bluetooth headset is turned on and connected to your computer.',
        options: [
          { label: 'Yes, it shows as connected', next: 'step-3' },
          { label: 'No, it is not connected', action: {
            title: 'Reconnect your Bluetooth device',
            steps: [
              'Turn your Bluetooth headset OFF and back ON',
              'Put the headset in pairing mode (check its manual)',
              'On your computer, click the Bluetooth icon in the bottom-right',
              'Select your headset from the device list and click Connect',
              'Try playing audio to test',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-3': {
        id: 'step-3',
        question: 'Is the correct audio output device selected?',
        description: 'Sometimes Windows sends sound to the wrong device (e.g. a disconnected monitor instead of your headphones).',
        options: [
          { label: "I'm not sure", action: {
            title: 'Set the correct audio output device',
            steps: [
              'Click the speaker icon in the bottom-right corner',
              'Click the small arrow next to the volume slider',
              'You will see a list of available audio devices',
              'Select the device you want to use (headphones, speakers, etc.)',
              'Try playing audio to test',
            ],
          }, next: 'step-check' },
          { label: 'Yes, the correct device is selected', next: 'step-4' },
        ],
      },
      'step-4': {
        id: 'step-4',
        question: 'Is the problem in a specific app, or all apps?',
        description: 'If only one app has no sound, the issue is with that app\'s settings, not your computer.',
        options: [
          { label: 'Only one specific app', action: {
            title: 'Check the app\'s audio settings',
            steps: [
              'Open the app that has no sound',
              'Look for Settings > Audio or Settings > Sound',
              'Make sure the correct output device is selected within the app',
              'Check that the app\'s volume slider is not at zero',
              'Try playing audio again',
            ],
          }, next: 'step-check' },
          { label: 'All apps have no sound', action: {
            title: 'Reinstall your audio driver',
            steps: [
              'Press Windows Key, type "Device Manager" and press Enter',
              'Expand "Sound, video and game controllers"',
              'Right-click your audio device and select "Uninstall device"',
              'Restart your computer — Windows will reinstall the driver automatically',
              'Try playing audio after the restart',
            ],
          }, cause: 'Audio driver issue — the driver may be corrupted or outdated.', next: 'step-check' },
        ],
      },
      'step-check': {
        id: 'step-check',
        question: 'Can you hear sound now?',
        options: [
          { label: "Yes, it's fixed!", outcome: 'fixed', cause: 'The audio output was restored by adjusting settings or reconnecting the device.' },
          { label: 'No, still no sound', cause: 'Audio hardware or driver issue that may require IT to inspect the device or reinstall drivers.', outcome: 'escalate' },
        ],
      },
    },
  },

  'printer': {
    id: 'printer',
    title: 'Printer Troubleshooter',
    icon: 'printer',
    problemLabel: 'Printer not printing',
    startStep: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        question: 'Is the printer powered on?',
        description: 'Check that the printer has lights on and no error messages on its screen.',
        options: [
          { label: 'Yes, it is on', next: 'step-2' },
          { label: 'No, it is off', action: {
            title: 'Power on the printer',
            steps: [
              'Check that the printer is plugged into a working power outlet',
              'Press the power button on the printer',
              'Wait for the printer to initialize (30-60 seconds)',
              'Check for any error lights or messages on the printer display',
            ],
          }, next: 'step-2' },
        ],
      },
      'step-2': {
        id: 'step-2',
        question: 'Is your computer connected to the printer?',
        description: 'Check if the printer appears in your list of available printers.',
        options: [
          { label: 'Yes, it appears in my printer list', next: 'step-3' },
          { label: 'No, I do not see it', action: {
            title: 'Reconnect the printer',
            steps: [
              'If it is a network printer, make sure your computer is on the same network',
              'Press Windows Key, type "Printers & scanners" and press Enter',
              'Click "Add device" and wait for Windows to find the printer',
              'Select your printer from the list and click Add',
              'If not found, note the printer\'s IP address and add it manually',
            ],
          }, next: 'step-3' },
        ],
      },
      'step-3': {
        id: 'step-3',
        question: 'Can you print a test page?',
        description: 'A test page helps determine if the issue is with the printer or a specific document.',
        options: [
          { label: 'Yes, test page prints fine', action: {
            title: 'The printer works — check your document',
            steps: [
              'Open the document you want to print',
              'Go to File > Print (or Ctrl + P)',
              'Make sure the correct printer is selected in the dialog',
              'Check that the page range and number of copies are correct',
              'Click Print',
            ],
          }, next: 'step-check' },
          { label: 'No, test page does not print', next: 'step-4' },
        ],
      },
      'step-4': {
        id: 'step-4',
        question: 'Is the print queue clear?',
        description: 'A stuck job in the print queue can block all new print jobs.',
        options: [
          { label: "I'm not sure", action: {
            title: 'Clear the print queue',
            steps: [
              'Press Windows Key, type "Printers & scanners" and press Enter',
              'Click your printer, then click "Open print queue"',
              'Click the three dots (or right-click) and select "Cancel all"',
              'Wait for the queue to clear completely',
              'Restart the print spooler: press Windows Key + R, type "services.msc", find "Print Spooler", right-click and Restart',
              'Try printing the test page again',
            ],
          }, next: 'step-check' },
          { label: 'Yes, queue is clear but still not printing', cause: 'Printer driver or connection issue — the printer is detected but cannot process print jobs.', next: 'step-5' },
        ],
      },
      'step-5': {
        id: 'step-5',
        question: 'Have you tried restarting the print spooler service?',
        description: 'The print spooler manages all print jobs and can sometimes get stuck.',
        options: [
          { label: 'No, let me try that', action: {
            title: 'Restart the Print Spooler',
            steps: [
              'Press Windows Key + R, type "services.msc" and press Enter',
              'Scroll down to find "Print Spooler"',
              'Right-click "Print Spooler" and select "Restart"',
              'Wait for the service to restart (the status should say "Running")',
              'Try printing a test page again',
            ],
          }, next: 'step-check' },
          { label: "Yes, I already tried that", cause: 'Printer driver or connection issue — the printer is detected but cannot process print jobs. IT may need to reinstall the driver or check the network connection.', outcome: 'escalate' },
        ],
      },
      'step-check': {
        id: 'step-check',
        question: 'Can you print successfully now?',
        options: [
          { label: "Yes, it prints!", outcome: 'fixed', cause: 'The print queue was cleared or the connection was re-established.' },
          { label: 'No, still not printing', cause: 'Printer driver or connection issue — the printer is detected but cannot process print jobs.', outcome: 'escalate' },
        ],
      },
    },
  },

  'email': {
    id: 'email',
    title: 'Email Troubleshooter',
    icon: 'mail',
    problemLabel: 'Email problem',
    startStep: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        question: 'What email issue are you experiencing?',
        options: [
          { label: 'Cannot send emails', next: 'step-send' },
          { label: 'Cannot receive emails', next: 'step-recv' },
          { label: 'Outlook is not opening', next: 'step-open' },
          { label: 'Emails are stuck in Outbox', next: 'step-outbox' },
        ],
      },
      'step-send': {
        id: 'step-send',
        question: 'Are you connected to the internet?',
        description: 'Outlook needs an internet connection to send emails.',
        options: [
          { label: 'Yes, I have internet', action: {
            title: 'Check your Outbox and try again',
            steps: [
              'Open Outlook and click on the "Outbox" folder',
              'If there are stuck emails, delete them',
              'Click "Send/Receive" in the ribbon',
              'Try composing and sending a new test email to yourself',
            ],
          }, next: 'step-check' },
          { label: 'No, my internet is not working', cause: 'No internet connection — email cannot be sent without network access.', next: 'step-internet' },
        ],
      },
      'step-recv': {
        id: 'step-recv',
        question: 'Is your inbox storage full?',
        description: 'A full mailbox prevents new emails from arriving.',
        options: [
          { label: "I'm not sure", action: {
            title: 'Check and clean up your mailbox',
            steps: [
              'Right-click your mailbox in Outlook and select "Data File Properties"',
              'Click "Folder Size" to see how much space you are using',
              'If you are near your limit, empty your Deleted Items folder',
              'Archive old emails by right-clicking a folder > Archive',
              'Click "Send/Receive" to check for new emails',
            ],
          }, next: 'step-check' },
          { label: 'No, my mailbox has space', action: {
            title: 'Force a send/receive',
            steps: [
              'In Outlook, click the "Send/Receive" tab',
              'Click "Send/Receive All Folders"',
              'Wait for the process to complete',
              'Check if new emails appear in your inbox',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-open': {
        id: 'step-open',
        question: 'Does Outlook show an error message when you try to open it?',
        options: [
          { label: 'Yes, there is an error message', cause: 'Outlook data file or profile corruption — the error message will help IT diagnose the exact issue.', outcome: 'escalate' },
          { label: 'No, it just hangs or does nothing', action: {
            title: 'Restart Outlook in Safe Mode',
            steps: [
              'Press Windows Key + R to open Run',
              'Type "outlook.exe /safe" and press Enter',
              'If Outlook opens in safe mode, an add-in may be causing the problem',
              'Go to File > Options > Add-ins > COM Add-ins > Go',
              'Uncheck all add-ins and click OK',
              'Close and reopen Outlook normally',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-outbox': {
        id: 'step-outbox',
        question: 'Is the email very large (with big attachments)?',
        options: [
          { label: 'Yes, it has large attachments', action: {
            title: 'Remove large attachments or use cloud sharing',
            steps: [
              'Open the Outbox folder',
              'Open the stuck email',
              'Remove the large attachments',
              'Instead, upload the files to OneDrive and share a link in the email',
              'Click Send again',
            ],
          }, next: 'step-check' },
          { label: 'No, it is a normal email', action: {
            title: 'Delete and re-send the stuck email',
            steps: [
              'Open the Outbox folder',
              'Delete the stuck email (you may need to switch Outlook to Work Offline mode first)',
              'Click "Send/Receive" > "Work Offline" to toggle it',
              'Delete the stuck email from Outbox',
              'Toggle Work Offline back off',
              'Compose and send the email again',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-check': {
        id: 'step-check',
        question: 'Is your email working now?',
        options: [
          { label: "Yes, it's fixed!", outcome: 'fixed', cause: 'The email issue was resolved by clearing stuck items or adjusting settings.' },
          { label: 'No, still having problems', cause: 'Persistent email configuration issue that may require IT to check your mailbox or Outlook profile.', outcome: 'escalate' },
        ],
      },
      'step-internet': {
        id: 'step-internet',
        question: 'Would you like to troubleshoot your internet connection?',
        options: [
          { label: 'Yes, take me to internet troubleshooting', cause: 'No internet connection — please use the Internet troubleshooter first.', outcome: 'escalate' },
          { label: 'No, contact IT directly', cause: 'No internet connection and email issues — IT needs to check network connectivity first.', outcome: 'escalate' },
        ],
      },
    },
  },

  'login': {
    id: 'login',
    title: 'Login & Password Troubleshooter',
    icon: 'lock',
    problemLabel: 'Login or password issue',
    startStep: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        question: 'What type of login issue are you having?',
        options: [
          { label: 'I forgot my password', next: 'step-forgot' },
          { label: 'My password is not being accepted', next: 'step-rejected' },
          { label: 'I am locked out of my account', next: 'step-locked' },
          { label: 'MFA prompt is not appearing', next: 'step-mfa' },
        ],
      },
      'step-forgot': {
        id: 'step-forgot',
        question: 'Have you tried the self-service password reset?',
        description: 'Most companies offer a self-service portal so you can reset your password without calling IT.',
        options: [
          { label: 'No, where do I find it?', action: {
            title: 'Use self-service password reset',
            steps: [
              'Go to your company\'s password reset portal (often at mypassword.yourcompany.com or aka.ms/sspr)',
              'Enter your work email address',
              'Verify your identity using your registered phone or authenticator app',
              'Create a new password that meets your company\'s requirements (usually 12+ characters with mix of upper, lower, numbers, symbols)',
              'Wait a few minutes for the password to sync, then try logging in',
            ],
          }, next: 'step-check' },
          { label: 'Yes, but it did not work', cause: 'Self-service password reset failed — you may not be registered for SSPR, or your identity verification failed.', outcome: 'escalate' },
        ],
      },
      'step-rejected': {
        id: 'step-rejected',
        question: 'Have you checked that Caps Lock is not on?',
        description: 'This is a surprisingly common cause of password rejection.',
        options: [
          { label: 'Yes, Caps Lock is off', next: 'step-rejected-2' },
          { label: "No, let me check", action: {
            title: 'Check Caps Lock and try again',
            steps: [
              'Look at your keyboard — is the Caps Lock light on?',
              'Press Caps Lock to turn it off',
              'Make sure Num Lock is on if you use the number pad',
              'Type your password slowly and carefully',
              'Check that your keyboard language is correct (check the taskbar)',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-rejected-2': {
        id: 'step-rejected-2',
        question: 'Did you recently change your password?',
        description: 'If you recently changed it, your old password may be cached in some apps.',
        options: [
          { label: 'Yes, I changed it recently', action: {
            title: 'Update your cached password',
            steps: [
              'Lock your computer by pressing Windows Key + L',
              'Unlock it using your new password',
              'If Outlook or other apps prompt for a password, enter the new one',
              'Restart your computer to ensure all apps pick up the new password',
            ],
          }, next: 'step-check' },
          { label: 'No, I have not changed it', cause: 'Password is not being accepted — the account may be locked or the password may have expired.', outcome: 'escalate' },
        ],
      },
      'step-locked': {
        id: 'step-locked',
        question: 'Have you tried entering your password again after waiting 15 minutes?',
        description: 'Some systems automatically unlock after a short lockout period.',
        options: [
          { label: 'Yes, still locked', cause: 'Account is locked out — IT needs to unlock your account in the identity system.', outcome: 'escalate' },
          { label: "No, I'll wait and try", action: {
            title: 'Wait and retry',
            steps: [
              'Wait 15-30 minutes for the automatic lockout to expire',
              'Try logging in again with your correct password',
              'If you are unsure of your password, use the self-service reset portal',
              'If still locked after waiting, you will need IT to unlock the account',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-mfa': {
        id: 'step-mfa',
        question: 'Is your phone turned on and connected to the internet?',
        description: 'MFA prompts are sent to your phone via the authenticator app or SMS.',
        options: [
          { label: 'Yes, my phone is on and online', action: {
            title: 'Troubleshoot MFA prompts',
            steps: [
              'Open your authenticator app (e.g. Microsoft Authenticator) manually',
              'Check if there is a pending notification waiting for approval',
              'If no notification, try logging in again to trigger a new prompt',
              'Make sure notifications are enabled for the authenticator app in your phone settings',
              'If you recently got a new phone, you may need to re-register MFA with IT',
            ],
          }, next: 'step-check' },
          { label: 'No, my phone is off or offline', cause: 'MFA cannot be completed without a phone — if your phone is lost or broken, IT needs to reset your MFA registration.', outcome: 'escalate' },
        ],
      },
      'step-check': {
        id: 'step-check',
        question: 'Can you log in now?',
        options: [
          { label: "Yes, I can log in!", outcome: 'fixed', cause: 'The login issue was resolved — password was reset, Caps Lock was off, or MFA was re-established.' },
          { label: 'No, still cannot log in', cause: 'Persistent login issue — the account may be locked, disabled, or require IT intervention.', outcome: 'escalate' },
        ],
      },
    },
  },

  'display': {
    id: 'display',
    title: 'Display Troubleshooter',
    icon: 'monitor',
    problemLabel: 'Display issue',
    startStep: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        question: 'What display issue are you experiencing?',
        options: [
          { label: 'Screen is completely black/blank', next: 'step-blank' },
          { label: 'External monitor not detected', next: 'step-ext' },
          { label: 'Screen resolution is wrong', next: 'step-res' },
          { label: 'Screen is flickering', next: 'step-flicker' },
        ],
      },
      'step-blank': {
        id: 'step-blank',
        question: 'Is the computer itself turned on (power light is on)?',
        options: [
          { label: 'Yes, computer is on', action: {
            title: 'Check display connection and brightness',
            steps: [
              'Press the Spacebar or move the mouse — the screen may be in sleep mode',
              'Check that the monitor\'s power cable is plugged in and the power light is on',
              'Check the cable connecting the monitor to the computer (HDMI/DisplayPort) is secure at both ends',
              'Try pressing the monitor\'s input/source button to make sure it is on the correct input',
              'Try increasing the brightness using the monitor\'s physical buttons',
            ],
          }, next: 'step-check' },
          { label: 'No, computer seems off', action: {
            title: 'Power on the computer',
            steps: [
              'Check that the computer\'s power cable is firmly plugged in',
              'Check that the power outlet is working (try another device)',
              'Press and hold the power button for 3 seconds to turn it on',
              'Wait for the computer to boot up',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-ext': {
        id: 'step-ext',
        question: 'Is the monitor powered on and connected with a cable?',
        options: [
          { label: 'Yes, it is on and connected', action: {
            title: 'Detect the external monitor',
            steps: [
              'Press Windows Key + P and select "Extend"',
              'Right-click the desktop and select "Display settings"',
              'Click the "Detect" button',
              'If the monitor appears, select it and choose "Extend these displays"',
              'Make sure the resolution is set to "Recommended"',
            ],
          }, next: 'step-check' },
          { label: 'No, let me check the connections', action: {
            title: 'Check monitor connections',
            steps: [
              'Make sure the monitor is powered on (check the power light)',
              'Check that the HDMI or DisplayPort cable is firmly connected at both ends',
              'Try a different cable if available',
              'Try a different port on the computer if available',
              'Press Windows Key + P and select "Extend"',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-res': {
        id: 'step-res',
        question: 'Did the resolution change after an update or docking station change?',
        options: [
          { label: 'Yes, after an update', action: {
            title: 'Reset display resolution',
            steps: [
              'Right-click the desktop and select "Display settings"',
              'Under "Display resolution", select the option marked "Recommended"',
              'Click "Keep changes" when prompted',
              'If the issue persists, click "Advanced display settings" and check the refresh rate',
            ],
          }, next: 'step-check' },
          { label: 'No, it just looks wrong', action: {
            title: 'Adjust display settings',
            steps: [
              'Right-click the desktop and select "Display settings"',
              'Check the "Scale" setting — it should be 100% or 125%',
              'Check "Display resolution" — select "Recommended"',
              'If using multiple monitors, make sure each one is set correctly',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-flicker': {
        id: 'step-flicker',
        question: 'Is the flickering happening constantly or only in certain apps?',
        options: [
          { label: 'Only in certain apps', action: {
            title: 'Check app compatibility',
            steps: [
              'Note which app causes the flickering',
              'Try updating that app to the latest version',
              'If it is a browser, try disabling hardware acceleration in settings',
              'Restart the app and check if flickering stops',
            ],
          }, next: 'step-check' },
          { label: 'Constantly, even on the desktop', action: {
            title: 'Update display driver',
            steps: [
              'Press Windows Key, type "Device Manager" and press Enter',
              'Expand "Display adapters"',
              'Right-click your display adapter and select "Update driver"',
              'Select "Search automatically for drivers"',
              'Restart your computer after the update',
            ],
          }, cause: 'Display driver issue — the graphics driver may be outdated or corrupted.', next: 'step-check' },
        ],
      },
      'step-check': {
        id: 'step-check',
        question: 'Is your display working correctly now?',
        options: [
          { label: "Yes, it's fixed!", outcome: 'fixed', cause: 'The display issue was resolved by adjusting settings, connections, or drivers.' },
          { label: 'No, still having display issues', cause: 'Persistent display issue — may be a hardware problem with the monitor or graphics adapter.', outcome: 'escalate' },
        ],
      },
    },
  },

  'keyboard': {
    id: 'keyboard',
    title: 'Keyboard Troubleshooter',
    icon: 'keyboard',
    problemLabel: 'Keyboard issue',
    startStep: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        question: 'What type of keyboard are you using?',
        options: [
          { label: 'Built-in laptop keyboard', next: 'step-2' },
          { label: 'USB keyboard', next: 'step-usb' },
          { label: 'Wireless/Bluetooth keyboard', next: 'step-bt' },
        ],
      },
      'step-2': {
        id: 'step-2',
        question: 'Are certain keys not working, or the entire keyboard?',
        options: [
          { label: 'Entire keyboard is not responding', action: {
            title: 'Restart your computer',
            steps: [
              'Save any work if possible',
              'Press and hold the power button for 10 seconds to force shutdown',
              'Wait 5 seconds, then press power to turn it back on',
              'Test the keyboard after the restart',
            ],
          }, next: 'step-check' },
          { label: 'Only certain keys do not work', action: {
            title: 'Check for debris and keyboard layout',
            steps: [
              'Check if there is any debris under the non-working keys',
              'Gently tilt the laptop and shake to dislodge debris',
              'Press Windows Key, type "Language" and check the keyboard layout is correct',
              'Try the On-Screen Keyboard (Windows Key > type "OSK") to test if it is hardware or software',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-usb': {
        id: 'step-usb',
        question: 'Is the keyboard plugged in securely?',
        options: [
          { label: 'Yes, it is plugged in', action: {
            title: 'Try a different USB port',
            steps: [
              'Unplug the keyboard',
              'Plug it into a different USB port (preferably on the back of the computer)',
              'Wait 5 seconds for Windows to detect it',
              'If using a USB hub, try connecting directly to the computer instead',
              'Test the keyboard',
            ],
          }, next: 'step-check' },
          { label: 'Let me check', action: {
            title: 'Reseat the keyboard connection',
            steps: [
              'Unplug the keyboard cable',
              'Check the USB connector for damage',
              'Plug it back in firmly',
              'Wait 5 seconds for detection',
              'Test the keyboard',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-bt': {
        id: 'step-bt',
        question: 'Is the keyboard battery charged and Bluetooth enabled?',
        options: [
          { label: 'Yes, battery is fine and Bluetooth is on', action: {
            title: 'Re-pair the keyboard',
            steps: [
              'Turn the keyboard OFF and back ON',
              'Put it in pairing mode (check the manual — usually a button on the bottom)',
              'On your computer, click Bluetooth settings in the taskbar',
              'Remove the old keyboard pairing if it exists',
              'Select the keyboard from the device list and click Pair',
              'Test the keyboard',
            ],
          }, next: 'step-check' },
          { label: 'Not sure about the battery', action: {
            title: 'Check keyboard battery',
            steps: [
              'Replace the keyboard batteries with fresh ones',
              'If rechargeable, plug the keyboard in to charge for 15 minutes',
              'Turn the keyboard on',
              'Check that Bluetooth is enabled on your computer',
              'Try reconnecting the keyboard',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-check': {
        id: 'step-check',
        question: 'Is your keyboard working now?',
        options: [
          { label: "Yes, it's fixed!", outcome: 'fixed', cause: 'The keyboard issue was resolved by reconnecting, re-pairing, or restarting.' },
          { label: 'No, still not working', cause: 'Keyboard hardware may be faulty and need replacement, or there may be a deeper driver issue.', outcome: 'escalate' },
        ],
      },
    },
  },

  'mouse': {
    id: 'mouse',
    title: 'Mouse Troubleshooter',
    icon: 'mouse',
    problemLabel: 'Mouse issue',
    startStep: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        question: 'What type of mouse are you using?',
        options: [
          { label: 'Built-in laptop trackpad', next: 'step-trackpad' },
          { label: 'USB mouse', next: 'step-usb' },
          { label: 'Wireless/Bluetooth mouse', next: 'step-bt' },
        ],
      },
      'step-trackpad': {
        id: 'step-trackpad',
        question: 'Is the trackpad completely unresponsive or just erratic?',
        options: [
          { label: 'Completely unresponsive', action: {
            title: 'Check trackpad settings and restart',
            steps: [
              'Press Windows Key, type "Touchpad settings" and press Enter',
              'Make sure the touchpad toggle is ON',
              'If it is on, press Tab to navigate and the Spacebar to toggle',
              'Restart your computer and test the trackpad again',
            ],
          }, next: 'step-check' },
          { label: 'Erratic or jumpy', action: {
            title: 'Clean the trackpad',
            steps: [
              'Turn off the laptop',
              'Dampen a microfiber cloth with a small amount of water',
              'Gently wipe the trackpad surface to remove oils and debris',
              'Dry with a clean cloth',
              'Turn the laptop back on and test',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-usb': {
        id: 'step-usb',
        question: 'Is the mouse plugged in securely?',
        options: [
          { label: 'Yes, it is plugged in', action: {
            title: 'Try a different USB port',
            steps: [
              'Unplug the mouse',
              'Plug it into a different USB port',
              'Wait 5 seconds for detection',
              'Try using the mouse',
              'If it works in the new port, the original port may be faulty',
            ],
          }, next: 'step-check' },
          { label: "Let me check", action: {
            title: 'Reseat the mouse connection',
            steps: [
              'Unplug the mouse cable',
              'Plug it back in firmly',
              'Wait 5 seconds',
              'Test the mouse',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-bt': {
        id: 'step-bt',
        question: 'Is the mouse turned on with a charged battery?',
        options: [
          { label: 'Yes, it is on', action: {
            title: 'Re-pair the mouse',
            steps: [
              'Turn the mouse OFF and back ON',
              'Press and hold the pairing button (usually on the bottom)',
              'On your computer, open Bluetooth settings',
              'Remove the old mouse pairing if it exists',
              'Select the mouse from the device list and click Pair',
              'Test the mouse',
            ],
          }, next: 'step-check' },
          { label: 'Not sure', action: {
            title: 'Check mouse battery',
            steps: [
              'Replace the mouse battery with a fresh one',
              'If rechargeable, plug it in to charge for 15 minutes',
              'Turn the mouse on',
              'Check Bluetooth is enabled on your computer',
              'Try reconnecting the mouse',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-check': {
        id: 'step-check',
        question: 'Is your mouse working now?',
        options: [
          { label: "Yes, it's fixed!", outcome: 'fixed', cause: 'The mouse issue was resolved by reconnecting, re-pairing, or adjusting settings.' },
          { label: 'No, still not working', cause: 'Mouse hardware may be faulty and need replacement.', outcome: 'escalate' },
        ],
      },
    },
  },

  'files': {
    id: 'files',
    title: 'Files & Storage Troubleshooter',
    icon: 'folder',
    problemLabel: 'Files or storage issue',
    startStep: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        question: 'What file or storage issue are you experiencing?',
        options: [
          { label: 'Cannot find a file', next: 'step-find' },
          { label: 'Storage is almost full', next: 'step-full' },
          { label: 'Cannot open a file', next: 'step-open' },
          { label: 'Files are not syncing (OneDrive)', next: 'step-sync' },
        ],
      },
      'step-find': {
        id: 'step-find',
        question: 'Do you remember the file name or when you last used it?',
        options: [
          { label: 'I know the file name', action: {
            title: 'Search for the file',
            steps: [
              'Press Windows Key and start typing the file name',
              'Check the search results for your file',
              'If not found, open File Explorer and use the search bar in the top-right',
              'Try searching with partial names or file extensions (e.g. "*.docx" for Word files)',
              'Check the Recycle Bin if you may have deleted it',
            ],
          }, next: 'step-check' },
          { label: 'I know roughly when I last used it', action: {
            title: 'Search by date',
            steps: [
              'Open File Explorer and go to the folder where you think the file was',
              'Click the search bar and type "datemodified:today" or "datemodified:thisweek"',
              'Review the results for your file',
              'Also check Recent files: open File Explorer > Home > Recent',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-full': {
        id: 'step-full',
        question: 'Would you like guidance on freeing up storage space?',
        options: [
          { label: 'Yes, help me free up space', action: {
            title: 'Free up storage space',
            steps: [
              'Press Windows Key, type "Storage Settings" and press Enter',
              'Click "Temporary files" and check items to remove (temp files, recycle bin, thumbnails)',
              'Click "Remove files" to free up space',
              'Open File Explorer and check your Downloads folder for large files you no longer need',
              'Move large files to OneDrive or cloud storage to free up local space',
              'Uninstall applications you no longer use (Settings > Apps > Installed apps)',
            ],
          }, next: 'step-check' },
          { label: 'No, I just want to check my storage', action: {
            title: 'Check storage usage',
            steps: [
              'Open File Explorer and click "This PC"',
              'Look at the C: drive — it shows used and free space',
              'For a detailed breakdown, press Windows Key, type "Storage Settings" and press Enter',
              'Review the storage breakdown by category',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-open': {
        id: 'step-open',
        question: 'What happens when you try to open the file?',
        options: [
          { label: 'I get an error message', cause: 'The file may be corrupted, or the associated application is not installed. Note the error message for IT.', outcome: 'escalate' },
          { label: 'Nothing happens at all', action: {
            title: 'Check the file type and try another app',
            steps: [
              'Right-click the file and select "Properties"',
              'Check the "Type of file" field',
              'Make sure you have an application that can open that file type',
              'Right-click the file > "Open with" > select a different app',
              'If the file type is unfamiliar, it may need a specific application',
            ],
          }, next: 'step-check' },
          { label: 'It opens but looks wrong', action: {
            title: 'Check file format compatibility',
            steps: [
              'The file may have been created in a different version of the software',
              'Try opening it in a compatible application (e.g. older Office files in Compatibility Mode)',
              'If it is a PDF, try opening it in a different PDF reader',
              'If it is an image, try Windows Photos or another viewer',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-sync': {
        id: 'step-sync',
        question: 'Is OneDrive running (check for the cloud icon in the taskbar)?',
        options: [
          { label: 'Yes, I see the OneDrive icon', action: {
            title: 'Force OneDrive sync',
            steps: [
              'Click the OneDrive cloud icon in the taskbar',
              'Click "Help & Settings" (gear icon) > "Pause syncing" > select 2 hours',
              'Wait 5 seconds, then go back and select "Resume syncing"',
              'Check if files start syncing (look for the spinning arrows icon)',
              'If files show a red X, click the icon for error details',
            ],
          }, next: 'step-check' },
          { label: 'No, I do not see the icon', action: {
            title: 'Restart OneDrive',
            steps: [
              'Press Windows Key, type "OneDrive" and press Enter',
              'Wait for OneDrive to start',
              'Sign in with your work account if prompted',
              'Check that the cloud icon appears in the taskbar',
              'Wait for the initial sync to complete',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-check': {
        id: 'step-check',
        question: 'Is your file or storage issue resolved?',
        options: [
          { label: "Yes, it's fixed!", outcome: 'fixed', cause: 'The file was found, storage was freed up, or syncing was restored.' },
          { label: 'No, still having issues', cause: 'File or storage issue that may require IT to check disk health, permissions, or OneDrive configuration.', outcome: 'escalate' },
        ],
      },
    },
  },

  'teams': {
    id: 'teams',
    title: 'Microsoft Teams Troubleshooter',
    icon: 'message-square',
    problemLabel: 'Microsoft Teams issue',
    startStep: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        question: 'What Teams issue are you experiencing?',
        options: [
          { label: 'Teams is slow or freezing', next: 'step-slow' },
          { label: 'Cannot join a meeting', next: 'step-meeting' },
          { label: 'No sound or video in calls', next: 'step-av' },
          { label: 'Messages are not sending', next: 'step-msg' },
        ],
      },
      'step-slow': {
        id: 'step-slow',
        question: 'Have you tried clearing the Teams cache?',
        description: 'A corrupted cache is the most common cause of Teams performance issues.',
        options: [
          { label: 'No, how do I do that?', action: {
            title: 'Clear the Teams cache',
            steps: [
              'Fully quit Teams (right-click the Teams icon in the taskbar > Quit)',
              'Press Windows Key + R to open Run',
              'Type: %appdata%\\Microsoft\\Teams and press Enter',
              'Delete the following folders: Blob_storage, Cache, GPUCache, Local Storage, tmp',
              'Restart Teams from the Start menu',
              'Sign back in with your work account',
            ],
          }, next: 'step-check' },
          { label: 'Yes, I already cleared the cache', action: {
            title: 'Reinstall Teams',
            steps: [
              'Quit Teams completely',
              'Go to Settings > Apps > Installed apps',
              'Find Microsoft Teams and click Uninstall',
              'Download the latest version from your company\'s software portal or teams.microsoft.com/download',
              'Install and sign in again',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-meeting': {
        id: 'step-meeting',
        question: 'Are you trying to join from the Teams app or from a browser link?',
        options: [
          { label: 'From the Teams app', action: {
            title: 'Join from the calendar',
            steps: [
              'Open Teams and click the Calendar tab',
              'Find the meeting and click "Join"',
              'Check that your camera and mic are working in the pre-join screen',
              'Click "Join now"',
              'If it still does not work, try the "Join on this device" option',
            ],
          }, next: 'step-check' },
          { label: 'From a browser link', action: {
            title: 'Join from the app instead',
            steps: [
              'Copy the meeting link from the email invitation',
              'Open the Teams app (not the browser)',
              'Click "Calendar" and find the meeting',
              'Click "Join"',
              'If Teams is not installed, click "Continue on this browser" in the meeting link',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-av': {
        id: 'step-av',
        question: 'Can you see and hear others, but they cannot see/hear you?',
        options: [
          { label: 'Yes, others cannot see/hear me', action: {
            title: 'Check Teams device settings',
            steps: [
              'In Teams, click the three dots (...) next to your profile > Settings > Devices',
              'Check that the correct microphone is selected under "Microphone"',
              'Check that the correct camera is selected under "Camera"',
              'Make a test call by clicking "Make a test call"',
              'Check that your mic and camera are not muted during the call',
            ],
          }, next: 'step-check' },
          { label: 'No, I cannot see or hear anyone', action: {
            title: 'Check system audio/video devices',
            steps: [
              'Click the speaker icon in the taskbar and make sure volume is up',
              'Check that your headset is connected (USB or Bluetooth)',
              'Press Windows Key, type "Camera" and check that your camera is detected',
              'In Teams Settings > Devices, verify devices are listed',
              'Try unplugging and replugging your headset',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-msg': {
        id: 'step-msg',
        question: 'Are you connected to the internet?',
        options: [
          { label: 'Yes, internet is working', action: {
            title: 'Force a Teams refresh',
            steps: [
              'Fully quit Teams (right-click the Teams icon > Quit)',
              'Wait 5 seconds',
              'Reopen Teams from the Start menu',
              'Check if your status shows as "Available" (green)',
              'Try sending a test message',
            ],
          }, next: 'step-check' },
          { label: 'No or not sure', action: {
            title: 'Check your connection',
            steps: [
              'Check the Wi-Fi/Ethernet icon in the taskbar',
              'If using VPN, make sure it is connected',
              'Try opening a website in your browser to verify connectivity',
              'If no internet, use the Internet troubleshooter first',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-check': {
        id: 'step-check',
        question: 'Is Teams working properly now?',
        options: [
          { label: "Yes, it's fixed!", outcome: 'fixed', cause: 'The Teams issue was resolved by clearing cache, adjusting device settings, or reconnecting.' },
          { label: 'No, still having problems', cause: 'Persistent Teams issue that may require IT to check your Teams policy or reinstall the application.', outcome: 'escalate' },
        ],
      },
    },
  },

  'power': {
    id: 'power',
    title: 'Power & Battery Troubleshooter',
    icon: 'battery-charging',
    problemLabel: 'Power or battery issue',
    startStep: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        question: 'What power issue are you experiencing?',
        options: [
          { label: 'Battery drains too quickly', next: 'step-drain' },
          { label: 'Laptop will not charge', next: 'step-charge' },
          { label: 'Computer shuts down unexpectedly', next: 'step-shutdown' },
          { label: 'Battery percentage is stuck', next: 'step-stuck' },
        ],
      },
      'step-drain': {
        id: 'step-drain',
        question: 'How long does the battery last now compared to before?',
        options: [
          { label: 'Less than 2 hours', action: {
            title: 'Optimize battery usage',
            steps: [
              'Click the battery icon in the taskbar and move the slider to "Best power efficiency"',
              'Close unnecessary apps, especially browsers with many tabs',
              'Reduce screen brightness to 50% or lower',
              'Disconnect unused USB devices that draw power',
              'Press Windows Key, type "Battery saver" and turn it on',
            ],
          }, next: 'step-check' },
          { label: 'About half of what it used to be', action: {
            title: 'Check battery health',
            steps: [
              'Press Windows Key, type "cmd", right-click Command Prompt > Run as Administrator',
              'Type: powercfg /batteryreport and press Enter',
              'Note the file path where the report was saved',
              'Open the report in a browser to see your battery health',
              'If the design capacity is much higher than full charge capacity, the battery is aging',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-charge': {
        id: 'step-charge',
        question: 'Have you checked the power adapter and charging cable?',
        options: [
          { label: 'Yes, they look fine', action: {
            title: 'Try a different outlet and reseat the connection',
            steps: [
              'Unplug the charger from the wall and the laptop',
              'Try a different power outlet that you know works',
              'Plug the charger back into the laptop firmly',
              'Check that the charging LED turns on (if your laptop has one)',
              'Try a different charger if one is available',
            ],
          }, next: 'step-check' },
          { label: 'No, let me check', action: {
            title: 'Inspect the charging equipment',
            steps: [
              'Check the charger cable for any visible damage or fraying',
              'Check the charging port on the laptop for bent pins or debris',
              'Make sure the charger is the correct one for your laptop (correct wattage)',
              'Try using the charger with a different outlet',
              'If the charger or cable is damaged, do not use it — request a replacement',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-shutdown': {
        id: 'step-shutdown',
        question: 'Does the computer shut down when you are doing something specific, or randomly?',
        options: [
          { label: 'When running demanding apps (video calls, heavy software)', action: {
            title: 'Check for overheating',
            steps: [
              'Check if the laptop feels very hot or the fan is very loud',
              'Make sure the vents on the bottom and sides are not blocked',
              'Place the laptop on a hard, flat surface (not a bed or cushion)',
              'Close unnecessary apps to reduce the load',
              'If it still overheats, the cooling system may need cleaning by IT',
            ],
          }, cause: 'Overheating — the computer shuts down to protect itself from heat damage.', next: 'step-check' },
          { label: 'Randomly, even when not doing much', cause: 'Random shutdowns can indicate a hardware issue (battery, power supply, or motherboard) that needs IT to inspect.', outcome: 'escalate' },
        ],
      },
      'step-stuck': {
        id: 'step-stuck',
        question: 'Is the battery percentage stuck at a specific number even when charging?',
        options: [
          { label: 'Yes, it is stuck', action: {
            title: 'Calibrate the battery',
            steps: [
              'Unplug the charger and use the laptop until it fully discharges and shuts down',
              'Leave it off for 5 minutes',
              'Plug in the charger and turn it on',
              'Let it charge to 100% without using it',
              'Check if the percentage is now updating correctly',
            ],
          }, next: 'step-check' },
          { label: 'No, it updates but very slowly', action: {
            title: 'Run the power troubleshooter',
            steps: [
              'Press Windows Key, type "Troubleshoot settings" and press Enter',
              'Click "Other troubleshooters"',
              'Find "Power" and click "Run"',
              'Follow the on-screen prompts',
              'Apply any recommended fixes',
            ],
          }, next: 'step-check' },
        ],
      },
      'step-check': {
        id: 'step-check',
        question: 'Is your power or battery issue resolved?',
        options: [
          { label: "Yes, it's fixed!", outcome: 'fixed', cause: 'The power issue was resolved by adjusting settings, reseating connections, or calibrating the battery.' },
          { label: 'No, still having issues', cause: 'Hardware issue with the battery, charger, or power system that requires IT inspection.', outcome: 'escalate' },
        ],
      },
    },
  },
};

import type { DiagnosisResult, LearningContent } from '@/types';

interface KeywordRule {
  flowId: string;
  problemLabel: string;
  keywords: string[];
}

export const keywordRules: KeywordRule[] = [
  { flowId: 'internet', problemLabel: 'Network / Internet', keywords: ['wi-fi', 'wifi', 'wi fi', 'internet', 'website', 'websites', 'connection', 'network', 'router', 'ethernet', 'dns', 'online', 'browser', 'loading'] },
  { flowId: 'slow-computer', problemLabel: 'Slow Computer', keywords: ['slow', 'freezing', 'lagging', 'lag', 'performance', 'unresponsive', 'stuck', 'hang', 'hangs', 'frozen', 'sluggish'] },
  { flowId: 'printer', problemLabel: 'Printer', keywords: ['print', 'printer', 'printing', 'prints', 'printed'] },
  { flowId: 'no-sound', problemLabel: 'Sound', keywords: ['sound', 'audio', 'speaker', 'speakers', 'microphone', 'mic', 'volume', 'mute', 'muted', 'headphone', 'headphones'] },
  { flowId: 'login', problemLabel: 'Login', keywords: ['password', 'login', 'log in', 'sign in', 'signin', 'account', 'locked', 'lockout', 'mfa', 'authentication'] },
  { flowId: 'email', problemLabel: 'Email', keywords: ['email', 'outlook', 'inbox', 'sending', 'receiving', 'mail', 'message'] },
  { flowId: 'display', problemLabel: 'Display', keywords: ['screen', 'display', 'monitor', 'resolution', 'flickering', 'flicker', 'blank', 'black screen'] },
  { flowId: 'keyboard', problemLabel: 'Keyboard', keywords: ['keyboard', 'keys', 'typing', 'type'] },
  { flowId: 'mouse', problemLabel: 'Mouse', keywords: ['mouse', 'trackpad', 'touchpad', 'cursor', 'pointer', 'click'] },
  { flowId: 'files', problemLabel: 'Files & Storage', keywords: ['file', 'files', 'storage', 'disk', 'space', 'full', 'sync', 'onedrive', 'folder', 'delete'] },
  { flowId: 'teams', problemLabel: 'Microsoft Teams', keywords: ['teams', 'meeting', 'video call', 'chat'] },
  { flowId: 'power', problemLabel: 'Power & Battery', keywords: ['battery', 'power', 'charge', 'charging', 'charger', 'shut down', 'shutdown'] },
];

export function analyseProblem(text: string): DiagnosisResult | null {
  const lower = text.toLowerCase();
  let bestMatch: { rule: KeywordRule; count: number; matched: string[] } | null = null;

  for (const rule of keywordRules) {
    const matched: string[] = [];
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) {
        matched.push(kw);
      }
    }
    if (matched.length > 0) {
      if (!bestMatch || matched.length > bestMatch.count) {
        bestMatch = { rule, count: matched.length, matched };
      }
    }
  }

  if (!bestMatch) return null;

  const confidence: 'high' | 'medium' | 'low' =
    bestMatch.count >= 3 ? 'high' : bestMatch.count === 2 ? 'medium' : 'low';

  const reasons = bestMatch.matched.map((kw) => {
    const display = kw.charAt(0).toUpperCase() + kw.slice(1);
    return `You mentioned "${display}".`;
  });

  return {
    flowId: bestMatch.rule.flowId,
    problemLabel: bestMatch.rule.problemLabel,
    matchedKeywords: bestMatch.matched,
    confidence,
    reasons,
  };
}

export const learningContent: Record<string, LearningContent> = {
  internet: {
    topic: 'DNS',
    term: 'DNS',
    explanation: 'DNS helps your computer find websites when you enter a website address.',
    whyExplanation: 'When you type a website name like google.com, DNS translates it into a numeric address that computers use to find each other. If DNS is not working, your computer cannot find websites even though your internet connection is fine.',
    quiz: [
      {
        question: 'What does DNS help your computer do?',
        options: ['Store photos', 'Find websites', 'Increase RAM'],
        answer: 1,
        explanation: 'DNS translates website names into computer addresses so your browser can find them.',
      },
      {
        question: 'If your Wi-Fi is connected but websites do not load, what might be the problem?',
        options: ['Your screen is too bright', 'DNS might not be working', 'Your keyboard is broken'],
        answer: 1,
        explanation: 'DNS issues prevent website names from being translated into addresses, so pages will not load despite a working connection.',
      },
      {
        question: 'What is one thing you can try if you suspect a DNS problem?',
        options: ['Restart your computer', 'Flush the DNS cache', 'Buy a new monitor'],
        answer: 1,
        explanation: 'Flushing the DNS cache clears outdated or corrupted entries, which often restores website access.',
      },
    ],
  },
  'slow-computer': {
    topic: 'RAM',
    term: 'RAM',
    explanation: 'RAM is your computer\'s short-term memory. It holds the data for apps you are actively using.',
    whyExplanation: 'When you have too many apps open, your RAM gets full and the computer slows down. Closing apps you are not using frees up RAM and can speed things up immediately.',
    quiz: [
      {
        question: 'What does RAM do?',
        options: ['Stores files permanently', 'Holds data for apps you are actively using', 'Connects you to the internet'],
        answer: 1,
        explanation: 'RAM provides fast, temporary storage for data that apps are actively using.',
      },
      {
        question: 'What is a quick way to free up RAM?',
        options: ['Delete your files', 'Close apps you are not using', 'Unplug your keyboard'],
        answer: 1,
        explanation: 'Closing apps releases the RAM they were using, making more memory available for other tasks.',
      },
      {
        question: 'Why does restarting often speed up a slow computer?',
        options: ['It downloads new software', 'It clears RAM and reloads everything fresh', 'It increases internet speed'],
        answer: 1,
        explanation: 'Restarting clears all RAM, stops stuck processes, and reloads the system from a clean state.',
      },
    ],
  },
  printer: {
    topic: 'Print Spooler',
    term: 'Print Spooler',
    explanation: 'The print spooler is a service that manages all print jobs sent to your printer.',
    whyExplanation: 'Sometimes a print job gets stuck in the spooler and blocks all new jobs. Restarting the spooler service clears the blockage and lets you print again.',
    quiz: [
      {
        question: 'What does the print spooler do?',
        options: ['It stores your files', 'It manages print jobs sent to the printer', 'It connects you to Wi-Fi'],
        answer: 1,
        explanation: 'The print spooler queues and manages all documents sent to the printer.',
      },
      {
        question: 'What can happen if a print job gets stuck in the spooler?',
        options: ['Nothing happens', 'All new print jobs are blocked', 'Your screen turns off'],
        answer: 1,
        explanation: 'A stuck job blocks the queue, preventing any new documents from printing.',
      },
      {
        question: 'What is one way to fix a stuck print queue?',
        options: ['Restart the print spooler service', 'Buy a new printer', 'Turn off your monitor'],
        answer: 0,
        explanation: 'Restarting the print spooler clears stuck jobs and restores normal printing.',
      },
    ],
  },
  'no-sound': {
    topic: 'Audio Output Device',
    term: 'Audio Output Device',
    explanation: 'An audio output device is where your computer sends sound — your speakers, headphones, or monitor.',
    whyExplanation: 'Sometimes Windows sends sound to the wrong device, like a disconnected monitor instead of your headphones. Selecting the correct output device fixes the problem.',
    quiz: [
      {
        question: 'What is an audio output device?',
        options: ['Where your computer sends sound', 'A type of internet connection', 'A storage device'],
        answer: 0,
        explanation: 'An audio output device is where sound goes — speakers, headphones, or a monitor.',
      },
      {
        question: 'Why might you hear no sound even though nothing is muted?',
        options: ['Sound is going to the wrong device', 'Your keyboard is broken', 'Your storage is full'],
        answer: 0,
        explanation: 'Windows may be sending audio to a device that is not connected or not in use.',
      },
      {
        question: 'How do you check which audio device is selected?',
        options: ['Click the speaker icon and check the output list', 'Restart your computer', 'Unplug everything'],
        answer: 0,
        explanation: 'The speaker icon in the taskbar lets you see and switch between audio output devices.',
      },
    ],
  },
  login: {
    topic: 'MFA',
    term: 'MFA',
    explanation: 'MFA (Multi-Factor Authentication) means you need more than just a password to log in.',
    whyExplanation: 'After entering your password, you also confirm your identity with a second method like a phone app. This protects your account even if someone steals your password.',
    quiz: [
      {
        question: 'What does MFA stand for?',
        options: ['Multiple File Access', 'Multi-Factor Authentication', 'Main Frame Adapter'],
        answer: 1,
        explanation: 'MFA stands for Multi-Factor Authentication — a second layer of security beyond your password.',
      },
      {
        question: 'Why is MFA important?',
        options: ['It makes logging in faster', 'It adds a second layer of security', 'It stores your passwords'],
        answer: 1,
        explanation: 'MFA requires a second form of verification, so even a stolen password is not enough to access your account.',
      },
      {
        question: 'What should you do if MFA prompts are not appearing?',
        options: ['Disable all security', 'Check that your phone is on and connected to the internet', 'Delete your account'],
        answer: 1,
        explanation: 'MFA prompts are sent to your phone, so it must be powered on and connected to receive them.',
      },
    ],
  },
  email: {
    topic: 'Outbox',
    term: 'Outbox',
    explanation: 'The Outbox is a folder in your email app where messages wait before being sent.',
    whyExplanation: 'If a message gets stuck in the Outbox, it blocks new emails from sending. Clearing the Outbox and forcing a send/receive usually fixes the issue.',
    quiz: [
      {
        question: 'What is the Outbox?',
        options: ['Where sent emails are stored', 'Where emails wait before being sent', 'A type of virus'],
        answer: 1,
        explanation: 'The Outbox holds outgoing messages until they are successfully delivered.',
      },
      {
        question: 'What can cause emails to get stuck in the Outbox?',
        options: ['Large attachments or no internet', 'Too many bookmarks', 'A dark theme'],
        answer: 0,
        explanation: 'Large attachments or no internet connection can prevent emails from sending, leaving them stuck in the Outbox.',
      },
      {
        question: 'How can you fix stuck emails in the Outbox?',
        options: ['Delete them and try re-sending', 'Buy a new computer', 'Change your password'],
        answer: 0,
        explanation: 'Deleting the stuck emails and composing them again often resolves the issue.',
      },
    ],
  },
  display: {
    topic: 'Display Driver',
    term: 'Display Driver',
    explanation: 'A display driver is software that tells your computer how to show images on your screen.',
    whyExplanation: 'If the driver is outdated or corrupted, your screen may flicker, show the wrong resolution, or go blank. Updating or reinstalling the driver usually fixes display problems.',
    quiz: [
      {
        question: 'What does a display driver do?',
        options: ['It stores your files', 'It tells your computer how to show images on screen', 'It connects you to Wi-Fi'],
        answer: 1,
        explanation: 'The display driver translates instructions into the images you see on your monitor.',
      },
      {
        question: 'What might happen if your display driver is outdated?',
        options: ['Flickering or wrong resolution', 'Faster internet', 'More storage space'],
        answer: 0,
        explanation: 'Outdated drivers can cause flickering, wrong resolution, or a blank screen.',
      },
      {
        question: 'How can you fix a display driver problem?',
        options: ['Update or reinstall the driver', 'Buy a new keyboard', 'Delete your files'],
        answer: 0,
        explanation: 'Updating or reinstalling the display driver through Device Manager resolves most display issues.',
      },
    ],
  },
  keyboard: {
    topic: 'Device Manager',
    term: 'Device Manager',
    explanation: 'Device Manager is a Windows tool that shows all hardware connected to your computer.',
    whyExplanation: 'If a keyboard or other device stops working, Device Manager can show if there is a driver problem. You can update or reinstall drivers from there.',
    quiz: [
      {
        question: 'What does Device Manager show you?',
        options: ['All hardware connected to your computer', 'Your email inbox', 'Your internet history'],
        answer: 0,
        explanation: 'Device Manager lists all hardware devices and their driver status.',
      },
      {
        question: 'If your keyboard stops working, where can you check for driver issues?',
        options: ['Device Manager', 'Your browser', 'The Recycle Bin'],
        answer: 0,
        explanation: 'Device Manager shows keyboard status and lets you update or reinstall drivers.',
      },
      {
        question: 'What is a common fix for keyboard driver problems?',
        options: ['Restart the computer so Windows reinstalls the driver', 'Buy a new monitor', 'Clear your browser cache'],
        answer: 0,
        explanation: 'Restarting often prompts Windows to reinstall the keyboard driver automatically.',
      },
    ],
  },
  mouse: {
    topic: 'Bluetooth Pairing',
    term: 'Bluetooth Pairing',
    explanation: 'Bluetooth pairing is the process of connecting a wireless device to your computer.',
    whyExplanation: 'Sometimes a wireless mouse loses its pairing connection. Re-pairing it — removing the old connection and adding it again — usually restores it.',
    quiz: [
      {
        question: 'What is Bluetooth pairing?',
        options: ['Connecting a wireless device to your computer', 'Deleting files', 'Installing software updates'],
        answer: 0,
        explanation: 'Pairing establishes a wireless connection between a device like a mouse and your computer.',
      },
      {
        question: 'What should you try if your wireless mouse stops working?',
        options: ['Re-pair it in Bluetooth settings', 'Restart your internet router', 'Buy a new keyboard'],
        answer: 0,
        explanation: 'Removing the old pairing and re-pairing the mouse usually restores the connection.',
      },
      {
        question: 'What is a common cause of wireless mouse problems?',
        options: ['Dead batteries', 'Full storage', 'Too many browser tabs'],
        answer: 0,
        explanation: 'Dead or low batteries are the most common cause of wireless mouse issues.',
      },
    ],
  },
  files: {
    topic: 'Cloud Storage',
    term: 'Cloud Storage',
    explanation: 'Cloud storage saves your files on remote servers so you can access them from any device.',
    whyExplanation: 'Moving large files to cloud storage like OneDrive frees up local disk space and keeps your files safe even if your computer is lost or damaged.',
    quiz: [
      {
        question: 'What is cloud storage?',
        options: ['Files stored on remote servers accessible from any device', 'A type of keyboard', 'A network cable'],
        answer: 0,
        explanation: 'Cloud storage keeps files on remote servers, accessible from any device with your login.',
      },
      {
        question: 'How can cloud storage help when your disk is full?',
        options: ['It moves files off your computer to free up space', 'It makes your computer faster', 'It fixes your printer'],
        answer: 0,
        explanation: 'Moving large files to the cloud frees up local storage space.',
      },
      {
        question: 'What is a benefit of storing files in the cloud?',
        options: ['Files are safe even if your computer is lost', 'Files load faster on your screen', 'Files use less RAM'],
        answer: 0,
        explanation: 'Cloud-stored files are protected from local hardware failure, loss, or damage.',
      },
    ],
  },
  teams: {
    topic: 'App Cache',
    term: 'Cache',
    explanation: 'Cache is temporary stored data that helps apps load faster, but it can become corrupted.',
    whyExplanation: 'When Teams is slow or freezing, a corrupted cache is often the cause. Clearing the cache forces Teams to reload fresh data, which usually fixes performance issues.',
    quiz: [
      {
        question: 'What is cache?',
        options: ['Temporary stored data that helps apps load faster', 'A type of virus', 'A network cable'],
        answer: 0,
        explanation: 'Cache stores frequently used data for quick access, but it can become corrupted over time.',
      },
      {
        question: 'Why can clearing cache fix Teams problems?',
        options: ['It removes corrupted data so the app reloads fresh', 'It increases internet speed', 'It frees up RAM permanently'],
        answer: 0,
        explanation: 'Clearing cache removes corrupted or outdated files, forcing the app to download fresh, correct versions.',
      },
      {
        question: 'What is a common symptom of a corrupted Teams cache?',
        options: ['Teams is slow or freezing', 'Your printer stops working', 'Your screen goes black'],
        answer: 0,
        explanation: 'Slow performance and freezing are the most common symptoms of cache corruption in Teams.',
      },
    ],
  },
  power: {
    topic: 'Battery Health',
    term: 'Battery Health',
    explanation: 'Battery health measures how much charge your battery can hold compared to when it was new.',
    whyExplanation: 'Over time, batteries lose their ability to hold a full charge. If your battery drains quickly, it may be aging and need replacement. Windows can generate a battery report to check this.',
    quiz: [
      {
        question: 'What does battery health measure?',
        options: ['How much charge the battery can hold vs when new', 'How fast your computer runs', 'Your internet speed'],
        answer: 0,
        explanation: 'Battery health compares current charge capacity to the original design capacity.',
      },
      {
        question: 'What happens to batteries over time?',
        options: ['They hold less charge', 'They get faster', 'They increase storage'],
        answer: 0,
        explanation: 'Batteries degrade over time, holding less charge and requiring more frequent charging.',
      },
      {
        question: 'How can you check your battery health on Windows?',
        options: ['Generate a battery report using powercfg', 'Check your email', 'Look at your desktop wallpaper'],
        answer: 0,
        explanation: 'The command "powercfg /batteryreport" generates a detailed report on battery health and usage history.',
      },
    ],
  },
};
