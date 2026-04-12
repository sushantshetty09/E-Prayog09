import React, { useState, useRef, useEffect } from 'react';
const ZenerDiodeLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [voltage, setVoltage] = useState(0);
  const Vz = 5.6;
  const Vf = 0.7;
  const isForward = voltage >= 0;
  const current = isForward ? (voltage > Vf ? (voltage - Vf) * 20 : 0) : (voltage < -Vz ? (voltage + Vz) * 50 : voltage * 0.01);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const ox = 80, oy = H - 50, gw = W - 160, gh = H - 100;
    // Axes
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + gw, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox + gw / 2, oy); ctx.lineTo(ox + gw / 2, 30); ctx.stroke();
    ctx.fillStyle = '#64748b'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
    ctx.fillText('V (Volts)', ox + gw * 0.75, oy + 20);
    ctx.fillText('I (mA)', ox + gw / 2 + 30, 25);
    // Plot I-V curve
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2; ctx.beginPath();
    for (let v = -10; v <= 5; v += 0.1) {
      const i = v >= 0 ? (v > Vf ? (v - Vf) * 20 : 0) : (v < -Vz ? (v + Vz) * 50 : v * 0.01);
      const px = ox + gw / 2 + (v / 10) * (gw / 2);
      const py = oy - (i / 100) * gh;
      if (v === -10) ctx.moveTo(px, py); else ctx.lineTo(px, Math.max(30, Math.min(oy, py)));
    }
    ctx.stroke();
    // Current point
    const cpx = ox + gw / 2 + (voltage / 10) * (gw / 2);
    const cpy = Math.max(30, Math.min(oy, oy - (current / 100) * gh));
    ctx.beginPath(); ctx.arc(cpx, cpy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    // Vz label
    const vzPx = ox + gw / 2 + (-Vz / 10) * (gw / 2);
    ctx.setLineDash([3, 3]); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(vzPx, oy); ctx.lineTo(vzPx, 30); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444'; ctx.fillText(`Vz = ${Vz}V`, vzPx, oy + 15);
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 13px Inter';
    ctx.fillText(`V = ${voltage.toFixed(1)}V | I = ${current.toFixed(1)} mA`, W / 2, H - 8);
  }, [voltage, current, Vz, Vf]);
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Zener Diode — I-V Characteristics</h3>
      <canvas ref={canvasRef} width={600} height={350} className="w-full rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400">Voltage:</label>
        <input type="range" min={-10} max={5} step={0.1} value={voltage} onChange={e => setVoltage(Number(e.target.value))} className="flex-1 h-2 accent-amber-500" />
        <span className="text-sm font-mono text-white">{voltage.toFixed(1)} V</span>
      </div>
    </div>
  );
};
export default ZenerDiodeLab;
