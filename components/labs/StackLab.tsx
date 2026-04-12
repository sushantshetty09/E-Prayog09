import React, { useState } from 'react';
const MAX = 8;
const StackLab: React.FC = () => {
  const [stack, setStack] = useState<number[]>([]);
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState('');
  const push = () => {
    const v = parseInt(input); if (isNaN(v)) { setMsg('Enter a number!'); return; }
    if (stack.length >= MAX) { setMsg('⚠️ Stack Overflow!'); return; }
    setStack([...stack, v]); setInput(''); setMsg(`Pushed ${v}`);
  };
  const pop = () => {
    if (stack.length === 0) { setMsg('⚠️ Stack Underflow!'); return; }
    const v = stack[stack.length - 1]; setStack(stack.slice(0, -1)); setMsg(`Popped ${v}`);
  };
  const peek = () => {
    if (stack.length === 0) { setMsg('Stack is empty!'); return; }
    setMsg(`Top element: ${stack[stack.length - 1]}`);
  };
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Stack — LIFO (Push / Pop / Peek)</h3>
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-slate-500 mb-1">TOP ↓</span>
          {Array.from({ length: MAX }).map((_, i) => {
            const idx = MAX - 1 - i;
            const val = stack[idx];
            return (
              <div key={i} className={`w-28 h-10 flex items-center justify-center rounded-lg border-2 text-sm font-mono font-bold transition-all
                ${val !== undefined ? (idx === stack.length - 1 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-indigo-500/15 border-indigo-500/30 text-white') : 'bg-white/5 border-white/5 text-slate-700'}`}>
                {val !== undefined ? val : '—'}
              </div>
            );
          })}
          <span className="text-xs text-slate-500 mt-1">BOTTOM</span>
        </div>
      </div>
      <div className="flex gap-2 justify-center items-center">
        <input type="number" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && push()} placeholder="Value" className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none" />
        <button onClick={push} className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Push</button>
        <button onClick={pop} className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30">Pop</button>
        <button onClick={peek} className="px-4 py-2 rounded-xl text-sm font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">Peek</button>
      </div>
      {msg && <div className="text-center text-sm text-slate-300 bg-white/5 rounded-xl p-2">{msg}</div>}
      <div className="text-xs text-slate-500 text-center">Size: {stack.length}/{MAX}</div>
    </div>
  );
};
export default StackLab;
