import { useState, useEffect } from 'react';
import { LocationService } from '../location/LocationService';
import { ObserverLocation } from '../types/astronomy';

export function useLocation(overrideLocation?: Partial<ObserverLocation> | null) {
  const locationService = LocationService.getInstance();
  const [location, setLocation] = useState<ObserverLocation>(locationService.getDefaultLocation());
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchLoc() {
      if (overrideLocation) {
        setLocation((prev) => ({
          ...prev,
          ...overrideLocation,
          timestamp: Date.now()
        }));
        setLoading(false);
        return;
      }

      try {
        const permitted = await locationService.hasPermission();
        if (isMounted) setHasPermission(permitted);

        const loc = await locationService.getCurrentLocation(true);
        if (isMounted) {
          setLocation(loc);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Location error');
          setLoading(false);
        }
      }
    }

    fetchLoc();

    return () => {
      isMounted = false;
    };
  }, [overrideLocation]);

  const requestPermission = async () => {
    const granted = await locationService.requestPermissions();
    setHasPermission(granted);
    if (granted) {
      const loc = await locationService.getCurrentLocation();
      setLocation(loc);
    }
  };

  return { location, loading, hasPermission, error, requestPermission };
}
