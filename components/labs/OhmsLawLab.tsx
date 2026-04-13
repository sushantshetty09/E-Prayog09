import React, { useState, useRef, useEffect } from 'react';

const OhmsLawLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [voltage, setVoltage] = useState(3);
  const [resistance] = useState(10);
  const current = voltage / resistance;
  const [readings, setReadings] = useState<{v: number; i: number}[]>([]);

  const addReading = () => {
    setReadings(prev => [...prev, { v: voltage, i: parseFloat(current.toFixed(3)) }]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Draw circuit schematic
    const cx = W / 2, cy = H / 2 - 10;
    // Battery
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 120, cy - 60); ctx.lineTo(cx - 60, cy - 60);
    ctx.stroke();
    // Battery symbol
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx - 60, cy - 75); ctx.lineTo(cx - 60, cy - 45); ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx - 50, cy - 70); ctx.lineTo(cx - 50, cy - 50); ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`${voltage.toFixed(1)}V`, cx - 55, cy - 80);

    // Top wire
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - 50, cy - 60); ctx.lineTo(cx + 80, cy - 60); ctx.stroke();

    // Ammeter (circle with A)
    ctx.beginPath(); ctx.arc(cx + 100, cy - 60, 18, 0, Math.PI * 2);
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 14px Inter';
    ctx.fillText('A', cx + 100, cy - 55);
    ctx.font = '9px Inter'; ctx.fillStyle = '#38bdf8';
    ctx.fillText(`${current.toFixed(3)} A`, cx + 100, cy - 35);

    // Right wire down
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx + 118, cy - 60); ctx.lineTo(cx + 140, cy - 60); ctx.lineTo(cx + 140, cy + 20); ctx.stroke();

    // Resistor (zigzag)
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
    const ry = cy + 20;
    ctx.beginPath();
    ctx.moveTo(cx + 140, ry);
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(cx + 140 - (i % 2 === 0 ? -10 : 10), ry + i * 10 + 5);
    }
    ctx.lineTo(cx + 140, ry + 65);
    ctx.stroke();
    ctx.fillStyle = '#f59e0b'; ctx.font = '10px Inter';
    ctx.fillText(`${resistance}Ω`, cx + 160, ry + 32);

    // Bottom wire
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx + 140, ry + 65); ctx.lineTo(cx - 120, ry + 65); ctx.lineTo(cx - 120, cy - 60); ctx.stroke();

    // Electrons & Current Arrows
    const time = Date.now() / 1000;
    const offset = (time * current * 20) % 50;
    ctx.fillStyle = '#3b82f6';
    for (let i = 0; i < 5; i++) {
        // Top wire electrons (moving left to right)
        ctx.beginPath(); ctx.arc(cx - 30 + i * 40 + offset, cy - 60, 4, 0, Math.PI * 2); ctx.fill();
        // Bottom wire electrons (moving right to left)
        ctx.beginPath(); ctx.arc(cx + 140 - (i * 40 + offset), ry + 65, 4, 0, Math.PI * 2); ctx.fill();
    }
    // Current arrows
    ctx.fillStyle = '#ef4444'; ctx.font = '12px Inter';
    ctx.fillText('I →', cx + 20, cy - 65);
    ctx.fillText('← I', cx + 20, ry + 55);

    // Voltmeter (parallel to resistor)
    ctx.beginPath(); ctx.arc(cx + 60, ry + 32, 18, 0, Math.PI * 2);
    ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#a78bfa'; ctx.font = 'bold 14px Inter';
    ctx.fillText('V', cx + 60, ry + 37);
    ctx.font = '9px Inter';
    ctx.fillText(`${voltage.toFixed(1)} V`, cx + 60, ry + 55);
    // Voltmeter wires
    ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(cx + 60, ry + 14); ctx.lineTo(cx + 60, ry - 5); ctx.lineTo(cx + 140, ry); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 60, ry + 50); ctx.lineTo(cx + 60, ry + 70); ctx.lineTo(cx + 140, ry + 65); ctx.stroke();
    ctx.setLineDash([]);

    // V-I Graph (bottom half)
    const gx = 40, gy = H - 130, gw = W - 80, gh = 100;
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
    ctx.strokeRect(gx, gy, gw, gh);
    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.beginPath(); ctx.moveTo(gx, gy + gh); ctx.lineTo(gx + gw, gy + gh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx, gy + gh); ctx.lineTo(gx, gy); ctx.stroke();
    ctx.fillStyle = '#64748b'; ctx.font = '9px Inter'; ctx.textAlign = 'center';
    ctx.fillText('Current I (A)', gx + gw / 2, gy + gh + 15);
    ctx.save(); ctx.translate(gx - 15, gy + gh / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('Voltage V', 0, 0); ctx.restore();

    // Plot readings
    readings.forEach((r, idx) => {
      const px = gx + (r.i / 1.2) * gw;
      const py = gy + gh - (r.v / 12) * gh;
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981'; ctx.fill();
      ctx.strokeStyle = '#064e3b'; ctx.lineWidth = 1; ctx.stroke();
    });
    // Best fit line
    if (readings.length >= 2) {
      ctx.strokeStyle = '#10b981'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(gx, gy + gh);
      ctx.lineTo(gx + (1 / resistance / 1.2) * gw * 12, gy);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // Current point
    const cpx = gx + (current / 1.2) * gw;
    const cpy = gy + gh - (voltage / 12) * gh;
    ctx.beginPath(); ctx.arc(cpx, cpy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

  }, [voltage, resistance, current, readings]);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Ohm's Law — V-I Characteristics</h3>
        <button onClick={addReading} className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all">
          📌 Record Reading
        </button>
      </div>
      <canvas ref={canvasRef} width={600} height={420} className="w-full rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400 whitespace-nowrap">Voltage:</label>
        <input type="range" min={0} max={12} step={0.5} value={voltage} onChange={e => setVoltage(Number(e.target.value))} className="flex-1 h-2 rounded-full accent-amber-500" />
        <span className="text-sm font-mono text-white w-14 text-right">{voltage.toFixed(1)} V</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-violet-500/10 rounded-xl p-3 border border-violet-500/20">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Voltage</div>
          <div className="text-lg font-bold text-violet-400 font-mono">{voltage.toFixed(1)}</div>
          <div className="text-[10px] text-slate-500">V</div>
        </div>
        <div className="bg-sky-500/10 rounded-xl p-3 border border-sky-500/20">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Current</div>
          <div className="text-lg font-bold text-sky-400 font-mono">{current.toFixed(3)}</div>
          <div className="text-[10px] text-slate-500">A</div>
        </div>
        <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Resistance</div>
          <div className="text-lg font-bold text-amber-400 font-mono">{resistance}</div>
          <div className="text-[10px] text-slate-500">Ω</div>
        </div>
      </div>
    </div>
  );
};

export default OhmsLawLab;
