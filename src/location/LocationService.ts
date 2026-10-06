import * as Location from 'expo-location';
import { ObserverLocation } from '../types/astronomy';

export class LocationService {
  private static instance: LocationService;
  private cachedLocation: ObserverLocation | null = null;
  private locationSubscription: Location.LocationSubscription | null = null;

  private constructor() {}

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  public async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (e) {
      console.warn('Failed to request location permissions:', e);
      return false;
    }
  }

  public async hasPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  }

  public async getCurrentLocation(fallbackToDefault: boolean = true): Promise<ObserverLocation> {
    const granted = await this.hasPermission();
    if (!granted) {
      const requested = await this.requestPermissions();
      if (!requested) {
        if (fallbackToDefault) {
          return this.getDefaultLocation();
        }
        throw new Error('Location permission is required to calculate the visible sky accurately.');
      }
    }

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      let city = 'Delhi';
      let country = 'India';

      try {
        const reverse = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (reverse && reverse.length > 0) {
          const rev = reverse[0];
          city = rev.city || rev.subregion || rev.district || rev.region || rev.name || 'Delhi';
          country = rev.country || 'India';
        }
      } catch {
        // Reverse geocoding optional (offline fallback)
      }

      this.cachedLocation = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        altitude: loc.coords.altitude || 0,
        accuracy: loc.coords.accuracy || 10,
        city,
        country,
        timestamp: loc.timestamp
      };

      return this.cachedLocation;
    } catch (error) {
      if (this.cachedLocation) {
        return this.cachedLocation;
      }
      return this.getDefaultLocation();
    }
  }

  public getDefaultLocation(): ObserverLocation {
    return {
      latitude: 28.6139,
      longitude: 77.2090,
      altitude: 216,
      accuracy: 10,
      city: 'Delhi',
      country: 'India',
      timestamp: Date.now()
    };
  }

  public getCachedLocation(): ObserverLocation | null {
    return this.cachedLocation;
  }
}
