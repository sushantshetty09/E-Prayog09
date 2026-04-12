import React, { useState, useRef, useEffect, useCallback } from 'react';
const ChromatographyLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const animRef = useRef(0);
  const tRef = useRef(0);
  const spots = [
    { name: 'Red', Rf: 0.85, color: '#ef4444' },
    { name: 'Blue', Rf: 0.45, color: '#3b82f6' },
    { name: 'Yellow', Rf: 0.65, color: '#eab308' },
    { name: 'Green', Rf: 0.55, color: '#22c55e' },
  ];
  const maxSolvent = 90;
  const solventFront = Math.min(time * 1.5, maxSolvent);
  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const px = W / 2 - 40, py = 30, pw = 80, ph = H - 80;
    // Paper
    ctx.fillStyle = '#fef3c7'; ctx.fillRect(px, py, pw, ph);
    // Solvent front (ascending)
    const sfY = py + ph - (solventFront / 100) * ph;
    ctx.fillStyle = 'rgba(147,197,253,0.3)'; ctx.fillRect(px, sfY, pw, py + ph - sfY);
    // Solvent front line
    ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(px - 10, sfY); ctx.lineTo(px + pw + 10, sfY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#60a5fa'; ctx.font = '9px Inter'; ctx.textAlign = 'left';
    ctx.fillText('Solvent front', px + pw + 12, sfY + 3);
    // Origin line
    const originY = py + ph - 10;
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px, originY); ctx.lineTo(px + pw, originY); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.fillText('Origin', px + pw + 12, originY + 3);
    // Spots
    spots.forEach((spot, i) => {
      const spotTravel = Math.min(solventFront * spot.Rf, solventFront);
      const spotY = originY - (spotTravel / 100) * ph;
      const spotX = px + 15 + i * 18;
      // Spot trail
      if (solventFront > 5) {
        ctx.fillStyle = spot.color + '20';
        ctx.fillRect(spotX - 5, spotY, 10, originY - spotY);
      }
      // Spot
      ctx.beginPath(); ctx.arc(spotX, spotY, 6, 0, Math.PI * 2);
      ctx.fillStyle = spot.color + (solventFront > 5 ? 'cc' : 'ff'); ctx.fill();
    });
    // Legend
    ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 11px Inter'; ctx.textAlign = 'left';
    spots.forEach((spot, i) => {
      const Rf = solventFront > 5 ? (Math.min(solventFront * spot.Rf, solventFront) / solventFront).toFixed(2) : '—';
      ctx.fillStyle = spot.color; ctx.fillRect(20, H - 65 + i * 15, 8, 8);
      ctx.fillStyle = '#e2e8f0'; ctx.font = '10px Inter';
      ctx.fillText(`${spot.name}: Rf = ${Rf}`, 32, H - 58 + i * 15);
    });
    if (running && solventFront < maxSolvent) {
      tRef.current += 0.5; setTime(tRef.current);
      animRef.current = requestAnimationFrame(draw);
    }
  }, [time, running, solventFront, spots, maxSolvent]);
  useEffect(() => { draw(); return () => cancelAnimationFrame(animRef.current); }, [draw]);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Paper Chromatography</h3>
        <button onClick={() => { if (!running) { tRef.current = 0; setTime(0); } setRunning(!running); }} className={`px-4 py-2 rounded-xl text-sm font-bold ${running ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'} border border-white/10`}>
          {running ? '⏸ Pause' : '▶ Run Chromatography'}
        </button>
      </div>
      <canvas ref={canvasRef} width={400} height={400} className="w-full max-w-sm mx-auto rounded-xl border border-white/10 bg-slate-950" />
      <div className="text-xs text-slate-500 text-center">Rf = Distance moved by solute / Distance moved by solvent front</div>
    </div>
  );
};
export default ChromatographyLab;
