import { useState, useEffect, useMemo } from 'react';
import { AstronomyEngine, SolarStatus } from '../astronomy/AstronomyEngine';
import { SkyObject, Constellation, ObserverLocation } from '../types/astronomy';

export function useVisibleStars(
  location: ObserverLocation,
  overrideDate?: Date | null,
  minAltitude: number = 0
) {
  const [currentTime, setCurrentTime] = useState<Date>(overrideDate || new Date());
  const astronomyEngine = useMemo(() => AstronomyEngine.getInstance(), []);

  // Update calculation time at 1Hz (or follow override)
  useEffect(() => {
    if (overrideDate) {
      setCurrentTime(overrideDate);
      return;
    }

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [overrideDate]);

  // Compute stars and constellations
  const visibleStars = useMemo<SkyObject[]>(() => {
    return astronomyEngine.getVisibleStars(location, currentTime, minAltitude);
  }, [location, currentTime, minAltitude, astronomyEngine]);

  const constellations = useMemo<Constellation[]>(() => {
    return astronomyEngine.getConstellations(location, currentTime, minAltitude);
  }, [location, currentTime, minAltitude, astronomyEngine]);

  const solarStatus = useMemo<SolarStatus>(() => {
    return astronomyEngine.getSolarStatus(location, currentTime);
  }, [location, currentTime, astronomyEngine]);

  return {
    visibleStars,
    constellations,
    solarStatus,
    currentTime
  };
}
