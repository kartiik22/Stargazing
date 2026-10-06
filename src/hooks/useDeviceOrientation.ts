import { useState, useEffect } from 'react';
import { SensorFusion } from '../sensors/SensorFusion';
import { DeviceOrientation } from '../types/astronomy';

export function useDeviceOrientation(overrideOrientation?: Partial<DeviceOrientation> | null) {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    azimuth: 0,
    altitude: 45,
    roll: 0,
    pitch: 45,
    timestamp: Date.now(),
    headingConfidence: 'high'
  });

  useEffect(() => {
    if (overrideOrientation) {
      setOrientation((prev) => ({
        ...prev,
        ...overrideOrientation,
        timestamp: Date.now()
      }));
      return;
    }

    const sensorFusion = SensorFusion.getInstance();
    sensorFusion.start();

    // Throttle UI orientation updates to ~30Hz
    let lastUpdate = 0;
    const unsub = sensorFusion.subscribe((newOrientation) => {
      const now = Date.now();
      if (now - lastUpdate >= 33) {
        lastUpdate = now;
        setOrientation(newOrientation);
      }
    });

    return () => {
      unsub();
      sensorFusion.stop();
    };
  }, [overrideOrientation]);

  return orientation;
}
