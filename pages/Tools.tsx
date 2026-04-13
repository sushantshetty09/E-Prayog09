import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sigma, Cpu, Table2, Hash, Calculator, ShieldCheck, Microscope } from 'lucide-react';

const TOOLS = [
  { id: 'formula-sheet',  label: 'Formula Sheet',  icon: Sigma,      color: '#3b82f6', bg: 'rgba(59,130,246,0.15)',  path: '/tools/formula-sheet' },
  { id: 'logic-gates',    label: 'Logic Gates',    icon: Cpu,        color: '#a855f7', bg: 'rgba(168,85,247,0.15)', path: '/tools/logic-gates' },
  { id: 'periodic-table', label: 'Periodic Table', icon: Table2,     color: '#10b981', bg: 'rgba(16,185,129,0.15)', path: '/tools/periodic-table' },
  { id: 'constants',      label: 'Constants',      icon: Hash,       color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', path: '/tools/constants' },
  { id: 'calculator',     label: 'Calculator',     icon: Calculator, color: '#ec4899', bg: 'rgba(236,72,153,0.15)', path: '/tools/calculator' },
  { id: 'safety-guide',   label: 'Safety Guide',   icon: ShieldCheck,color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  path: '/tools/safety-guide' },
  { id: 'bio-diagrams',   label: 'Bio Diagrams',   icon: Microscope, color: '#22c55e', bg: 'rgba(34,197,94,0.15)',  path: '/tools/bio-diagrams' },
];

const Tools: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">Scientific Tools</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Quick access to references, calculators, and interactive study aids for all your science experiments.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {TOOLS.map((tool, i) => (
          <Link key={tool.id} to={tool.path}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="glass-panel rounded-2xl p-6 flex flex-col items-center gap-4 cursor-pointer
                         border border-white/5 hover:border-white/15 transition-colors
                         bg-slate-900/60 hover:bg-slate-800/60 h-full"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                   style={{ background: tool.bg, border: `1.5px solid ${tool.color}25` }}>
                <tool.icon size={30} style={{ color: tool.color }} />
              </div>
              <span className="text-white font-semibold text-sm text-center">{tool.label}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tools;
