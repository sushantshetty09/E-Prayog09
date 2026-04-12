import React, { useState, useRef, useEffect } from 'react';
const InsertionSortLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [arr, setArr] = useState([64, 34, 25, 12, 22, 11, 90, 45]);
  const [sortedIdx, setSortedIdx] = useState(1);
  const [active, setActive] = useState(-1);
  const [done, setDone] = useState(false);
  const [steps, setSteps] = useState(0);
  const generate = () => { setArr(Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10)); setSortedIdx(1); setDone(false); setSteps(0); setActive(-1); };
  const step = () => {
    if (sortedIdx >= arr.length) { setDone(true); return; }
    const a = [...arr]; const key = a[sortedIdx]; let j = sortedIdx - 1;
    while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
    a[j + 1] = key; setArr(a); setActive(j + 1); setSortedIdx(sortedIdx + 1); setSteps(s => s + 1);
  };
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const barW = (W - 40) / arr.length - 4;
    const maxV = Math.max(...arr);
    arr.forEach((v, i) => {
      const x = 20 + i * (barW + 4); const h = (v / maxV) * (H - 80);
      ctx.fillStyle = done ? '#10b981' : i === active ? '#f59e0b' : i < sortedIdx ? '#6366f1' : '#334155';
      ctx.fillRect(x, H - 40 - h, barW, h);
      ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
      ctx.fillText(`${v}`, x + barW / 2, H - 25);
    });
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
    ctx.fillText(`Steps: ${steps} | ${done ? '✅ Sorted!' : `Sorted portion: [0..${sortedIdx - 1}]`}`, W / 2, 20);
  }, [arr, sortedIdx, active, done, steps]);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Insertion Sort Visualiser</h3>
      <canvas ref={canvasRef} width={500} height={280} className="w-full rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex gap-2 justify-center">
        <button onClick={step} disabled={done} className="px-4 py-2 rounded-xl text-sm font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 disabled:opacity-30">▶ Step</button>
        <button onClick={generate} className="px-4 py-2 rounded-xl text-sm font-bold bg-white/5 text-slate-300 border border-white/10">🔄 New Array</button>
      </div>
    </div>
  );
};
export default InsertionSortLab;
