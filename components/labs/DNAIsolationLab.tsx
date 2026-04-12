import React, { useState } from 'react';
const steps = [
  { title: '1. Mash Plant Tissue', desc: 'Mash banana with extraction buffer (water + salt + detergent).', icon: '🍌', color: '#fbbf24' },
  { title: '2. Incubate at 60°C', desc: 'Warm for 15 min — detergent lyses cell membranes.', icon: '🔥', color: '#ef4444' },
  { title: '3. Filter', desc: 'Strain through cheesecloth to remove debris.', icon: '🧹', color: '#94a3b8' },
  { title: '4. Add Cold Ethanol', desc: 'Gently layer ice-cold ethanol on top of filtrate.', icon: '🧊', color: '#38bdf8' },
  { title: '5. Observe DNA!', desc: 'White, stringy DNA precipitates at the interface.', icon: '🧬', color: '#10b981' },
];
const DNAIsolationLab: React.FC = () => {
  const [step, setStep] = useState(0);
  const s = steps[step];
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">DNA Isolation from Plant Tissue</h3>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="text-6xl">{s.icon}</div>
        <svg viewBox="0 0 200 200" className="w-40">
          <rect x="60" y="30" width="80" height="140" rx="15" fill="none" stroke="#94a3b8" strokeWidth="2" />
          {step < 3 && <rect x="62" y="90" width="76" height="78" rx="13" fill={s.color + '30'} />}
          {step >= 3 && <>
            <rect x="62" y="90" width="76" height="78" rx="13" fill="#fbbf2420" />
            <rect x="62" y="50" width="76" height="40" rx="5" fill="#38bdf830" />
          </>}
          {step === 4 && <>
            <line x1="80" y1="85" x2="90" y2="70" stroke="#e2e8f0" strokeWidth="2" />
            <line x1="100" y1="88" x2="105" y2="72" stroke="#e2e8f0" strokeWidth="1.5" />
            <line x1="120" y1="86" x2="115" y2="68" stroke="#e2e8f0" strokeWidth="2" />
            <text x="100" y="65" textAnchor="middle" fill="#10b981" fontSize="8" fontWeight="bold">DNA strands!</text>
          </>}
        </svg>
        <div className="text-center">
          <h4 className="text-lg font-bold" style={{ color: s.color }}>{s.title}</h4>
          <p className="text-sm text-slate-400 mt-1">{s.desc}</p>
        </div>
      </div>
      <div className="flex gap-2 justify-center">
        {steps.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${i === step ? 'text-white scale-110' : 'text-slate-500'}`} style={{ background: i === step ? steps[i].color + '40' : 'rgba(255,255,255,0.05)', borderWidth: 2, borderColor: i <= step ? steps[i].color : 'transparent' }}>
            {i + 1}
          </button>
        ))}
      </div>
      <div className="flex justify-between">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 rounded-xl text-sm bg-white/5 text-slate-400 disabled:opacity-30">← Previous</button>
        <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1} className="px-4 py-2 rounded-xl text-sm bg-emerald-500/20 text-emerald-400 disabled:opacity-30">Next →</button>
      </div>
    </div>
  );
};
export default DNAIsolationLab;
