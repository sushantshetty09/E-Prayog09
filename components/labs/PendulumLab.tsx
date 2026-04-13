import React, { useState, useRef, useEffect, useCallback } from 'react';

const PendulumLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [length, setLength] = useState(60); // cm
  const [isSwinging, setIsSwinging] = useState(false);
  const angleRef = useRef(Math.PI / 6);
  const velRef = useRef(0);

  const g = 9.78; // m/s² Bangalore
  const L_m = length / 100;
  const T = 2 * Math.PI * Math.sqrt(L_m / g);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    // Skipping background fill to intentionally leave it transparent/styled by CSS

    // Support bar (ceiling)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(W * 0.3, 20, W * 0.4, 8);

    // Pivot point
    const px = W / 2, py = 28;
    const ropeLen = Math.min(length * 2.5, H * 0.65);
    const angle = angleRef.current;

    // Bob position
    const bx = px + ropeLen * Math.sin(angle);
    const by = py + ropeLen * Math.cos(angle);

    // Rope
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // Bob (Shadow projection)
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.ellipse(bx, H - 10, 15, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bob
    const bobR = 16;
    const grad = ctx.createRadialGradient(bx - 4, by - 4, 0, bx, by, bobR);
    grad.addColorStop(0, '#60a5fa');
    grad.addColorStop(1, '#2563eb');
    ctx.beginPath();
    ctx.arc(bx, by, bobR, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Pivot
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();

    // Angle indicator
    if (Math.abs(angle) > 0.01) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, py + 40);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(px, py, 30, Math.PI / 2 - angle, Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(`${(Math.abs(angle) * 180 / Math.PI).toFixed(1)}°`, px + 45 * Math.sign(angle), py + 20);
    }

    // Info at bottom
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`Period T = ${T.toFixed(3)} s`, W / 2, H - 20);

    // Physics simulation step
    if (isSwinging) {
      // Analytical approach
      velRef.current += 1; // Used as 'time elapsed in frames'
      const w = Math.sqrt(g / (L_m));
      const t = velRef.current * 0.016; 
      const damping = 0.998;
      angleRef.current = (Math.PI / 6) * Math.cos(w * t) * Math.pow(damping, t * 2);
      
      animRef.current = requestAnimationFrame(draw);
    }
  }, [length, isSwinging, T, g, L_m]);

  useEffect(() => {
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const toggleSwing = () => {
    if (!isSwinging) {
      angleRef.current = Math.PI / 6;
      velRef.current = 0;
    }
    setIsSwinging(!isSwinging);
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Simple Pendulum Simulation</h3>
        <button onClick={toggleSwing} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isSwinging ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
          {isSwinging ? '⏸ Pause' : '▶ Start Oscillation'}
        </button>
      </div>
      <canvas ref={canvasRef} width={600} height={350} className="w-full rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400 whitespace-nowrap">Length (L):</label>
        <input type="range" min={20} max={120} value={length} onChange={e => { setLength(Number(e.target.value)); setIsSwinging(false); }}
          className="flex-1 h-2 rounded-full accent-sky-500" />
        <span className="text-sm font-mono text-white w-16 text-right">{length} cm</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Length</div>
          <div className="text-lg font-bold text-white font-mono">{L_m.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500">m</div>
        </div>
        <div className="bg-sky-500/10 rounded-xl p-3 border border-sky-500/20">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Time Period</div>
          <div className="text-lg font-bold text-sky-400 font-mono">{T.toFixed(3)}</div>
          <div className="text-[10px] text-slate-500">s</div>
        </div>
        <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
          <div className="text-[10px] text-slate-500 uppercase font-bold">g (Bangalore)</div>
          <div className="text-lg font-bold text-emerald-400 font-mono">{g}</div>
          <div className="text-[10px] text-slate-500">m/s²</div>
        </div>
      </div>
    </div>
  );
};

export default PendulumLab;
