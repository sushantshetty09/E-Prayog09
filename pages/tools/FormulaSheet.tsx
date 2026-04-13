import React, { useState } from 'react';
import { Search, Copy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FORMULAS = [
  // Physics
  { id: 'p1', category: 'Physics', subcategory: 'Mechanics', name: 'Velocity', formula: 'v = u + at', variables: 'v = final velocity, u = initial velocity, a = acceleration, t = time' },
  { id: 'p2', category: 'Physics', subcategory: 'Mechanics', name: 'Displacement', formula: 's = ut + ½at²', variables: 's = displacement, u = initial velocity, a = acceleration, t = time' },
  { id: 'p3', category: 'Physics', subcategory: 'Mechanics', name: 'Kinetic Energy', formula: 'KE = ½mv²', variables: 'm = mass, v = velocity' },
  { id: 'p4', category: 'Physics', subcategory: 'Mechanics', name: 'Potential Energy', formula: 'PE = mgh', variables: 'm = mass, g = gravity, h = height' },
  { id: 'p5', category: 'Physics', subcategory: 'Electricity', name: "Ohm's Law", formula: 'V = IR', variables: 'V = Voltage, I = Current, R = Resistance' },
  { id: 'p6', category: 'Physics', subcategory: 'Electricity', name: 'Power', formula: 'P = VI = I²R', variables: 'P = Power, V = Voltage, I = Current' },
  // Chemistry
  { id: 'c1', category: 'Chemistry', subcategory: 'Gas Laws', name: 'Ideal Gas Law', formula: 'PV = nRT', variables: 'P = Pressure, V = Volume, n = moles, R = Gas constant, T = Temp' },
  { id: 'c2', category: 'Chemistry', subcategory: 'Acids & Bases', name: 'pH Calculation', formula: 'pH = -log[H⁺]', variables: '[H⁺] = Hydrogen ion concentration' },
  { id: 'c3', category: 'Chemistry', subcategory: 'Thermodynamics', name: 'Gibbs Free Energy', formula: 'ΔG = ΔH - TΔS', variables: 'G = Free Energy, H = Enthalpy, T = Temp, S = Entropy' },
  // Math
  { id: 'm1', category: 'Math', subcategory: 'Trigonometry', name: 'Pythagorean Identity', formula: 'sin²θ + cos²θ = 1', variables: 'θ = angle' },
  { id: 'm2', category: 'Math', subcategory: 'Calculus', name: 'Power Rule (Derivative)', formula: 'd/dx (xⁿ) = n·xⁿ⁻¹', variables: 'n = exponent' },
  { id: 'm3', category: 'Math', subcategory: 'Algebra', name: 'Quadratic Formula', formula: 'x = (-b ± √(b² - 4ac)) / 2a', variables: 'a, b, c = coefficients' },
  // Biology
  { id: 'b1', category: 'Biology', subcategory: 'Genetics', name: 'Hardy-Weinberg Principle', formula: 'p² + 2pq + q² = 1', variables: 'p, q = allele frequencies' },
  { id: 'b2', category: 'Biology', subcategory: 'Biochemistry', name: 'Photosynthesis', formula: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', variables: 'Carbon dioxide + Water → Glucose + Oxygen' },
  // CS
  { id: 'cs1', category: 'CS', subcategory: 'Complexity', name: 'Time Complexity (Binary Search)', formula: 'O(log n)', variables: 'n = number of elements' },
  { id: 'cs2', category: 'CS', subcategory: 'Data Transfer', name: 'Bandwidth Delay Product', formula: 'BDP = Bandwidth × RTT', variables: 'RTT = Round Trip Time' },
];

const FormulaSheet: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const tabs = ['All', 'Physics', 'Chemistry', 'Math', 'Biology', 'CS'];

  const filtered = FORMULAS.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.formula.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'All' || f.category === activeTab;
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
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">Formula Sheet</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Standard formulas and equations for quick reference.</p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-white/5">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
          {tabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-slate-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search formulas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map(f => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={f.id}
              className="glass-panel rounded-xl p-5 border border-white/10 bg-slate-900/40 hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{f.category} • {f.subcategory}</span>
                <button 
                  onClick={() => handleCopy(f.id, f.formula)}
                  className={`${copiedId === f.id ? 'text-green-400' : 'text-slate-500 hover:text-white'} transition-colors`}
                  title="Copy to clipboard"
                >
                  {copiedId === f.id ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div className="text-2xl font-mono font-bold text-white mb-2 overflow-x-auto no-scrollbar py-1">{f.formula}</div>
              <div className="text-sm font-semibold text-blue-400 mb-1">{f.name}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{f.variables}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No formulas matched your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulaSheet;
