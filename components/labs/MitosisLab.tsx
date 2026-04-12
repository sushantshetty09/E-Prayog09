import React, { useState, useRef, useEffect, useCallback } from 'react';
const stages = [
  { name: 'Interphase', desc: 'DNA replicates. Cell prepares for division.', chromatin: false },
  { name: 'Prophase', desc: 'Chromatin condenses into visible chromosomes. Nuclear envelope begins to break.', chromatin: true },
  { name: 'Metaphase', desc: 'Chromosomes align at the metaphase plate (cell equator).', chromatin: true },
  { name: 'Anaphase', desc: 'Sister chromatids separate and move to opposite poles.', chromatin: true },
  { name: 'Telophase', desc: 'Nuclear envelope reforms. Chromosomes decondense. Cytokinesis begins.', chromatin: false },
];
const MitosisLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const s = stages[stage];

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => setStage(prev => (prev + 1) % stages.length), 2500);
    return () => clearInterval(timer);
  }, [autoPlay]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;

    // Cell membrane
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 3;
    if (stage === 4) {
      // Pinching
      ctx.beginPath(); ctx.ellipse(cx - 30, cy, 50, 60, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx + 30, cy, 50, 60, 0, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.ellipse(cx, cy, 80, 70, 0, 0, Math.PI * 2); ctx.stroke();
    }

    // Nuclear envelope
    if (stage === 0 || stage === 4) {
      ctx.strokeStyle = '#60a5fa40'; ctx.lineWidth = 2;
      if (stage === 4) {
        ctx.beginPath(); ctx.arc(cx - 30, cy, 25, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + 30, cy, 25, 0, Math.PI * 2); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(cx, cy, 35, 0, Math.PI * 2); ctx.stroke();
      }
    }

    // Chromosomes / chromatin
    if (stage === 0) {
      // Diffuse chromatin
      ctx.strokeStyle = '#a78bfa40'; ctx.lineWidth = 1;
      for (let i = 0; i < 12; i++) {
        const x = cx + (Math.random() - 0.5) * 40;
        const y = cy + (Math.random() - 0.5) * 40;
        ctx.beginPath();
        ctx.arc(x, y, 3 + Math.random() * 5, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (stage === 1) {
      // Condensed chromosomes scattered
      const chroms = [[-15, -10], [10, -15], [-8, 12], [15, 8], [0, -5], [-12, 5]];
      chroms.forEach(([dx, dy]) => {
        ctx.fillStyle = '#a78bfa'; ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(cx + dx, cy + dy, 3, 10, Math.random(), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      });
      // Spindle fibres forming
      ctx.strokeStyle = '#94a3b830'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(cx - 70, cy); ctx.lineTo(cx + 70, cy); ctx.stroke();
    } else if (stage === 2) {
      // Chromosomes at metaphase plate
      for (let i = -3; i <= 3; i++) {
        ctx.fillStyle = '#a78bfa'; ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(cx, cy + i * 10, 4, 8, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      // Spindle fibres
      ctx.strokeStyle = '#94a3b850'; ctx.lineWidth = 1;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath(); ctx.moveTo(cx - 70, cy); ctx.lineTo(cx, cy + i * 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 70, cy); ctx.lineTo(cx, cy + i * 10); ctx.stroke();
      }
      // Centrioles
      ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(cx - 70, cy, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 70, cy, 4, 0, Math.PI * 2); ctx.fill();
    } else if (stage === 3) {
      // Chromatids moving apart
      for (let i = -3; i <= 3; i++) {
        ctx.fillStyle = '#a78bfa'; ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(cx - 35, cy + i * 8, 3, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx + 35, cy + i * 8, 3, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      // Spindles stretching
      ctx.strokeStyle = '#94a3b830'; ctx.lineWidth = 0.5;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath(); ctx.moveTo(cx - 70, cy); ctx.lineTo(cx - 35, cy + i * 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + 70, cy); ctx.lineTo(cx + 35, cy + i * 8); ctx.stroke();
      }
    } else if (stage === 4) {
      // Two groups of decondensing chromosomes
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = '#a78bfa60';
        ctx.beginPath(); ctx.arc(cx - 30 + (Math.random() - 0.5) * 20, cy + (Math.random() - 0.5) * 20, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + 30 + (Math.random() - 0.5) * 20, cy + (Math.random() - 0.5) * 20, 4, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Stage label
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 16px Inter'; ctx.textAlign = 'center';
    ctx.fillText(s.name, W / 2, H - 15);
  }, [stage, s]);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Mitosis — Cell Division Stages</h3>
        <button onClick={() => setAutoPlay(!autoPlay)} className={`px-4 py-2 rounded-xl text-sm font-bold ${autoPlay ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'} border border-white/10`}>
          {autoPlay ? '⏸ Pause' : '▶ Auto Play'}
        </button>
      </div>
      <canvas ref={canvasRef} width={400} height={300} className="w-full max-w-md mx-auto rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex gap-2 justify-center">
        {stages.map((st, i) => (
          <button key={i} onClick={() => { setStage(i); setAutoPlay(false); }} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${i === stage ? 'bg-lime-500/20 text-lime-400 border-lime-500/30' : 'text-slate-500 border-white/10 hover:text-white'}`}>
            {st.name}
          </button>
        ))}
      </div>
      <div className="text-center text-sm text-slate-400 bg-white/5 rounded-xl p-3">{s.desc}</div>
    </div>
  );
};
export default MitosisLab;
