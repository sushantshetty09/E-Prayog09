import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SUBJECTS } from '../constants';
import SimulationStage from '../components/SimulationStage';
import {
  ArrowLeft, ArrowRight, Target, BookOpen, ListChecks, Info, Youtube,
  FlaskConical, ClipboardList, CheckCircle2, Globe, HelpCircle, Brain,
  Printer, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

type Tab = 'aim' | 'procedure' | 'instructions' | 'simulation' | 'observation' | 'result' | 'realworld' | 'viva' | 'quiz';

const TABS: { id: Tab; label: string; icon: React.ReactNode; shortLabel: string }[] = [
  { id: 'aim',          label: 'Aim & Theory',           icon: <Target size={14} />,       shortLabel: 'Aim' },
  { id: 'procedure',    label: 'Procedure',              icon: <ListChecks size={14} />,   shortLabel: 'Procedure' },
  { id: 'instructions', label: 'Instructions & Video',   icon: <Youtube size={14} />,      shortLabel: 'Instructions' },
  { id: 'simulation',   label: 'Simulation',             icon: <FlaskConical size={14} />, shortLabel: 'Simulation' },
  { id: 'observation',  label: 'Observation',            icon: <ClipboardList size={14} />, shortLabel: 'Observation' },
  { id: 'result',       label: 'Result',                 icon: <CheckCircle2 size={14} />, shortLabel: 'Result' },
  { id: 'realworld',    label: 'Real World',             icon: <Globe size={14} />,        shortLabel: 'Real World' },
  { id: 'viva',         label: 'Viva Questions',         icon: <HelpCircle size={14} />,   shortLabel: 'Viva' },
  { id: 'quiz',         label: 'Quiz',                   icon: <Brain size={14} />,        shortLabel: 'Quiz' },
];

const LabView: React.FC = () => {
  const { subjectId, labId } = useParams<{ subjectId: string; labId: string }>();
  const [tabIdx, setTabIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const subject = SUBJECTS.find(s => s.id === subjectId);
  const lab = subject?.labs.find(l => l.id === labId);

  if (!subject || !lab) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-white text-xl">
        Experiment not found.
      </div>
    );
  }

  const content = lab.content;
  const activeTab = TABS[tabIdx];

  const goNext = () => { if (tabIdx < TABS.length - 1) setTabIdx(tabIdx + 1); };
  const goPrev = () => { if (tabIdx > 0) setTabIdx(tabIdx - 1); };

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>${lab.title} — Observation | E-Prayog</title>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; padding: 40px; color: #0f172a; }
        h1 { font-size: 22px; margin-bottom: 4px; }
        h2 { font-size: 16px; color: #475569; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 13px; }
        th { background: #f1f5f9; font-weight: 600; }
        .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; }
        .result-box { margin-top: 30px; padding: 16px; border: 2px solid #10b981; border-radius: 8px; }
        .result-box h3 { font-size: 14px; margin-bottom: 8px; }
        input { width: 100%; border: none; border-bottom: 1px dotted #94a3b8; padding: 4px 0; font-size: 13px; }
      </style></head><body>
      <h1>🔬 ${lab.title}</h1>
      <h2>${subject.name} — Karnataka PUC | E-Prayog Virtual Lab</h2>
      ${printRef.current.innerHTML}
      <div class="result-box">
        <h3>Result / Conclusion:</h3>
        <input placeholder="Write your result here..." /><br/><br/>
        <input placeholder="" /><br/><br/>
        <input placeholder="" />
      </div>
      <div class="footer">
        Printed from E-Prayog (ಇ-ಪ್ರಯೋಗ) — Virtual Science Lab for Karnataka PUC<br/>
        Student Name: __________________ | Date: __________________ | Section: __________________
      </div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Generate default quiz if none exists
  const quizQuestions = content?.quizQuestions || [];
  const quizScore = quizSubmitted ? quizQuestions.filter(q => quizAnswers[q.id] === q.correctIndex).length : 0;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to={`/subjects/${subject.id}`} className="text-sm text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1 mb-3">
            <ArrowLeft size={14} /> Back to {subject.name}
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${subject.hex}15` }}>
              <subject.icon size={20} style={{ color: subject.hex }} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white">{lab.title}</h1>
              <p className="text-sm text-slate-400">{lab.category} • {lab.difficulty} • {lab.duration}</p>
            </div>
          </div>
        </div>

        {/* Step Indicator (numbered tabs) */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {TABS.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setTabIdx(idx)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border
                ${tabIdx === idx
                  ? 'bg-white/10 text-white border-white/20 shadow-lg'
                  : tabIdx > idx
                    ? 'text-emerald-400/60 border-emerald-500/10 bg-emerald-500/5'
                    : 'text-slate-500 border-transparent hover:text-white hover:bg-white/5'
                }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                tabIdx === idx ? 'bg-white/20 text-white' : tabIdx > idx ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-600'
              }`}>
                {tabIdx > idx ? '✓' : idx + 1}
              </span>
              <span className="hidden sm:inline">{tab.shortLabel}</span>
              {tab.icon}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <MotionDiv key={activeTab.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>

          {/* 1. AIM & THEORY */}
          {activeTab.id === 'aim' && content && (
            <div className="glass-panel rounded-2xl p-8 space-y-6 max-w-4xl">
              <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Target size={18} style={{ color: subject.hex }} /> Aim
                </h3>
                <p className="text-slate-300">{content.aim}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">📋 Requirements</h3>
                <ul className="list-disc list-inside text-slate-400 space-y-1">
                  {content.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <BookOpen size={18} style={{ color: subject.hex }} /> Theory
                </h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{content.theory}</p>
              </div>
              {content.objectives?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">🎯 Objectives</h3>
                  <ul className="list-disc list-inside text-slate-400 space-y-1">
                    {content.objectives.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
              )}
              {content.safety && content.safety.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-red-400 mb-2">⚠️ Safety Precautions</h3>
                  <ul className="list-disc list-inside text-red-300/80 text-sm space-y-1">
                    {content.safety.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 2. PROCEDURE */}
          {activeTab.id === 'procedure' && content && (
            <div className="glass-panel rounded-2xl p-8 max-w-4xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ListChecks size={18} style={{ color: subject.hex }} /> Procedure
              </h3>
              <ol className="space-y-3">
                {content.procedure.map((step, i) => (
                  <li key={i} className="flex gap-3 items-start text-slate-300">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: `${subject.hex}20`, color: subject.hex }}>
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* 3. INSTRUCTIONS & YOUTUBE */}
          {activeTab.id === 'instructions' && content && (
            <div className="glass-panel rounded-2xl p-8 max-w-4xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Info size={18} style={{ color: subject.hex }} /> Lab Instructions
                </h3>
                {content.instructions && content.instructions.length > 0 ? (
                  <ul className="space-y-2">
                    {content.instructions.map((inst, i) => (
                      <li key={i} className="flex gap-2 items-start text-slate-300 text-sm">
                        <span className="text-amber-400 mt-0.5">•</span> {inst}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-2 text-slate-400 text-sm">
                    <p>• Read the aim and theory before starting the simulation.</p>
                    <p>• Follow the procedure step-by-step.</p>
                    <p>• Record all readings in the observation table carefully.</p>
                    <p>• Calculate the result and compare with the expected value.</p>
                    <p>• Answer the viva questions and attempt the quiz for self-assessment.</p>
                  </div>
                )}
              </div>

              {/* YouTube Video */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Youtube size={18} className="text-red-500" /> Video Demonstration
                </h3>
                {content.videoId ? (
                  <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
                    <iframe
                      src={`https://www.youtube.com/embed/${content.videoId}`}
                      title={`${lab.title} - Video Demo`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-col gap-3">
                    <Youtube size={48} className="text-slate-700" />
                    <p className="text-sm text-slate-500">Video demonstration coming soon</p>
                    <a
                      href={`https://www.youtube.com/results?search_query=Karnataka+PUC+${encodeURIComponent(lab.title)}+experiment`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      Search on YouTube <ArrowRight size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. SIMULATION */}
          {activeTab.id === 'simulation' && (
            <div className="min-h-[500px]">
              <SimulationStage labId={lab.id} hex={subject.hex} />
            </div>
          )}

          {/* 5. OBSERVATION (printable) */}
          {activeTab.id === 'observation' && content?.observationTable && (
            <div className="max-w-4xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ClipboardList size={18} style={{ color: subject.hex }} /> Observation Table
                </h3>
                <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20 text-sm font-bold hover:bg-amber-500/25 transition-all">
                  <Printer size={14} /> Print Observation
                </button>
              </div>
              <div ref={printRef} className="glass-panel rounded-2xl p-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      {content.observationTable.columns.map((col, i) => (
                        <th key={i} className="text-left py-2 px-3 text-slate-400 border-b border-white/10 font-bold">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: content.observationTable.rows || 5 }).map((_, row) => (
                      <tr key={row} className="border-b border-white/5">
                        {content.observationTable!.columns.map((_, col) => (
                          <td key={col} className="py-2 px-3">
                            <input
                              type="text"
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab.id === 'observation' && (!content || !content.observationTable) && (
            <div className="glass-panel rounded-2xl p-8 max-w-4xl text-center">
              <ClipboardList size={48} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400">No observation table defined for this experiment.</p>
            </div>
          )}

          {/* 6. RESULT */}
          {activeTab.id === 'result' && (
            <div className="glass-panel rounded-2xl p-8 max-w-4xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 size={18} style={{ color: subject.hex }} /> Result & Conclusion
              </h3>
              {content?.result ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-emerald-300 leading-relaxed">{content.result}</p>
                </div>
              ) : (
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                  <p className="text-slate-400 text-sm mb-2">Expected result format:</p>
                  <p className="text-emerald-300/80 text-sm">
                    Based on your observations, write the result matching the aim of the experiment.
                    Compare your experimental value with the theoretical/standard value and calculate percentage error.
                  </p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-white mb-2">📝 Your Result</h4>
                <textarea
                  rows={4}
                  placeholder="Write your result and conclusion here..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1">Experimental Value</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50" placeholder="e.g., 9.72 m/s²" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-bold block mb-1">Percentage Error</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50" placeholder="e.g., 0.8%" />
                </div>
              </div>
            </div>
          )}

          {/* 7. REAL WORLD */}
          {activeTab.id === 'realworld' && (
            <div className="glass-panel rounded-2xl p-8 max-w-4xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe size={18} style={{ color: subject.hex }} /> Real-World Applications
              </h3>
              {content?.realWorldApplications && content.realWorldApplications.length > 0 ? (
                <ul className="space-y-3">
                  {content.realWorldApplications.map((app, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="w-8 h-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-white/5">
                        {['🏗️', '🏥', '🚀', '💡', '🔋', '📡', '🌍', '🧬'][i % 8]}
                      </span>
                      <p className="text-slate-300 text-sm leading-relaxed pt-1">{app}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-3">
                  <p className="text-slate-400 text-sm">
                    Real-world applications for <strong className="text-white">{lab.title}</strong> include:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Engineering and manufacturing quality control',
                      'Scientific research and laboratory measurements',
                      'Medical and pharmaceutical applications',
                      'Everyday technology and practical uses',
                    ].map((app, i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-3 flex items-center gap-2">
                        <span className="text-lg">{['🏗️', '🔬', '🏥', '💡'][i]}</span>
                        <span className="text-sm text-slate-400">{app}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 8. VIVA */}
          {activeTab.id === 'viva' && content?.vivaQuestions && (
            <div className="glass-panel rounded-2xl p-8 max-w-4xl space-y-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <HelpCircle size={18} style={{ color: subject.hex }} /> Viva Questions
              </h3>
              {content.vivaQuestions.map((vq, i) => (
                <details key={i} className="bg-white/5 rounded-xl p-4 group">
                  <summary className="cursor-pointer text-white font-medium flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                      style={{ background: `${subject.hex}20`, color: subject.hex }}>
                      Q{i + 1}
                    </span>
                    {vq.question}
                  </summary>
                  <p className="text-slate-400 mt-3 ml-8 text-sm leading-relaxed">{vq.answer}</p>
                </details>
              ))}
            </div>
          )}
          {activeTab.id === 'viva' && (!content?.vivaQuestions || content.vivaQuestions.length === 0) && (
            <div className="glass-panel rounded-2xl p-8 max-w-4xl text-center">
              <HelpCircle size={48} className="text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400">Viva questions for this experiment will be added soon.</p>
            </div>
          )}

          {/* 9. QUIZ */}
          {activeTab.id === 'quiz' && (
            <div className="glass-panel rounded-2xl p-8 max-w-4xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Brain size={18} style={{ color: subject.hex }} /> Self-Assessment Quiz
              </h3>
              {quizQuestions.length > 0 ? (
                <>
                  {quizQuestions.map((q, idx) => (
                    <div key={q.id} className="bg-white/5 rounded-xl p-4">
                      <p className="text-white font-medium mb-3 text-sm">
                        <span className="font-bold" style={{ color: subject.hex }}>Q{idx + 1}.</span> {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = quizAnswers[q.id] === optIdx;
                          const isCorrect = quizSubmitted && optIdx === q.correctIndex;
                          const isWrong = quizSubmitted && isSelected && optIdx !== q.correctIndex;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => { if (!quizSubmitted) setQuizAnswers({ ...quizAnswers, [q.id]: optIdx }); }}
                              disabled={quizSubmitted}
                              className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                                isCorrect ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
                                isWrong ? 'bg-red-500/20 border-red-500/40 text-red-300' :
                                isSelected ? 'bg-white/10 border-white/30 text-white' :
                                'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between">
                    {!quizSubmitted ? (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                        className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all disabled:opacity-30"
                      >
                        Submit Quiz
                      </button>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className={`text-lg font-bold ${quizScore === quizQuestions.length ? 'text-emerald-400' : quizScore >= quizQuestions.length / 2 ? 'text-amber-400' : 'text-red-400'}`}>
                          Score: {quizScore}/{quizQuestions.length}
                        </div>
                        <button
                          onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                          className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 font-bold text-sm border border-white/10"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Brain size={48} className="text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400">Quiz questions for this experiment will be added soon.</p>
                  <p className="text-slate-500 text-sm mt-2">Review the Viva Questions tab for practice.</p>
                </div>
              )}
            </div>
          )}
        </MotionDiv>

        {/* Navigation: Previous / Next */}
        <div className="flex items-center justify-between mt-8 max-w-4xl">
          <button
            onClick={goPrev}
            disabled={tabIdx === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold transition-all hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> {tabIdx > 0 ? TABS[tabIdx - 1].label : 'Previous'}
          </button>

          <span className="text-xs text-slate-500 font-mono">
            {tabIdx + 1} / {TABS.length}
          </span>

          <button
            onClick={goNext}
            disabled={tabIdx === TABS.length - 1}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 disabled:opacity-20 disabled:cursor-not-allowed"
            style={{ background: `${subject.hex}20`, color: subject.hex, borderColor: `${subject.hex}30`, borderWidth: 1 }}
          >
            {tabIdx < TABS.length - 1 ? TABS[tabIdx + 1].label : 'Finish'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabView;
