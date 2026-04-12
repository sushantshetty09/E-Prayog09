import React, { useState, useRef, useEffect, useCallback } from 'react';
const OsmosisLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const animRef = useRef(0);
  const riseLevel = Math.min(time * 0.5, 40);
  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, by = H - 60;
    // Petri dish (water)
    ctx.fillStyle = '#38bdf820'; ctx.fillRect(cx - 100, by, 200, 30);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.strokeRect(cx - 100, by, 200, 30);
    ctx.fillStyle = '#38bdf8'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
    ctx.fillText('Distilled Water', cx, by + 45);
    // Potato
    ctx.fillStyle = '#d4a373'; ctx.strokeStyle = '#92400e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(cx - 30, by - 80, 60, 80, [10, 10, 0, 0]); ctx.fill(); ctx.stroke();
    // Cavity with sugar solution
    const cavTop = by - 70;
    const sugarH = 40 + riseLevel;
    ctx.fillStyle = '#a78bfa40'; ctx.fillRect(cx - 15, cavTop + (50 - sugarH), 30, sugarH);
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1;
    ctx.strokeRect(cx - 15, cavTop, 30, 50);
    // Pin marker
    const pinY = cavTop + 10;
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1; ctx.setLineDash([2, 2]);
    ctx.beginPath(); ctx.moveTo(cx - 20, pinY); ctx.lineTo(cx + 20, pinY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444'; ctx.font = '8px Inter'; ctx.textAlign = 'left';
    ctx.fillText('Initial level', cx + 22, pinY + 3);
    // Water arrows
    if (running) {
      ctx.strokeStyle = '#38bdf860'; ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const x = cx - 10 + i * 10;
        ctx.beginPath(); ctx.moveTo(x, by); ctx.lineTo(x, by - 30);
        ctx.lineTo(x - 3, by - 25); ctx.moveTo(x, by - 30); ctx.lineTo(x + 3, by - 25); ctx.stroke();
      }
    }
    // Labels
    ctx.fillStyle = '#a78bfa'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
    ctx.fillText('Sugar solution', cx, cavTop - 5);
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 12px Inter';
    ctx.fillText(`Rise = ${riseLevel.toFixed(1)} units | Time = ${time.toFixed(0)} min`, W / 2, H - 8);
    if (running && riseLevel < 40) {
      setTime(t => t + 0.3);
      animRef.current = requestAnimationFrame(draw);
    }
  }, [time, running, riseLevel]);
  useEffect(() => { draw(); return () => cancelAnimationFrame(animRef.current); }, [draw]);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Osmosis — Potato Osmometer</h3>
        <button onClick={() => { if (!running) setTime(0); setRunning(!running); }} className={`px-4 py-2 rounded-xl text-sm font-bold ${running ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'} border border-white/10`}>
          {running ? '⏸ Pause' : '▶ Start Osmosis'}
        </button>
      </div>
      <canvas ref={canvasRef} width={400} height={330} className="w-full max-w-sm mx-auto rounded-xl border border-white/10 bg-slate-950" />
      <div className="text-sm text-slate-400 text-center bg-white/5 rounded-xl p-3">Water moves from petri dish (high water potential) into sugar cavity (low water potential) through the potato membrane.</div>
    </div>
  );
};
export default OsmosisLab;
