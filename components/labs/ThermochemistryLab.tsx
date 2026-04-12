import React, { useState } from 'react';
const ThermochemistryLab: React.FC = () => {
  const [mixed, setMixed] = useState(false);
  const T_acid = 25, T_base = 25;
  const dT = 7.8;
  const T_final = mixed ? T_acid + dT : T_acid;
  const m = 100; const c = 4.18;
  const Q = m * c * dT;
  const enthalpy = -(Q / 1000).toFixed(2);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Enthalpy of Neutralisation</h3>
      <div className="flex-1 flex items-center justify-center gap-8">
        <svg viewBox="0 0 120 180" className="w-28">
          <rect x="30" y="30" width="60" height="120" rx="15" fill={mixed ? '#ef444430' : '#3b82f630'} stroke="#94a3b8" strokeWidth="2" />
          <rect x="32" y={mixed ? 50 : 80} width="56" height={mixed ? 98 : 68} rx="13" fill={mixed ? '#ef444460' : '#3b82f660'} />
          <text x="60" y="170" textAnchor="middle" fill="#94a3b8" fontSize="10">{mixed ? 'Mixed' : 'HCl (1M)'}</text>
          {/* Thermometer */}
          <rect x="55" y="10" width="10" height="80" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          <rect x="57" y={90 - (T_final - 20) * 3} width="6" height={(T_final - 20) * 3} rx="3" fill="#ef4444" />
          <text x="80" y="30" fill="#ef4444" fontSize="11" fontWeight="bold">{T_final.toFixed(1)}°C</text>
        </svg>
        {!mixed && (
          <svg viewBox="0 0 120 180" className="w-28">
            <rect x="30" y="30" width="60" height="120" rx="15" fill="#22c55e30" stroke="#94a3b8" strokeWidth="2" />
            <rect x="32" y="80" width="56" height="68" rx="13" fill="#22c55e60" />
            <text x="60" y="170" textAnchor="middle" fill="#94a3b8" fontSize="10">NaOH (1M)</text>
          </svg>
        )}
      </div>
      <button onClick={() => setMixed(!mixed)} className={`mx-auto px-6 py-3 rounded-xl font-bold text-sm transition-all ${mixed ? 'bg-slate-500/20 text-slate-400' : 'bg-emerald-500/20 text-emerald-400'} border border-white/10`}>
        {mixed ? '↩ Reset' : '🧪 Mix Solutions'}
      </button>
      {mixed && (
        <div className="grid grid-cols-3 gap-3 text-center animate-in fade-in">
          <div className="bg-white/5 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">ΔT</div><div className="font-bold text-amber-400 font-mono">{dT}°C</div></div>
          <div className="bg-white/5 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">Q</div><div className="font-bold text-sky-400 font-mono">{Q.toFixed(0)} J</div></div>
          <div className="bg-white/5 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">ΔH</div><div className="font-bold text-emerald-400 font-mono">{enthalpy} kJ/mol</div></div>
        </div>
      )}
    </div>
  );
};
export default ThermochemistryLab;
