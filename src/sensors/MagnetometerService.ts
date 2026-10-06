import { Magnetometer } from 'expo-sensors';

export interface MagnetometerData {
  x: number; // microteslas (μT)
  y: number;
  z: number;
  heading: number; // 0..360 deg
  timestamp: number;
}

export type MagnetometerListener = (data: MagnetometerData) => void;

export class MagnetometerService {
  private static instance: MagnetometerService;
  private subscription: any = null;
  private listeners: Set<MagnetometerListener> = new Set();
  private lastData: MagnetometerData = { x: 0, y: 0, z: 0, heading: 0, timestamp: Date.now() };

  private constructor() {}

  public static getInstance(): MagnetometerService {
    if (!MagnetometerService.instance) {
      MagnetometerService.instance = new MagnetometerService();
    }
    return MagnetometerService.instance;
  }

  public async isAvailable(): Promise<boolean> {
    try {
      return await Magnetometer.isAvailableAsync();
    } catch {
      return false;
    }
  }

  public start(updateIntervalMs: number = 30): void {
    if (this.subscription) return;
    Magnetometer.setUpdateInterval(updateIntervalMs);
    this.subscription = Magnetometer.addListener((reading) => {
      // Calculate compass heading in flat phone coordinate system:
      // In 2D plane: angle = atan2(y, x) * (180 / PI)
      let heading = Math.atan2(-reading.x, reading.y) * (180 / Math.PI);
      if (heading < 0) heading += 360;

      this.lastData = {
        x: reading.x,
        y: reading.y,
        z: reading.z,
        heading,
        timestamp: Date.now()
      };
      this.listeners.forEach((l) => l(this.lastData));
    });
  }

  public stop(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  public subscribe(listener: MagnetometerListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getLastData(): MagnetometerData {
    return this.lastData;
  }
}
