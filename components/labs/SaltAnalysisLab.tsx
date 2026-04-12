import React, { useState } from 'react';
const tests=[
  {name:'Flame Test',cation:'Na⁺',obs:'Golden yellow flame',color:'#fbbf24'},
  {name:'Flame Test',cation:'K⁺',obs:'Violet/Lilac flame',color:'#a78bfa'},
  {name:'Flame Test',cation:'Ca²⁺',obs:'Brick red flame',color:'#ef4444'},
  {name:'Flame Test',cation:'Cu²⁺',obs:'Green/Blue-green flame',color:'#10b981'},
  {name:'Flame Test',cation:'Ba²⁺',obs:'Apple green flame',color:'#84cc16'},
  {name:'Flame Test',cation:'Sr²⁺',obs:'Crimson flame',color:'#dc2626'},
  {name:'NaOH test',cation:'Fe³⁺',obs:'Reddish-brown precipitate',color:'#92400e'},
  {name:'NaOH test',cation:'Cu²⁺',obs:'Blue precipitate',color:'#3b82f6'},
];
const SaltAnalysisLab: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const t = tests[idx];
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Salt Analysis — Qualitative</h3>
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <svg viewBox="0 0 200 200" className="w-48">
            {/* Bunsen burner */}
            <rect x="85" y="150" width="30" height="40" rx="5" fill="#475569" />
            <ellipse cx="100" cy="150" rx="15" ry="5" fill="#64748b" />
            {/* Flame */}
            <ellipse cx="100" cy="110" rx="18" ry="40" fill={t.color+'60'} />
            <ellipse cx="100" cy="115" rx="10" ry="25" fill={t.color+'90'} />
            <ellipse cx="100" cy="120" rx="5" ry="15" fill={t.color} />
            {/* Wire loop */}
            <line x1="160" y1="40" x2="110" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="110" cy="120" r="5" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          </svg>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color:t.color}}>{t.obs}</div>
            <div className="text-sm text-slate-400 mt-2">Test: {t.name} | Cation: <span className="text-white font-bold">{t.cation}</span></div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {tests.map((x,i)=>(
          <button key={i} onClick={()=>setIdx(i)} className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${i===idx?'scale-105':''}`} style={{borderColor:x.color,color:i===idx?'white':x.color,background:i===idx?x.color+'40':'transparent'}}>
            {x.cation}
          </button>
        ))}
      </div>
    </div>
  );
};
export default SaltAnalysisLab;
