import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SUBJECTS } from '../constants';
import GlassCard from '../components/GlassCard';
import { ArrowRight, Clock, BarChart3, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

const SubjectView: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const [difficulty, setDifficulty] = useState<string>('All');
  const [standard, setStandard] = useState<string>('All');

  if (!subject) return <div className="min-h-screen pt-24 flex items-center justify-center text-white text-xl">Subject not found.</div>;

  const filtered = subject.labs.filter(lab => {
    if (difficulty !== 'All' && lab.difficulty !== difficulty) return false;
    if (standard !== 'All' && !lab.standards?.includes(standard as any)) return false;
    return true;
  });

  const diffColors: Record<string, string> = { Easy: 'text-emerald-400 bg-emerald-500/10', Medium: 'text-amber-400 bg-amber-500/10', Hard: 'text-red-400 bg-red-500/10' };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link to="/subjects" className="text-sm text-slate-500 hover:text-emerald-400 transition-colors mb-4 inline-block">← Back to Subjects</Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${subject.hex}15` }}>
              <subject.icon size={28} style={{ color: subject.hex }} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">{subject.name}</h1>
              <p className="text-slate-400 text-sm">{subject.labs.length} experiments • Karnataka PUC</p>
            </div>
          </div>
        </MotionDiv>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-500" />
            <span className="text-xs text-slate-500 uppercase font-bold">Difficulty:</span>
            {['All', 'Easy', 'Medium', 'Hard'].map(d => (
              <button key={d} onClick={() => setDifficulty(d)} className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${difficulty === d ? 'bg-white/10 text-white border-white/20' : 'text-slate-500 border-white/5 hover:text-white'}`}>{d}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 uppercase font-bold">Standard:</span>
            {['All', '1st PUC / Class 11', '2nd PUC / Class 12'].map(s => (
              <button key={s} onClick={() => setStandard(s)} className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${standard === s ? 'bg-white/10 text-white border-white/20' : 'text-slate-500 border-white/5 hover:text-white'}`}>{s === 'All' ? s : s.split(' / ')[0]}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lab, idx) => (
            <Link key={lab.id} to={`/subjects/${subject.id}/${lab.id}`}>
              <GlassCard color={subject.color} className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${diffColors[lab.difficulty] || ''}`}>{lab.difficulty}</span>
                  <div className="flex items-center gap-1 text-xs text-slate-500"><Clock size={12} /> {lab.duration}</div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{lab.title}</h3>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{lab.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 bg-white/5 rounded-full px-2 py-0.5">{lab.category}</span>
                  <span className="text-sm font-bold flex items-center gap-1" style={{ color: subject.hex }}>
                    Open Lab <ArrowRight size={14} />
                  </span>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center text-slate-500 py-12">No experiments match the selected filters.</p>}
      </div>
    </div>
  );
};

export default SubjectView;
