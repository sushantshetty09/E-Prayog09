import React, { useState, useRef, useEffect, useCallback } from 'react';
const PotashAlumLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [temp, setTemp] = useState(80);
  const [cooling, setCooling] = useState(false);
  const animRef = useRef(0);
  const crystalSize = Math.max(0, (80 - temp) / 60);
  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    // Beaker
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - 60, cy - 60); ctx.lineTo(cx - 60, cy + 60); ctx.lineTo(cx + 60, cy + 60); ctx.lineTo(cx + 60, cy - 60); ctx.stroke();
    // Solution
    const opacity = temp > 40 ? 0.3 : 0.15;
    ctx.fillStyle = `rgba(167,139,250,${opacity})`; ctx.fillRect(cx - 58, cy - 20, 116, 78);
    // Crystals
    if (crystalSize > 0) {
      const numCrystals = Math.floor(crystalSize * 12);
      for (let i = 0; i < numCrystals; i++) {
        const angle = (i / numCrystals) * Math.PI * 2;
        const r = 15 + i * 3;
        const x = cx + Math.cos(angle) * r * 0.5;
        const y = cy + 20 + Math.sin(angle) * r * 0.3;
        const s = 3 + crystalSize * 8;
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        ctx.fillStyle = '#e2e8f0'; ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.strokeStyle = '#94a3b8'; ctx.strokeRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      }
    }
    // Thermometer
    ctx.fillStyle = '#1e293b'; ctx.fillRect(cx + 70, cy - 50, 8, 70);
    const mercH = ((temp - 20) / 80) * 60;
    ctx.fillStyle = '#ef4444'; ctx.fillRect(cx + 71, cy + 20 - mercH, 6, mercH);
    ctx.fillStyle = '#ef4444'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'left';
    ctx.fillText(`${temp.toFixed(0)}°C`, cx + 82, cy - 30);
    // Info
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 13px Inter'; ctx.textAlign = 'center';
    ctx.fillText(temp > 60 ? 'Dissolving...' : temp > 35 ? 'Cooling — crystals forming...' : '✨ Crystals formed!', W / 2, H - 15);
    if (cooling && temp > 25) {
      setTemp(t => Math.max(25, t - 0.3));
      animRef.current = requestAnimationFrame(draw);
    }
  }, [temp, cooling, crystalSize]);
  useEffect(() => { draw(); return () => cancelAnimationFrame(animRef.current); }, [draw]);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Crystallisation — Potash Alum</h3>
        <button onClick={() => { if (!cooling) setTemp(80); setCooling(!cooling); }} className={`px-4 py-2 rounded-xl text-sm font-bold ${cooling ? 'bg-red-500/20 text-red-400' : 'bg-sky-500/20 text-sky-400'} border border-white/10`}>
          {cooling ? '⏸ Pause' : '❄️ Start Cooling'}
        </button>
      </div>
      <canvas ref={canvasRef} width={400} height={300} className="w-full max-w-sm mx-auto rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400">Temperature:</label>
        <input type="range" min={25} max={80} value={temp} onChange={e => { setTemp(Number(e.target.value)); setCooling(false); }} className="flex-1 h-2 accent-red-500" />
        <span className="text-sm font-mono text-white">{temp.toFixed(0)}°C</span>
      </div>
    </div>
  );
};
export default PotashAlumLab;
