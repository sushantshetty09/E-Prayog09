import React, { useState, useRef, useEffect } from 'react';
const ConicSectionsLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [conic, setConic] = useState<'circle' | 'ellipse' | 'parabola' | 'hyperbola'>('circle');
  const [paramA, setParamA] = useState(3);
  const [paramB, setParamB] = useState(2);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2, sc = 30;
    // Grid
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 0.5;
    for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(cx + i * sc, 0); ctx.lineTo(cx + i * sc, H); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, cy + i * sc); ctx.lineTo(W, cy + i * sc); ctx.stroke(); }
    // Axes
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    // Draw conic
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5; ctx.beginPath();
    if (conic === 'circle') {
      ctx.arc(cx, cy, paramA * sc, 0, Math.PI * 2);
    } else if (conic === 'ellipse') {
      ctx.ellipse(cx, cy, paramA * sc, paramB * sc, 0, 0, Math.PI * 2);
    } else if (conic === 'parabola') {
      for (let t = -6; t <= 6; t += 0.05) { const x = paramA * t * t; const y = t; const px = cx + x * sc; const py = cy - y * sc; if (t === -6) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
    } else {
      // Hyperbola x²/a² - y²/b² = 1
      for (let t = -3; t <= 3; t += 0.02) {
        const x = paramA * Math.cosh(t); const y = paramB * Math.sinh(t);
        if (t === -3) ctx.moveTo(cx + x * sc, cy - y * sc); else ctx.lineTo(cx + x * sc, cy - y * sc);
      }
      ctx.stroke(); ctx.beginPath();
      for (let t = -3; t <= 3; t += 0.02) {
        const x = -paramA * Math.cosh(t); const y = paramB * Math.sinh(t);
        if (t === -3) ctx.moveTo(cx + x * sc, cy - y * sc); else ctx.lineTo(cx + x * sc, cy - y * sc);
      }
    }
    ctx.stroke();
    // Foci
    ctx.fillStyle = '#f59e0b';
    if (conic === 'circle') {
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
    } else if (conic === 'ellipse') {
      const c = Math.sqrt(Math.abs(paramA ** 2 - paramB ** 2));
      ctx.beginPath(); ctx.arc(cx + c * sc, cy, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx - c * sc, cy, 4, 0, Math.PI * 2); ctx.fill();
    } else if (conic === 'parabola') {
      ctx.beginPath(); ctx.arc(cx + paramA * sc / 4, cy, 4, 0, Math.PI * 2); ctx.fill();
    }
    // Equation label
    ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 13px Inter'; ctx.textAlign = 'center';
    const eq = conic === 'circle' ? `x² + y² = ${paramA}²` : conic === 'ellipse' ? `x²/${paramA}² + y²/${paramB}² = 1` : conic === 'parabola' ? `y² = ${(4 * paramA).toFixed(1)}x` : `x²/${paramA}² − y²/${paramB}² = 1`;
    ctx.fillText(eq, W / 2, H - 12);
  }, [conic, paramA, paramB]);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Conic Sections Explorer</h3>
      <canvas ref={canvasRef} width={500} height={350} className="w-full rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex gap-2 justify-center">
        {(['circle', 'ellipse', 'parabola', 'hyperbola'] as const).map(c => (
          <button key={c} onClick={() => setConic(c)} className={`px-3 py-2 rounded-xl text-sm font-bold border capitalize ${conic === c ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'text-slate-500 border-white/10'}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 px-2">
        <div className="flex items-center gap-2"><label className="text-sm text-slate-400">{conic === 'circle' ? 'r' : 'a'}:</label><input type="range" min={1} max={5} step={0.5} value={paramA} onChange={e => setParamA(Number(e.target.value))} className="flex-1 h-2 accent-emerald-500" /><span className="text-sm font-mono text-white">{paramA}</span></div>
        {conic !== 'circle' && conic !== 'parabola' && <div className="flex items-center gap-2"><label className="text-sm text-slate-400">b:</label><input type="range" min={1} max={5} step={0.5} value={paramB} onChange={e => setParamB(Number(e.target.value))} className="flex-1 h-2 accent-amber-500" /><span className="text-sm font-mono text-white">{paramB}</span></div>}
      </div>
    </div>
  );
};
export default ConicSectionsLab;
