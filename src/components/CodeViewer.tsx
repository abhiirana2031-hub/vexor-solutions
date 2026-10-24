import React, { useState } from 'react';
import { Copy, Check, Play, Info } from 'lucide-react';
import { CodeSnippet } from '../types/course';

interface CodeViewerProps {
  snippet: CodeSnippet;
  onSendToRunner?: (code: string) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ snippet, onSendToRunner }) => {
  const [copied, setCopied] = useState(false);
  const [activeAnnotationLine, setActiveAnnotationLine] = useState<number | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = snippet.code.split('\n');

  // Tokenize line for syntax styling
  const renderHighlightedLine = (line: string) => {
    if (!line) return <span>&nbsp;</span>;

    // Check comment
    const commentIdx = line.indexOf('#') !== -1 ? line.indexOf('#') : line.indexOf('//');
    if (commentIdx !== -1) {
      const codePart = line.substring(0, commentIdx);
      const commentPart = line.substring(commentIdx);
      return (
        <>
          {renderTokens(codePart)}
          <span className="text-slate-400 dark:text-slate-500 italic">{commentPart}</span>
        </>
      );
    }

    return renderTokens(line);
  };

  const renderTokens = (text: string) => {
    const regex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:def|class|return|if|elif|else|for|while|break|continue|try|except|finally|raise|import|from|as|with|yield|lambda|in|is|not|and|or|pass|async|await|const|let|var|function|type|interface|export|default|extends|implements|new|throw)\b|\b(?:True|False|None|true|false|null|undefined)\b|\b(?:print|console|len|range|sum|max|min|abs|type|str|int|float|bool|enumerate|zip|sorted|dict|list|set|tuple|open|require|process)\b|@[a-zA-Z0-9_.]+|\b\d+(?:\.\d+)?\b|[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()|[^\s\w]+|\s+|[a-zA-Z_][a-zA-Z0-9_]*)/g;

    const parts = text.match(regex) || [text];

    return parts.map((part, index) => {
      // String
      if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'")) || (part.startsWith('`') && part.endsWith('`'))) {
        return <span key={index} className="text-emerald-400 dark:text-emerald-300">{part}</span>;
      }
      // Decorator
      if (part.startsWith('@')) {
        return <span key={index} className="text-amber-400 font-semibold">{part}</span>;
      }
      // Boolean & None
      if (['True', 'False', 'None', 'true', 'false', 'null', 'undefined'].includes(part)) {
        return <span key={index} className="text-rose-400 font-semibold">{part}</span>;
      }
      // Keywords
      if (['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'try', 'except', 'finally', 'raise', 'import', 'from', 'as', 'with', 'yield', 'lambda', 'in', 'is', 'not', 'and', 'or', 'pass', 'async', 'await', 'const', 'let', 'var', 'function', 'type', 'interface', 'export', 'default', 'extends'].includes(part)) {
        return <span key={index} className="text-indigo-400 font-semibold">{part}</span>;
      }
      // Builtins
      if (['print', 'console', 'len', 'range', 'sum', 'max', 'min', 'abs', 'type', 'str', 'int', 'float', 'bool', 'enumerate', 'zip', 'sorted', 'dict', 'list', 'set', 'tuple', 'open', 'require', 'process'].includes(part)) {
        return <span key={index} className="text-cyan-300 font-medium">{part}</span>;
      }
      // Number
      if (/^\d+(\.\d+)?$/.test(part)) {
        return <span key={index} className="text-amber-300">{part}</span>;
      }
      // Function call
      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(part) && text.indexOf(part + '(') !== -1) {
        return <span key={index} className="text-sky-300">{part}</span>;
      }
      return <span key={index} className="text-slate-200">{part}</span>;
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-lg transition-colors">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          </div>
          <span className="text-xs font-mono font-medium text-slate-200">
            {snippet.title}
          </span>
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
            {snippet.language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onSendToRunner && (
            <button
              onClick={() => onSendToRunner(snippet.code)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 rounded-md hover:bg-emerald-900/60 transition-colors cursor-pointer"
              title="Load into Interactive Runner"
            >
              <Play className="w-3 h-3" />
              <span>Run in Playground</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-md hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Copy snippet code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code Viewport with Line Numbers */}
      <div className="p-4 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const hasAnnotation = snippet.lineAnnotations && snippet.lineAnnotations[lineNum];
              const isSelected = activeAnnotationLine === lineNum;

              return (
                <React.Fragment key={lineNum}>
                  <tr
                    className={`transition-colors ${
                      hasAnnotation ? 'cursor-pointer hover:bg-slate-900/80' : ''
                    } ${isSelected ? 'bg-indigo-950/50' : ''}`}
                    onClick={() => {
                      if (hasAnnotation) {
                        setActiveAnnotationLine(isSelected ? null : lineNum);
                      }
                    }}
                  >
                    {/* Line number */}
                    <td className="w-10 pr-4 text-right select-none text-slate-500 font-mono text-xs align-top">
                      {lineNum}
                    </td>

                    {/* Code line */}
                    <td className="text-slate-100 whitespace-pre align-top font-mono">
                      {renderHighlightedLine(line)}
                    </td>

                    {/* Annotation indicator */}
                    <td className="w-6 pl-2 align-top text-right select-none">
                      {hasAnnotation && (
                        <span
                          title={snippet.lineAnnotations![lineNum]}
                          className="inline-block text-indigo-400 hover:text-indigo-300"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Inline line explanation disclosure */}
                  {isSelected && hasAnnotation && (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 bg-indigo-950/40 border-y border-indigo-900/40 text-xs text-indigo-200 font-sans">
                        <span className="font-semibold text-indigo-300">Line {lineNum} Insight: </span>
                        {snippet.lineAnnotations![lineNum]}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Expected output if present */}
      {snippet.expectedOutput && (
        <div className="border-t border-slate-800 bg-slate-900/60 px-4 py-2.5">
          <div className="text-xs font-semibold text-slate-400 mb-1">Expected Output:</div>
          <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap">
            {snippet.expectedOutput}
          </pre>
        </div>
      )}
    </div>
  );
};
