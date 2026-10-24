import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Terminal, Clock, CheckCircle2, AlertTriangle, Trash2, Code2 } from 'lucide-react';
import { executeCode } from '../utils/course_logic';
import { ExecutionResult, SupportedLanguage } from '../types/course';

interface CodeRunnerProps {
  initialCode?: string;
  language?: SupportedLanguage;
  title?: string;
}

export const CodeRunner: React.FC<CodeRunnerProps> = ({
  initialCode = '# Write code here\nprint("Hello world")\n',
  language = 'python',
  title = 'Interactive Code Runner',
}) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = executeCode(code, language);
      setResult(res);
      setIsRunning(false);
    }, 40);
  };

  const handleReset = () => {
    setCode(initialCode);
    setResult(null);
  };

  const handleClearTerminal = () => {
    setResult(null);
  };

  // Handle Tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-xl transition-colors">
      {/* Top Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-200">{title}</span>
          <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Reset to starter snippet"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="min-h-[44px] flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm shadow-indigo-600/30 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Running...' : `Run ${language.toUpperCase()}`}</span>
          </button>
        </div>
      </div>

      {/* Editor & Terminal Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
        {/* Left: Code Editor Area */}
        <div className="p-3 bg-slate-900 dark:bg-slate-950 flex flex-col">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1 font-mono">
            <span>Editor ({language})</span>
            <span>Tab: 2 spaces</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={10}
            spellCheck={false}
            className="w-full bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm p-3.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 resize-y leading-relaxed sm:rows-[14]"
            placeholder={`Type ${language} code here...`}
          />
        </div>

        {/* Right: Terminal Console Output */}
        <div className="p-3 bg-slate-900 dark:bg-slate-950 flex flex-col">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1 font-mono">
            <span className="flex items-center gap-1.5">
              <span>Standard Output (stdout)</span>
              {result && (
                <span className="text-slate-400">
                  · {result.executionTimeMs}ms
                </span>
              )}
            </span>
            {result && (
              <button
                onClick={handleClearTerminal}
                className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="Clear Output"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[220px] bg-slate-950 rounded-lg border border-slate-800 p-3.5 font-mono text-xs overflow-y-auto leading-relaxed">
            {result ? (
              <div className="space-y-2">
                {result.output && (
                  <div className="text-emerald-400 whitespace-pre-wrap font-mono">
                    {result.output}
                  </div>
                )}
                {result.error && (
                  <div className="text-rose-400 bg-rose-950/40 p-2.5 rounded border border-rose-900/60 whitespace-pre-wrap font-mono">
                    {result.error}
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800 text-slate-400 text-[11px] flex items-center justify-between">
                  <span>Process finished with exit code {result.error ? '1' : '0'}</span>
                  <span className="tabular-nums">Time: {result.executionTimeMs} ms</span>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 flex flex-col items-center justify-center h-full py-12 text-center">
                <Terminal className="w-8 h-8 mb-2 text-slate-600" />
                <p className="text-slate-400">Click "Run {language.toUpperCase()}" above to execute.</p>
                <p className="text-[11px] text-slate-500 mt-1">Captured output and results will appear in real time.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
