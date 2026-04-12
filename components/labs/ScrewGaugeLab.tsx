import React, { useState, useRef, useEffect } from 'react';

const ScrewGaugeLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(25);
  const pitch = 0.5; // mm
  const divs = 50;
  const LC = pitch / divs; // 0.01 mm
  const diameter_mm = (rotation / divs) * pitch;
  const psr = Math.floor(diameter_mm / pitch) * pitch;
  const csr = Math.round((diameter_mm - psr) / LC);
  const reading = psr + csr * LC;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Frame (U-shape)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(80, H / 2 - 50);
    ctx.lineTo(80, H / 2 + 50);
    ctx.lineTo(150, H / 2 + 50);
    ctx.lineTo(150, H / 2 - 50);
    ctx.stroke();

    // Anvil
    ctx.fillStyle = '#64748b';
    ctx.fillRect(145, H / 2 - 8, 40, 16);

    // Spindle position based on reading
    const spindleX = 185 + (diameter_mm / 3) * 80;
    ctx.fillStyle = '#475569';
    ctx.fillRect(spindleX, H / 2 - 8, W - spindleX - 100, 16);

    // Thimble (rotating cylinder)
    const thimbleX = Math.min(spindleX + 60, W - 120);
    ctx.fillStyle = '#334155';
    ctx.fillRect(thimbleX, H / 2 - 35, 80, 70);
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(thimbleX, H / 2 - 35, 80, 70);

    // Thimble markings (circular scale representation)
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '9px Inter';
    ctx.textAlign = 'right';
    const visibleRange = 10;
    for (let i = -visibleRange; i <= visibleRange; i++) {
      const div = ((csr + i) % 50 + 50) % 50;
      const y = H / 2 + i * 4;
      if (y < H / 2 - 33 || y > H / 2 + 33) continue;
      const isMajor = div % 5 === 0;
      ctx.strokeStyle = i === 0 ? '#10b981' : '#94a3b8';
      ctx.lineWidth = isMajor ? 1.5 : 0.5;
      ctx.beginPath();
      ctx.moveTo(thimbleX, y);
      ctx.lineTo(thimbleX - (isMajor ? 15 : 8), y);
      ctx.stroke();
      if (isMajor) {
        ctx.fillStyle = i === 0 ? '#10b981' : '#94a3b8';
        ctx.fillText(`${div}`, thimbleX - 18, y + 3);
      }
    }

    // Datum line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(thimbleX - 20, H / 2);
    ctx.lineTo(thimbleX + 5, H / 2);
    ctx.stroke();

    // Main scale markings
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 6; i++) {
      const x = 185 + i * 30;
      if (x > thimbleX - 5) break;
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, H / 2 + 10);
      ctx.lineTo(x, H / 2 + 20);
      ctx.stroke();
      ctx.fillText(`${(i * 0.5).toFixed(1)}`, x, H / 2 + 32);
    }

    // Object between anvil and spindle
    if (diameter_mm > 0.1) {
      const objCx = (185 + spindleX) / 2;
      const objR = Math.min((spindleX - 185) / 2 - 2, 6);
      if (objR > 1) {
        ctx.beginPath();
        ctx.arc(objCx, H / 2, objR, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(objCx - 2, H / 2 - 2, 0, objCx, H / 2, objR);
        grad.addColorStop(0, '#c084fc');
        grad.addColorStop(1, '#7c3aed');
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    // Reading display
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`Reading: ${reading.toFixed(2)} mm`, W / 2, H - 15);
  }, [rotation, diameter_mm, psr, csr, reading]);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Screw Gauge Simulation</h3>
        <div className="flex gap-3 text-xs text-slate-400">
          <span>Pitch: <span className="text-white font-mono">0.5 mm</span></span>
          <span>LC: <span className="text-white font-mono">0.01 mm</span></span>
        </div>
      </div>
      <canvas ref={canvasRef} width={600} height={280} className="w-full rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400 whitespace-nowrap">Rotate Thimble:</label>
        <input type="range" min={0} max={150} value={rotation} onChange={e => setRotation(Number(e.target.value))} className="flex-1 h-2 rounded-full accent-violet-500" />
        <span className="text-sm font-mono text-white w-20 text-right">{diameter_mm.toFixed(2)} mm</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <div className="text-[10px] text-slate-500 uppercase font-bold">PSR</div>
          <div className="text-lg font-bold text-white font-mono">{psr.toFixed(1)}</div>
          <div className="text-[10px] text-slate-500">mm</div>
        </div>
        <div className="bg-violet-500/10 rounded-xl p-3 border border-violet-500/20">
          <div className="text-[10px] text-slate-500 uppercase font-bold">CSR</div>
          <div className="text-lg font-bold text-violet-400 font-mono">{csr}</div>
          <div className="text-[10px] text-slate-500">× 0.01 mm</div>
        </div>
        <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Total</div>
          <div className="text-lg font-bold text-emerald-400 font-mono">{reading.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500">mm</div>
        </div>
      </div>
    </div>
  );
};

export default ScrewGaugeLab;
