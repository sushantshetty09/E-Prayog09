import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, FlaskConical, Dna, Calculator, Monitor, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { SUBJECTS } from '../constants';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;
const icons = [Zap, FlaskConical, Dna, Calculator, Monitor];

const Subjects: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            Virtual <span className="text-emerald-400">Laboratories</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Choose a subject to explore interactive experiments aligned with the Karnataka PUC syllabus.
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SUBJECTS.map((subject, idx) => {
            const Icon = icons[idx] || Zap;
            return (
              <Link key={subject.id} to={`/subjects/${subject.id}`}>
                <GlassCard color={subject.color} className="h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${subject.hex}15` }}>
                      <Icon size={28} style={{ color: subject.hex }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{subject.name}</h2>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${subject.hex}15`, color: subject.hex }}>
                        {subject.labs.length} Experiments
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">{subject.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {subject.labs.slice(0, 4).map(lab => (
                      <span key={lab.id} className="text-xs text-slate-500 bg-white/5 rounded-full px-2 py-0.5">{lab.title}</span>
                    ))}
                    {subject.labs.length > 4 && <span className="text-xs text-slate-600">+{subject.labs.length - 4} more</span>}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold" style={{ color: subject.hex }}>
                    Explore <ArrowRight size={16} />
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
