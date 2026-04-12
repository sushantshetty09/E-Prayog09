import React, { useState, useRef, useEffect } from 'react';

const ConcaveMirrorLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objectDist, setObjectDist] = useState(40); // cm from mirror
  const f = 15; // focal length cm

  const u = -objectDist;
  const v = (u * (-f)) / (u - (-f)); // mirror formula: 1/v + 1/u = 1/f
  const m = -v / u;
  const imageReal = v < 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    const mirrorX = W - 60;
    const axisY = H / 2;
    const scale = 4; // pixels per cm

    // Principal axis
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(20, axisY);
    ctx.lineTo(W - 20, axisY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Mirror (concave arc)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(mirrorX + 80, axisY, 100, Math.PI * 0.65, Math.PI * 1.35);
    ctx.stroke();

    // Mark F, C, P
    const pX = mirrorX;
    const fX = mirrorX - f * scale;
    const cX = mirrorX - 2 * f * scale;

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'center';
    [{ x: pX, label: 'P' }, { x: fX, label: 'F' }, { x: cX, label: 'C' }].forEach(pt => {
      ctx.beginPath(); ctx.arc(pt.x, axisY, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillText(pt.label, pt.x, axisY + 20);
    });

    // Object (arrow)
    const objX = mirrorX - objectDist * scale;
    const objH = 40;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(objX, axisY);
    ctx.lineTo(objX, axisY - objH);
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(objX - 6, axisY - objH + 10);
    ctx.lineTo(objX, axisY - objH);
    ctx.lineTo(objX + 6, axisY - objH + 10);
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();
    ctx.fillStyle = '#f59e0b';
    ctx.font = '10px Inter';
    ctx.fillText('Object', objX, axisY + 15);

    // Image (if valid)
    if (Math.abs(u + f) > 0.5) {
      const imgX = mirrorX + v * scale; // v is negative for real
      const imgH = objH * Math.abs(m);
      const imgY = imageReal ? axisY + (m < 0 ? 0 : -imgH) : axisY - imgH;

      ctx.strokeStyle = imageReal ? '#38bdf8' : '#a78bfa';
      ctx.lineWidth = 3;
      ctx.setLineDash(imageReal ? [] : [4, 4]);
      ctx.beginPath();
      ctx.moveTo(imgX, axisY);
      ctx.lineTo(imgX, imageReal ? axisY + imgH : axisY - imgH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = imageReal ? '#38bdf8' : '#a78bfa';
      ctx.font = '10px Inter';
      ctx.fillText(imageReal ? 'Real Image' : 'Virtual Image', imgX, axisY + imgH + 20);

      // Ray diagram (two principal rays)
      ctx.strokeStyle = '#ef444480';
      ctx.lineWidth = 1;
      // Ray 1: parallel to axis, then through F
      ctx.beginPath();
      ctx.moveTo(objX, axisY - objH);
      ctx.lineTo(mirrorX, axisY - objH);
      ctx.lineTo(imgX, imageReal ? axisY + imgH : axisY - imgH);
      ctx.stroke();

      // Ray 2: through center of curvature
      ctx.strokeStyle = '#22c55e80';
      ctx.beginPath();
      ctx.moveTo(objX, axisY - objH);
      ctx.lineTo(mirrorX, axisY - objH * (mirrorX - objX) / (cX - objX) + objH);
      ctx.stroke();
    }

    // Info
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 13px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(`f = ${f} cm | u = ${u} cm | v = ${v.toFixed(1)} cm | m = ${m.toFixed(2)}`, W / 2, H - 12);

  }, [objectDist, f, u, v, m, imageReal]);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Concave Mirror — Ray Diagram</h3>
      <canvas ref={canvasRef} width={700} height={320} className="w-full rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400 whitespace-nowrap">Object Distance:</label>
        <input type="range" min={5} max={80} value={objectDist} onChange={e => setObjectDist(Number(e.target.value))} className="flex-1 h-2 accent-amber-500" />
        <span className="text-sm font-mono text-white w-16 text-right">{objectDist} cm</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center text-sm">
        <div className="bg-white/5 rounded-xl p-2 border border-white/5">
          <div className="text-[9px] text-slate-500 uppercase font-bold">u</div>
          <div className="font-bold text-amber-400 font-mono">{u} cm</div>
        </div>
        <div className="bg-white/5 rounded-xl p-2 border border-sky-500/20">
          <div className="text-[9px] text-slate-500 uppercase font-bold">v</div>
          <div className="font-bold text-sky-400 font-mono">{v.toFixed(1)} cm</div>
        </div>
        <div className="bg-white/5 rounded-xl p-2 border border-white/5">
          <div className="text-[9px] text-slate-500 uppercase font-bold">m</div>
          <div className="font-bold text-white font-mono">{m.toFixed(2)}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-2 border border-emerald-500/20">
          <div className="text-[9px] text-slate-500 uppercase font-bold">Nature</div>
          <div className="font-bold text-emerald-400">{imageReal ? 'Real' : 'Virtual'}</div>
        </div>
      </div>
    </div>
  );
};

export default ConcaveMirrorLab;
