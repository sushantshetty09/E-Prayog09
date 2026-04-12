import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SUBJECTS } from '../constants';
import SimulationStage from '../components/SimulationStage';
import { ArrowLeft, BookOpen, FlaskConical, ListChecks, Target, HelpCircle, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

type Tab = 'simulation' | 'aim' | 'theory' | 'procedure' | 'viva' | 'observation';

const LabView: React.FC = () => {
  const { subjectId, labId } = useParams<{ subjectId: string; labId: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('simulation');

  const subject = SUBJECTS.find(s => s.id === subjectId);
  const lab = subject?.labs.find(l => l.id === labId);

  if (!subject || !lab) return <div className="min-h-screen pt-24 flex items-center justify-center text-white text-xl">Experiment not found.</div>;

  const content = lab.content;
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'simulation', label: 'Simulation', icon: <FlaskConical size={14} /> },
    { id: 'aim', label: 'Aim & Theory', icon: <Target size={14} /> },
    { id: 'procedure', label: 'Procedure', icon: <ListChecks size={14} /> },
    { id: 'viva', label: 'Viva', icon: <HelpCircle size={14} /> },
    { id: 'observation', label: 'Observation', icon: <ClipboardList size={14} /> },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-white/10 text-white border border-white/20' : 'text-slate-500 border border-transparent hover:text-white hover:bg-white/5'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <MotionDiv key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'simulation' && (
            <div className="min-h-[500px]">
              <SimulationStage labId={lab.id} hex={subject.hex} />
            </div>
          )}
          {activeTab === 'aim' && content && (
            <div className="glass-panel rounded-2xl p-8 space-y-6 max-w-4xl">
              <div><h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Target size={18} style={{ color: subject.hex }} /> Aim</h3><p className="text-slate-300">{content.aim}</p></div>
              <div><h3 className="text-lg font-bold text-white mb-2">📋 Requirements</h3><ul className="list-disc list-inside text-slate-400 space-y-1">{content.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
              <div><h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><BookOpen size={18} style={{ color: subject.hex }} /> Theory</h3><p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{content.theory}</p></div>
              {content.objectives?.length > 0 && (
                <div><h3 className="text-lg font-bold text-white mb-2">🎯 Objectives</h3><ul className="list-disc list-inside text-slate-400 space-y-1">{content.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul></div>
              )}
              {content.safety && content.safety.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"><h3 className="text-sm font-bold text-red-400 mb-2">⚠️ Safety Precautions</h3><ul className="list-disc list-inside text-red-300/80 text-sm space-y-1">{content.safety.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
              )}
            </div>
          )}
          {activeTab === 'procedure' && content && (
            <div className="glass-panel rounded-2xl p-8 max-w-4xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><ListChecks size={18} style={{ color: subject.hex }} /> Procedure</h3>
              <ol className="space-y-3">{content.procedure.map((step, i) => (
                <li key={i} className="flex gap-3 items-start text-slate-300">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: `${subject.hex}20`, color: subject.hex }}>{i + 1}</span>
                  {step}
                </li>
              ))}</ol>
            </div>
          )}
          {activeTab === 'viva' && content?.vivaQuestions && (
            <div className="glass-panel rounded-2xl p-8 max-w-4xl space-y-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><HelpCircle size={18} style={{ color: subject.hex }} /> Viva Questions</h3>
              {content.vivaQuestions.map((vq, i) => (
                <details key={i} className="bg-white/5 rounded-xl p-4 group">
                  <summary className="cursor-pointer text-white font-medium flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: `${subject.hex}20`, color: subject.hex }}>Q{i + 1}</span>
                    {vq.question}
                  </summary>
                  <p className="text-slate-400 mt-3 ml-8">{vq.answer}</p>
                </details>
              ))}
            </div>
          )}
          {activeTab === 'observation' && content?.observationTable && (
            <div className="glass-panel rounded-2xl p-8 max-w-4xl overflow-x-auto">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><ClipboardList size={18} style={{ color: subject.hex }} /> Observation Table</h3>
              <table className="w-full text-sm">
                <thead><tr>{content.observationTable.columns.map((col, i) => (
                  <th key={i} className="text-left py-2 px-3 text-slate-400 border-b border-white/10 font-bold">{col}</th>
                ))}</tr></thead>
                <tbody>{Array.from({ length: content.observationTable.rows || 5 }).map((_, row) => (
                  <tr key={row} className="border-b border-white/5">{content.observationTable!.columns.map((_, col) => (
                    <td key={col} className="py-2 px-3"><input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-emerald-500/50" /></td>
                  ))}</tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </MotionDiv>
      </div>
    </div>
  );
};

export default LabView;
