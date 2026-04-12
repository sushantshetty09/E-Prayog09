import React, { useState, useRef, useEffect, useCallback } from 'react';
const HookesLawLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mass, setMass] = useState(100); // grams
  const k = 5; // N/m
  const F = (mass / 1000) * 9.8;
  const x = F / k; // extension in metres
  const x_cm = x * 100;
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, topY = 30;
    // Support
    ctx.fillStyle = '#475569'; ctx.fillRect(cx - 40, topY, 80, 8);
    // Spring (coils)
    const springTop = topY + 8;
    const naturalLen = 80;
    const extLen = naturalLen + x_cm * 5;
    const coils = 10;
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= coils * 4; i++) {
      const t = i / (coils * 4);
      const y = springTop + t * extLen;
      const xOff = Math.sin(t * coils * Math.PI * 2) * 15;
      if (i === 0) ctx.moveTo(cx + xOff, y); else ctx.lineTo(cx + xOff, y);
    }
    ctx.stroke();
    // Weight
    const weightY = springTop + extLen;
    const weightR = 18;
    const grad = ctx.createRadialGradient(cx - 4, weightY - 4, 0, cx, weightY, weightR);
    grad.addColorStop(0, '#f59e0b'); grad.addColorStop(1, '#b45309');
    ctx.beginPath(); ctx.arc(cx, weightY + weightR, weightR, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Inter'; ctx.textAlign = 'center';
    ctx.fillText(`${mass}g`, cx, weightY + weightR + 5);
    // Extension line
    ctx.setLineDash([3, 3]); ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx + 30, springTop + naturalLen); ctx.lineTo(cx + 30, weightY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#38bdf8'; ctx.font = '10px Inter';
    ctx.fillText(`x = ${x_cm.toFixed(1)} cm`, cx + 60, springTop + naturalLen + (weightY - springTop - naturalLen) / 2);
    // Formula
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 13px Inter';
    ctx.fillText(`F = kx | ${F.toFixed(2)} N = ${k} × ${x.toFixed(3)} m`, W / 2, H - 12);
  }, [mass, k, F, x, x_cm]);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Hooke's Law — Spring Constant</h3>
      <canvas ref={canvasRef} width={400} height={350} className="w-full max-w-md mx-auto rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400">Mass:</label>
        <input type="range" min={0} max={500} step={10} value={mass} onChange={e => setMass(Number(e.target.value))} className="flex-1 h-2 accent-amber-500" />
        <span className="text-sm font-mono text-white">{mass} g</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white/5 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">Force</div><div className="font-bold text-amber-400 font-mono">{F.toFixed(2)} N</div></div>
        <div className="bg-white/5 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">Extension</div><div className="font-bold text-sky-400 font-mono">{x_cm.toFixed(1)} cm</div></div>
        <div className="bg-white/5 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">k</div><div className="font-bold text-emerald-400 font-mono">{k} N/m</div></div>
      </div>
    </div>
  );
};
export default HookesLawLab;
