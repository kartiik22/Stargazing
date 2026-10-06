import { AccelerometerService, AccelerometerData } from './AccelerometerService';
import { GyroscopeService, GyroscopeData } from './GyroscopeService';
import { MagnetometerService, MagnetometerData } from './MagnetometerService';
import { DeviceOrientation } from '../types/astronomy';

export type OrientationListener = (orientation: DeviceOrientation) => void;

/**
 * SensorFusion fuses Accelerometer (gravity/pitch/roll), Magnetometer (compass heading),
 * and Gyroscope (rotational delta) into a stable camera pointing Azimuth and Altitude.
 * Includes complementary filtering, low-pass smoothing, and compass tilt compensation.
 */
export class SensorFusion {
  private static instance: SensorFusion;

  private accelService = AccelerometerService.getInstance();
  private gyroService = GyroscopeService.getInstance();
  private magService = MagnetometerService.getInstance();

  private unsubAccel: (() => void) | null = null;
  private unsubGyro: (() => void) | null = null;
  private unsubMag: (() => void) | null = null;

  private listeners: Set<OrientationListener> = new Set();

  // Current fused state
  private currentAzimuth = 0;
  private currentAltitude = 0;
  private currentRoll = 0;
  private currentPitch = 0;
  private lastTimestamp = Date.now();

  // Low-pass smoothing factor (alpha: 0 = no change, 1 = instant change)
  private readonly alphaAccel = 0.25;
  private readonly alphaMag = 0.20;

  private smoothedAccel: AccelerometerData = { x: 0, y: 0, z: -1, timestamp: 0 };
  private smoothedMag: MagnetometerData = { x: 0, y: 0, z: 0, heading: 0, timestamp: 0 };

  private isRunning = false;

  private constructor() {}

  public static getInstance(): SensorFusion {
    if (!SensorFusion.instance) {
      SensorFusion.instance = new SensorFusion();
    }
    return SensorFusion.instance;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    this.accelService.start(30);
    this.gyroService.start(30);
    this.magService.start(30);

    this.unsubAccel = this.accelService.subscribe((data) => this.onAccel(data));
    this.unsubGyro = this.gyroService.subscribe((data) => this.onGyro(data));
    this.unsubMag = this.magService.subscribe((data) => this.onMag(data));
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.unsubAccel) { this.unsubAccel(); this.unsubAccel = null; }
    if (this.unsubGyro) { this.unsubGyro(); this.unsubGyro = null; }
    if (this.unsubMag) { this.unsubMag(); this.unsubMag = null; }

    this.accelService.stop();
    this.gyroService.stop();
    this.magService.stop();
  }

  public subscribe(listener: OrientationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private onAccel(data: AccelerometerData): void {
    // Low pass filter on gravity vector
    this.smoothedAccel.x += this.alphaAccel * (data.x - this.smoothedAccel.x);
    this.smoothedAccel.y += this.alphaAccel * (data.y - this.smoothedAccel.y);
    this.smoothedAccel.z += this.alphaAccel * (data.z - this.smoothedAccel.z);

    this.computeOrientation();
  }

  private onGyro(data: GyroscopeData): void {
    const now = Date.now();
    const dt = Math.max(0.001, (now - this.lastTimestamp) / 1000);
    this.lastTimestamp = now;

    // Use gyroscope integration for instant responsiveness between magnetometer updates
    // Gyro z/y gives delta rotation
    // Subtle complementary adjustment:
    const gyroDeltaHeading = (data.z * (180 / Math.PI)) * dt;
    this.currentAzimuth = (this.currentAzimuth - gyroDeltaHeading + 360) % 360;
  }

  private onMag(data: MagnetometerData): void {
    this.smoothedMag.x += this.alphaMag * (data.x - this.smoothedMag.x);
    this.smoothedMag.y += this.alphaMag * (data.y - this.smoothedMag.y);
    this.smoothedMag.z += this.alphaMag * (data.z - this.smoothedMag.z);

    this.computeOrientation();
  }

  private computeOrientation(): void {
    const ax = this.smoothedAccel.x;
    const ay = this.smoothedAccel.y;
    const az = this.smoothedAccel.z;

    const mx = this.smoothedMag.x;
    const my = this.smoothedMag.y;
    const mz = this.smoothedMag.z;

    // In portrait phone orientation:
    // When held vertically pointing straight ahead: ay ~ -1, az ~ 0
    // When pointed straight up at the zenith: ay ~ 0, az ~ -1
    // Pitch/Elevation of the back camera:
    // Altitude = atan2(-ay, -az) in camera space
    // Let's compute pitch and roll in radians:
    const normA = Math.sqrt(ax * ax + ay * ay + az * az) || 1;
    const nax = ax / normA;
    const nay = ay / normA;
    const naz = az / normA;

    // In iPhone/Android portrait orientation:
    // When holding phone upright looking at horizon:
    // - Gravity acts downwards: nay ~ -1.0, naz ~ 0.0, nax ~ 0.0
    // When pointing camera up toward the ceiling/zenith:
    // - Phone back faces upward: naz ~ -1.0, nay ~ 0.0 (altitude ~ +90°)
    // When phone is flat on table (screen up):
    // - naz ~ +1.0 (pointing at ground: altitude ~ -90°)
    // Therefore, camera optical ray altitude is atan2(-naz, -nay):
    const altitudeRad = Math.atan2(-naz, -nay);
    const altitudeDeg = altitudeRad * (180 / Math.PI);

    // Roll (tilt side-to-side)
    const rollRad = Math.atan2(nax, -nay);
    const rollDeg = rollRad * (180 / Math.PI);

    // Compass Heading of the back camera:
    // Magnetometer heading reading.heading (or tilt-compensated)
    // In portrait when aiming forward:
    let magneticHeading = this.smoothedMag.heading;
    
    // Tilt compensation:
    const cosRoll = Math.cos(rollRad);
    const sinRoll = Math.sin(rollRad);
    const cosPitch = Math.cos(altitudeRad);
    const sinPitch = Math.sin(altitudeRad);

    const Xh = mx * cosRoll + mz * sinRoll;
    const Yh = mx * sinPitch * sinRoll + my * cosPitch - mz * sinPitch * cosRoll;

    let tiltCompensatedHeading = Math.atan2(-Xh, Yh) * (180 / Math.PI);
    if (tiltCompensatedHeading < 0) tiltCompensatedHeading += 360;

    // Use tilt-compensated heading when valid, fallback to magnetometer heading
    const targetHeading = !isNaN(tiltCompensatedHeading) ? tiltCompensatedHeading : magneticHeading;

    // Smooth fusion into azimuth
    let diff = (targetHeading - this.currentAzimuth + 540) % 360 - 180;
    this.currentAzimuth = (this.currentAzimuth + diff * 0.25 + 360) % 360;

    this.currentAltitude = this.currentAltitude + 0.3 * (altitudeDeg - this.currentAltitude);
    this.currentRoll = rollDeg;
    this.currentPitch = altitudeDeg;

    // Heading confidence check based on magnetic field strength (typical Earth B-field: 25 to 65 μT)
    const bFieldNorm = Math.sqrt(mx * mx + my * my + mz * mz);
    let headingConfidence: 'high' | 'medium' | 'low' = 'high';
    if (bFieldNorm < 15 || bFieldNorm > 90) {
      headingConfidence = 'low';
    } else if (bFieldNorm < 22 || bFieldNorm > 75) {
      headingConfidence = 'medium';
    }

    const orientation: DeviceOrientation = {
      azimuth: this.currentAzimuth,
      altitude: this.currentAltitude,
      roll: this.currentRoll,
      pitch: this.currentPitch,
      timestamp: Date.now(),
      headingConfidence
    };

    this.notify(orientation);
  }

  private notify(orientation: DeviceOrientation): void {
    this.listeners.forEach((listener) => listener(orientation));
  }

  public getOrientation(): DeviceOrientation {
    return {
      azimuth: this.currentAzimuth,
      altitude: this.currentAltitude,
      roll: this.currentRoll,
      pitch: this.currentPitch,
      timestamp: Date.now()
    };
  }
}
