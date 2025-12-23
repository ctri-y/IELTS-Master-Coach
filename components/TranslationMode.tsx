
import React, { useState } from 'react';
import { getTranslationFeedback } from '../services/geminiService';
import { TranslationFeedback } from '../types';

const SAMPLE_SENTENCES = [
  "随着科技的快速发展，人们的沟通方式发生了巨大的变化。",
  "政府应该投入更多资金在公共交通系统上，以减少环境污染。",
  "虽然远程学习变得越来越流行，但它不能完全取代传统的课堂教学。",
  "在竞争激烈的现代社会，掌握多门语言是一个巨大的优势。",
  "有些专家认为，过度使用社交媒体会导致青少年出现心理健康问题。"
];

const TranslationMode: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<TranslationFeedback | null>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SAMPLE_SENTENCES.length);
    setUserInput('');
    setFeedback(null);
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    try {
      const res = await getTranslationFeedback(SAMPLE_SENTENCES[currentIndex], userInput);
      setFeedback(res);
    } catch (error) {
      console.error(error);
      alert("Evaluation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Translation Practice</h2>
          <button 
            onClick={handleNext}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
          >
            Switch Sentence →
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-r-xl">
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider block mb-2">Chinese Source</span>
            <p className="text-lg text-slate-800 font-medium leading-relaxed">
              {SAMPLE_SENTENCES[currentIndex]}
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider block">Your English Translation</label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full h-40 p-5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 text-lg placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all resize-none font-medium shadow-sm"
              placeholder="Enter your translation here..."
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !userInput.trim()}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] ${
              isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-black shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? 'Analyzing Band Score...' : 'Get Examiner Feedback'}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase mb-3 block">Standard</span>
              <p className="text-slate-800 leading-relaxed italic">"{feedback.translations.standard}"</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm ring-1 ring-emerald-50">
              <span className="text-xs font-bold text-emerald-500 uppercase mb-3 block">Natural / Native</span>
              <p className="text-slate-800 leading-relaxed italic">"{feedback.translations.natural}"</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm ring-1 ring-indigo-50">
              <span className="text-xs font-bold text-indigo-500 uppercase mb-3 block">IELTS Advanced (Band 8)</span>
              <p className="text-slate-800 leading-relaxed font-medium">"{feedback.translations.advanced}"</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold">Examiner Critique</h3>
              <div className="bg-indigo-500 px-3 py-1 rounded text-xs font-black">
                BAND: {feedback.estimatedBand.toFixed(1)}
              </div>
            </div>
            <div className="p-6 divide-y divide-slate-100">
              {feedback.critique.length > 0 ? (
                feedback.critique.map((c, i) => (
                  <div key={i} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase mt-1 ${
                        c.type === 'Grammar' ? 'bg-red-100 text-red-600' :
                        c.type === 'Vocabulary' ? 'bg-blue-100 text-blue-600' :
                        c.type === 'Collocation' ? 'bg-purple-100 text-purple-600' :
                        c.type === 'Style' ? 'bg-orange-100 text-orange-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {c.type}
                      </span>
                      <div className="space-y-1">
                        <p className="text-slate-800 font-medium">{c.issue}</p>
                        <p className="text-slate-500 text-sm">Recommendation: <span className="text-slate-700 font-semibold italic">{c.suggestion}</span></p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic text-center py-4">No major issues detected. This is a strong translation.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslationMode;
