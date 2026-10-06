import { Gyroscope } from 'expo-sensors';

export interface GyroscopeData {
  x: number; // rad/s
  y: number; // rad/s
  z: number; // rad/s
  timestamp: number;
}

export type GyroscopeListener = (data: GyroscopeData) => void;

export class GyroscopeService {
  private static instance: GyroscopeService;
  private subscription: any = null;
  private listeners: Set<GyroscopeListener> = new Set();
  private lastData: GyroscopeData = { x: 0, y: 0, z: 0, timestamp: Date.now() };

  private constructor() {}

  public static getInstance(): GyroscopeService {
    if (!GyroscopeService.instance) {
      GyroscopeService.instance = new GyroscopeService();
    }
    return GyroscopeService.instance;
  }

  public async isAvailable(): Promise<boolean> {
    try {
      return await Gyroscope.isAvailableAsync();
    } catch {
      return false;
    }
  }

  public start(updateIntervalMs: number = 30): void {
    if (this.subscription) return;
    Gyroscope.setUpdateInterval(updateIntervalMs);
    this.subscription = Gyroscope.addListener((reading) => {
      this.lastData = {
        x: reading.x,
        y: reading.y,
        z: reading.z,
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

  public subscribe(listener: GyroscopeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getLastData(): GyroscopeData {
    return this.lastData;
  }
}
