import React, { useState } from 'react';
function C(n: number, r: number): number { if (r === 0 || r === n) return 1; return C(n - 1, r - 1) + C(n - 1, r); }
const BinomialTheoremLab: React.FC = () => {
  const [n, setN] = useState(5);
  const [highlight, setHighlight] = useState(-1);
  const rows: number[][] = [];
  for (let i = 0; i <= n; i++) { const row: number[] = []; for (let j = 0; j <= i; j++) row.push(C(i, j)); rows.push(row); }
  const rowSum = rows[n]?.reduce((a, b) => a + b, 0) || 0;
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Binomial Theorem — Pascal's Triangle</h3>
      <div className="flex-1 flex flex-col items-center justify-center gap-1 overflow-y-auto">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-1 justify-center">
            {row.map((val, j) => (
              <div key={j} onClick={() => setHighlight(highlight === j + i * 100 ? -1 : j + i * 100)}
                className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-xs font-mono font-bold cursor-pointer transition-all
                  ${i === n ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : val % 2 === 0 ? 'bg-white/5 text-slate-400' : 'bg-indigo-500/10 text-indigo-400'}
                  hover:bg-white/10 hover:scale-105`}>
                {val}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400">n:</label>
        <input type="range" min={1} max={10} value={n} onChange={e => setN(Number(e.target.value))} className="flex-1 h-2 accent-amber-500" />
        <span className="text-sm font-mono text-white">n = {n}</span>
      </div>
      <div className="bg-white/5 rounded-xl p-3 text-sm text-center">
        <span className="text-slate-400">Row {n} sum = </span><span className="text-amber-400 font-bold font-mono">{rowSum}</span>
        <span className="text-slate-400"> = 2</span><sup className="text-slate-400">{n}</sup>
        <span className="text-slate-600 mx-4">|</span>
        <span className="text-slate-400">(a+b)</span><sup className="text-slate-400">{n}</sup>
        <span className="text-slate-400"> = </span>
        <span className="text-indigo-400 font-mono text-xs">{rows[n].map((c, i) => `${c}a${n - i > 1 ? `^${n - i}` : n - i === 1 ? '' : ''}b${i > 1 ? `^${i}` : i === 1 ? '' : ''}`).join(' + ').replace(/a0/g, '').replace(/b0/g, '').replace(/a1/g, 'a').replace(/b1/g, 'b').replace(/a\^/g, 'a^').replace(/b\^/g, 'b^')}</span>
      </div>
    </div>
  );
};
export default BinomialTheoremLab;
