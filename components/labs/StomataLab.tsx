import React, { useState } from 'react';
const StomataLab: React.FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Stomata — Structure & Guard Cells</h3>
      <div className="flex-1 flex items-center justify-center">
        <svg viewBox="0 0 300 300" className="w-72">
          {/* Epidermal cells background */}
          {Array.from({length:6},(_,r)=>Array.from({length:5},(_,c)=>(
            <rect key={`${r}-${c}`} x={20+c*55} y={20+r*45} width="50" height="40" rx="8" fill="#22c55e15" stroke="#22c55e30" strokeWidth="1" />
          )))}
          {/* Guard cells */}
          <g transform="translate(150,150)">
            <ellipse cx="-15" cy="0" rx="12" ry={open?35:25} fill="#22c55e80" stroke="#15803d" strokeWidth="2" transform={`rotate(${open?-15:0})`} />
            <ellipse cx="15" cy="0" rx="12" ry={open?35:25} fill="#22c55e80" stroke="#15803d" strokeWidth="2" transform={`rotate(${open?15:0})`} />
            {/* Stoma pore */}
            <ellipse cx="0" cy="0" rx={open?8:2} ry={open?20:8} fill="#0f172a" stroke="#064e3b" strokeWidth="1" />
            {/* Chloroplasts in guard cells */}
            {open && <>
              <circle cx="-18" cy="-10" r="3" fill="#4ade80" />
              <circle cx="-12" cy="8" r="3" fill="#4ade80" />
              <circle cx="18" cy="-10" r="3" fill="#4ade80" />
              <circle cx="12" cy="8" r="3" fill="#4ade80" />
            </>}
          </g>
          {/* Labels */}
          <text x="150" y="115" textAnchor="middle" fill="#94a3b8" fontSize="9">Guard cells</text>
          <text x="150" y="195" textAnchor="middle" fill="#94a3b8" fontSize="9">{open ? 'Stomatal pore (open)' : 'Stomatal pore (closed)'}</text>
          {/* Arrows for gas exchange when open */}
          {open && <>
            <text x="150" y="130" textAnchor="middle" fill="#38bdf8" fontSize="8">CO₂ ↓</text>
            <text x="150" y="180" textAnchor="middle" fill="#ef4444" fontSize="8">O₂ ↑</text>
          </>}
        </svg>
      </div>
      <div className="flex justify-center">
        <button onClick={() => setOpen(!open)} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${open ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'} border border-white/10`}>
          {open ? '💧 Close Stomata (Water Stress)' : '🌿 Open Stomata (Turgid)'}
        </button>
      </div>
      <div className="text-center text-sm text-slate-400 bg-white/5 rounded-xl p-3">
        {open ? 'Guard cells are turgid → pore opens → gas exchange (CO₂ in, O₂ out) and transpiration occur.' : 'Guard cells are flaccid → pore closes → reduces water loss during drought.'}
      </div>
    </div>
  );
};
export default StomataLab;
