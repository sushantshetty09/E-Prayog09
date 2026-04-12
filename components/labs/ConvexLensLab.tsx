import React, { useState, useRef, useEffect } from 'react';

const ConvexLensLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objectDist, setObjectDist] = useState(35);
  const f = 15;
  const u = -objectDist;
  const v_val = (u * f) / (u + f);
  const m = v_val / u;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
    const lensX = W / 2, axisY = H / 2, sc = 3.5;

    // Axis
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(20, axisY); ctx.lineTo(W-20, axisY); ctx.stroke(); ctx.setLineDash([]);

    // Lens (double convex shape)
    ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(lensX, axisY, 6, 80, 0, 0, Math.PI*2); ctx.stroke();

    // F, 2F markers
    ctx.fillStyle = '#10b981'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
    [{x: lensX - f*sc, l:'F₁'},{x: lensX + f*sc, l:'F₂'},{x: lensX - 2*f*sc, l:'2F₁'},{x: lensX + 2*f*sc, l:'2F₂'}].forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, axisY, 3, 0, Math.PI*2); ctx.fill();
      ctx.fillText(p.l, p.x, axisY+18);
    });

    // Object
    const objX = lensX + u * sc;
    const objH = 35;
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(objX, axisY); ctx.lineTo(objX, axisY-objH); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(objX-5, axisY-objH+8); ctx.lineTo(objX, axisY-objH); ctx.lineTo(objX+5, axisY-objH+8); ctx.stroke();

    // Image
    if (Math.abs(u + f) > 0.5) {
      const imgX = lensX + v_val * sc;
      const imgH = Math.abs(m) * objH;
      ctx.strokeStyle = v_val > 0 ? '#38bdf8' : '#a78bfa'; ctx.lineWidth = 3;
      ctx.setLineDash(v_val > 0 ? [] : [4,4]);
      ctx.beginPath(); ctx.moveTo(imgX, axisY); ctx.lineTo(imgX, m < 0 ? axisY+imgH : axisY-imgH); ctx.stroke();
      ctx.setLineDash([]);

      // Rays
      ctx.strokeStyle = '#ef444460'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(objX, axisY-objH); ctx.lineTo(lensX, axisY-objH);
      ctx.lineTo(imgX, m < 0 ? axisY+imgH : axisY-imgH); ctx.stroke();
      ctx.strokeStyle = '#22c55e60';
      ctx.beginPath(); ctx.moveTo(objX, axisY-objH); ctx.lineTo(lensX, axisY); ctx.lineTo(imgX, m < 0 ? axisY+imgH : axisY-imgH); ctx.stroke();
    }
    ctx.fillStyle='#10b981'; ctx.font='bold 12px Inter'; ctx.textAlign='center';
    ctx.fillText(`f=${f}cm | u=${u}cm | v=${v_val.toFixed(1)}cm | m=${m.toFixed(2)}`, W/2, H-10);
  }, [objectDist, f, u, v_val, m]);

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Convex Lens — Ray Diagram</h3>
      <canvas ref={canvasRef} width={700} height={300} className="w-full rounded-xl border border-white/10 bg-slate-950" />
      <div className="flex items-center gap-4 px-2">
        <label className="text-sm text-slate-400">Object Distance:</label>
        <input type="range" min={5} max={80} value={objectDist} onChange={e=>setObjectDist(Number(e.target.value))} className="flex-1 h-2 accent-blue-500" />
        <span className="text-sm font-mono text-white w-16 text-right">{objectDist} cm</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center text-sm">
        {[{l:'u',v:`${u} cm`,c:'text-amber-400'},{l:'v',v:`${v_val.toFixed(1)} cm`,c:'text-sky-400'},{l:'m',v:m.toFixed(2),c:'text-white'},{l:'Nature',v:v_val>0?'Real':'Virtual',c:'text-emerald-400'}].map(d=>(
          <div key={d.l} className="bg-white/5 rounded-xl p-2 border border-white/5">
            <div className="text-[9px] text-slate-500 uppercase font-bold">{d.l}</div>
            <div className={`font-bold font-mono ${d.c}`}>{d.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConvexLensLab;
