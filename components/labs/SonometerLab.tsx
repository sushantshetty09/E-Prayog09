import React, { useState, useRef, useEffect, useCallback } from 'react';
const SonometerLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [freq, setFreq] = useState(256);
  const [tension] = useState(4); // kg weight
  const mu = 0.005; // linear density kg/m
  const T = tension * 9.8;
  const L = (1 / (2 * freq)) * Math.sqrt(T / mu) * 100; // cm
  const animRef = useRef(0);
  const tRef = useRef(0);
  const [playing, setPlaying] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const bx = 60, by = H / 2, bw = W - 120;
    // Board
    ctx.fillStyle = '#1e293b'; ctx.fillRect(bx, by - 5, bw, 10);
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1; ctx.strokeRect(bx, by - 5, bw, 10);
    // Bridges
    const wireLen = Math.min(L * 3, bw - 20);
    const b1x = bx + (bw - wireLen) / 2, b2x = b1x + wireLen;
    ctx.fillStyle = '#92400e'; ctx.fillRect(b1x - 3, by - 20, 6, 20); ctx.fillRect(b2x - 3, by - 20, 6, 20);
    // Wire with vibration
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = b1x; x <= b2x; x++) {
      const t = (x - b1x) / (b2x - b1x);
      const amp = playing ? 15 * Math.sin(Math.PI * t) * Math.sin(tRef.current * freq * 0.02) : 0;
      if (x === b1x) ctx.moveTo(x, by - 15 + amp); else ctx.lineTo(x, by - 15 + amp);
    }
    ctx.stroke();
    // Labels
    ctx.fillStyle = '#94a3b8'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
    ctx.fillText(`L = ${L.toFixed(1)} cm`, (b1x + b2x) / 2, by + 30);
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 13px Inter';
    ctx.fillText(`f = ${freq} Hz | T = ${T.toFixed(1)} N | L = ${L.toFixed(1)} cm | f×L = ${(freq * L / 100).toFixed(2)}`, W / 2, H - 12);
    if (playing) { tRef.current++; animRef.current = requestAnimationFrame(draw); }
  }, [freq, tension, T, L, playing, mu]);

  useEffect(() => { draw(); return () => cancelAnimationFrame(animRef.current); }, [draw]);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Sonometer Simulation</h3>
        <button onClick={() => { setPlaying(!playing); tRef.current = 0; }} className={`px-4 py-2 rounded-xl text-sm font-bold ${playing ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'} border border-white/10`}>
          {playing ? '⏸ Stop' : '▶ Vibrate'}
        </button>
      </div>
      <canvas ref={canvasRef} width={600} height={250} className="w-full rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400">Frequency:</label>
        <input type="range" min={128} max={512} step={1} value={freq} onChange={e => setFreq(Number(e.target.value))} className="flex-1 h-2 accent-amber-500" />
        <span className="text-sm font-mono text-white">{freq} Hz</span>
      </div>
    </div>
  );
};
export default SonometerLab;
