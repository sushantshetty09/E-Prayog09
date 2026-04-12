import React, { useState } from 'react';
const bloodGroups = [
  { type: 'A', antiA: true, antiB: false, antiD: true },
  { type: 'B', antiA: false, antiB: true, antiD: true },
  { type: 'AB', antiA: true, antiB: true, antiD: false },
  { type: 'O', antiA: false, antiB: false, antiD: true },
];
const BloodGroupLab: React.FC = () => {
  const [bgIdx, setBgIdx] = useState(0);
  const [tested, setTested] = useState(false);
  const bg = bloodGroups[bgIdx];
  const Clump = ({ clumped }: { clumped: boolean }) => (
    <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center ${clumped ? 'border-red-500 bg-red-500/10' : 'border-slate-600 bg-slate-800/50'}`}>
      {clumped ? (
        <svg viewBox="0 0 60 60" className="w-14"><g fill="#ef4444">
          {Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={25 + Math.cos(i) * 12} cy={25 + Math.sin(i * 2.3) * 12} r={5 + Math.random() * 3} opacity={0.7} />)}
        </g><text x="30" y="55" textAnchor="middle" fill="#ef4444" fontSize="7" fontWeight="bold">Clumped</text></svg>
      ) : (
        <svg viewBox="0 0 60 60" className="w-14"><g fill="#ef4444">
          {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={15 + (i % 3) * 15} cy={15 + Math.floor(i / 3) * 20} r="4" opacity={0.5} />)}
        </g><text x="30" y="55" textAnchor="middle" fill="#94a3b8" fontSize="7">No clumping</text></svg>
      )}
    </div>
  );
  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <h3 className="text-lg font-bold text-white">Blood Group Identification (ABO)</h3>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {tested ? (
          <div className="flex gap-6 items-end">
            {[{ label: 'Anti-A', val: bg.antiA }, { label: 'Anti-B', val: bg.antiB }, { label: 'Anti-D', val: bg.antiD }].map(s => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <Clump clumped={s.val} />
                <span className="text-sm font-bold text-slate-300">{s.label}</span>
                <span className={`text-xs font-bold ${s.val ? 'text-red-400' : 'text-slate-500'}`}>{s.val ? '✅ Agglutination' : '❌ No reaction'}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">🩸</div>
            <p className="text-slate-400">Select a blood sample and add antisera to test.</p>
          </div>
        )}
        {tested && (
          <div className="text-center mt-4">
            <div className="text-3xl font-bold text-red-400">Blood Group: {bg.type}{bg.antiD ? '⁺' : '⁻'}</div>
          </div>
        )}
      </div>
      <button onClick={() => setTested(!tested)} className={`mx-auto px-6 py-3 rounded-xl font-bold text-sm ${tested ? 'bg-slate-500/20 text-slate-400' : 'bg-red-500/20 text-red-400'} border border-white/10`}>
        {tested ? '↩ Reset' : '🧪 Add Antisera'}
      </button>
      <div className="flex gap-3 justify-center">
        {bloodGroups.map((b, i) => (
          <button key={i} onClick={() => { setBgIdx(i); setTested(false); }} className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${i === bgIdx ? 'bg-red-500/20 text-red-400 border-red-500' : 'text-slate-500 border-white/10'}`}>
            Type {b.type}
          </button>
        ))}
      </div>
    </div>
  );
};
export default BloodGroupLab;
