import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const GATES = {
  AND:  { fn: (a: boolean, b: boolean) => a && b, expr: 'Y = A · B', inputs: 2 },
  OR:   { fn: (a: boolean, b: boolean) => a || b, expr: 'Y = A + B', inputs: 2 },
  NOT:  { fn: (a: boolean) => !a,                 expr: 'Y = Ā',     inputs: 1 },
  NAND: { fn: (a: boolean, b: boolean) => !(a && b), expr: 'Y = (A·B)̄', inputs: 2 },
  NOR:  { fn: (a: boolean, b: boolean) => !(a || b), expr: 'Y = (A+B)̄', inputs: 2 },
  XOR:  { fn: (a: boolean, b: boolean) => a !== b,  expr: 'Y = A ⊕ B', inputs: 2 },
  XNOR: { fn: (a: boolean, b: boolean) => a === b,  expr: 'Y = (A⊕B)̄', inputs: 2 },
};

type GateType = keyof typeof GATES;

const LogicGates: React.FC = () => {
  const [activeGate, setActiveGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const gateInfo = GATES[activeGate];
  // @ts-ignore
  const output = gateInfo.inputs === 1 ? gateInfo.fn(inputA) : gateInfo.fn(inputA, inputB);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear & background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cw = canvas.width;
    const ch = canvas.height;
    
    // Draw styles
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1e293b'; // dark slate
    ctx.fillStyle = '#f8fafc';
    
    // Math helpers
    const cx = cw / 2;
    const cy = ch / 2;
    const s = 40; // scale
    
    ctx.beginPath();
    
    if (activeGate === 'AND' || activeGate === 'NAND') {
      ctx.moveTo(cx - s, cy - s);
      ctx.lineTo(cx, cy - s);
      ctx.arc(cx, cy, s, -Math.PI/2, Math.PI/2);
      ctx.lineTo(cx - s, cy + s);
      ctx.closePath();
    } 
    else if (activeGate === 'OR' || activeGate === 'NOR' || activeGate === 'XOR' || activeGate === 'XNOR') {
      if (activeGate.includes('X')) {
        // Draw the extra XOR line
        ctx.beginPath();
        ctx.moveTo(cx - s - 10, cy - s);
        ctx.quadraticCurveTo(cx - s + 10, cy, cx - s - 10, cy + s);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(cx - s, cy - s);
      ctx.quadraticCurveTo(cx + s/2, cy - s, cx + s*1.5, cy);
      ctx.quadraticCurveTo(cx + s/2, cy + s, cx - s, cy + s);
      ctx.quadraticCurveTo(cx - s + 15, cy, cx - s, cy - s);
    }
    else if (activeGate === 'NOT') {
      ctx.moveTo(cx - s, cy - s);
      ctx.lineTo(cx + s, cy);
      ctx.lineTo(cx - s, cy + s);
      ctx.closePath();
    }
    
    ctx.fill();
    ctx.stroke();
    
    // Draw inversion bubble
    let outX = cx + (activeGate === 'NOT' ? s : (activeGate.includes('OR') ? s*1.5 : s));
    if (activeGate === 'NAND' || activeGate === 'NOR' || activeGate === 'XNOR' || activeGate === 'NOT') {
      ctx.beginPath();
      ctx.arc(outX + 6, cy, 6, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();
      outX += 12;
    }
    
    // Draw Inputs
    ctx.beginPath();
    if (gateInfo.inputs === 2) {
      // Input A
      ctx.moveTo(cx - s - (activeGate.includes('X') ? 10 : 0), cy - s/2);
      ctx.lineTo(cx - s - 40, cy - s/2);
      // Input B
      ctx.moveTo(cx - s - (activeGate.includes('X') ? 10 : 0), cy + s/2);
      ctx.lineTo(cx - s - 40, cy + s/2);
    } else {
      ctx.moveTo(cx - s, cy);
      ctx.lineTo(cx - s - 40, cy);
    }
    // Draw Output
    ctx.moveTo(outX, cy);
    ctx.lineTo(outX + 40, cy);
    ctx.stroke();
    
    // Draw Text Labels
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = inputA ? '#10b981' : '#ef4444'; // Red=0, Green=1
    if (gateInfo.inputs === 2) {
      ctx.fillText(inputA ? '1' : '0', cx - s - 60, cy - s/2 + 6);
      ctx.fillStyle = inputB ? '#10b981' : '#ef4444';
      ctx.fillText(inputB ? '1' : '0', cx - s - 60, cy + s/2 + 6);
    } else {
      ctx.fillText(inputA ? '1' : '0', cx - s - 60, cy + 6);
    }
    
    ctx.fillStyle = output ? '#10b981' : '#ef4444';
    ctx.fillText(output ? '1' : '0', outX + 50, cy + 6);

  }, [activeGate, inputA, inputB]);

  const TruthTable = () => {
    const rows = gateInfo.inputs === 1 
      ? [[false], [true]] 
      : [[false, false], [false, true], [true, false], [true, true]];
      
    return (
      <table className="w-full text-center border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-slate-400 text-sm">
            <th className="py-2">A</th>
            {gateInfo.inputs === 2 && <th className="py-2">B</th>}
            <th className="py-2">Output (Y)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            // @ts-ignore
            const out = gateInfo.inputs === 1 ? gateInfo.fn(row[0]) : gateInfo.fn(row[0], row[1]);
            const isCurrent = gateInfo.inputs === 1 ? (inputA === row[0]) : (inputA === row[0] && inputB === row[1]);
            return (
              <tr key={i} className={`border-b border-white/5 transition-colors ${isCurrent ? 'bg-purple-500/20' : 'hover:bg-white/5'}`}>
                <td className="py-3 font-mono">{row[0] ? '1' : '0'}</td>
                {gateInfo.inputs === 2 && <td className="py-3 font-mono">{row[1] ? '1' : '0'}</td>}
                <td className={`py-3 font-mono font-bold ${out ? 'text-green-400' : 'text-red-400'}`}>{out ? '1' : '0'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="pt-24 pb-12 px-6 lg:px-12 max-w-5xl mx-auto min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">Logic Gates Sandbox</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Interactive simulation of fundamental digital logic gates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gate Selector */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/60">
          <h2 className="text-lg font-bold text-white mb-4">Select Gate</h2>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(GATES) as GateType[]).map(gate => (
              <button
                key={gate}
                onClick={() => setActiveGate(gate)}
                className={`flex-1 min-w-[30%] py-3 rounded-xl font-bold text-sm transition-all border ${
                  activeGate === gate 
                    ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                    : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                {gate}
              </button>
            ))}
          </div>
          
          <div className="mt-8 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <div className="text-sm text-purple-400 font-bold mb-1">Boolean Expression</div>
            <div className="text-2xl font-mono text-white">{gateInfo.expr}</div>
          </div>
        </div>

        {/* Main Canvas & Output */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/60 flex flex-col items-center">
          
          <div className="w-full max-w-md bg-white p-2 rounded-2xl shadow-xl mb-8">
            <canvas ref={canvasRef} width={400} height={200} className="w-full rounded-xl" />
          </div>
          
          <div className="flex flex-col sm:flex-row w-full gap-8 justify-center">
            <div className="flex gap-4 bg-black/30 p-4 rounded-2xl border border-white/5">
              <div className="text-center">
                <div className="text-sm font-bold text-slate-400 mb-2">Input A</div>
                <button 
                  onClick={() => setInputA(!inputA)}
                  className={`w-16 h-16 rounded-xl font-mono text-2xl font-bold transition-all ${inputA ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}
                >
                  {inputA ? '1' : '0'}
                </button>
              </div>
              {gateInfo.inputs === 2 && (
                <div className="text-center">
                  <div className="text-sm font-bold text-slate-400 mb-2">Input B</div>
                  <button 
                    onClick={() => setInputB(!inputB)}
                    className={`w-16 h-16 rounded-xl font-mono text-2xl font-bold transition-all ${inputB ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}
                  >
                    {inputB ? '1' : '0'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center bg-black/30 p-4 rounded-2xl border border-white/5 min-w-[120px]">
              <div className="text-sm font-bold text-slate-400 mb-2">Output Y</div>
              <div className={`w-16 h-16 flex items-center justify-center rounded-xl font-mono text-2xl font-bold ${output ? 'text-green-400 bg-green-500/20 border border-green-500/40' : 'text-red-400 bg-red-500/20 border border-red-500/40'}`}>
                {output ? '1' : '0'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Truth Table */}
      <div className="mt-8 glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/60 max-w-2xl mx-auto">
        <h2 className="text-lg font-bold text-white mb-4">Truth Table</h2>
        <TruthTable />
      </div>

    </div>
  );
};

export default LogicGates;
