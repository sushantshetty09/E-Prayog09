import React, { useState, useRef, useEffect } from 'react';
const RateOfReactionLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [concentration, setConcentration] = useState(50);
  const time = Math.max(5, 200 / concentration + Math.random() * 5);
  const rate = 1 / time;
  const [data] = useState(() => {
    const d: { conc: number; t: number; r: number }[] = [];
    for (let c = 10; c <= 100; c += 10) { const t = 200 / c + (Math.random() - 0.5) * 3; d.push({ conc: c, t, r: 1 / t }); }
    return d;
  });
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const ox = 60, oy = H - 40, gw = W - 100, gh = H - 80;
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + gw, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - gh); ctx.stroke();
    ctx.fillStyle = '#64748b'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
    ctx.fillText('Concentration (mL)', ox + gw / 2, oy + 20);
    ctx.save(); ctx.translate(ox - 20, oy - gh / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('Rate (1/t)', 0, 0); ctx.restore();
    // Grid
    for (let i = 0; i <= 10; i++) { const x = ox + (i / 10) * gw; ctx.strokeStyle = '#1e293b'; ctx.beginPath(); ctx.moveTo(x, oy); ctx.lineTo(x, oy - gh); ctx.stroke(); ctx.fillStyle = '#64748b'; ctx.fillText(`${i * 10}`, x, oy + 12); }
    // Plot
    data.forEach(d => {
      const px = ox + (d.conc / 100) * gw;
      const py = oy - (d.r / 0.12) * gh;
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2); ctx.fillStyle = '#10b981'; ctx.fill();
    });
    // Best fit line
    ctx.strokeStyle = '#10b98180'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + gw, oy - (0.1 / 0.12) * gh); ctx.stroke(); ctx.setLineDash([]);
    // Current point
    const cpx = ox + (concentration / 100) * gw;
    const cpy = oy - (rate / 0.12) * gh;
    ctx.beginPath(); ctx.arc(cpx, cpy, 7, 0, Math.PI * 2); ctx.fillStyle = '#f59e0b'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 12px Inter';
    ctx.fillText(`Conc = ${concentration} mL | Time = ${time.toFixed(1)}s | Rate = ${rate.toFixed(4)} s⁻¹`, W / 2, H - 8);
  }, [concentration, time, rate, data]);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Rate of Reaction — Na₂S₂O₃ + HCl</h3>
      <canvas ref={canvasRef} width={600} height={320} className="w-full rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400">Na₂S₂O₃ Volume:</label>
        <input type="range" min={10} max={100} step={5} value={concentration} onChange={e => setConcentration(Number(e.target.value))} className="flex-1 h-2 accent-emerald-500" />
        <span className="text-sm font-mono text-white">{concentration} mL</span>
      </div>
    </div>
  );
};
export default RateOfReactionLab;
