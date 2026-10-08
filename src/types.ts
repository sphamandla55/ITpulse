export type Status = 'good' | 'attention' | 'action' | 'risk';

export type PageKey =
  | 'dashboard'
  | 'device-health'
  | 'troubleshoot'
  | 'security'
  | 'knowledge'
  | 'recommendations'
  | 'settings';

export interface HealthCategory {
  key: string;
  label: string;
  status: Status;
  message: string;
  icon: string;
}

export interface DeviceMetrics {
  score: number;
  performance: {
    cpu: number;
    memory: number;
    runningApps: { name: string; usage: number; status: Status }[];
    startupApps: { name: string; impact: 'low' | 'medium' | 'high' }[];
  };
  storage: {
    total: number;
    used: number;
    breakdown: { label: string; size: number; color: string }[];
  };
  network: {
    status: Status;
    type: string;
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
    dns: Status;
    dnsServer: string;
  };
  updates: {
    system: { name: string; date: string; severity: 'important' | 'optional' }[];
    apps: { name: string; current: string; available: string }[];
    security: { name: string; date: string; status: 'pending' | 'installed' }[];
  };
}

export interface SecurityCheck {
  key: string;
  label: string;
  status: Status;
  detail: string;
  recommendation: string;
  demo: boolean;
}

export interface KnowledgeArticle {
  id: string;
  category: string;
  title: string;
  icon: string;
  explanation: string;
  whyItMatters: string;
  commonProblems: string[];
  quiz: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
}

export interface Recommendation {
  id: string;
  icon: string;
  title: string;
  description: string;
  action: string;
  guideType: 'storage' | 'updates' | 'security';
  priority: 'high' | 'medium' | 'low';
}

export interface ExplainTerm {
  term: string;
  short: string;
  long: string;
}

export interface TroubleshootStep {
  id: string;
  question: string;
  description?: string;
  options: {
    label: string;
    next?: string;
    action?: { title: string; steps: string[] };
    outcome?: 'fixed' | 'escalate';
    cause?: string;
  }[];
}

export interface TroubleshootFlow {
  id: string;
  title: string;
  icon: string;
  problemLabel: string;
  startStep: string;
  steps: Record<string, TroubleshootStep>;
}

export interface EscalationSummary {
  problem: string;
  userDescription: string;
  checksCompleted: string[];
  possibleCause: string;
}

export interface DiagnosisResult {
  flowId: string;
  problemLabel: string;
  matchedKeywords: string[];
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
}

export interface TroubleshootHistoryEntry {
  id: string;
  date: number;
  problem: string;
  outcome: 'solved' | 'escalated';
  fixCause: string | null;
  possibleCause: string | null;
  steps: { question: string; answer: string }[];
  userDescription: string;
}

export interface LearningContent {
  topic: string;
  term: string;
  explanation: string;
  whyExplanation: string;
  quiz: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }[];
}
