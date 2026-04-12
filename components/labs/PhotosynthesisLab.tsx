import React, { useState, useRef, useEffect, useCallback } from 'react';
const PhotosynthesisLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lightOn, setLightOn] = useState(true);
  const [bubbleCount, setBubbleCount] = useState(0);
  const animRef = useRef(0);
  const tRef = useRef(0);
  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, waterY = 100;
    // Beaker
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - 80, waterY - 20); ctx.lineTo(cx - 80, H - 40); ctx.lineTo(cx + 80, H - 40); ctx.lineTo(cx + 80, waterY - 20); ctx.stroke();
    // Water
    ctx.fillStyle = '#38bdf815'; ctx.fillRect(cx - 78, waterY, 156, H - 40 - waterY);
    // Plant (Hydrilla)
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, H - 50); ctx.quadraticCurveTo(cx - 10, H - 120, cx - 5, waterY + 40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, H - 60); ctx.quadraticCurveTo(cx + 15, H - 130, cx + 8, waterY + 50); ctx.stroke();
    // Leaves
    [[-5, waterY + 45], [8, waterY + 55], [-8, waterY + 80], [5, waterY + 90]].forEach(([lx, ly]) => {
      ctx.fillStyle = '#22c55e80';
      ctx.beginPath(); ctx.ellipse(cx + lx, ly, 8, 4, lx > 0 ? 0.3 : -0.3, 0, Math.PI * 2); ctx.fill();
    });
    // Inverted funnel
    ctx.strokeStyle = '#94a3b860'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx - 40, waterY + 20); ctx.lineTo(cx - 5, waterY - 30); ctx.lineTo(cx + 5, waterY - 30); ctx.lineTo(cx + 40, waterY + 20); ctx.stroke();
    // Inverted test tube
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(cx - 12, 20, 24, waterY - 45, [10, 10, 0, 0]); ctx.stroke();
    // Collected gas
    const gasH = Math.min(bubbleCount * 2, waterY - 70);
    ctx.fillStyle = '#38bdf830'; ctx.fillRect(cx - 10, 25, 20, gasH);
    // Bubbles
    if (lightOn) {
      tRef.current++;
      for (let i = 0; i < 3; i++) {
        const bx = cx + (Math.random() - 0.5) * 20;
        const by = waterY - 20 - ((tRef.current * 2 + i * 30) % 60);
        if (by > 25) {
          ctx.beginPath(); ctx.arc(bx, by, 2 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf860'; ctx.fill();
        }
      }
      if (tRef.current % 20 === 0) setBubbleCount(c => c + 1);
    }
    // Light source
    if (lightOn) {
      ctx.fillStyle = '#fbbf2440';
      ctx.beginPath(); ctx.arc(W - 40, 60, 30, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
      ctx.fillText('☀️', W - 40, 65);
      // Light rays
      ctx.strokeStyle = '#fbbf2420'; ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath(); ctx.moveTo(W - 60, 50 + i * 8); ctx.lineTo(cx + 50, waterY + i * 15); ctx.stroke();
      }
    }
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 12px Inter'; ctx.textAlign = 'center';
    ctx.fillText(`Bubbles: ${bubbleCount} | ${lightOn ? '☀️ Light ON — O₂ evolving' : '🌙 Dark — No photosynthesis'}`, W / 2, H - 10);
    animRef.current = requestAnimationFrame(draw);
  }, [lightOn, bubbleCount]);
  useEffect(() => { draw(); return () => cancelAnimationFrame(animRef.current); }, [draw]);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Photosynthesis — O₂ Evolution</h3>
        <button onClick={() => setLightOn(!lightOn)} className={`px-4 py-2 rounded-xl text-sm font-bold ${lightOn ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'} border border-white/10`}>
          {lightOn ? '🌙 Turn Off Light' : '☀️ Turn On Light'}
        </button>
      </div>
      <canvas ref={canvasRef} width={400} height={350} className="w-full max-w-sm mx-auto rounded-xl border border-white/10 bg-slate-950" />
    </div>
  );
};
export default PhotosynthesisLab;
