import { useState } from 'react';
import type { PageKey, KnowledgeArticle } from '@/types';
import { knowledgeCategories, knowledgeArticles } from '@/data/knowledgeData';
import { Icon } from '@/components/Icon';
import { Modal } from '@/components/Modal';
import { DemoNotice } from '@/components/DemoNotice';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, XCircle, Lightbulb, AlertTriangle, HelpCircle } from 'lucide-react';

export function KnowledgePage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const filteredArticles = selectedCategory
    ? knowledgeArticles.filter((a) => a.category === selectedCategory)
    : knowledgeArticles;

  const openArticle = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    setQuizAnswer(null);
    setShowResult(false);
  };

  const handleQuizAnswer = (idx: number) => {
    setQuizAnswer(idx);
    setShowResult(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">IT Learning Centre</h2>
          <p className="text-sm text-slate-500">Understand IT concepts in plain, simple language.</p>
        </div>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            All Topics
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        {knowledgeCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <button
            key={article.id}
            onClick={() => openArticle(article)}
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-card transition-all hover:shadow-card-hover hover:border-brand-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon name={article.icon} className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                {article.category}
              </span>
            </div>
            <h3 className="mt-3 font-semibold text-slate-900 group-hover:text-brand-700">{article.title}</h3>
            <p className="mt-1 text-sm text-slate-500 line-clamp-2">{article.explanation}</p>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-brand-600">
              <BookOpen className="h-3.5 w-3.5" />
              Read & Take Quiz
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <HelpCircle className="mx-auto h-10 w-10" />
          <p className="mt-2 text-sm">No articles in this category yet.</p>
        </div>
      )}

      <Modal
        open={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        title={selectedArticle?.title || ''}
        maxWidth="max-w-2xl"
      >
        {selectedArticle && (
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Simple Explanation</h4>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{selectedArticle.explanation}</p>
            </div>

            <div className="rounded-xl bg-brand-50/50 p-4">
              <h4 className="text-sm font-semibold text-brand-700">Why it matters</h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{selectedArticle.whyItMatters}</p>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Common Problems</h4>
              </div>
              <ul className="space-y-1.5">
                {selectedArticle.commonProblems.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <div className="mb-3 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-brand-600" />
                <h4 className="text-sm font-semibold text-slate-900">Quick Quiz</h4>
              </div>
              <p className="mb-3 text-sm font-medium text-slate-700">{selectedArticle.quiz.question}</p>
              <div className="space-y-2">
                {selectedArticle.quiz.options.map((opt, i) => {
                  const isSelected = quizAnswer === i;
                  const isCorrect = i === selectedArticle.quiz.answer;
                  const showCorrect = showResult && isCorrect;
                  const showWrong = showResult && isSelected && !isCorrect;

                  return (
                    <button
                      key={i}
                      onClick={() => !showResult && handleQuizAnswer(i)}
                      disabled={showResult}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                        showCorrect
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          : showWrong
                          ? 'border-red-300 bg-red-50 text-red-800'
                          : isSelected
                          ? 'border-brand-300 bg-brand-50 text-brand-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-200 hover:bg-brand-50'
                      } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      {opt}
                      {showCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                      {showWrong && <XCircle className="h-4 w-4 text-red-500" />}
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className="mt-3 rounded-xl bg-slate-50 p-3 animate-slide-up">
                  {quizAnswer === selectedArticle.quiz.answer ? (
                    <p className="text-sm font-medium text-emerald-700">Correct! {selectedArticle.quiz.explanation}</p>
                  ) : (
                    <p className="text-sm text-slate-600">
                      Not quite. {selectedArticle.quiz.explanation}
                    </p>
                  )}
                  <button
                    onClick={() => {
                      setQuizAnswer(null);
                      setShowResult(false);
                    }}
                    className="mt-2 text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    Try again →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <DemoNotice text="IT Knowledge articles are educational content for this prototype. They provide general guidance and are not specific to your organization's policies." />
    </div>
  );
}
