import React, { useState } from 'react';
import { Search, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock SVG diagrams for the biology tool section.
// In a full production app, these would be detailed assets.
const DIAGRAMS = [
  { 
    id: 'd1', 
    title: 'Animal Cell', 
    description: 'Structure of a typical animal cell with major organelles.',
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full" style={{ background: '#ffffff' }}>
        <circle cx="100" cy="100" r="90" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
        <circle cx="100" cy="100" r="30" fill="#fca5a5" stroke="#dc2626" strokeWidth="2" />
        <circle cx="90" cy="90" r="10" fill="#991b1b" />
        <ellipse cx="60" cy="140" rx="20" ry="10" fill="#60a5fa" stroke="#2563eb" strokeWidth="2" transform="rotate(-30 60 140)" />
        <path d="M 120 60 Q 140 40 160 50" fill="none" stroke="#22c55e" strokeWidth="4" />
        <path d="M 130 70 Q 150 50 170 60" fill="none" stroke="#22c55e" strokeWidth="4" />
        
        {/* Labels */}
        <text x="100" y="30" fontSize="8" fill="#333" textAnchor="middle">Cell Membrane</text>
        <line x1="100" y1="32" x2="100" y2="10" stroke="#333" strokeWidth="0.5" />
        
        <text x="160" y="100" fontSize="8" fill="#333" textAnchor="start">Nucleus</text>
        <line x1="158" y1="100" x2="130" y2="100" stroke="#333" strokeWidth="0.5" />
      </svg>
    )
  },
  { 
    id: 'd2', 
    title: 'Plant Cell', 
    description: 'Structure of a typical plant cell, highlighting the cell wall and chloroplasts.',
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full" style={{ background: '#ffffff' }}>
        <rect x="20" y="20" width="160" height="160" rx="10" fill="#bbf7d0" stroke="#166534" strokeWidth="6" />
        <rect x="23" y="23" width="154" height="154" rx="8" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
        
        <circle cx="140" cy="60" r="30" fill="#fca5a5" stroke="#dc2626" strokeWidth="2" />
        <path d="M 40 80 Q 90 40 130 160 Q 80 180 40 80" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" opacity="0.6"/>
        
        <ellipse cx="140" cy="140" rx="15" ry="25" fill="#22c55e" stroke="#166534" strokeWidth="2" transform="rotate(45 140 140)" />
        <ellipse cx="60" cy="40" rx="15" ry="25" fill="#22c55e" stroke="#166534" strokeWidth="2" transform="rotate(-30 60 40)" />
        
        <text x="100" y="10" fontSize="8" fill="#333" textAnchor="middle">Cell Wall</text>
        <text x="90" y="130" fontSize="8" fill="#333" textAnchor="middle">Large Central Vacuole</text>
      </svg>
    )
  },
  { 
    id: 'd3', 
    title: 'Neuron', 
    description: 'Structure of a nerve cell showing dendrites, soma, and axon.',
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full" style={{ background: '#ffffff' }}>
        <path d="M 50 100 L 160 100" fill="none" stroke="#fbbf24" strokeWidth="4" />
        <rect x="70" y="96" width="20" height="8" rx="2" fill="#60a5fa" stroke="#2563eb" strokeWidth="1" />
        <rect x="100" y="96" width="20" height="8" rx="2" fill="#60a5fa" stroke="#2563eb" strokeWidth="1" />
        <rect x="130" y="96" width="20" height="8" rx="2" fill="#60a5fa" stroke="#2563eb" strokeWidth="1" />
        
        <circle cx="40" cy="100" r="15" fill="#fcd34d" stroke="#d97706" strokeWidth="2" />
        <circle cx="40" cy="100" r="4" fill="#92400e" />
        
        <path d="M 30 90 L 10 70 M 50 90 L 70 70 M 30 110 L 10 130 M 50 110 L 70 130" fill="none" stroke="#d97706" strokeWidth="2" />
        <path d="M 160 100 L 180 80 M 160 100 L 180 120" fill="none" stroke="#d97706" strokeWidth="2" />
        
        <text x="40" y="60" fontSize="8" fill="#333" textAnchor="middle">Cell Body (Soma)</text>
        <text x="110" y="80" fontSize="8" fill="#333" textAnchor="middle">Myelin Sheath</text>
      </svg>
    )
  },
  { 
    id: 'd4', 
    title: 'DNA Double Helix', 
    description: 'Structure of DNA showing base pairs and sugar-phosphate backbone.',
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full" style={{ background: '#ffffff' }}>
        <path d="M 60 20 Q 140 100 60 180" fill="none" stroke="#3b82f6" strokeWidth="6" />
        <path d="M 140 20 Q 60 100 140 180" fill="none" stroke="#ef4444" strokeWidth="6" />
        
        <line x1="75" y1="40" x2="125" y2="40" stroke="#22c55e" strokeWidth="4" />
        <line x1="90" y1="60" x2="110" y2="60" stroke="#eab308" strokeWidth="4" />
        <line x1="100" y1="80" x2="100" y2="80" stroke="#a855f7" strokeWidth="4" />
        <line x1="90" y1="140" x2="110" y2="140" stroke="#eab308" strokeWidth="4" />
        <line x1="75" y1="160" x2="125" y2="160" stroke="#22c55e" strokeWidth="4" />
        
        <text x="150" y="40" fontSize="8" fill="#333" textAnchor="start">Base Pairs</text>
        <line x1="145" y1="40" x2="125" y2="40" stroke="#333" strokeWidth="0.5" />
        
        <text x="50" y="100" fontSize="8" fill="#333" textAnchor="end">Sugar-Phosphate Backbone</text>
      </svg>
    )
  }
];

const BioDiagrams: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedDiagram, setSelectedDiagram] = useState<any>(null);

  const filtered = DIAGRAMS.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">Biological Diagrams</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Reference illustrations for biological structures and pathways.</p>
      </div>

      <div className="mb-8 relative max-w-md mx-auto">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
         <input
           type="text"
           placeholder="Search diagrams..."
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           className="w-full pl-9 pr-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {filtered.map(d => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={d.id}
              className="glass-panel rounded-2xl overflow-hidden border border-white/10 bg-slate-900/60 flex flex-col group cursor-pointer"
              onClick={() => setSelectedDiagram(d)}
            >
              <div className="aspect-square bg-slate-100 p-4 border-b border-white/10 relative">
                {d.svg}
                <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={16} className="text-white" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-1">{d.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{d.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedDiagram && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-12 bg-black/80 backdrop-blur-md"
             onClick={() => setSelectedDiagram(null)}
           >
             <motion.div 
               initial={{ scale: 0.95 }}
               animate={{ scale: 1 }}
               exit={{ scale: 0.95 }}
               className="bg-slate-900 rounded-3xl overflow-hidden w-full max-w-4xl max-h-full flex flex-col md:flex-row border border-white/10 shadow-2xl relative"
               onClick={e => e.stopPropagation()}
             >
                <button 
                  onClick={() => setSelectedDiagram(null)}
                  className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-slate-300 transition-colors z-10"
                >
                  <X size={20} />
                </button>
                
                <div className="flex-1 bg-white p-8 border-b md:border-b-0 md:border-r border-white/10 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
                   {selectedDiagram.svg}
                </div>
                
                <div className="w-full md:w-80 p-8 flex flex-col shrink-0">
                  <h2 className="text-2xl font-bold text-white mb-4">{selectedDiagram.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8">{selectedDiagram.description}</p>
                </div>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default BioDiagrams;
