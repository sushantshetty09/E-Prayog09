import React, { useState, useRef, useEffect } from 'react';

const VernierCalipersLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [jawPos, setJawPos] = useState(50); // 0-100 slider => 0-5 cm
  const LC = 0.01; // cm

  const diameter = (jawPos / 100) * 5;
  const msr = Math.floor(diameter * 10) / 10;
  const vsd = Math.round((diameter - msr) / LC);
  const reading = msr + vsd * LC;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    const scale = W * 0.8;
    const ox = W * 0.1;
    const oy = H * 0.35;

    // Main scale bar
    ctx.fillStyle = '#475569';
    ctx.fillRect(ox, oy, scale, 30);

    // Main scale markings (0 to 5 cm)
    ctx.strokeStyle = '#e2e8f0';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 50; i++) {
      const x = ox + (i / 50) * scale;
      const isCm = i % 10 === 0;
      const isHalf = i % 5 === 0;
      ctx.beginPath();
      ctx.moveTo(x, oy);
      ctx.lineTo(x, oy - (isCm ? 18 : isHalf ? 12 : 7));
      ctx.lineWidth = isCm ? 2 : 1;
      ctx.stroke();
      if (isCm) {
        ctx.fillText(`${i / 10}`, x, oy - 22);
      }
    }
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter';
    ctx.fillText('cm', ox + scale + 15, oy - 10);

    // Fixed jaw (left)
    ctx.fillStyle = '#64748b';
    ctx.fillRect(ox - 5, oy - 5, 12, 80);

    // Vernier scale (sliding part)
    const vOffset = ox + (diameter / 5) * scale;
    ctx.fillStyle = '#334155';
    ctx.fillRect(vOffset, oy + 30, scale * 0.22, 25);

    // Vernier scale markings (0-10)
    ctx.strokeStyle = '#38bdf8';
    ctx.fillStyle = '#38bdf8';
    ctx.font = '9px Inter';
    const vScaleLen = scale * 0.18;
    for (let i = 0; i <= 10; i++) {
      const x = vOffset + (i / 10) * vScaleLen;
      ctx.beginPath();
      ctx.moveTo(x, oy + 30);
      ctx.lineTo(x, oy + 30 + (i % 5 === 0 ? 15 : 10));
      ctx.lineWidth = i % 5 === 0 ? 2 : 1;
      ctx.stroke();
      if (i % 5 === 0) ctx.fillText(`${i}`, x, oy + 65);
    }

    // Movable jaw
    ctx.fillStyle = '#64748b';
    ctx.fillRect(vOffset - 2, oy - 5, 10, 80);

    // Object (sphere) between jaws
    if (diameter > 0.1) {
      const cx = ox + 3 + (vOffset - ox - 3) / 2;
      const cy = oy + 35;
      const r = Math.min((vOffset - ox - 8) / 2, 25);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(r, 3), 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
      grad.addColorStop(0, '#818cf8');
      grad.addColorStop(1, '#4338ca');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Reading display
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(W * 0.25, H * 0.75, W * 0.5, 50);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(W * 0.25, H * 0.75, W * 0.5, 50);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 18px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`Reading: ${reading.toFixed(2)} cm`, W / 2, H * 0.75 + 32);

  }, [jawPos, diameter, msr, vsd, reading]);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Vernier Calipers Simulation</h3>
        <div className="flex gap-4 text-xs text-slate-400">
          <span>MSR: <span className="text-white font-mono">{msr.toFixed(1)} cm</span></span>
          <span>VSD: <span className="text-sky-400 font-mono">{vsd}</span></span>
          <span>LC: <span className="text-white font-mono">{LC} cm</span></span>
        </div>
      </div>
      <canvas ref={canvasRef} width={700} height={320} className="w-full rounded-xl border border-white/10 bg-slate-950" style={{ maxHeight: '320px' }} />
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400 whitespace-nowrap">Move Jaw:</label>
        <input type="range" min={0} max={100} value={jawPos} onChange={e => setJawPos(Number(e.target.value))}
          className="flex-1 h-2 rounded-full accent-sky-500 cursor-pointer" />
        <span className="text-sm font-mono text-white w-20 text-right">{diameter.toFixed(2)} cm</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Main Scale</div>
          <div className="text-lg font-bold text-white font-mono">{msr.toFixed(1)}</div>
          <div className="text-[10px] text-slate-500">cm</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-sky-500/20">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Vernier Div.</div>
          <div className="text-lg font-bold text-sky-400 font-mono">{vsd}</div>
          <div className="text-[10px] text-slate-500">× {LC} cm</div>
        </div>
        <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Total Reading</div>
          <div className="text-lg font-bold text-emerald-400 font-mono">{reading.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500">cm</div>
        </div>
      </div>
    </div>
  );
};

export default VernierCalipersLab;
