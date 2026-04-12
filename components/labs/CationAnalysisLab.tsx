import React, { useState } from 'react';
const flames=[
  {ion:'Na⁺',color:'#fbbf24',name:'Sodium',flame:'Golden Yellow'},
  {ion:'K⁺',color:'#a78bfa',name:'Potassium',flame:'Violet/Lilac'},
  {ion:'Ca²⁺',color:'#ef4444',name:'Calcium',flame:'Brick Red'},
  {ion:'Cu²⁺',color:'#10b981',name:'Copper',flame:'Green/Blue-green'},
  {ion:'Ba²⁺',color:'#84cc16',name:'Barium',flame:'Apple Green'},
  {ion:'Sr²⁺',color:'#dc2626',name:'Strontium',flame:'Crimson Red'},
];
const CationAnalysisLab: React.FC = () => {
  const [idx,setIdx]=useState(0);
  const f=flames[idx];
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Cation Analysis — Flame Test</h3>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <svg viewBox="0 0 200 220" className="w-48">
          <rect x="85" y="170" width="30" height="40" rx="5" fill="#475569" />
          <ellipse cx="100" cy="170" rx="20" ry="6" fill="#64748b" />
          <ellipse cx="100" cy="110" rx="22" ry="55" fill={f.color+'50'} />
          <ellipse cx="100" cy="120" rx="14" ry="35" fill={f.color+'88'} />
          <ellipse cx="100" cy="128" rx="8" ry="20" fill={f.color} />
          <line x1="170" y1="30" x2="115" y2="125" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="115" cy="125" r="4" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        </svg>
        <div className="text-center">
          <div className="text-3xl font-bold font-display" style={{color:f.color}}>{f.flame}</div>
          <div className="text-lg text-slate-300 mt-1">{f.name} ({f.ion})</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {flames.map((x,i)=>(
          <button key={i} onClick={()=>setIdx(i)} className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${i===idx?'scale-105 text-white':'text-slate-400'}`} style={{borderColor:x.color,background:i===idx?x.color+'30':'transparent'}}>
            {x.ion} {x.name}
          </button>
        ))}
      </div>
    </div>
  );
};
export default CationAnalysisLab;
