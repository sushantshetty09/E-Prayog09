import React, { useState } from 'react';
type Gate = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR';
const evaluate = (gate: Gate, a: boolean, b: boolean): boolean => {
  switch (gate) {
    case 'AND': return a && b; case 'OR': return a || b; case 'NOT': return !a;
    case 'NAND': return !(a && b); case 'NOR': return !(a || b); case 'XOR': return a !== b;
  }
};
const LogicGatesLab: React.FC = () => {
  const [gate, setGate] = useState<Gate>('AND');
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const out = evaluate(gate, a, b);
  const isUnary = gate === 'NOT';
  const truthTable = isUnary
    ? [[false, evaluate(gate, false, false)], [true, evaluate(gate, true, false)]]
    : [[false, false, evaluate(gate, false, false)], [false, true, evaluate(gate, false, true)], [true, false, evaluate(gate, true, false)], [true, true, evaluate(gate, true, true)]];
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Logic Gates Simulator</h3>
      <div className="flex gap-2 justify-center flex-wrap">
        {(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'] as Gate[]).map(g => (
          <button key={g} onClick={() => setGate(g)} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${gate === g ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'text-slate-500 border-white/10'}`}>{g}</button>
        ))}
      </div>
      <div className="flex-1 flex items-center justify-center">
        <svg viewBox="0 0 300 160" className="w-full max-w-md">
          {/* Input A */}
          <circle cx="40" cy={isUnary ? "80" : "50"} r="15" fill={a ? '#10b981' : '#334155'} stroke={a ? '#059669' : '#475569'} strokeWidth="2" onClick={() => setA(!a)} className="cursor-pointer" />
          <text x="40" y={isUnary ? "85" : "55"} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{a ? '1' : '0'}</text>
          <text x="40" y={isUnary ? "105" : "30"} textAnchor="middle" fill="#94a3b8" fontSize="10">A</text>
          {/* Input B */}
          {!isUnary && <>
            <circle cx="40" cy="110" r="15" fill={b ? '#10b981' : '#334155'} stroke={b ? '#059669' : '#475569'} strokeWidth="2" onClick={() => setB(!b)} className="cursor-pointer" />
            <text x="40" y="115" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{b ? '1' : '0'}</text>
            <text x="40" y="135" textAnchor="middle" fill="#94a3b8" fontSize="10">B</text>
          </>}
          {/* Wires */}
          <line x1="55" y1={isUnary ? "80" : "50"} x2="110" y2={isUnary ? "80" : "65"} stroke="#94a3b8" strokeWidth="2" />
          {!isUnary && <line x1="55" y1="110" x2="110" y2="95" stroke="#94a3b8" strokeWidth="2" />}
          {/* Gate body */}
          <rect x="110" y="55" width="80" height="50" rx="10" fill="#1e293b" stroke="#6366f1" strokeWidth="2" />
          <text x="150" y="85" textAnchor="middle" fill="#a5b4fc" fontSize="14" fontWeight="bold">{gate}</text>
          {/* Output wire */}
          <line x1="190" y1="80" x2="230" y2="80" stroke="#94a3b8" strokeWidth="2" />
          {/* Output */}
          <circle cx="250" cy="80" r="18" fill={out ? '#10b981' : '#334155'} stroke={out ? '#059669' : '#475569'} strokeWidth="2" />
          <text x="250" y="85" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{out ? '1' : '0'}</text>
          <text x="250" y="110" textAnchor="middle" fill="#94a3b8" fontSize="10">Output</text>
        </svg>
      </div>
      <div className="text-center text-xs text-slate-500">Click inputs A/B to toggle (0/1)</div>
      {/* Truth Table */}
      <div className="overflow-x-auto">
        <table className="mx-auto text-sm text-center">
          <thead><tr className="text-slate-500">{!isUnary && <th className="px-4 py-1">A</th>}{isUnary ? <th className="px-4 py-1">A</th> : <th className="px-4 py-1">B</th>}<th className="px-4 py-1">Out</th></tr></thead>
          <tbody>
            {truthTable.map((row, i) => (
              <tr key={i} className="border-t border-white/5">
                {(row as boolean[]).map((v, j) => (
                  <td key={j} className={`px-4 py-1 font-mono ${j === row.length - 1 ? (v ? 'text-emerald-400 font-bold' : 'text-slate-500') : 'text-white'}`}>{v ? '1' : '0'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default LogicGatesLab;
