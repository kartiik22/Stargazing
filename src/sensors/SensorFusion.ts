import { AccelerometerService, AccelerometerData } from './AccelerometerService';
import { GyroscopeService, GyroscopeData } from './GyroscopeService';
import { MagnetometerService, MagnetometerData } from './MagnetometerService';
import { DeviceOrientation } from '../types/astronomy';
import { Mat3, orientationFromMatrix } from '../astronomy/projection';

export type OrientationListener = (orientation: DeviceOrientation) => void;

/* ------------------------------------------------------------------ *
 * PLATFORM SWITCHES - verify once on a real phone (see checklist).
 * ------------------------------------------------------------------ */
// expo-sensors Accelerometer: phone lying face-up reads z ≈ -1 (reading points DOWN, iOS convention).
// If altitude comes out mirrored (looking up shows negative), set this to false.
const GRAVITY_READING_IS_DOWN = true;
// If turning the phone RIGHT makes azimuth go DOWN after a second or two, flip to -1.
const GYRO_SIGN = 1;

type V3 = [number, number, number];
type Q = [number, number, number, number]; // w, x, y, z

/* ----------------------------- math ------------------------------ */
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const scale = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const norm = (a: V3): V3 | null => {
  const l = len(a);
  return l < 1e-6 ? null : scale(a, 1 / l);
};
const lerp3 = (a: V3, b: V3, k: number): V3 => [
  a[0] + k * (b[0] - a[0]),
  a[1] + k * (b[1] - a[1]),
  a[2] + k * (b[2] - a[2]),
];
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const qMul = (a: Q, b: Q): Q => [
  a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
  a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
  a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
  a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0],
];
const qNormalize = (q: Q): Q => {
  const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / l, q[1] / l, q[2] / l, q[3] / l];
};
const qNlerp = (a: Q, b: Q, k: number): Q => {
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const s = dot < 0 ? -1 : 1; // shortest path
  return qNormalize([
    a[0] + k * (s * b[0] - a[0]),
    a[1] + k * (s * b[1] - a[1]),
    a[2] + k * (s * b[2] - a[2]),
    a[3] + k * (s * b[3] - a[3]),
  ]);
};

/** Row-major 3x3 -> quaternion */
const qFromMatrix = (m: Mat3): Q => {
  const [m00, m01, m02, m10, m11, m12, m20, m21, m22] = m;
  const t = m00 + m11 + m22;
  let w: number, x: number, y: number, z: number;
  if (t > 0) {
    const s = Math.sqrt(t + 1) * 2;
    w = s / 4; x = (m21 - m12) / s; y = (m02 - m20) / s; z = (m10 - m01) / s;
  } else if (m00 > m11 && m00 > m22) {
    const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
    w = (m21 - m12) / s; x = s / 4; y = (m01 + m10) / s; z = (m02 + m20) / s;
  } else if (m11 > m22) {
    const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
    w = (m02 - m20) / s; x = (m01 + m10) / s; y = s / 4; z = (m12 + m21) / s;
  } else {
    const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
    w = (m10 - m01) / s; x = (m02 + m20) / s; y = (m12 + m21) / s; z = s / 4;
  }
  return qNormalize([w, x, y, z]);
};

const qToMatrix = (q: Q): Mat3 => {
  const [w, x, y, z] = q;
  return [
    1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y),
    2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x),
    2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y),
  ];
};

/* --------------------------- the fusion --------------------------- */
/**
 * Orientation is a quaternion q that maps DEVICE axes -> WORLD (East, North, Up).
 *
 *  1. GYRO     integrates q every sample (fast, smooth, but drifts).
 *  2. ACCEL+MAG give an absolute (TRIAD) orientation: up from gravity, east = mag x up, north = up x east.
 *     q is gently pulled toward it with a time-constant based gain, which cancels the drift.
 *
 * The output is a full rotation matrix, so ROLL is handled correctly and there is no gimbal problem at the zenith.
 */
export class SensorFusion {
  private static instance: SensorFusion;

  private accelService = AccelerometerService.getInstance();
  private gyroService = GyroscopeService.getInstance();
  private magService = MagnetometerService.getInstance();

  private unsubs: Array<() => void> = [];
  private listeners: Set<OrientationListener> = new Set();
  private isRunning = false;

  private q: Q | null = null;
  private accel: V3 | null = null; // low-passed raw accelerometer
  private mag: V3 | null = null;   // low-passed, hard-iron-corrected magnetometer

  private lastGyroTs = 0;
  private lastCorrectTs = 0;

  // Magnetic declination in degrees, east positive (Delhi ≈ +1°). Gets true north instead of magnetic north.
  private declinationDeg = 1.0;

  // Hard-iron calibration (figure-eight)
  private magOffset: V3 = [0, 0, 0];
  private calibrating = false;
  private calMin: V3 = [Infinity, Infinity, Infinity];
  private calMax: V3 = [-Infinity, -Infinity, -Infinity];

  private last: DeviceOrientation = {
    azimuth: 0, altitude: 0, roll: 0, pitch: 0, timestamp: Date.now(), headingConfidence: 'medium',
  };

  private constructor() {}

  public static getInstance(): SensorFusion {
    if (!SensorFusion.instance) SensorFusion.instance = new SensorFusion();
    return SensorFusion.instance;
  }

  public setDeclination(deg: number): void { this.declinationDeg = deg; }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    this.accelService.start(20);
    this.magService.start(20);
    this.gyroService.start(16);

    this.unsubs = [
      this.accelService.subscribe((d) => this.onAccel(d)),
      this.magService.subscribe((d) => this.onMag(d)),
      this.gyroService.subscribe((d) => this.onGyro(d)),
    ];
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.unsubs.forEach((u) => u());
    this.unsubs = [];
    this.accelService.stop();
    this.gyroService.stop();
    this.magService.stop();
    this.lastGyroTs = 0;
    this.lastCorrectTs = 0;
  }

  public subscribe(listener: OrientationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getOrientation(): DeviceOrientation { return this.last; }

  /* ---- magnetometer hard-iron calibration (wire to CalibrationModal) ---- */
  public startCalibration(): void {
    this.calibrating = true;
    this.calMin = [Infinity, Infinity, Infinity];
    this.calMax = [-Infinity, -Infinity, -Infinity];
    this.magOffset = [0, 0, 0];
    this.mag = null;
  }

  public finishCalibration(): boolean {
    this.calibrating = false;
    const spans = this.calMax.map((mx, i) => mx - this.calMin[i]);
    // Need real movement on all 3 axes (> ~30 µT of swing) or the result is garbage.
    if (spans.some((s) => !isFinite(s) || s < 30)) {
      this.magOffset = [0, 0, 0];
      return false;
    }
    this.magOffset = [
      (this.calMax[0] + this.calMin[0]) / 2,
      (this.calMax[1] + this.calMin[1]) / 2,
      (this.calMax[2] + this.calMin[2]) / 2,
    ];
    this.mag = null;
    return true;
  }

  /* ----------------------------- inputs ----------------------------- */
  private gyroActive(now: number): boolean {
    return this.lastGyroTs > 0 && now - this.lastGyroTs < 150;
  }

  private onAccel(d: AccelerometerData): void {
    const a: V3 = [d.x, d.y, d.z];
    this.accel = this.accel ? lerp3(this.accel, a, 0.3) : a;
    // Without a gyro the accel/mag stream is the only clock.
    if (!this.gyroActive(d.timestamp)) this.correctAndEmit(d.timestamp);
  }

  private onMag(d: MagnetometerData): void {
    const raw: V3 = [d.x, d.y, d.z];
    if (this.calibrating) {
      for (let i = 0; i < 3; i++) {
        this.calMin[i] = Math.min(this.calMin[i], raw[i]);
        this.calMax[i] = Math.max(this.calMax[i], raw[i]);
      }
    }
    const m: V3 = [raw[0] - this.magOffset[0], raw[1] - this.magOffset[1], raw[2] - this.magOffset[2]];
    this.mag = this.mag ? lerp3(this.mag, m, 0.2) : m;
  }

  private onGyro(d: GyroscopeData): void {
    const now = d.timestamp;
    const prev = this.lastGyroTs;
    this.lastGyroTs = now;

    if (prev > 0 && this.q) {
      const dt = clamp((now - prev) / 1000, 0, 0.1);
      const w: V3 = [d.x * GYRO_SIGN, d.y * GYRO_SIGN, d.z * GYRO_SIGN]; // rad/s in DEVICE axes
      const rate = len(w);
      if (rate > 1e-6 && dt > 0) {
        const half = (rate * dt) / 2;
        const axis = scale(w, 1 / rate);
        const s = Math.sin(half);
        const dq: Q = [Math.cos(half), axis[0] * s, axis[1] * s, axis[2] * s];
        // body-frame rotation -> right-multiply
        this.q = qNormalize(qMul(this.q, dq));
      }
    }
    this.correctAndEmit(now);
  }

  /* --------------------------- core step ---------------------------- */
  private measuredQuat(): Q | null {
    if (!this.accel || !this.mag) return null;

    const sign = GRAVITY_READING_IS_DOWN ? -1 : 1;
    const up = norm([this.accel[0] * sign, this.accel[1] * sign, this.accel[2] * sign]);
    if (!up) return null;

    const east0 = norm(cross(this.mag, up));
    if (!east0) return null; // field parallel to gravity -> heading undefined
    const north0 = cross(up, east0) as V3;

    // Rotate magnetic north -> true north around "up" (declination east positive)
    const d = (this.declinationDeg * Math.PI) / 180;
    const c = Math.cos(d);
    const s = Math.sin(d);
    const north: V3 = [
      north0[0] * c - east0[0] * s,
      north0[1] * c - east0[1] * s,
      north0[2] * c - east0[2] * s,
    ];
    const east: V3 = [
      east0[0] * c + north0[0] * s,
      east0[1] * c + north0[1] * s,
      east0[2] * c + north0[2] * s,
    ];

    // Rows = East, North, Up expressed in device coords  ==  device -> world matrix
    const M: Mat3 = [
      east[0], east[1], east[2],
      north[0], north[1], north[2],
      up[0], up[1], up[2],
    ];
    return qFromMatrix(M);
  }

  private confidence(): 'high' | 'medium' | 'low' {
    if (!this.mag) return 'low';
    const b = len(this.mag);
    if (b < 15 || b > 90) return 'low';
    if (b < 22 || b > 75) return 'medium';
    return 'high';
  }

  private correctAndEmit(now: number): void {
    const meas = this.measuredQuat();
    if (!meas) return;

    const dt = this.lastCorrectTs ? clamp((now - this.lastCorrectTs) / 1000, 0.001, 0.1) : 0.03;
    this.lastCorrectTs = now;

    if (!this.q) {
      this.q = meas;
    } else {
      // time-constant gain (frame-rate independent): gyro trusted short-term, accel/mag long-term
      const tau = this.gyroActive(now) ? 0.6 : 0.12;
      let k = 1 - Math.exp(-dt / tau);
      if (this.confidence() === 'low') k *= 0.2; // distorted field: lean on the gyro
      this.q = qNlerp(this.q, meas, k);
    }

    const matrix = qToMatrix(this.q);
    const { altitude, azimuth, roll } = orientationFromMatrix(matrix);

    this.last = {
      azimuth,
      altitude,
      roll,
      pitch: altitude,
      timestamp: now,
      headingConfidence: this.confidence(),
      matrix,
    };
    this.listeners.forEach((l) => l(this.last));
  }
}
