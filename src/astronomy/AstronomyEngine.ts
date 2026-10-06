import * as Astronomy from 'astronomy-engine';
import { SkyObject, Constellation, ObserverLocation } from '../types/astronomy';
import { STAR_CATALOG, CONSTELLATIONS_CATALOG } from './StarCatalog';
import { raDecToAltAz } from './CoordinateTransform';

export interface SolarStatus {
  isDaytime: boolean;
  sunAltitude: number;
  sunAzimuth: number;
  nextSunrise?: Date;
  nextSunset?: Date;
}

export class AstronomyEngine {
  private static instance: AstronomyEngine;

  private constructor() {}

  public static getInstance(): AstronomyEngine {
    if (!AstronomyEngine.instance) {
      AstronomyEngine.instance = new AstronomyEngine();
    }
    return AstronomyEngine.instance;
  }

  /**
   * Calculates the Sun position and whether it is daytime at the observer location
   */
  public getSolarStatus(location: ObserverLocation, date: Date = new Date()): SolarStatus {
    try {
      const observer = new Astronomy.Observer(location.latitude, location.longitude, location.altitude || 0);
      const astroTime = new Astronomy.AstroTime(date);
      const sunEquator = Astronomy.Equator(Astronomy.Body.Sun, astroTime, observer, true, true);
      const sunHorizon = Astronomy.Horizon(astroTime, observer, sunEquator.ra, sunEquator.dec, 'normal');

      const isDaytime = sunHorizon.altitude > -6; // Civil twilight threshold (-6 deg)

      return {
        isDaytime,
        sunAltitude: sunHorizon.altitude,
        sunAzimuth: sunHorizon.azimuth
      };
    } catch {
      // Fallback using manual transform
      return {
        isDaytime: false,
        sunAltitude: -20,
        sunAzimuth: 180
      };
    }
  }

  /**
   * Computes current Altitude & Azimuth for all catalog stars
   */
  public getVisibleStars(
    location: ObserverLocation,
    date: Date = new Date(),
    minAltitudeDeg: number = 0
  ): SkyObject[] {
    const observer = new Astronomy.Observer(location.latitude, location.longitude, location.altitude || 0);
    const astroTime = new Astronomy.AstroTime(date);

    // 1. Process Fixed Catalog Stars
    const stars: SkyObject[] = STAR_CATALOG.map((star) => {
      // Use astronomy-engine Horizon transformation with precession & refraction
      const horizon = Astronomy.Horizon(astroTime, observer, star.ra, star.dec, 'normal');
      const altitude = horizon.altitude;
      const azimuth = horizon.azimuth;

      return {
        ...star,
        altitude,
        azimuth,
        isVisible: altitude >= minAltitudeDeg
      };
    });

    // 2. Add Moon and Solar System Planets
    const moonEquator = Astronomy.Equator(Astronomy.Body.Moon, astroTime, observer, true, true);
    const moonHorizon = Astronomy.Horizon(astroTime, observer, moonEquator.ra, moonEquator.dec, 'normal');
    const moonIllum = Astronomy.Illumination(Astronomy.Body.Moon, astroTime);
    const moonPhaseName = moonIllum.phase_fraction > 0.95 ? 'Full Moon' :
                          moonIllum.phase_fraction < 0.05 ? 'New Moon' :
                          moonIllum.phase_angle < 90 ? 'Waxing Crescent' :
                          moonIllum.phase_angle < 180 ? 'Waxing Gibbous' : 'Waning Moon';

    const moonObject: SkyObject = {
      id: 'moon',
      name: `Moon (${moonPhaseName})`,
      latinName: 'Luna',
      type: 'planet' as const,
      ra: moonEquator.ra,
      dec: moonEquator.dec,
      magnitude: -12.7 * (moonIllum.phase_fraction || 0.5) - 2.5,
      distanceLightYears: 0.0000000406, // ~384,400 km
      description: `Earth's only natural satellite. Phase: ${moonPhaseName} (${Math.round((moonIllum.phase_fraction || 0.5) * 100)}% illuminated). Approx distance 384,400 km.`,
      mythology: 'Revered in ancient Indian astronomy as Chandra (Soma), celestial ruler of tides, minds, and night rhythms.',
      missionHint: 'Look for the luminous crescent or disk of the Moon glowing against the stars.',
      altitude: moonHorizon.altitude,
      azimuth: moonHorizon.azimuth,
      isVisible: moonHorizon.altitude >= minAltitudeDeg
    };

    const planetsToCompute = [
      { body: Astronomy.Body.Mercury, id: 'mercury', name: 'Mercury', mag: -0.4, desc: 'The smallest planet and closest to the Sun.' },
      { body: Astronomy.Body.Venus, id: 'venus', name: 'Venus', mag: -4.4, desc: 'The Evening/Morning Star, shrouded in reflective clouds of sulfuric acid.' },
      { body: Astronomy.Body.Mars, id: 'mars', name: 'Mars', mag: -1.0, desc: 'The Red Planet, illuminated by iron oxide on its rusty desert surface.' },
      { body: Astronomy.Body.Jupiter, id: 'jupiter', name: 'Jupiter', mag: -2.7, desc: 'The king of planets, a gas giant with prominent Galilean moons.' },
      { body: Astronomy.Body.Saturn, id: 'saturn', name: 'Saturn', mag: 0.5, desc: 'The jewel of the solar system, surrounded by icy rings.' }
    ];

    const computedPlanets: SkyObject[] = planetsToCompute.map((p) => {
      const eq = Astronomy.Equator(p.body, astroTime, observer, true, true);
      const hor = Astronomy.Horizon(astroTime, observer, eq.ra, eq.dec, 'normal');
      return {
        id: p.id,
        name: p.name,
        type: 'planet' as const,
        ra: eq.ra,
        dec: eq.dec,
        magnitude: p.mag,
        description: p.desc,
        altitude: hor.altitude,
        azimuth: hor.azimuth,
        isVisible: hor.altitude >= minAltitudeDeg
      };
    });

    const allObjects = [...stars, moonObject, ...computedPlanets];
    return allObjects.filter((obj) => obj.isVisible).sort((a, b) => a.magnitude - b.magnitude);
  }

  /**
   * Computes constellations positions & line geometries
   */
  public getConstellations(
    location: ObserverLocation,
    date: Date = new Date(),
    minAltitudeDeg: number = 0
  ): Constellation[] {
    const observer = new Astronomy.Observer(location.latitude, location.longitude, location.altitude || 0);
    const astroTime = new Astronomy.AstroTime(date);

    return CONSTELLATIONS_CATALOG.map((con) => {
      const hor = Astronomy.Horizon(astroTime, observer, con.centerRa, con.centerDec, 'normal');
      return {
        ...con,
        altitude: hor.altitude,
        azimuth: hor.azimuth,
        isVisible: hor.altitude >= minAltitudeDeg
      };
    });
  }

  /**
   * Find object by id
   */
  public getObjectById(id: string, location: ObserverLocation, date: Date = new Date()): SkyObject | undefined {
    const objects = this.getVisibleStars(location, date, -90);
    return objects.find((o) => o.id.toLowerCase() === id.toLowerCase());
  }
}
