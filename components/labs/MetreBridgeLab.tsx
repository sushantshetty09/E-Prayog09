import React, { useState } from 'react';
const MetreBridgeLab: React.FC = () => {
  const [knownR, setKnownR] = useState(5);
  const [balLen, setBalLen] = useState(40);
  const unknownR = parseFloat((knownR * (100 - balLen) / balLen).toFixed(2));
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Metre Bridge — Wheatstone's Principle</h3>
      <svg viewBox="0 0 600 280" className="w-full rounded-xl border border-white/10 bg-slate-950 p-4">
        {/* Wire */}
        <line x1="50" y1="140" x2="550" y2="140" stroke="#94a3b8" strokeWidth="3" />
        {/* Jockey position */}
        <circle cx={50 + balLen * 5} cy="140" r="6" fill="#10b981" stroke="white" strokeWidth="2" />
        <line x1={50 + balLen * 5} y1="140" x2={50 + balLen * 5} y2="80" stroke="#10b981" strokeWidth="2" />
        {/* Galvanometer */}
        <circle cx="300" cy="50" r="18" fill="none" stroke="#a78bfa" strokeWidth="2" />
        <text x="300" y="55" textAnchor="middle" fill="#a78bfa" fontSize="14" fontWeight="bold">G</text>
        <line x1={50 + balLen * 5} y1="80" x2="282" y2="50" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4" />
        {/* Resistances */}
        <rect x="80" y="180" width="100" height="40" rx="8" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="130" y="205" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">R = {knownR}Ω</text>
        <rect x="400" y="180" width="120" height="40" rx="8" fill="#38bdf820" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="460" y="205" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">S = {unknownR}Ω</text>
        {/* Labels */}
        <text x={50 + balLen * 5} y="170" textAnchor="middle" fill="#94a3b8" fontSize="10">l = {balLen} cm</text>
        <text x="50" y="160" fill="#64748b" fontSize="10">0</text>
        <text x="545" y="160" fill="#64748b" fontSize="10" textAnchor="end">100</text>
        {/* Battery */}
        <text x="300" y="270" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="bold">S = R(100−l)/l = {knownR}×{100-balLen}/{balLen} = {unknownR} Ω</text>
      </svg>
      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-400">Known R:</label>
          <input type="range" min={1} max={20} value={knownR} onChange={e => setKnownR(Number(e.target.value))} className="flex-1 h-2 accent-amber-500" />
          <span className="text-sm font-mono text-white">{knownR}Ω</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-400">Balance pt:</label>
          <input type="range" min={10} max={90} value={balLen} onChange={e => setBalLen(Number(e.target.value))} className="flex-1 h-2 accent-emerald-500" />
          <span className="text-sm font-mono text-white">{balLen} cm</span>
        </div>
      </div>
    </div>
  );
};
export default MetreBridgeLab;
