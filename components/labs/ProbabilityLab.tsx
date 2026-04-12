import React, { useState } from 'react';
const ProbabilityLab: React.FC = () => {
  const [mode, setMode] = useState<'coin' | 'dice'>('coin');
  const [results, setResults] = useState<number[]>([]);
  const [total, setTotal] = useState(0);
  const flip = (n: number) => {
    const r: number[] = []; for (let i = 0; i < n; i++) r.push(Math.random() < 0.5 ? 0 : 1);
    setResults(prev => [...prev, ...r]); setTotal(prev => prev + n);
  };
  const roll = (n: number) => {
    const r: number[] = []; for (let i = 0; i < n; i++) r.push(Math.floor(Math.random() * 6) + 1);
    setResults(prev => [...prev, ...r]); setTotal(prev => prev + n);
  };
  const reset = () => { setResults([]); setTotal(0); };
  const heads = results.filter(r => r === 1).length;
  const tails = results.filter(r => r === 0).length;
  const diceFreq = [0, 0, 0, 0, 0, 0];
  if (mode === 'dice') results.forEach(r => { if (r >= 1 && r <= 6) diceFreq[r - 1]++; });
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Probability — {mode === 'coin' ? 'Coin Toss' : 'Dice Roll'}</h3>
      <div className="flex gap-2 justify-center">
        <button onClick={() => { setMode('coin'); reset(); }} className={`px-4 py-2 rounded-xl text-sm font-bold ${mode === 'coin' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500'} border border-white/10`}>🪙 Coin</button>
        <button onClick={() => { setMode('dice'); reset(); }} className={`px-4 py-2 rounded-xl text-sm font-bold ${mode === 'dice' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500'} border border-white/10`}>🎲 Dice</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {mode === 'coin' ? (
          <div className="text-center">
            <div className="text-5xl mb-4">{total === 0 ? '🪙' : results[results.length - 1] === 1 ? '🟡 H' : '⚪ T'}</div>
            <div className="grid grid-cols-2 gap-4 w-64">
              <div className="bg-amber-500/10 rounded-xl p-3"><div className="text-xs text-slate-500">Heads</div><div className="text-2xl font-bold text-amber-400">{heads}</div><div className="text-xs text-slate-500">P(H) = {total > 0 ? (heads / total).toFixed(4) : '—'}</div></div>
              <div className="bg-slate-500/10 rounded-xl p-3"><div className="text-xs text-slate-500">Tails</div><div className="text-2xl font-bold text-slate-300">{tails}</div><div className="text-xs text-slate-500">P(T) = {total > 0 ? (tails / total).toFixed(4) : '—'}</div></div>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            {diceFreq.map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-12 bg-indigo-500/30 rounded-lg relative" style={{ height: `${Math.max(8, (f / Math.max(1, total)) * 200)}px` }}>
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-mono text-white">{f}</span>
                </div>
                <span className="text-lg">{['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][i]}</span>
                <span className="text-[9px] text-slate-500">{total > 0 ? (f / total * 100).toFixed(1) : 0}%</span>
              </div>
            ))}
          </div>
        )}
        <div className="text-sm text-slate-400">Total trials: <span className="text-white font-bold">{total}</span></div>
      </div>
      <div className="flex gap-2 justify-center">
        {[1, 10, 100, 1000].map(n => (
          <button key={n} onClick={() => mode === 'coin' ? flip(n) : roll(n)} className="px-4 py-2 rounded-xl text-sm font-bold bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all">
            {mode === 'coin' ? 'Flip' : 'Roll'} ×{n}
          </button>
        ))}
        <button onClick={reset} className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/20">Reset</button>
      </div>
    </div>
  );
};
export default ProbabilityLab;
