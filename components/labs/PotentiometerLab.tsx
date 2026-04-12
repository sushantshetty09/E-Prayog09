import React, { useState } from 'react';
const PotentiometerLab: React.FC = () => {
  const [l1, setL1] = useState(40);
  const [l2, setL2] = useState(55);
  const ratio = (l1 / l2).toFixed(3);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Potentiometer — EMF Comparison</h3>
      <svg viewBox="0 0 600 250" className="w-full rounded-xl border border-white/10 bg-slate-950 p-4">
        <line x1="50" y1="100" x2="550" y2="100" stroke="#94a3b8" strokeWidth="4" />
        <circle cx={50 + l1 * 5} cy="100" r="7" fill="#f59e0b" stroke="white" strokeWidth="2" />
        <circle cx={50 + l2 * 5} cy="100" r="7" fill="#38bdf8" stroke="white" strokeWidth="2" />
        <text x={50 + l1 * 5} y="85" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">l₁={l1}cm</text>
        <text x={50 + l2 * 5} y="130" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">l₂={l2}cm</text>
        <rect x="220" y="160" width="160" height="40" rx="10" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
        <text x="300" y="185" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="bold">E₁/E₂ = l₁/l₂ = {ratio}</text>
        <text x="50" y="120" fill="#64748b" fontSize="10">0</text>
        <text x="545" y="120" fill="#64748b" fontSize="10" textAnchor="end">100 cm</text>
      </svg>
      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="flex items-center gap-3">
          <label className="text-sm text-amber-400">l₁ (E₁):</label>
          <input type="range" min={10} max={90} value={l1} onChange={e => setL1(Number(e.target.value))} className="flex-1 h-2 accent-amber-500" />
          <span className="font-mono text-white text-sm">{l1}cm</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-sky-400">l₂ (E₂):</label>
          <input type="range" min={10} max={90} value={l2} onChange={e => setL2(Number(e.target.value))} className="flex-1 h-2 accent-sky-500" />
          <span className="font-mono text-white text-sm">{l2}cm</span>
        </div>
      </div>
    </div>
  );
};
export default PotentiometerLab;
