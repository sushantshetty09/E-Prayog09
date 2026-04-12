import React, { useState } from 'react';
const MAX = 8;
const QueueLab: React.FC = () => {
  const [queue, setQueue] = useState<number[]>([]);
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState('');
  const enqueue = () => {
    const v = parseInt(input); if (isNaN(v)) { setMsg('Enter a number!'); return; }
    if (queue.length >= MAX) { setMsg('⚠️ Queue Full!'); return; }
    setQueue([...queue, v]); setInput(''); setMsg(`Enqueued ${v}`);
  };
  const dequeue = () => {
    if (queue.length === 0) { setMsg('⚠️ Queue Empty!'); return; }
    const v = queue[0]; setQueue(queue.slice(1)); setMsg(`Dequeued ${v}`);
  };
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Queue — FIFO (Enqueue / Dequeue)</h3>
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 rotate-90">FRONT →</span>
          <div className="flex gap-1">
            {Array.from({ length: MAX }).map((_, i) => {
              const val = queue[i];
              return (
                <div key={i} className={`w-12 h-14 flex items-center justify-center rounded-lg border-2 text-sm font-mono font-bold transition-all
                  ${val !== undefined ? (i === 0 ? 'bg-amber-500/20 border-amber-500 text-amber-400' : i === queue.length - 1 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-indigo-500/15 border-indigo-500/30 text-white') : 'bg-white/5 border-white/5 text-slate-700'}`}>
                  {val !== undefined ? val : '—'}
                </div>
              );
            })}
          </div>
          <span className="text-xs text-slate-500 rotate-90">← REAR</span>
        </div>
      </div>
      <div className="flex gap-2 justify-center items-center">
        <input type="number" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && enqueue()} placeholder="Value" className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none" />
        <button onClick={enqueue} className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Enqueue</button>
        <button onClick={dequeue} className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30">Dequeue</button>
      </div>
      {msg && <div className="text-center text-sm text-slate-300 bg-white/5 rounded-xl p-2">{msg}</div>}
      <div className="flex justify-between text-xs text-slate-500 px-4">
        <span>Front: {queue.length > 0 ? queue[0] : '—'}</span>
        <span>Size: {queue.length}/{MAX}</span>
        <span>Rear: {queue.length > 0 ? queue[queue.length - 1] : '—'}</span>
      </div>
    </div>
  );
};
export default QueueLab;
