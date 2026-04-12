import React, { useState } from 'react';
const MatrixLab: React.FC = () => {
  const [a, setA] = useState([[1, 2], [3, 4]]);
  const [b, setB] = useState([[5, 6], [7, 8]]);
  const [op, setOp] = useState<'add' | 'mul' | 'det' | 'inv'>('add');
  const add = a.map((row, i) => row.map((v, j) => v + b[i][j]));
  const mul = a.map((row, i) => b[0].map((_, j) => row.reduce((s, v, k) => s + v * b[k][j], 0)));
  const detA = a[0][0] * a[1][1] - a[0][1] * a[1][0];
  const inv = detA !== 0 ? [[a[1][1] / detA, -a[0][1] / detA], [-a[1][0] / detA, a[0][0] / detA]] : null;
  const result = op === 'add' ? add : op === 'mul' ? mul : op === 'det' ? [[detA]] : inv;
  const Cell = ({ val, onChange }: { val: number; onChange: (v: number) => void }) => (
    <input type="number" value={val} onChange={e => onChange(Number(e.target.value))} className="w-14 h-10 text-center bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-500/50" />
  );
  const MatrixDisplay = ({ m, label, color }: { m: number[][]; label: string; color: string }) => (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-xs font-bold ${color}`}>{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-2xl text-slate-600 font-light">[</span>
        <div className="flex flex-col gap-1">{m.map((row, i) => (
          <div key={i} className="flex gap-1">{row.map((v, j) => (
            <div key={j} className="w-14 h-8 flex items-center justify-center bg-white/5 rounded text-sm font-mono text-white">{typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(2)) : v}</div>
          ))}</div>
        ))}</div>
        <span className="text-2xl text-slate-600 font-light">]</span>
      </div>
    </div>
  );
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Matrix Operations</h3>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="flex gap-6 items-center flex-wrap justify-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold text-sky-400">Matrix A</span>
            <div className="flex flex-col gap-1">{a.map((row, i) => (
              <div key={i} className="flex gap-1">{row.map((v, j) => (
                <Cell key={j} val={v} onChange={nv => { const na = a.map(r => [...r]); na[i][j] = nv; setA(na); }} />
              ))}</div>
            ))}</div>
          </div>
          {(op === 'add' || op === 'mul') && (
            <>
              <span className="text-2xl text-slate-400 font-bold">{op === 'add' ? '+' : '×'}</span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-emerald-400">Matrix B</span>
                <div className="flex flex-col gap-1">{b.map((row, i) => (
                  <div key={i} className="flex gap-1">{row.map((v, j) => (
                    <Cell key={j} val={v} onChange={nv => { const nb = b.map(r => [...r]); nb[i][j] = nv; setB(nb); }} />
                  ))}</div>
                ))}</div>
              </div>
            </>
          )}
          <span className="text-2xl text-slate-400 font-bold">=</span>
          {result ? <MatrixDisplay m={result} label={op === 'det' ? '|A|' : op === 'inv' ? 'A⁻¹' : 'Result'} color="text-amber-400" /> : <span className="text-red-400 font-bold">|A| = 0 (No inverse)</span>}
        </div>
      </div>
      <div className="flex gap-2 justify-center">
        {(['add', 'mul', 'det', 'inv'] as const).map(o => (
          <button key={o} onClick={() => setOp(o)} className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${op === o ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'text-slate-500 border-white/10 hover:text-white'}`}>
            {o === 'add' ? 'A + B' : o === 'mul' ? 'A × B' : o === 'det' ? '|A|' : 'A⁻¹'}
          </button>
        ))}
      </div>
    </div>
  );
};
export default MatrixLab;
