import React, { useState, useEffect } from 'react';
const setups = [
  { id: 'A', label: 'Control', conditions: 'Moist cotton + Air + Room temp', willGerminate: true },
  { id: 'B', label: 'No Water', conditions: 'Dry cotton', willGerminate: false },
  { id: 'C', label: 'No Air', conditions: 'Submerged in boiled water + oil', willGerminate: false },
  { id: 'D', label: 'Low Temp', conditions: 'Moist cotton in fridge (4°C)', willGerminate: false },
];
const SeedGerminationLab: React.FC = () => {
  const [day, setDay] = useState(0);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Seed Germination — Conditions</h3>
      <div className="flex-1 grid grid-cols-2 gap-4 items-center">
        {setups.map(s => {
          const germinated = s.willGerminate && day >= 2;
          const rootLen = germinated ? Math.min((day - 2) * 8, 25) : 0;
          const shootLen = germinated && day >= 3 ? Math.min((day - 3) * 6, 20) : 0;
          return (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <svg viewBox="0 0 100 120" className="w-24">
                {/* Pot */}
                <rect x="20" y="70" width="60" height="35" rx="5" fill="#92400e30" stroke="#92400e" strokeWidth="1.5" />
                {/* Soil / cotton */}
                <rect x="22" y="72" width="56" height="10" rx="3" fill={s.id === 'C' ? '#38bdf830' : '#a3764960'} />
                {/* Seed */}
                <ellipse cx="50" cy="78" rx="6" ry="4" fill="#d4a373" />
                {/* Root */}
                {rootLen > 0 && <line x1="50" y1="82" x2="50" y2={82 + rootLen} stroke="#a3e635" strokeWidth="2" />}
                {/* Shoot */}
                {shootLen > 0 && <>
                  <line x1="50" y1="74" x2="50" y2={74 - shootLen} stroke="#22c55e" strokeWidth="2.5" />
                  {day >= 4 && <ellipse cx="50" cy={74 - shootLen - 5} rx="8" ry="4" fill="#22c55e80" />}
                  {day >= 5 && <ellipse cx="50" cy={74 - shootLen - 8} rx="6" ry="3" fill="#22c55e60" />}
                </>}
                <text x="50" y="115" textAnchor="middle" fill="#94a3b8" fontSize="8">{s.id}: {s.label}</text>
              </svg>
              <div className={`text-xs text-center px-2 py-1 rounded-lg ${germinated ? 'bg-emerald-500/20 text-emerald-400' : day > 3 ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-slate-500'}`}>
                {germinated ? '✅ Germinated' : day > 3 ? '❌ No germination' : 'Waiting...'}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400">Day:</label>
        <input type="range" min={0} max={7} value={day} onChange={e => setDay(Number(e.target.value))} className="flex-1 h-2 accent-lime-500" />
        <span className="text-sm font-mono text-white">Day {day}</span>
      </div>
      <div className="text-xs text-slate-500 text-center">Only Setup A (water + air + warmth) germinates — all three conditions are essential.</div>
    </div>
  );
};
export default SeedGerminationLab;
