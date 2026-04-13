import React, { useState } from 'react';
import { Search, Copy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CONSTANTS = [
  { id: 'c1', category: 'Universal', name: 'Speed of Light in Vacuum', symbol: 'c', value: '299,792,458', unit: 'm/s', description: 'The upper limit for the speed at which conventional matter, energy or any signal carrying information can travel through space.' },
  { id: 'c2', category: 'Universal', name: 'Newtonian constant of gravitation', symbol: 'G', value: '6.67430(15) × 10⁻¹¹', unit: 'm³⋅kg⁻¹⋅s⁻²', description: 'Empirical physical constant involved in the calculation of gravitational effects in Sir Isaac Newton\'s law of universal gravitation and in Albert Einstein\'s general theory of relativity.' },
  { id: 'c3', category: 'Universal', name: 'Planck constant', symbol: 'h', value: '6.62607015 × 10⁻³⁴', unit: 'J⋅s', description: 'Fundamental physical constant occurring in the mathematical formulations of quantum mechanics.' },
  { id: 'c4', category: 'Electromagnetic', name: 'Elementary charge', symbol: 'e', value: '1.602176634 × 10⁻¹⁹', unit: 'C', description: 'The magnitude of the electric charge carried by a single electron or proton.' },
  { id: 'c5', category: 'Electromagnetic', name: 'Vacuum permittivity', symbol: 'ε₀', value: '8.8541878128(13) × 10⁻¹²', unit: 'F/m', description: 'Ideal physical constant, the absolute dielectric permittivity of classical vacuum.' },
  { id: 'c6', category: 'Atomic', name: 'Electron mass', symbol: 'mₑ', value: '9.1093837015(28) × 10⁻³¹', unit: 'kg', description: 'The mass of a stationary electron.' },
  { id: 'c7', category: 'Atomic', name: 'Proton mass', symbol: 'mₚ', value: '1.67262192369(51) × 10⁻²⁷', unit: 'kg', description: 'The rest mass of a proton.' },
  { id: 'c8', category: 'Atomic', name: 'Avogadro constant', symbol: 'N_A', value: '6.02214076 × 10²³', unit: 'mol⁻¹', description: 'The number of constituent particles (usually atoms or molecules) that are contained in one mole of a given substance.' },
  { id: 'c9', category: 'Pharmacokinetic', name: 'Molar Gas Constant', symbol: 'R', value: '8.314462618', unit: 'J⋅mol⁻¹⋅K⁻¹', description: 'Equivalent to the Boltzmann constant, but expressed in units of energy per temperature increment per mole.' },
  { id: 'c10', category: 'Thermodynamic', name: 'Boltzmann constant', symbol: 'k', value: '1.380649 × 10⁻²³', unit: 'J/K', description: 'The proportionality factor that relates the average relative kinetic energy of particles in a gas with the thermodynamic temperature of the gas.' },
];

const Constants: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const tabs = ['All', 'Universal', 'Electromagnetic', 'Atomic', 'Thermodynamic'];

  const filtered = CONSTANTS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'All' || c.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">Physical Constants</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Reference values for universal and fundamental physical constants.</p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-white/5">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
          {tabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-amber-600 text-white' : 'hover:bg-white/10 text-slate-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search constants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500/50 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map(c => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={c.id}
              className="glass-panel rounded-xl p-5 border border-white/10 bg-slate-900/40 hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{c.category}</span>
                <button 
                  onClick={() => handleCopy(c.id, c.value)}
                  className={`${copiedId === c.id ? 'text-green-400' : 'text-slate-500 hover:text-white'} transition-colors`}
                  title="Copy value"
                >
                  {copiedId === c.id ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div className="flex gap-4 items-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl font-serif italic text-amber-400 border border-white/10 shrink-0">
                  {c.symbol}
                </div>
                <div>
                   <div className="text-xl font-mono font-bold text-white leading-tight">{c.value}</div>
                   <div className="text-sm text-slate-400">{c.unit}</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-white mb-1">{c.name}</div>
              <div className="text-xs text-slate-500 leading-relaxed line-clamp-3">{c.description}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No constants matched your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Constants;
