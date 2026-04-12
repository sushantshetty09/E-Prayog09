import React, { useState, useRef, useEffect } from 'react';
const UnitCircleLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(45);
  const rad = (angle * Math.PI) / 180;
  const sinV = Math.sin(rad), cosV = Math.cos(rad), tanV = Math.tan(rad);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.35;
    // Grid
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 0.5;
    for (let i = -1; i <= 1; i += 0.5) {
      ctx.beginPath(); ctx.moveTo(cx + i * r, cy - r - 10); ctx.lineTo(cx + i * r, cy + r + 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - r - 10, cy + i * r); ctx.lineTo(cx + r + 10, cy + i * r); ctx.stroke();
    }
    // Axes
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx - r - 20, cy); ctx.lineTo(cx + r + 20, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - r - 20); ctx.lineTo(cx, cy + r + 20); ctx.stroke();
    // Circle
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    // Angle arc
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 25, 0, -rad, true); ctx.stroke();
    ctx.fillStyle = '#f59e0b'; ctx.font = '11px Inter'; ctx.textAlign = 'left';
    ctx.fillText(`${angle}°`, cx + 28, cy - 8);
    // Point on circle
    const px = cx + r * cosV, py = cy - r * sinV;
    // cos line (x projection)
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, cy); ctx.stroke();
    // sin line (y projection)
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, py); ctx.stroke();
    // Radius
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
    // Point
    ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    // Dashed lines
    ctx.setLineDash([3, 3]); ctx.strokeStyle = '#94a3b840'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, py); ctx.stroke();
    ctx.setLineDash([]);
    // Labels
    ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 11px Inter'; ctx.textAlign = 'center';
    ctx.fillText(`cos = ${cosV.toFixed(3)}`, (cx + px) / 2, cy + 18);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`sin = ${sinV.toFixed(3)}`, px + 45, (cy + py) / 2);
    // Quadrant labels
    ctx.fillStyle = '#64748b40'; ctx.font = '10px Inter';
    ctx.fillText('I', cx + r * 0.6, cy - r * 0.6);
    ctx.fillText('II', cx - r * 0.6, cy - r * 0.6);
    ctx.fillText('III', cx - r * 0.6, cy + r * 0.6);
    ctx.fillText('IV', cx + r * 0.6, cy + r * 0.6);
    // Coord label
    ctx.fillStyle = '#e2e8f0'; ctx.font = '10px Inter';
    ctx.fillText(`(${cosV.toFixed(2)}, ${sinV.toFixed(2)})`, px + (cosV > 0 ? 10 : -10), py - 12);
  }, [angle, rad, sinV, cosV]);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Unit Circle & Trigonometry</h3>
      <canvas ref={canvasRef} width={500} height={400} className="w-full rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400">Angle θ:</label>
        <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))} className="flex-1 h-2 accent-amber-500" />
        <span className="text-sm font-mono text-white">{angle}°</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center text-sm">
        <div className="bg-white/5 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">θ</div><div className="font-bold text-amber-400 font-mono">{angle}°</div></div>
        <div className="bg-sky-500/10 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">cos θ</div><div className="font-bold text-sky-400 font-mono">{cosV.toFixed(4)}</div></div>
        <div className="bg-emerald-500/10 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">sin θ</div><div className="font-bold text-emerald-400 font-mono">{sinV.toFixed(4)}</div></div>
        <div className="bg-violet-500/10 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">tan θ</div><div className="font-bold text-violet-400 font-mono">{Math.abs(tanV) > 1000 ? '∞' : tanV.toFixed(4)}</div></div>
      </div>
    </div>
  );
};
export default UnitCircleLab;
