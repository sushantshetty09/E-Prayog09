import React, { useState } from 'react';
const solutions = [
  { name:'Hydrochloric Acid',pH:1,color:'#ef4444'},
  { name:'Lemon Juice',pH:2.5,color:'#f97316'},
  { name:'Vinegar',pH:3,color:'#fb923c'},
  { name:'Coffee',pH:5,color:'#eab308'},
  { name:'Pure Water',pH:7,color:'#22c55e'},
  { name:'Baking Soda',pH:8.5,color:'#3b82f6'},
  { name:'Milk of Magnesia',pH:10,color:'#6366f1'},
  { name:'Ammonia',pH:11.5,color:'#8b5cf6'},
  { name:'NaOH',pH:14,color:'#a855f7'},
];
const PHLabSimulation: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const sol = solutions[selected];
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">pH of Solutions</h3>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* pH strip */}
        <div className="w-full max-w-md flex rounded-xl overflow-hidden h-10 border border-white/10">
          {Array.from({length:14},(_,i)=>i+1).map(ph=>(
            <div key={ph} className="flex-1 flex items-end justify-center relative" style={{background:`hsl(${(14-ph)*8},80%,${ph===sol.pH?'60%':'35%'})`}}>
              <span className="text-[8px] text-white/80 mb-1">{ph}</span>
              {Math.round(sol.pH)===ph && <div className="absolute -top-3 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />}
            </div>
          ))}
        </div>
        {/* Test tube */}
        <svg viewBox="0 0 120 200" className="h-40">
          <rect x="35" y="20" width="50" height="140" rx="20" fill={sol.color+'30'} stroke="#94a3b8" strokeWidth="2" style={{ transition: 'fill 0.8s ease' }} />
          <rect x="37" y={160 - 100} width="46" height="100" rx="18" fill={sol.color+'60'} style={{ transition: 'fill 0.8s ease' }} />
          <text x="60" y="180" textAnchor="middle" fill="#94a3b8" fontSize="10">{sol.name}</text>
        </svg>
        <div className="text-center">
          <div className="text-4xl font-bold font-mono" style={{color:sol.color}}>pH {sol.pH}</div>
          <div className="text-sm text-slate-400 mt-1">{sol.pH < 7 ? 'Acidic' : sol.pH === 7 ? 'Neutral' : 'Basic'}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {solutions.map((s,i) => (
          <button key={i} onClick={()=>setSelected(i)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${i===selected?'text-white scale-105':'text-slate-400 hover:text-white'}`} style={{borderWidth:2,borderColor:s.color,background:i===selected?s.color+'40':'transparent'}}>
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
};
export default PHLabSimulation;
