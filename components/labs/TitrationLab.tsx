import React, { useState, useRef, useEffect, useCallback } from 'react';
const TitrationLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [buretteVol, setBuretteVol] = useState(0);
  const endpoint = 20.5;
  const progress = buretteVol / 50;
  const atEndpoint = Math.abs(buretteVol - endpoint) < 0.5;
  const pastEndpoint = buretteVol > endpoint + 0.5;
  const flaskColor = pastEndpoint ? `rgba(236,72,153,${0.4 + (buretteVol - endpoint) * 0.04})` : atEndpoint ? 'rgba(236,72,153,0.25)' : 'rgba(200,220,255,0.1)';
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    // Burette
    const bx = W / 2, by = 30, bw = 20, bh = 180;
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
    ctx.strokeRect(bx - bw / 2, by, bw, bh);
    const liquidH = bh * (1 - progress);
    ctx.fillStyle = '#a78bfa40'; ctx.fillRect(bx - bw / 2 + 1, by + 1, bw - 2, liquidH);
    // Scale on burette
    ctx.fillStyle = '#64748b'; ctx.font = '8px Inter'; ctx.textAlign = 'right';
    for (let i = 0; i <= 50; i += 10) {
      const y = by + (i / 50) * bh;
      ctx.fillText(`${i}`, bx - bw / 2 - 4, y + 3);
      ctx.beginPath(); ctx.moveTo(bx - bw / 2, y); ctx.lineTo(bx - bw / 2 - 3, y); ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1; ctx.stroke();
    }
    // Stopcock
    ctx.fillStyle = '#475569'; ctx.fillRect(bx - 3, by + bh, 6, 15);
    // Drop
    if (buretteVol > 0 && buretteVol < 50) {
      // Simulate falling drops
      const dropCycle = (Date.now() % 500) / 500; // 0 to 1 every 500ms
      const dropY = by + bh + (dropCycle * 180); // Falls down towards flask 80px
      if (dropY < fy) { // Only draw if above flask
        ctx.beginPath(); 
        ctx.arc(bx + (Math.random() - 0.5)*2, dropY, 2, 0, Math.PI * 2); 
        ctx.fillStyle = '#a78bfa'; 
        ctx.fill();
      }
    }
    // Conical flask
    const fx = W / 2, fy = H - 40;
    ctx.beginPath();
    ctx.moveTo(fx - 50, fy); ctx.lineTo(fx - 15, fy - 80); ctx.lineTo(fx + 15, fy - 80); ctx.lineTo(fx + 50, fy);
    ctx.closePath();
    ctx.fillStyle = flaskColor; ctx.fill();
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.stroke();
    // Flask opening
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(fx - 15, fy - 80); ctx.lineTo(fx - 15, fy - 95); ctx.lineTo(fx + 15, fy - 95); ctx.lineTo(fx + 15, fy - 80); ctx.stroke();
    // Info
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 13px Inter'; ctx.textAlign = 'center';
    const status = pastEndpoint ? '🔴 Past endpoint!' : atEndpoint ? '🟢 ENDPOINT reached!' : '⚪ Titrating...';
    ctx.fillText(`Volume: ${buretteVol.toFixed(1)} mL | ${status}`, W / 2, H - 8);
  }, [buretteVol, progress, atEndpoint, pastEndpoint, flaskColor, endpoint]);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Acid-Base Titration (HCl vs NaOH)</h3>
      <canvas ref={canvasRef} width={400} height={380} className="w-full max-w-sm mx-auto rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400">Add NaOH:</label>
        <input type="range" min={0} max={40} step={0.5} value={buretteVol} onChange={e => setBuretteVol(Number(e.target.value))} className="flex-1 h-2 accent-violet-500" />
        <span className="text-sm font-mono text-white">{buretteVol.toFixed(1)} mL</span>
      </div>
      <div className={`text-center text-sm py-2 rounded-xl font-bold ${atEndpoint ? 'bg-emerald-500/20 text-emerald-400' : pastEndpoint ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-slate-400'}`}>
        {atEndpoint ? '✅ Phenolphthalein turns PINK — Endpoint!' : pastEndpoint ? '⚠️ Over-titrated! Permanent pink.' : 'Colourless solution — keep adding NaOH'}
      </div>
    </div>
  );
};
export default TitrationLab;
