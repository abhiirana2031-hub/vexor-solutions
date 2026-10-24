import React, { useState } from 'react';
import { InteractiveDiagram } from '../types/course';
import { Sliders, Database, GitMerge, Layers } from 'lucide-react';

interface InteractiveDiagramsProps {
  diagram: InteractiveDiagram;
}

export const InteractiveDiagrams: React.FC<InteractiveDiagramsProps> = ({ diagram }) => {
  if (diagram.type === 'slicing') {
    return <SlicingVisualizer diagram={diagram} />;
  }

  if (diagram.type === 'memory') {
    return <MemoryModelVisualizer diagram={diagram} />;
  }

  if (diagram.type === 'mro') {
    return <MROVisualizer diagram={diagram} />;
  }

  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-center text-xs text-slate-400">
      {diagram.caption}
    </div>
  );
};

// Slicing Interactive Tool
const SlicingVisualizer: React.FC<{ diagram: InteractiveDiagram }> = ({ diagram }) => {
  const text = (diagram.data?.text as string) || 'PYTHON';
  const len = text.length;

  const [start, setStart] = useState<number>(0);
  const [stop, setStop] = useState<number>(len);
  const [step, setStep] = useState<number>(1);

  // Compute sliced indices
  const getSelectedIndices = () => {
    const indices: number[] = [];
    const from = Math.max(0, Math.min(len, start));
    const to = Math.max(0, Math.min(len, stop));
    const st = step === 0 ? 1 : step;

    if (st > 0) {
      for (let i = from; i < to; i += st) {
        indices.push(i);
      }
    } else {
      for (let i = from; i > to; i += st) {
        indices.push(i);
      }
    }
    return indices;
  };

  const selectedIndices = getSelectedIndices();
  const slicedResult = selectedIndices.map((i) => text[i]).join('');

  return (
    <div className="rounded-xl border border-indigo-900/40 bg-slate-900/80 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h4 className="text-sm font-semibold text-white">{diagram.title}</h4>
        </div>
        <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded border border-indigo-800">
          text[{start}:{stop}:{step}] = "{slicedResult}"
        </span>
      </div>

      <p className="text-xs text-slate-400">{diagram.caption}</p>

      {/* Grid of Characters */}
      <div className="flex items-center justify-center gap-2 py-4 overflow-x-auto">
        {text.split('').map((char, index) => {
          const isSelected = selectedIndices.includes(index);
          const negativeIdx = index - len;

          return (
            <div
              key={index}
              className={`flex flex-col items-center justify-center w-12 sm:w-14 rounded-lg p-2 transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105 border-indigo-400'
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700'
              }`}
            >
              {/* Positive index */}
              <span className="text-[10px] font-mono text-slate-400">{index}</span>
              {/* Character */}
              <span className="text-lg sm:text-xl font-bold font-mono py-1">{char}</span>
              {/* Negative index */}
              <span className="text-[10px] font-mono text-slate-400">{negativeIdx}</span>
            </div>
          );
        })}
      </div>

      {/* Sliders Control Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800 text-xs">
        <div>
          <label className="block text-slate-300 font-mono mb-1">
            Start index: <span className="text-indigo-400 font-bold">{start}</span>
          </label>
          <input
            type="range"
            min={0}
            max={len}
            value={start}
            onChange={(e) => setStart(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-mono mb-1">
            Stop index: <span className="text-indigo-400 font-bold">{stop}</span>
          </label>
          <input
            type="range"
            min={0}
            max={len}
            value={stop}
            onChange={(e) => setStop(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-mono mb-1">
            Step: <span className="text-indigo-400 font-bold">{step}</span>
          </label>
          <input
            type="range"
            min={1}
            max={3}
            value={step}
            onChange={(e) => setStep(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

// Memory Allocation Visualizer
const MemoryModelVisualizer: React.FC<{ diagram: InteractiveDiagram }> = ({ diagram }) => {
  return (
    <div className="rounded-xl border border-sky-900/40 bg-slate-900/80 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Database className="w-4 h-4 text-sky-400" />
        <h4 className="text-sm font-semibold text-white">{diagram.title}</h4>
      </div>
      <p className="text-xs text-slate-400">{diagram.caption}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Stack: Names & References */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Stack Frame (Name Bindings)
          </div>
          <div className="space-y-2">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-indigo-400 font-bold">a</span>
              <span className="text-slate-500 font-mono">points to -&gt;</span>
              <span className="font-mono text-sky-300">0x1004</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-indigo-400 font-bold">b</span>
              <span className="text-slate-500 font-mono">points to -&gt;</span>
              <span className="font-mono text-sky-300">0x1004 (shared!)</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-indigo-400 font-bold">c</span>
              <span className="text-slate-500 font-mono">points to -&gt;</span>
              <span className="font-mono text-emerald-300">0x2048</span>
            </div>
          </div>
        </div>

        {/* Heap: Python Objects */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Heap Memory Pool (CPython Objects)
          </div>
          <div className="space-y-2">
            <div className="p-2.5 rounded bg-sky-950/40 border border-sky-800/60 text-xs">
              <div className="flex items-center justify-between font-mono text-[11px] text-sky-400">
                <span>Address: 0x1004</span>
                <span>ref_count: 2</span>
              </div>
              <div className="mt-1 font-mono text-slate-200">
                PyLongObject: <span className="text-sky-300 font-bold">42</span> (Interned)
              </div>
            </div>
            <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-xs">
              <div className="flex items-center justify-between font-mono text-[11px] text-emerald-400">
                <span>Address: 0x2048</span>
                <span>ref_count: 1</span>
              </div>
              <div className="mt-1 font-mono text-slate-200">
                PyListObject: <span className="text-emerald-300 font-bold">[1, 2]</span> (Mutable)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// MRO Visualizer
const MROVisualizer: React.FC<{ diagram: InteractiveDiagram }> = ({ diagram }) => {
  return (
    <div className="rounded-xl border border-purple-900/40 bg-slate-900/80 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <GitMerge className="w-4 h-4 text-purple-400" />
        <h4 className="text-sm font-semibold text-white">{diagram.title}</h4>
      </div>
      <p className="text-xs text-slate-400">{diagram.caption}</p>

      <div className="flex flex-wrap items-center justify-center gap-2 py-3 font-mono text-xs">
        {['Subclass D', '->', 'Parent B', '->', 'Parent C', '->', 'Base A', '->', 'object'].map((node, i) => (
          <span
            key={i}
            className={`px-3 py-1.5 rounded ${
              node === '->'
                ? 'text-slate-500'
                : 'bg-purple-950/60 border border-purple-800 text-purple-200 font-semibold'
            }`}
          >
            {node}
          </span>
        ))}
      </div>
    </div>
  );
};
