import { useState } from 'react';
import type { PageKey, TroubleshootFlow, EscalationSummary, DiagnosisResult, LearningContent } from '@/types';
import { troubleshootCategories, troubleshootFlows, analyseProblem, learningContent } from '@/data/troubleshootData';
import { Icon } from '@/components/Icon';
import { ExplainButton } from '@/components/ExplainModal';
import { useExplain } from '@/context/ExplainContext';
import { EscalationScreen } from './EscalationScreen';
import { useTroubleshootHistory } from '@/hooks/useTroubleshootHistory';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Wrench,
  Lightbulb, PartyPopper, Search, Sparkles, BookOpen,
  GraduationCap, RotateCcw, ChevronRight, XCircle,
  HelpCircle, AlertCircle,
} from 'lucide-react';

interface Props {
  onNavigate: (page: PageKey) => void;
}

interface StepHistory {
  stepId: string;
  question: string;
  answer: string;
}

type Phase = 'describe' | 'diagnosis' | 'troubleshooting' | 'fixed' | 'escalate' | 'learning';

export function Troubleshoot({ onNavigate }: Props) {
  const { addEntry } = useTroubleshootHistory();
  const { openExplain } = useExplain();

  const [phase, setPhase] = useState<Phase>('describe');
  const [userText, setUserText] = useState('');
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<TroubleshootFlow | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [history, setHistory] = useState<StepHistory[]>([]);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [escalationData, setEscalationData] = useState<EscalationSummary | null>(null);
  const [fixCause, setFixCause] = useState<string | null>(null);
  const [learning, setLearning] = useState<LearningContent | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleAnalyse = () => {
    const text = userText.trim();
    if (!text) return;
    const result = analyseProblem(text);
    setDiagnosis(result);
    setPhase('diagnosis');
  };

  const handleStartTroubleshooting = (flowId: string) => {
    const flow = troubleshootFlows[flowId];
    if (!flow) return;
    setSelectedFlow(flow);
    setCurrentStepId(flow.startStep);
    setHistory([]);
    setCompletedActions([]);
    setPhase('troubleshooting');
  };

  const handleDiagnosisContinue = () => {
    if (diagnosis) {
      handleStartTroubleshooting(diagnosis.flowId);
    }
  };

  const resetAll = () => {
    setPhase('describe');
    setUserText('');
    setDiagnosis(null);
    setSelectedFlow(null);
    setCurrentStepId(null);
    setHistory([]);
    setCompletedActions([]);
    setEscalationData(null);
    setFixCause(null);
    setLearning(null);
    setQuizAnswers([]);
    setQuizSubmitted(false);
  };

  const handleOption = (option: {
    label: string;
    next?: string;
    action?: { title: string; steps: string[] };
    outcome?: 'fixed' | 'escalate';
    cause?: string;
  }) => {
    if (!currentStepId || !selectedFlow) return;
    const step = selectedFlow.steps[currentStepId];

    const newHistory = [...history, { stepId: currentStepId, question: step.question, answer: option.label }];
    setHistory(newHistory);

    let newActions = completedActions;
    if (option.action) {
      newActions = [...completedActions, option.action.title];
      setCompletedActions(newActions);
    }

    if (option.outcome === 'fixed') {
      setOutcome('fixed', option.cause || null, newHistory, newActions);
      return;
    }

    if (option.outcome === 'escalate') {
      setOutcome('escalate', null, newHistory, newActions, option.cause);
      return;
    }

    if (option.next) {
      setCurrentStepId(option.next);
    }
  };

  const setOutcome = (
    type: 'fixed' | 'escalate',
    cause: string | null,
    hist: StepHistory[],
    actions: string[],
    escalateCause?: string
  ) => {
    if (type === 'fixed') {
      setFixCause(cause);
      setPhase('fixed');
      addEntry({
        id: `entry-${Date.now()}`,
        date: Date.now(),
        problem: selectedFlow?.problemLabel || 'Unknown',
        outcome: 'solved',
        fixCause: cause,
        possibleCause: null,
        steps: hist.map((h) => ({ question: h.question, answer: h.answer })),
        userDescription: userText,
      });
    } else {
      const escalation: EscalationSummary = {
        problem: selectedFlow?.problemLabel || 'Unknown',
        userDescription: userText,
        checksCompleted: actions,
        possibleCause: escalateCause || 'Unable to determine the exact cause automatically.',
      };
      setEscalationData(escalation);
      setPhase('escalate');
      addEntry({
        id: `entry-${Date.now()}`,
        date: Date.now(),
        problem: selectedFlow?.problemLabel || 'Unknown',
        outcome: 'escalated',
        fixCause: null,
        possibleCause: escalation.possibleCause,
        steps: hist.map((h) => ({ question: h.question, answer: h.answer })),
        userDescription: userText,
      });
    }
  };

  const handleStartLearning = () => {
    if (!selectedFlow) return;
    const content = learningContent[selectedFlow.id];
    if (content) {
      setLearning(content);
      setQuizAnswers(new Array(content.quiz.length).fill(null));
      setQuizSubmitted(false);
      setPhase('learning');
    } else {
      resetAll();
    }
  };

  const handleQuizAnswer = (qIdx: number, aIdx: number) => {
    if (quizSubmitted) return;
    const newAnswers = [...quizAnswers];
    newAnswers[qIdx] = aIdx;
    setQuizAnswers(newAnswers);
  };

  const quizScore = learning
    ? learning.quiz.reduce((score, q, i) => (quizAnswers[i] === q.answer ? score + 1 : score), 0)
    : 0;

  // --- DESCRIBE PHASE ---
  if (phase === 'describe') {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">What is wrong?</h2>
              <p className="text-sm text-slate-500">Describe your problem in your own words and we'll help identify it.</p>
            </div>
          </div>
          <div className="mt-4">
            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Example: My laptop is connected to Wi-Fi but I cannot open websites."
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <button
              onClick={handleAnalyse}
              disabled={!userText.trim()}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              Analyse My Problem
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium text-slate-400">or select a problem below</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Choose a problem category</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {troubleshootCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleStartTroubleshooting(cat.id)}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card transition-all hover:shadow-card-hover hover:border-brand-200"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
                  <Icon name={cat.icon} className="h-7 w-7" />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-700">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- DIAGNOSIS PHASE ---
  if (phase === 'diagnosis') {
    if (!diagnosis) {
      return (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <AlertCircle className="h-7 w-7 text-slate-400" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">
              We're not sure what the problem is.
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              We couldn't identify the problem from your description. Please select a problem category below.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {troubleshootCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleStartTroubleshooting(cat.id)}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-card transition-all hover:shadow-card-hover hover:border-brand-200"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
                  <Icon name={cat.icon} className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-700">{cat.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={resetAll}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to description
          </button>
        </div>
      );
    }

    const confidenceConfig = {
      high: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'High', dots: 3 },
      medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Medium', dots: 2 },
      low: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', label: 'Low', dots: 1 },
    };
    const cc = confidenceConfig[diagnosis.confidence];

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={resetAll}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="text-lg font-bold text-slate-900">Smart Diagnosis</h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card animate-slide-up">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Possible Problem</p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">{diagnosis.problemLabel}</h3>

          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-700">Why we think this:</p>
            <ul className="mt-2 space-y-1.5">
              {diagnosis.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">Confidence:</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cc.bg} ${cc.text} ${cc.border}`}>
              <span className="flex gap-0.5">
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    className={`h-1.5 w-1.5 rounded-full ${n <= cc.dots ? cc.text.replace('text', 'bg') : 'bg-slate-200'}`}
                  />
                ))}
              </span>
              {cc.label}
            </span>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50/50 px-4 py-3">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-xs text-slate-500">
              This is a prototype using simple keyword matching — not real AI. We look for keywords in your description to identify the problem.
            </p>
          </div>

          <button
            onClick={handleDiagnosisContinue}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Start Troubleshooting
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // --- FIXED PHASE ---
  if (phase === 'fixed') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center animate-slide-up">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500">
            <PartyPopper className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-emerald-900">Problem Solved!</h2>
          <p className="mt-2 text-sm text-emerald-700">Great work! Your issue has been resolved.</p>
          {fixCause && (
            <div className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">What fixed it:</p>
              <p className="mt-1 text-sm text-slate-700">{fixCause}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h3 className="font-semibold text-slate-900">Steps You Completed</h3>
          <div className="mt-3 space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-slate-700">{h.question}</p>
                  <p className="text-xs text-slate-400">You selected: {h.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleStartLearning}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <GraduationCap className="h-4 w-4" />
            What did I learn?
          </button>
          <button
            onClick={resetAll}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Wrench className="h-4 w-4" />
            Troubleshoot Another Problem
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- LEARNING PHASE ---
  if (phase === 'learning' && learning) {
    const allAnswered = quizAnswers.every((a) => a !== null);

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border border-brand-200 bg-brand-50/30 p-6 shadow-card animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">What You Learned</p>
              <h2 className="text-lg font-bold text-slate-900">Today's topic: {learning.topic}</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-700">{learning.explanation}</p>
          <div className="mt-3 flex items-center gap-2">
            <ExplainButton term={learning.term} />
          </div>
          <div className="mt-3 rounded-xl bg-white/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Why?</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{learning.whyExplanation}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
            <HelpCircle className="h-5 w-5 text-brand-600" />
            Quick Quiz
          </h3>
          <div className="space-y-5">
            {learning.quiz.map((q, qIdx) => (
              <div key={qIdx}>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  {qIdx + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, aIdx) => {
                    const isSelected = quizAnswers[qIdx] === aIdx;
                    const isCorrect = aIdx === q.answer;
                    const showCorrect = quizSubmitted && isCorrect;
                    const showWrong = quizSubmitted && isSelected && !isCorrect;

                    return (
                      <button
                        key={aIdx}
                        onClick={() => handleQuizAnswer(qIdx, aIdx)}
                        disabled={quizSubmitted}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm transition-all ${
                          showCorrect
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                            : showWrong
                            ? 'border-red-300 bg-red-50 text-red-800'
                            : isSelected
                            ? 'border-brand-300 bg-brand-50 text-brand-700'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-200 hover:bg-brand-50'
                        } ${quizSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <span><span className="font-semibold mr-2">{String.fromCharCode(65 + aIdx)}.</span>{opt}</span>
                        {showCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        {showWrong && <XCircle className="h-4 w-4 text-red-500" />}
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <p className={`mt-2 text-xs ${quizAnswers[qIdx] === q.answer ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {quizAnswers[qIdx] === q.answer ? 'Correct!' : q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={() => setQuizSubmitted(true)}
              disabled={!allAnswered}
              className="mt-5 w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              Submit Quiz
            </button>
          ) : (
            <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-4 text-center animate-slide-up">
              <p className="text-2xl font-bold text-emerald-700">Quiz Score: {quizScore} / {learning.quiz.length}</p>
              <p className="mt-1 text-sm text-emerald-600">
                {quizScore === learning.quiz.length ? 'Perfect score! You really know your stuff.' : 'Good effort! Review the answers above to learn more.'}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={resetAll}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <Wrench className="h-4 w-4" />
            Troubleshoot Another Problem
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- ESCALATE PHASE ---
  if (phase === 'escalate' && escalationData && selectedFlow) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <EscalationScreen
          escalation={escalationData}
          flowTitle={selectedFlow.title}
          history={history}
          onNavigate={onNavigate}
          onReset={resetAll}
        />
      </div>
    );
  }

  // --- TROUBLESHOOTING PHASE ---
  const currentStep = currentStepId ? selectedFlow?.steps[currentStepId] : null;
  if (!currentStep || !selectedFlow) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={resetAll}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon name={selectedFlow.icon} className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">{selectedFlow.title}</h2>
        </div>
      </div>

      {history.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Step {history.length + 1}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{completedActions.length} actions completed</span>
        </div>
      )}

      <div key={currentStepId} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card animate-slide-up">
        <h3 className="text-lg font-semibold text-slate-900">{currentStep.question}</h3>
        {currentStep.description && (
          <p className="mt-2 text-sm text-slate-500">{currentStep.description}</p>
        )}
        <div className="mt-5 space-y-2.5">
          {currentStep.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleOption(opt)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-all hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            >
              {opt.label}
              <ArrowRight className="h-4 w-4 text-slate-300" />
            </button>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Previous Steps</p>
          <div className="space-y-1.5">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span className="truncate">{h.question}</span>
                <span className="shrink-0 font-medium text-slate-400">→ {h.answer}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-card">
        <Lightbulb className="h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-xs text-slate-500">
          Follow each step carefully. If an action doesn't fix the problem, you'll be guided to the next step automatically.
        </p>
      </div>
    </div>
  );
}
