import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SUBJECTS } from '../constants';
import SimulationStage from '../components/SimulationStage';
import { useAuth } from '../services/AuthContext';
import { supabase } from '../services/supabase';
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
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Scroll to top when tab changes to prevent layout shift jumping to the bottom
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tabIdx]);
  
  const [vivaRevealed, setVivaRevealed] = useState<Set<number>>(new Set());
  const [vivaRating, setVivaRating] = useState<Record<number, 'knew' | 'unsure' | 'missed'>>({});
  const [shuffledViva, setShuffledViva] = useState<any[]>([]);

  const printRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

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

  // Setup Quiz and Viva
  const quizQuestions = content?.quizQuestions || [];
  
  // Use effect to initialize shuffled viva
  React.useEffect(() => {
    if (content?.vivaQuestions) {
      setShuffledViva([...content.vivaQuestions]);
    }
  }, [content]);

  const handleQuizSubmit = async () => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    
    if (user) {
      try {
        await supabase.from('quiz_scores').upsert({
          user_id: user.id,
          lab_id: lab.id,
          score,
          total: quizQuestions.length,
          completed_at: new Date().toISOString()
        });
      } catch (e) {
         console.warn('Supabase save error:', e);
      }
    }
  };

  const handleShuffleViva = () => {
    setShuffledViva([...shuffledViva].sort(() => Math.random() - 0.5));
    setVivaRevealed(new Set());
    setVivaRating({});
  };

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
              type="button"
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
          {activeTab.id === 'viva' && content?.vivaQuestions && shuffledViva.length > 0 && (
            <div className="max-w-4xl space-y-6">
              <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                    <HelpCircle size={18} style={{ color: subject.hex }} /> Interactive Viva Voce
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-48 h-1.5 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(vivaRevealed.size / shuffledViva.length) * 100}%`, background: subject.hex }} />
                    </div>
                    <span className="text-xs text-slate-400 font-bold">{vivaRevealed.size} / {shuffledViva.length} revealed</span>
                  </div>
                </div>
                <button 
                  onClick={handleShuffleViva}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors"
                >
                  Shuffle Questions
                </button>
              </div>

              {shuffledViva.map((vq, i) => {
                const isRevealed = vivaRevealed.has(i);
                const rating = vivaRating[i];
                const borderColor = rating === 'knew' ? 'border-green-500/50' : rating === 'unsure' ? 'border-amber-500/50' : rating === 'missed' ? 'border-red-500/50' : 'border-white/10';
                
                return (
                  <div key={i} className={`glass-panel rounded-2xl p-6 transition-all border ${borderColor}`}>
                    <div className="flex items-start gap-4 mb-4">
                      <span className="w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center shrink-0" style={{ background: `${subject.hex}20`, color: subject.hex }}>
                        Q{i + 1}
                      </span>
                      <h4 className="text-white font-medium text-lg leading-snug pt-1">{vq.question}</h4>
                    </div>
                    
                    {!isRevealed ? (
                      <div className="ml-12 mt-4">
                        <button 
                          onClick={() => setVivaRevealed(new Set(vivaRevealed).add(i))}
                          className="px-6 py-2 rounded-xl border border-blue-500/50 text-blue-400 font-bold text-sm hover:bg-blue-500/10 transition-colors"
                        >
                          Reveal Answer
                        </button>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="ml-12">
                        <div className="p-4 rounded-xl bg-black/20 text-slate-300 leading-relaxed mb-4 border border-white/5">
                          {vq.answer}
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs text-slate-500 font-bold uppercase mr-2">How did you do?</span>
                          <button onClick={() => setVivaRating({...vivaRating, [i]: 'knew'})} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${rating === 'knew' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'}`}>✅ I knew this</button>
                          <button onClick={() => setVivaRating({...vivaRating, [i]: 'unsure'})} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${rating === 'unsure' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'}`}>🤔 Unsure</button>
                          <button onClick={() => setVivaRating({...vivaRating, [i]: 'missed'})} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${rating === 'missed' ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'}`}>❌ Missed it</button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}

              {vivaRevealed.size === shuffledViva.length && shuffledViva.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-2xl border border-white/10 mt-8 flex flex-col items-center">
                  <h3 className="text-white font-bold text-lg mb-4">Practice Summary</h3>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center bg-green-500/10 p-4 rounded-xl border border-green-500/20 min-w-[100px]">
                      <span className="text-2xl font-bold text-green-400">{Object.values(vivaRating).filter(r => r === 'knew').length}</span>
                      <span className="text-xs text-green-300/70 font-bold uppercase mt-1">Knew</span>
                    </div>
                    <div className="flex flex-col items-center bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 min-w-[100px]">
                      <span className="text-2xl font-bold text-amber-400">{Object.values(vivaRating).filter(r => r === 'unsure').length}</span>
                      <span className="text-xs text-amber-300/70 font-bold uppercase mt-1">Unsure</span>
                    </div>
                    <div className="flex flex-col items-center bg-red-500/10 p-4 rounded-xl border border-red-500/20 min-w-[100px]">
                      <span className="text-2xl font-bold text-red-400">{Object.values(vivaRating).filter(r => r === 'missed').length}</span>
                      <span className="text-xs text-red-300/70 font-bold uppercase mt-1">Missed</span>
                    </div>
                  </div>
                </motion.div>
              )}
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
              
              {quizSubmitted && quizQuestions.length > 0 && (
                <div className={`p-6 rounded-2xl border mb-8 text-center flex flex-col items-center gap-2 ${
                  quizScore >= quizQuestions.length * 0.7 ? 'bg-green-500/10 border-green-500/30' :
                  quizScore >= quizQuestions.length * 0.4 ? 'bg-amber-500/10 border-amber-500/30' :
                  'bg-red-500/10 border-red-500/30'
                }`}>
                  <h2 className="text-lg font-bold text-white mb-2">Quiz Completed!</h2>
                  <div className={`text-5xl font-black ${
                    quizScore >= quizQuestions.length * 0.7 ? 'text-green-400' :
                    quizScore >= quizQuestions.length * 0.4 ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {quizScore} / {quizQuestions.length}
                  </div>
                  <p className="text-slate-400 font-medium">({Math.round((quizScore / quizQuestions.length) * 100)}%)</p>
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Brain size={18} style={{ color: subject.hex }} /> Self-Assessment Quiz
                </h3>
                {!quizSubmitted && quizQuestions.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-slate-400 font-bold">{Object.keys(quizAnswers).length} / {quizQuestions.length} answered</div>
                    <div className="w-24 h-1.5 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all" style={{ width: `${(Object.keys(quizAnswers).length / quizQuestions.length) * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {quizQuestions.length > 0 ? (
                <>
                  {quizQuestions.map((q, idx) => (
                    <div key={q.id} className={`bg-white/5 rounded-xl p-5 border transition-all ${
                      quizSubmitted && quizAnswers[q.id] === q.correctIndex ? 'border-green-500/30' :
                      quizSubmitted && quizAnswers[q.id] !== q.correctIndex ? 'border-red-500/30' :
                      'border-transparent'
                    }`}>
                      <div className="flex items-start gap-4 mb-4">
                        <span className="w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center shrink-0" style={{ background: `${subject.hex}20`, color: subject.hex }}>
                          Q{idx + 1}
                        </span>
                        <p className="text-white font-medium text-lg leading-snug pt-1">{q.question}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 ml-12">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = quizAnswers[q.id] === optIdx;
                          const isCorrect = quizSubmitted && optIdx === q.correctIndex;
                          const isWrong = quizSubmitted && isSelected && optIdx !== q.correctIndex;
                          
                          let btnClass = 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white';
                          if (quizSubmitted) {
                            if (isCorrect) btnClass = 'bg-green-500/20 border border-green-500/50 text-green-300';
                            else if (isWrong) btnClass = 'bg-red-500/20 border border-red-500/50 text-red-300';
                            else btnClass = 'bg-black/20 border border-transparent text-slate-500 opacity-50';
                          } else if (isSelected) {
                            btnClass = 'bg-blue-600/20 border-l-4 border-y border-r border-blue-500 text-white';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => { if (!quizSubmitted) setQuizAnswers({ ...quizAnswers, [q.id]: optIdx }); }}
                              disabled={quizSubmitted}
                              className={`text-left px-5 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${btnClass}`}
                            >
                              <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                                quizSubmitted && isCorrect ? 'bg-green-500' :
                                quizSubmitted && isWrong ? 'bg-red-500' :
                                isSelected ? 'bg-blue-500 text-white' : 'bg-black/30'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      
                      {quizSubmitted && q.explanation && (
                        <div className="ml-12 mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                          <p className="text-sm text-blue-300"><span className="font-bold mr-1">Explanation:</span> {q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center justify-center pt-4">
                    {!quizSubmitted ? (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                        className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all disabled:opacity-30 disabled:scale-100 hover:scale-105"
                      >
                        Submit Quiz
                      </button>
                    ) : (
                      <button
                        onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); setQuizScore(0); }}
                        className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
                      >
                        Retake Quiz
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="glass-panel p-12 text-center rounded-2xl flex flex-col items-center justify-center border border-white/5">
                  <Brain size={48} className="text-slate-700 mb-4" />
                  <p className="text-slate-400 font-medium">Quiz questions for this experiment will be added soon.</p>
                </div>
              )}
            </div>
          )}
        </MotionDiv>

        {/* Navigation: Previous / Next */}
        <div className="flex items-center justify-between mt-8 max-w-4xl">
          <button
            type="button"
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
            type="button"
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
