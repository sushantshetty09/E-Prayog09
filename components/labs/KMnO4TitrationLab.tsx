import React, { useState } from 'react';
const KMnO4TitrationLab: React.FC = () => {
  const [vol, setVol] = useState(0);
  const endpoint = 18.2;
  const atEnd = Math.abs(vol - endpoint) < 0.5;
  const past = vol > endpoint + 0.5;
  const color = past ? '#c026d3' : atEnd ? '#f0abfc' : vol > 5 ? `rgba(192,38,211,${vol * 0.015})` : 'transparent';
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">KMnO₄ Titration (Redox)</h3>
      <div className="flex-1 flex items-center justify-center">
        <svg viewBox="0 0 300 350" className="w-full max-w-xs">
          <rect x="125" y="20" width="50" height="140" rx="5" fill="none" stroke="#94a3b8" strokeWidth="2" />
          <rect x="127" y={22 + (vol / 40) * 136} width="46" height={138 - (vol / 40) * 136} rx="3" fill="#c026d380" />
          <text x="150" y="15" textAnchor="middle" fill="#94a3b8" fontSize="10">Burette (KMnO₄)</text>
          <path d="M 100 320 L 130 240 L 170 240 L 200 320 Z" fill={color} stroke="#94a3b8" strokeWidth="2" />
          <rect x="128" y="225" width="44" height="15" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="150" y1="160" x2="150" y2="225" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3" />
          <text x="150" y="340" textAnchor="middle" fill={atEnd ? '#10b981' : past ? '#ef4444' : '#94a3b8'} fontSize="12" fontWeight="bold">
            {atEnd ? '🟢 Permanent pink! Endpoint!' : past ? '🔴 Over-titrated!' : `Volume: ${vol.toFixed(1)} mL`}
          </text>
        </svg>
      </div>
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400">Add KMnO₄:</label>
        <input type="range" min={0} max={35} step={0.2} value={vol} onChange={e => setVol(Number(e.target.value))} className="flex-1 h-2 accent-pink-500" />
        <span className="text-sm font-mono text-white">{vol.toFixed(1)} mL</span>
      </div>
      <div className="text-xs text-slate-500 text-center">Self-indicator: KMnO₄ purple colour disappears until the endpoint</div>
    </div>
  );
};
export default KMnO4TitrationLab;
