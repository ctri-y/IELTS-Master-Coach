
import React, { useState } from 'react';
import { getWritingFeedback } from '../services/geminiService';
import { WritingFeedback, WritingCriterion } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const SAMPLE_PROMPTS = [
  {
    title: "Task 2: Global Warming",
    content: "Some people believe that it is the responsibility of individuals to save the environment, while others believe that the government and big companies should take the main responsibility. Discuss both views and give your opinion."
  },
  {
    title: "Task 2: Urbanization",
    content: "The rapid growth of cities has led to several problems. What are the main problems associated with urbanization? What solutions can you suggest?"
  },
  {
    title: "Task 1: Academic (Describing Data)",
    content: "The graph below shows the changes in the number of international students attending universities in a particular country from 2005 to 2015. Summarize the information by selecting and reporting the main features, and make comparisons where relevant."
  }
];

const WritingMode: React.FC = () => {
  const [prompt, setPrompt] = useState(SAMPLE_PROMPTS[0]);
  const [essay, setEssay] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);

  const handleSubmit = async () => {
    if (!essay.trim()) return;
    setIsLoading(true);
    try {
      const res = await getWritingFeedback(prompt.content, essay);
      setFeedback(res);
    } catch (error) {
      console.error(error);
      alert("Failed to evaluate essay.");
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = feedback ? [
    { subject: 'Task Response', A: feedback.criteria.taskResponse.score, full: 9 },
    { subject: 'Cohesion', A: feedback.criteria.coherence.score, full: 9 },
    { subject: 'Lexical', A: feedback.criteria.lexical.score, full: 9 },
    { subject: 'Grammar', A: feedback.criteria.grammar.score, full: 9 },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-6">
              <select 
                onChange={(e) => setPrompt(SAMPLE_PROMPTS[parseInt(e.target.value)])}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {SAMPLE_PROMPTS.map((p, i) => (
                  <option key={i} value={i}>{p.title}</option>
                ))}
              </select>
              <div className="mt-4 p-4 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-600 text-sm leading-relaxed italic">{prompt.content}</p>
              </div>
            </div>
            
            <div className="p-6">
              <textarea
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                className="w-full h-96 p-6 font-serif text-lg leading-relaxed text-slate-900 bg-white rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all resize-none shadow-inner"
                placeholder="Start writing your IELTS essay here..."
                disabled={isLoading}
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-slate-400 text-sm font-medium">{essay.split(/\s+/).filter(x => x).length} words</span>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || essay.length < 50}
                  className={`px-10 py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
                    isLoading ? 'bg-slate-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'
                  }`}
                >
                  {isLoading ? 'Analyzing Essay...' : 'Submit for Grading'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Results Dashboard */}
        <div className="space-y-6">
          {!feedback && !isLoading && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center space-y-4">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Ready to Grade</h3>
              <p className="text-slate-600 text-sm">Submit your essay to see detailed Band analytics and sentence-level improvement suggestions.</p>
            </div>
          )}

          {isLoading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 animate-pulse">
              <div className="h-40 bg-slate-100 rounded-xl"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              </div>
            </div>
          )}

          {feedback && (
            <>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 text-center">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Estimated Score</span>
                <div className="text-6xl font-black text-slate-900 my-2">
                  {feedback.overallBand.toFixed(1)}
                </div>
                <div className="h-[200px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                      <Radar
                        name="IELTS Band"
                        dataKey="A"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  Upgrades
                </h4>
                <div className="space-y-4">
                  {feedback.upgrades.vocabulary.slice(0, 3).map((v, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-red-400 line-through">{v.old}</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">→ {v.improved}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 italic">Context: {v.context}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {feedback && (
        <div className="space-y-8 pb-12">
          {/* Detailed Justification Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {(Object.entries(feedback.criteria) as [string, WritingCriterion][]).map(([key, val]) => (
                <div key={key} className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-lg font-bold text-indigo-600">{val.score}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{val.justification}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sentence Analysis */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 p-4 text-white font-bold">Sentence-level Analysis</div>
            <div className="p-6 space-y-6">
              {feedback.sentenceLevel.map((item, i) => (
                <div key={i} className={`p-5 rounded-xl border-l-4 ${
                  item.type === 'strong' ? 'bg-emerald-50 border-emerald-400' : 'bg-rose-50 border-rose-400'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-slate-800 font-serif leading-relaxed italic">"{item.original}"</p>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      item.type === 'strong' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium mb-3">{item.explanation}</p>
                  {item.improved && (
                    <div className="bg-white/60 p-3 rounded-lg border border-dashed border-slate-300">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">RECOMMENDED REVISION</span>
                      <p className="text-slate-800 font-medium">{item.improved}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Revised Paragraphs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-indigo-600 p-4 text-white font-bold">Strategic Rewrite (Selected Paragraphs)</div>
            <div className="divide-y divide-slate-100">
              {feedback.revisedParagraphs.map((p, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Original Draft</span>
                    <p className="text-sm text-slate-500 leading-relaxed italic">{p.original}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Band 8+ Revision</span>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">{p.revised}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritingMode;
