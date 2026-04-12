import React, { useState, useRef, useEffect } from 'react';
const StatisticsLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState([12, 15, 18, 22, 25, 18, 30, 15, 22, 28]);
  const [input, setInput] = useState(data.join(', '));
  const sorted = [...data].sort((a, b) => a - b);
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const median = data.length % 2 === 0 ? (sorted[data.length / 2 - 1] + sorted[data.length / 2]) / 2 : sorted[Math.floor(data.length / 2)];
  const freq: Record<number, number> = {};
  data.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
  const maxFreq = Math.max(...Object.values(freq));
  const modes = Object.entries(freq).filter(([, f]) => f === maxFreq).map(([v]) => Number(v));
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const ox = 50, oy = H - 40, gw = W - 80, gh = H - 80;
    const maxVal = Math.max(...data) * 1.2;
    // Axes
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + gw, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - gh); ctx.stroke();
    // Bars
    const barW = Math.min(gw / data.length - 4, 40);
    data.forEach((v, i) => {
      const x = ox + (i / data.length) * gw + 2;
      const h = (v / maxVal) * gh;
      const isMode = modes.includes(v);
      ctx.fillStyle = isMode ? '#f59e0b80' : '#3b82f660';
      ctx.fillRect(x, oy - h, barW, h);
      ctx.strokeStyle = isMode ? '#f59e0b' : '#3b82f6';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, oy - h, barW, h);
      ctx.fillStyle = '#e2e8f0'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
      ctx.fillText(`${v}`, x + barW / 2, oy - h - 5);
    });
    // Mean line
    const meanY = oy - (mean / maxVal) * gh;
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2; ctx.setLineDash([5, 3]);
    ctx.beginPath(); ctx.moveTo(ox, meanY); ctx.lineTo(ox + gw, meanY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 10px Inter'; ctx.textAlign = 'left';
    ctx.fillText(`Mean = ${mean.toFixed(1)}`, ox + gw + 5, meanY + 4);
    // Median line
    const medY = oy - (median / maxVal) * gh;
    ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 2; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(ox, medY); ctx.lineTo(ox + gw, medY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#a78bfa'; ctx.fillText(`Median = ${median}`, ox + gw + 5, medY + 4);
  }, [data, mean, median, modes]);
  const handleUpdate = () => {
    const nums = input.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (nums.length > 0) setData(nums);
  };
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Statistics — Mean, Median, Mode</h3>
      <canvas ref={canvasRef} width={600} height={280} className="w-full rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50" placeholder="Enter data separated by commas" />
        <button onClick={handleUpdate} className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-sm border border-amber-500/30">Update</button>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center text-sm">
        <div className="bg-emerald-500/10 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">Mean</div><div className="font-bold text-emerald-400 font-mono">{mean.toFixed(2)}</div></div>
        <div className="bg-violet-500/10 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">Median</div><div className="font-bold text-violet-400 font-mono">{median}</div></div>
        <div className="bg-amber-500/10 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">Mode</div><div className="font-bold text-amber-400 font-mono">{modes.join(', ')}</div></div>
        <div className="bg-white/5 rounded-xl p-2"><div className="text-[9px] text-slate-500 uppercase font-bold">Range</div><div className="font-bold text-white font-mono">{sorted[sorted.length - 1] - sorted[0]}</div></div>
      </div>
    </div>
  );
};
export default StatisticsLab;
