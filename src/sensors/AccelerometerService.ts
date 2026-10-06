import { Accelerometer } from 'expo-sensors';

export interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export type AccelerometerListener = (data: AccelerometerData) => void;

export class AccelerometerService {
  private static instance: AccelerometerService;
  private subscription: any = null;
  private listeners: Set<AccelerometerListener> = new Set();
  private lastData: AccelerometerData = { x: 0, y: 0, z: -1, timestamp: Date.now() };

  private constructor() {}

  public static getInstance(): AccelerometerService {
    if (!AccelerometerService.instance) {
      AccelerometerService.instance = new AccelerometerService();
    }
    return AccelerometerService.instance;
  }

  public async isAvailable(): Promise<boolean> {
    try {
      return await Accelerometer.isAvailableAsync();
    } catch {
      return false;
    }
  }

  public start(updateIntervalMs: number = 30): void {
    if (this.subscription) return;
    Accelerometer.setUpdateInterval(updateIntervalMs);
    this.subscription = Accelerometer.addListener((reading) => {
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

  public subscribe(listener: AccelerometerListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getLastData(): AccelerometerData {
    return this.lastData;
  }
}
