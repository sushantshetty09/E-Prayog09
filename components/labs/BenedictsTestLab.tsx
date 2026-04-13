import React, { useState } from 'react';
const samples = [
  { name: 'Glucose', reducing: true, color: '#ef4444', result: 'Brick Red' },
  { name: 'Fructose', reducing: true, color: '#f97316', result: 'Orange' },
  { name: 'Sucrose', reducing: false, color: '#3b82f6', result: 'Blue (−)' },
  { name: 'Maltose', reducing: true, color: '#eab308', result: 'Yellow-Green' },
  { name: 'Milk (lactose)', reducing: true, color: '#22c55e', result: 'Green' },
  { name: 'Water (control)', reducing: false, color: '#3b82f6', result: 'Blue (−)' },
];
const BenedictsTestLab: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [heated, setHeated] = useState(false);
  const s = samples[idx];
  const tubeColor = heated ? (s.reducing ? s.color : '#3b82f6') : '#3b82f6';
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Benedict's Test for Reducing Sugars</h3>
      <div className="flex-1 flex items-center justify-center gap-8">
        <svg viewBox="0 0 120 220" className="w-28">
          <rect x="35" y="30" width="50" height="140" rx="20" fill={tubeColor + '30'} stroke="#94a3b8" strokeWidth="2" style={{ transition: 'fill 0.8s ease' }} />
          <rect x="37" y={heated ? 70 : 100} width="46" height={heated ? 98 : 68} rx="18" fill={tubeColor + '70'} style={{ transition: 'all 0.8s ease' }} />
          {heated && s.reducing && <text x="60" y="60" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">Precipitate ↓</text>}
          <text x="60" y="195" textAnchor="middle" fill="#94a3b8" fontSize="9">{s.name}</text>
        </svg>
        <div className="flex flex-col gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: heated ? tubeColor : '#3b82f6' }}>{heated ? s.result : "Benedict's (Blue)"}</div>
            <div className="text-sm text-slate-400 mt-2">{heated ? (s.reducing ? '✅ Reducing sugar PRESENT' : '❌ Reducing sugar ABSENT') : 'Heat to observe result'}</div>
          </div>
        </div>
      </div>
      <button onClick={() => setHeated(!heated)} className={`mx-auto px-6 py-3 rounded-xl font-bold text-sm ${heated ? 'bg-slate-500/20 text-slate-400' : 'bg-red-500/20 text-red-400'} border border-white/10`}>
        {heated ? '↩ Reset' : '🔥 Heat in Water Bath (3 min)'}
      </button>
      <div className="flex flex-wrap gap-2 justify-center">
        {samples.map((sa, i) => (
          <button key={i} onClick={() => { setIdx(i); setHeated(false); }} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${i === idx ? 'bg-white/10 text-white border-white/30' : 'text-slate-500 border-white/10'}`}>
            {sa.name}
          </button>
        ))}
      </div>
    </div>
  );
};
export default BenedictsTestLab;
