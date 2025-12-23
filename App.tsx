
import React, { useState } from 'react';
import TranslationMode from './components/TranslationMode';
import WritingMode from './components/WritingMode';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.TRANSLATION);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Persistent Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl italic">I</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter text-slate-900 leading-none">IELTS MASTER</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Excellence</p>
            </div>
          </div>

          <nav className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setMode(AppMode.TRANSLATION)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                mode === AppMode.TRANSLATION 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Translation Practice
            </button>
            <button
              onClick={() => setMode(AppMode.WRITING)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                mode === AppMode.WRITING 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Writing Feedback
            </button>
          </nav>

          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Examiner Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto">
          {mode === AppMode.TRANSLATION ? <TranslationMode /> : <WritingMode />}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs font-medium">© 2024 IELTS Master Coach. Professional Exam Standards.</p>
          <div className="flex gap-6">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-default">Task 1 Mastery</span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-default">Essay Logic</span>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-default">Lexical Precision</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
