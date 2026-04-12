// ═══════════════════════════════════════════════════════════════
// E-Prayog Simulation Engine — Pure math/physics computation layer
// All functions are deterministic given the same inputs + env
// ═══════════════════════════════════════════════════════════════

export interface EnvironmentState {
  temperature_C: number;
  altitude_m: number;
  humidity_pct: number;
}

export const DEFAULT_ENV: EnvironmentState = {
  temperature_C: 25,
  altitude_m: 920,   // Bangalore altitude
  humidity_pct: 60,
};

// ─── GAUSSIAN NOISE ─────────────────────────────────────────
export function gaussianNoise(mean: number, stddev: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + stddev * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ─── LOCAL GRAVITY ──────────────────────────────────────────
export function localGravity(env: EnvironmentState): number {
  const g0 = 9.80665;
  const R = 6371000;
  return g0 * (R / (R + env.altitude_m)) ** 2;
}

// ─── VERNIER CALIPERS ───────────────────────────────────────
export interface InstrumentReading {
  instrument: string;
  displayed_value: number;
  uncertainty: number;
  notes?: string;
}

export function vernierReading(trueDiameter_cm: number, zeroError_cm: number): InstrumentReading {
  const LC = 0.01; // cm
  const noise = gaussianNoise(0, LC * 0.3);
  const displayed = Math.round((trueDiameter_cm + zeroError_cm + noise) / LC) * LC;
  return {
    instrument: 'Vernier Calipers',
    displayed_value: displayed,
    uncertainty: LC,
    notes: `LC = ${LC} cm, Zero Error = ${zeroError_cm >= 0 ? '+' : ''}${zeroError_cm} cm`,
  };
}

export function sphereVolume(diameter_cm: number) {
  const r = diameter_cm / 2;
  return { volume: parseFloat(((4 / 3) * Math.PI * r ** 3).toFixed(4)) };
}

// ─── SCREW GAUGE ────────────────────────────────────────────
export function screwGaugeReading(trueDiameter_mm: number, zeroError_mm: number): InstrumentReading {
  const LC = 0.01; // mm
  const noise = gaussianNoise(0, LC * 0.25);
  const displayed = Math.round((trueDiameter_mm + zeroError_mm + noise) / LC) * LC;
  return {
    instrument: 'Screw Gauge (Micrometer)',
    displayed_value: displayed,
    uncertainty: LC,
    notes: `LC = ${LC} mm, Pitch = 0.5 mm, Divisions = 50`,
  };
}

// ─── SIMPLE PENDULUM ────────────────────────────────────────
export function pendulumPeriod(length_m: number, g: number): number {
  return 2 * Math.PI * Math.sqrt(length_m / g);
}

export function pendulumExperiment(length_m: number, env: EnvironmentState) {
  const g = localGravity(env);
  const T_theo = pendulumPeriod(length_m, g);
  const T_meas = parseFloat(gaussianNoise(T_theo, 0.005).toFixed(4));
  const g_calc = parseFloat(((4 * Math.PI ** 2 * length_m) / (T_meas ** 2)).toFixed(4));
  const pctErr = parseFloat((Math.abs(g_calc - g) / g * 100).toFixed(2));
  return {
    g_local: parseFloat(g.toFixed(4)),
    T_theoretical: parseFloat(T_theo.toFixed(4)),
    T_measured: T_meas,
    g_calculated: g_calc,
    uncertainty_g: parseFloat((g_calc * 0.02).toFixed(4)),
    percentage_error: pctErr,
  };
}

export function pendulumDataTable(env: EnvironmentState) {
  const lengths = [0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 1.10, 1.20];
  const g = localGravity(env);
  return lengths.map(L => {
    const T = gaussianNoise(pendulumPeriod(L, g), 0.003);
    return { L, T2: parseFloat((T * T).toFixed(4)) };
  });
}

export function linearRegression(data: { L: number; T2: number }[]) {
  const n = data.length;
  const sx = data.reduce((a, d) => a + d.T2, 0);
  const sy = data.reduce((a, d) => a + d.L, 0);
  const sxy = data.reduce((a, d) => a + d.T2 * d.L, 0);
  const sx2 = data.reduce((a, d) => a + d.T2 * d.T2, 0);
  const slope = (n * sxy - sx * sy) / (n * sx2 - sx * sx);
  const intercept = (sy - slope * sx) / n;
  const ym = sy / n;
  const ss_tot = data.reduce((a, d) => a + (d.L - ym) ** 2, 0);
  const ss_res = data.reduce((a, d) => a + (d.L - (slope * d.T2 + intercept)) ** 2, 0);
  const r_squared = ss_tot === 0 ? 1 : 1 - ss_res / ss_tot;
  return { slope: parseFloat(slope.toFixed(6)), intercept: parseFloat(intercept.toFixed(6)), r_squared: parseFloat(r_squared.toFixed(6)) };
}

export function gFromSlope(slope: number): number {
  return parseFloat(((4 * Math.PI ** 2) * slope).toFixed(4));
}

// ─── OHM'S LAW ──────────────────────────────────────────────
export function ohmsLawReading(voltage: number, resistance: number, env: EnvironmentState) {
  const alpha = 0.004;
  const R_T = resistance * (1 + alpha * (env.temperature_C - 25));
  const I_true = voltage / R_T;
  const V_noise = gaussianNoise(voltage, 0.02);
  const I_noise = gaussianNoise(I_true, I_true * 0.01);
  const R_meas = parseFloat((V_noise / I_noise).toFixed(3));
  return {
    V: { displayed_value: parseFloat(V_noise.toFixed(2)), uncertainty: 0.02 } as InstrumentReading,
    I: { displayed_value: parseFloat(I_noise.toFixed(4)), uncertainty: parseFloat((I_true * 0.01).toFixed(4)) } as InstrumentReading,
    R_measured: R_meas,
    R_theoretical: parseFloat(R_T.toFixed(3)),
    percentage_error: parseFloat((Math.abs(R_meas - R_T) / R_T * 100).toFixed(2)),
  };
}

// ─── CONCAVE MIRROR ─────────────────────────────────────────
export function mirrorFormula(u_cm: number, f_cm: number) {
  const u = -Math.abs(u_cm);
  const f = -Math.abs(f_cm);
  const v = parseFloat(((u * f) / (u - f)).toFixed(2));
  const m = parseFloat((-v / u).toFixed(3));
  const nature = v < 0 ? 'Real' : 'Virtual';
  const size = Math.abs(m) > 1 ? 'Magnified' : Math.abs(m) < 1 ? 'Diminished' : 'Same size';
  const formula_str = `1/${v.toFixed(1)} + 1/${u.toFixed(1)} = ${(1 / v + 1 / u).toFixed(4)} ≈ 1/${f.toFixed(1)} = ${(1 / f).toFixed(4)}`;
  return { v, m, nature, size, formula_str };
}

// ─── TITRATION ──────────────────────────────────────────────
export function titrationResult(M_acid: number, V_acid_mL: number, M_base: number) {
  const V_theo = (M_acid * V_acid_mL) / M_base;
  const V_meas = parseFloat(gaussianNoise(V_theo, 0.15).toFixed(2));
  const M_back = parseFloat(((M_base * V_meas) / V_acid_mL).toFixed(4));
  const pctErr = parseFloat((Math.abs(M_back - M_acid) / M_acid * 100).toFixed(2));
  const enthalpy = parseFloat((-57.1 * M_acid * V_acid_mL / 1000).toFixed(4));
  return {
    V_base_theoretical: parseFloat(V_theo.toFixed(2)),
    V_base_measured: V_meas,
    M_acid_back_calculated: M_back,
    percentage_error: pctErr,
    enthalpy_kJ: enthalpy,
  };
}

// ─── ANALYSIS UTILITIES ─────────────────────────────────────
export function analyzeReadings(values: number[]) {
  const n = values.length;
  if (n === 0) return { mean: 0, std_deviation: 0, std_error: 0, relative_error_pct: 0 };
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, v) => a + (v - mean) ** 2, 0) / n;
  const std = Math.sqrt(variance);
  return {
    mean: parseFloat(mean.toFixed(6)),
    std_deviation: parseFloat(std.toFixed(6)),
    std_error: parseFloat((std / Math.sqrt(n)).toFixed(6)),
    relative_error_pct: parseFloat((mean !== 0 ? (std / mean) * 100 : 0).toFixed(4)),
  };
}

// ─── OSMOTIC PRESSURE (BIOLOGY) ─────────────────────────────
export function osmoticPressure(molarity: number, temp_C: number): number {
  const R = 8.314;
  const T = temp_C + 273.15;
  const i = 1;
  return parseFloat((i * molarity * R * T).toFixed(2));
}

export function waterPotential(molarity: number, temp_C: number): number {
  return parseFloat((-osmoticPressure(molarity, temp_C)).toFixed(2));
}
