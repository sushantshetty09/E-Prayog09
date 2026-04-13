import React, { useState } from 'react';
import { ShieldAlert, Flame, Beaker, Zap, Biohazard, HeartPulse, Glasses, EyeOff, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SAFETY_RULES = [
  // General Rules
  { id: 'g1', category: 'General Rules', severity: 'critical', title: 'Always Wear PPE', description: 'Personal Protective Equipment like goggles, lab coats, and closed-toe shoes are mandatory.', icon: Glasses },
  { id: 'g2', category: 'General Rules', severity: 'warning', title: 'No Food or Drink', description: 'Never eat, drink, or chew gum in the laboratory environment.', icon: EyeOff },
  { id: 'g3', category: 'General Rules', severity: 'info', title: 'Know Exits & Equipment', description: 'Locate fire extinguishers, eye wash stations, safety showers, and fire blankets before starting.', icon: ShieldAlert },
  
  // Chemical Safety
  { id: 'c1', category: 'Chemical Safety', severity: 'critical', title: 'Fume Hood Usage', description: 'Always use the fume hood when working with volatile, toxic, or flammable chemicals.', icon: Beaker },
  { id: 'c2', category: 'Chemical Safety', severity: 'critical', title: 'Acid Dilution', description: 'Always add Acid to Water (A to W), never water to acid, to prevent exothermic splashing.', icon: Beaker },
  { id: 'c3', category: 'Chemical Safety', severity: 'warning', title: 'Waft, Don\'t Sniff', description: 'If instructed to smell a chemical, gently waft the vapors towards your nose; never sniff directly.', icon: Beaker },
  
  // Fire Safety
  { id: 'f1', category: 'Fire Safety', severity: 'critical', title: 'Unattended Flames', description: 'Never leave a lit Bunsen burner or active heat source unattended.', icon: Flame },
  { id: 'f2', category: 'Fire Safety', severity: 'critical', title: 'Tie Back Hair', description: 'Long hair must be tied back and dangling jewelry removed when working near open flames.', icon: Flame },
  { id: 'f3', category: 'Fire Safety', severity: 'warning', title: 'Flammable Liquids', description: 'Keep volatile organic solvents far away from open flames and heat plates.', icon: Flame },

  // Electrical
  { id: 'e1', category: 'Electrical Safety', severity: 'critical', title: 'Keep Away from Water', description: 'Ensure hands and surfaces are completely dry before operating electrical equipment.', icon: Zap },
  { id: 'e2', category: 'Electrical Safety', severity: 'warning', title: 'Inspect Cords', description: 'Check for frayed wires or damaged plugs before plugging in devices.', icon: Zap },

  // Biohazard
  { id: 'b1', category: 'Biohazard', severity: 'critical', title: 'Disposal of Bio Waste', description: 'Dispose of bacterial cultures and biological waste in designated biohazard bags, never the regular trash.', icon: Biohazard },
  { id: 'b2', category: 'Biohazard', severity: 'critical', title: 'Wash Surfaces', description: 'Disinfect laboratory work surfaces before and after biological experiments.', icon: Biohazard },
  
  // First Aid
  { id: 'fa1', category: 'First Aid', severity: 'critical', title: 'Eye Wash Protocol', description: 'If chemicals get in eyes, flush immediately at the eye wash station for at least 15 minutes.', icon: HeartPulse },
  { id: 'fa2', category: 'First Aid', severity: 'warning', title: 'Report All Injuries', description: 'Report any spill, cut, or burn to the instructor immediately, no matter how minor.', icon: HeartPulse },
];

const SafetyGuide: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'General Rules', 'Chemical Safety', 'Fire Safety', 'Electrical Safety', 'Biohazard', 'First Aid'];

  const filteredRules = SAFETY_RULES.filter(rule => {
    const matchesSearch = rule.title.toLowerCase().includes(search.toLowerCase()) || rule.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || rule.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">Laboratory Safety Guide</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Essential safety protocols and emergency procedures for all laboratory experiments.</p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-white/5">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-red-600 text-white' : 'hover:bg-white/10 text-slate-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
           <input
             type="text"
             placeholder="Search guidelines..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/50 text-sm"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         <AnimatePresence>
            {filteredRules.map(rule => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={rule.id}
                className={`glass-panel rounded-xl p-5 border-l-4 bg-slate-900/60 hover:bg-slate-800 transition-colors ${
                  rule.severity === 'critical' ? 'border-l-red-500 border-y-white/5 border-r-white/5' :
                  rule.severity === 'warning'  ? 'border-l-amber-500 border-y-white/5 border-r-white/5' : 
                  'border-l-blue-500 border-y-white/5 border-r-white/5'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${
                    rule.severity === 'critical' ? 'bg-red-500/10' :
                    rule.severity === 'warning'  ? 'bg-amber-500/10' : 'bg-blue-500/10'
                  }`}>
                    <rule.icon size={24} className={
                      rule.severity === 'critical' ? 'text-red-400' :
                      rule.severity === 'warning'  ? 'text-amber-400' : 'text-blue-400'
                    }/>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1 block">
                      {rule.category}
                    </span>
                    <p className="font-bold text-white mb-2 leading-tight">{rule.title}</p>
                    <p className="text-sm text-slate-400">{rule.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
         </AnimatePresence>
         
         {filteredRules.length === 0 && (
           <div className="col-span-full py-12 text-center text-slate-500">
             No safety rules matched your search.
           </div>
         )}
      </div>
    </div>
  );
};

export default SafetyGuide;
