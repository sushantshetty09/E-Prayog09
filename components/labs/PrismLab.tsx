import React, { useState, useRef, useEffect } from 'react';

const PrismLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(45);
  const A = 60; // prism angle
  const n = 1.5;
  const r1 = Math.asin(Math.sin(angle * Math.PI / 180) / n) * 180 / Math.PI;
  const r2 = A - r1;
  const e = Math.asin(n * Math.sin(r2 * Math.PI / 180)) * 180 / Math.PI;
  const deviation = angle + (isNaN(e) ? 0 : e) - A;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2 + 20;
    const s = 140; // side length

    // Prism (equilateral triangle)
    const p1 = { x: cx, y: cy - s * Math.sqrt(3) / 3 };
    const p2 = { x: cx - s / 2, y: cy + s * Math.sqrt(3) / 6 };
    const p3 = { x: cx + s / 2, y: cy + s * Math.sqrt(3) / 6 };

    ctx.fillStyle = 'rgba(96,165,250,0.12)';
    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2; ctx.stroke();

    // Label A
    ctx.fillStyle = '#60a5fa'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
    ctx.fillText(`A = ${A}°`, p1.x, p1.y - 12);

    // Incident ray
    const entryY = (p2.y + p1.y) / 2;
    const entryX = p2.x + (p1.x - p2.x) * (entryY - p2.y) / (p1.y - p2.y);
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, entryY - (entryX - 20) * Math.tan(angle * Math.PI / 180 - Math.PI / 6));
    ctx.lineTo(entryX, entryY);
    ctx.stroke();

    // Dispersed rays (rainbow)
    if (!isNaN(e) && e > 0) {
      const exitY = (p3.y + p1.y) / 2;
      const exitX = p3.x - (p3.x - p1.x) * (p3.y - exitY) / (p3.y - p1.y);
      const colors = ['#ef4444', '#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6'];
      const spread = 0.03;
      colors.forEach((color, i) => {
        const offset = (i - 3) * spread;
        const eAngle = e * Math.PI / 180 + offset + Math.PI / 6;
        ctx.strokeStyle = color; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(exitX, exitY);
        ctx.lineTo(exitX + 160 * Math.cos(eAngle), exitY - 160 * Math.sin(eAngle));
        ctx.stroke();
      });
      // Inside ray
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(entryX, entryY); ctx.lineTo(exitX, exitY); ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.fillStyle = '#10b981'; ctx.font = 'bold 13px Inter'; ctx.textAlign = 'center';
    ctx.fillText(`i = ${angle}° | δ = ${deviation.toFixed(1)}° | n = ${n}`, W / 2, H - 12);
  }, [angle, A, n, r1, r2, e, deviation]);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Glass Prism — Light Dispersion</h3>
      <canvas ref={canvasRef} width={700} height={350} className="w-full rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400">Angle of incidence:</label>
        <input type="range" min={20} max={70} value={angle} onChange={e => setAngle(Number(e.target.value))} className="flex-1 h-2 accent-yellow-500" />
        <span className="text-sm font-mono text-white w-12 text-right">{angle}°</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center text-sm">
        <div className="bg-white/5 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">i</div><div className="font-bold text-amber-400">{angle}°</div></div>
        <div className="bg-white/5 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">e</div><div className="font-bold text-sky-400">{isNaN(e) ? 'TIR' : `${e.toFixed(1)}°`}</div></div>
        <div className="bg-white/5 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">δ</div><div className="font-bold text-emerald-400">{deviation.toFixed(1)}°</div></div>
        <div className="bg-white/5 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">μ</div><div className="font-bold text-violet-400">{n}</div></div>
      </div>
    </div>
  );
};

export default PrismLab;
