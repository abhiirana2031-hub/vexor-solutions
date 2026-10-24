import React, { useState } from 'react';
import { ModuleQuiz } from '../types/course';
import { calculateQuizScore } from '../utils/course_logic';
import {
  X,
  CheckCircle2,
  XCircle,
  Award,
  Unlock,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

interface QuizModalProps {
  quiz: ModuleQuiz;
  isOpen: boolean;
  onClose: () => void;
  onQuizPassed: (weekNumber: number, score: number, total: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  quiz,
  isOpen,
  onClose,
  onQuizPassed,
}) => {
  if (!isOpen) return null;

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = quiz.questions;
  const currentQ = questions[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setAnswers({
      ...answers,
      [currentQ.id]: optIdx,
    });
  };

  const isCurrentAnswered = answers[currentQ.id] !== undefined;
  const isAllAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmit = () => {
    const result = calculateQuizScore(answers, questions, quiz.passingScorePercent);
    setIsSubmitted(true);
    if (result.passed) {
      onQuizPassed(quiz.weekNumber, result.correctCount, result.totalCount);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
  };

  const result = isSubmitted ? calculateQuizScore(answers, questions, quiz.passingScorePercent) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 transition-colors">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {quiz.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Passing Score: {quiz.passingScorePercent}% (Unlock Requirement)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {!isSubmitted ? (
            <>
              {/* Question Progress Tracker */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span>
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  {Object.keys(answers).length} answered
                </span>
              </div>

              {/* Question Prompt */}
              <div className="space-y-4">
                <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </h4>

                {currentQ.codeSnippet && (
                  <pre className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                    {currentQ.codeSnippet}
                  </pre>
                )}

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = answers[currentQ.id] === optIdx;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-600 text-indigo-950 dark:text-white shadow-sm font-medium'
                            : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-400 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="leading-snug">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {currentIdx < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      disabled={!isCurrentAnswered}
                      className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!isAllAnswered}
                      className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-emerald-600/30"
                    >
                      Submit Assessment
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Result Screen */
            <div className="space-y-6">
              {result?.passed ? (
                <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <Unlock className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    {quiz.weekNumber === 4 ? 'Mastery Achieved!' : `Week ${quiz.weekNumber + 1} Module Unlocked!`}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
                    You scored <span className="font-bold font-mono">{result.percentage}%</span> ({result.correctCount} / {result.totalCount} correct). 
                    {quiz.weekNumber === 4
                      ? ' You have passed the final exam and can now view your Certificate of Completion!'
                      : ` Week ${quiz.weekNumber + 1} is now accessible.`}
                  </p>
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Assessment Incomplete</h4>
                  <p className="text-xs sm:text-sm text-rose-900 dark:text-rose-200">
                    You scored <span className="font-bold font-mono">{result?.percentage}%</span> ({result?.correctCount} / {result?.totalCount} correct). 
                    A score of at least {quiz.passingScorePercent}% is required to unlock the next module.
                  </p>
                </div>
              )}

              {/* Detailed Question Review */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                  Detailed Answers & Explanations
                </div>
                {questions.map((q, qIdx) => {
                  const userAns = answers[q.id];
                  const isCorrect = userAns === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                        isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                          : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                      }`}
                    >
                      <div className="flex items-start gap-2 font-semibold text-slate-900 dark:text-slate-200">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <span>
                          {qIdx + 1}. {q.question}
                        </span>
                      </div>
                      <div className="text-slate-700 dark:text-slate-400 pl-6 space-y-1">
                        <div>
                          Your answer:{' '}
                          <span className={isCorrect ? 'text-emerald-700 dark:text-emerald-300 font-medium' : 'text-rose-700 dark:text-rose-300 font-medium'}>
                            {q.options[userAns]}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="text-emerald-700 dark:text-emerald-300 font-semibold">
                            Correct answer: {q.options[q.correctIndex]}
                          </div>
                        )}
                        <div className="text-slate-600 dark:text-slate-400 pt-1 italic">{q.explanation}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
                >
                  {result?.passed ? 'Continue Learning' : 'Review Curriculum'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
