import React, { useState } from 'react';
const anionTests=[
  {anion:'CO₃²⁻',reagent:'Dilute HCl',obs:'Brisk effervescence, CO₂ turns lime water milky',color:'#94a3b8'},
  {anion:'SO₄²⁻',reagent:'BaCl₂ + dil HCl',obs:'White precipitate (BaSO₄), insoluble in HCl',color:'#e2e8f0'},
  {anion:'Cl⁻',reagent:'AgNO₃ + dil HNO₃',obs:'White curdy precipitate (AgCl), soluble in NH₃',color:'#f1f5f9'},
  {anion:'S²⁻',reagent:'Dilute HCl',obs:'Rotten egg smell (H₂S), blackens lead acetate paper',color:'#fbbf24'},
  {anion:'NO₃⁻',reagent:'Conc H₂SO₄ + Cu',obs:'Brown ring at junction (FeSO₄ ring test)',color:'#92400e'},
  {anion:'CH₃COO⁻',reagent:'Conc H₂SO₄',obs:'Vinegar-like smell of acetic acid',color:'#a3e635'},
];
const AnionAnalysisLab: React.FC = () => {
  const [idx,setIdx]=useState(0);
  const t=anionTests[idx];
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Anion Analysis — Preliminary Tests</h3>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <svg viewBox="0 0 200 200" className="w-40">
          <rect x="70" y="20" width="60" height="130" rx="20" fill={t.color+'20'} stroke="#94a3b8" strokeWidth="2" />
          <rect x="72" y="80" width="56" height="68" rx="18" fill={t.color+'50'} />
          {idx===0 && <>
            <circle cx="90" cy="90" r="3" fill="#94a3b8" opacity="0.6"><animate attributeName="cy" values="90;70;50" dur="1.5s" repeatCount="indefinite" /></circle>
            <circle cx="100" cy="95" r="2" fill="#94a3b8" opacity="0.5"><animate attributeName="cy" values="95;75;55" dur="1.8s" repeatCount="indefinite" /></circle>
            <circle cx="110" cy="92" r="2.5" fill="#94a3b8" opacity="0.5"><animate attributeName="cy" values="92;72;52" dur="1.3s" repeatCount="indefinite" /></circle>
          </>}
          <text x="100" y="170" textAnchor="middle" fill="#94a3b8" fontSize="10">Test tube</text>
        </svg>
        <div className="text-center max-w-sm">
          <div className="text-xl font-bold text-white">{t.anion}</div>
          <div className="text-sm text-slate-400 mt-1">Reagent: <span className="text-sky-400">{t.reagent}</span></div>
          <div className="text-sm text-emerald-400 mt-2 font-medium">{t.obs}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {anionTests.map((x,i)=>(
          <button key={i} onClick={()=>setIdx(i)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${i===idx?'bg-white/10 text-white border-white/30':'text-slate-500 border-white/10 hover:text-white'}`}>
            {x.anion}
          </button>
        ))}
      </div>
    </div>
  );
};
export default AnionAnalysisLab;
