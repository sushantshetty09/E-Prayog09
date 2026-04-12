import React, { useState, useRef, useEffect, useCallback } from 'react';
const BubbleSortLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [arr, setArr] = useState([64, 34, 25, 12, 22, 11, 90, 45]);
  const [comparing, setComparing] = useState<[number, number] | null>(null);
  const [sorted, setSorted] = useState(false);
  const [steps, setSteps] = useState(0);
  const stepRef = useRef<{ arr: number[]; i: number; j: number }>({ arr: [...arr], i: 0, j: 0 });

  const generate = () => {
    const a = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 10);
    setArr(a); stepRef.current = { arr: [...a], i: 0, j: 0 }; setSorted(false); setSteps(0); setComparing(null);
  };

  const step = () => {
    const { arr: a, i, j } = stepRef.current;
    const n = a.length;
    if (i >= n - 1) { setSorted(true); setComparing(null); return; }
    setComparing([j, j + 1]);
    if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; }
    setArr([...a]); setSteps(s => s + 1);
    if (j + 1 >= n - 1 - i) { stepRef.current = { arr: a, i: i + 1, j: 0 }; }
    else { stepRef.current = { arr: a, i, j: j + 1 }; }
  };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const barW = (W - 40) / arr.length - 4;
    const maxV = Math.max(...arr);
    arr.forEach((v, i) => {
      const x = 20 + i * (barW + 4);
      const h = (v / maxV) * (H - 80);
      const isComparing = comparing && (i === comparing[0] || i === comparing[1]);
      ctx.fillStyle = sorted ? '#10b981' : isComparing ? '#f59e0b' : '#3b82f6';
      ctx.fillRect(x, H - 40 - h, barW, h);
      ctx.strokeStyle = sorted ? '#064e3b' : isComparing ? '#92400e' : '#1d4ed8';
      ctx.lineWidth = 1; ctx.strokeRect(x, H - 40 - h, barW, h);
      ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
      ctx.fillText(`${v}`, x + barW / 2, H - 25);
    });
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
    ctx.fillText(`Steps: ${steps} | ${sorted ? '✅ Sorted!' : 'Sorting...'}`, W / 2, 20);
  }, [arr, comparing, sorted, steps]);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Bubble Sort Visualiser</h3>
      <canvas ref={canvasRef} width={500} height={280} className="w-full rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex gap-2 justify-center">
        <button onClick={step} disabled={sorted} className="px-4 py-2 rounded-xl text-sm font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 disabled:opacity-30">▶ Step</button>
        <button onClick={() => { const id = setInterval(() => { stepRef.current.i < arr.length - 1 ? step() : clearInterval(id); }, 200); }} disabled={sorted} className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 disabled:opacity-30">⏩ Auto Sort</button>
        <button onClick={generate} className="px-4 py-2 rounded-xl text-sm font-bold bg-white/5 text-slate-300 border border-white/10">🔄 New Array</button>
      </div>
    </div>
  );
};
export default BubbleSortLab;
