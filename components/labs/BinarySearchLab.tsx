import React, { useState } from 'react';
const BinarySearchLab: React.FC = () => {
  const [arr] = useState([3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51]);
  const [target, setTarget] = useState(27);
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(arr.length - 1);
  const [mid, setMid] = useState(-1);
  const [found, setFound] = useState(false);
  const [done, setDone] = useState(false);
  const [steps, setSteps] = useState(0);
  const reset = () => { setLo(0); setHi(arr.length - 1); setMid(-1); setFound(false); setDone(false); setSteps(0); };
  const step = () => {
    if (done || lo > hi) { setDone(true); return; }
    const m = Math.floor((lo + hi) / 2); setMid(m); setSteps(s => s + 1);
    if (arr[m] === target) { setFound(true); setDone(true); }
    else if (arr[m] < target) { setLo(m + 1); }
    else { setHi(m - 1); }
  };
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Binary Search Visualiser</h3>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="flex gap-1">
          {arr.map((v, i) => (
            <div key={i} className={`w-10 h-12 flex items-center justify-center rounded-lg text-sm font-mono font-bold border-2 transition-all
              ${i === mid ? 'bg-amber-500/30 border-amber-500 text-amber-400 scale-110' : found && i === mid ? 'bg-emerald-500/30 border-emerald-500 text-emerald-400' : i >= lo && i <= hi ? 'bg-indigo-500/15 border-indigo-500/30 text-white' : 'bg-white/5 border-white/5 text-slate-600'}`}>
              {v}
            </div>
          ))}
        </div>
        <div className="flex gap-4 text-xs text-slate-400">
          <span>lo: <span className="text-sky-400 font-bold">{lo}</span></span>
          <span>hi: <span className="text-sky-400 font-bold">{hi}</span></span>
          <span>mid: <span className="text-amber-400 font-bold">{mid >= 0 ? mid : '—'}</span></span>
          <span>Steps: <span className="text-white font-bold">{steps}</span></span>
        </div>
        {done && <div className={`text-lg font-bold ${found ? 'text-emerald-400' : 'text-red-400'}`}>{found ? `✅ Found ${target} at index ${mid}!` : `❌ ${target} not found.`}</div>}
      </div>
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400">Target:</label>
        <input type="number" value={target} onChange={e => { setTarget(Number(e.target.value)); reset(); }} className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none" />
        <button onClick={step} disabled={done} className="px-4 py-2 rounded-xl text-sm font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 disabled:opacity-30">▶ Step</button>
        <button onClick={reset} className="px-4 py-2 rounded-xl text-sm font-bold bg-white/5 text-slate-300 border border-white/10">↩ Reset</button>
      </div>
    </div>
  );
};
export default BinarySearchLab;
