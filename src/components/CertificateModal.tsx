import React, { useState } from 'react';
import { X, Award, CheckCircle2, Printer } from 'lucide-react';
import { UserProgress, CourseId } from '../types/course';
import { COURSES } from '../data/coursesCatalog';

interface CertificateProps {
  progress: UserProgress;
  activeCourseId: CourseId;
  onUpdateName?: (name: string) => void;
}

export const CertificateCanvas: React.FC<CertificateProps> = ({
  progress,
  activeCourseId,
  onUpdateName,
}) => {
  const currentCourse = COURSES[activeCourseId];
  const [studentName, setStudentName] = useState(
    progress.userName || (activeCourseId === 'python' ? 'Python Engineer' : 'Full Stack Developer')
  );
  const [isEditing, setIsEditing] = useState(false);

  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const prefix = activeCourseId === 'python' ? 'PY-MASTER' : 'FS-MASTER';
  const certificateId = `${prefix}-${Math.abs(
    studentName.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)
  )
    .toString(16)
    .toUpperCase()
    .padStart(8, '0')}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
        <span className="font-mono">Verified Academic Credential · {currentCourse.shortTitle}</span>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      <div className="p-6 sm:p-10 bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-center relative border-8 border-double border-amber-500/40 dark:border-amber-500/25 rounded-2xl space-y-6 shadow-2xl transition-colors">
        <div className="absolute top-4 left-4 text-amber-500/40">
          <Award className="w-5 h-5" />
        </div>
        <div className="absolute top-4 right-4 text-amber-500/40">
          <Award className="w-5 h-5" />
        </div>
        <div className="absolute bottom-4 left-4 text-amber-500/40">
          <Award className="w-5 h-5" />
        </div>
        <div className="absolute bottom-4 right-4 text-amber-500/40">
          <Award className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <div className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-mono font-bold">
            {currentCourse.title.toUpperCase()} · OFFICIAL CREDENTIAL
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
            {activeCourseId === 'python'
              ? 'Certificate of Python Engineering Mastery'
              : 'Certificate of Full Stack Web Development Mastery'}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          This certifies that the recipient has completed the rigorous 4-week, 28-day professional curriculum,
          passing all qualifying module examinations across{' '}
          {activeCourseId === 'python'
            ? 'Bytecode Architecture, Advanced Data Structures, Object-Oriented Design, and Asynchronous Concurrency.'
            : 'Web Foundations & Git, Modern React & TypeScript, Node/Express & Security, and Relational Databases, Docker & Cloud CI/CD.'}
        </p>

        {/* Student Name */}
        <div className="py-2">
          {isEditing ? (
            <div className="flex items-center justify-center gap-2">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="px-3 py-1.5 text-lg font-bold text-center bg-white dark:bg-slate-900 border border-indigo-500 rounded text-slate-900 dark:text-white focus:outline-none shadow-sm"
                autoFocus
              />
              <button
                onClick={() => {
                  setIsEditing(false);
                  if (onUpdateName) onUpdateName(studentName);
                }}
                className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded font-semibold cursor-pointer"
              >
                Save
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-300 font-serif border-b-2 border-amber-500/50 inline-block px-8 py-1 cursor-pointer hover:border-amber-500"
              title="Click to edit recipient name"
            >
              {studentName}
            </div>
          )}
          <div className="text-[11px] text-slate-500 mt-1 font-mono">Recipient Name (Click to Edit)</div>
        </div>

        {/* 4 Pillars Verified */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left pt-2 max-w-xl mx-auto text-xs">
          {currentCourse.modules.map((m) => (
            <div
              key={m.weekNumber}
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800"
            >
              <div className="font-bold text-slate-900 dark:text-white font-mono">Week {m.weekNumber}</div>
              <div className="text-slate-600 dark:text-slate-400 text-[11px] line-clamp-1">{m.title}</div>
            </div>
          ))}
        </div>

        {/* Footer Metadata */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono">
          <div>Issue Date: {issueDate}</div>
          <div>Credential ID: {certificateId}</div>
        </div>
      </div>
    </div>
  );
};

export const CertificateModal: React.FC<
  CertificateProps & { isOpen: boolean; onClose: () => void }
> = ({ isOpen, onClose, progress, activeCourseId, onUpdateName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-0 sm:my-6 transition-colors animate-in slide-in-from-bottom duration-300">
        {/* Mobile Drag Pill */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
            <Award className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="font-semibold">Official Certificate of Completion</span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Certificate Modal"
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
          <CertificateCanvas
            progress={progress}
            activeCourseId={activeCourseId}
            onUpdateName={onUpdateName}
          />
        </div>
      </div>
    </div>
  );
};
