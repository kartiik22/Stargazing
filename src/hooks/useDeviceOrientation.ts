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
    headingConfidence: 'high',
  });

  useEffect(() => {
    if (overrideOrientation) {
      // matrix: undefined -> SkyOverlay rebuilds it from the manual alt/az instead of using a stale live one
      setOrientation((prev) => ({
        ...prev,
        ...overrideOrientation,
        matrix: undefined,
        timestamp: Date.now(),
      }));
      return;
    }

    const fusion = SensorFusion.getInstance();
    fusion.start();

    let lastUpdate = 0;
    const unsub = fusion.subscribe((o) => {
      const now = Date.now();
      if (now - lastUpdate >= 33) {
        lastUpdate = now;
        setOrientation(o);
      }
    });

    return () => {
      unsub();
      fusion.stop();
    };
  }, [overrideOrientation]);

  return orientation;
}
