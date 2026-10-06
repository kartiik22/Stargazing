/**
 * High-accuracy astronomical coordinate transformations and sidereal calculations.
 * Converts Right Ascension (RA) & Declination (Dec) -> Altitude & Azimuth
 * for a specific observer location (latitude, longitude) and Date/Time.
 */

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

export interface AltAzCoord {
  altitude: number; // in degrees [-90, +90]
  azimuth: number;  // in degrees [0, 360), 0 = North, 90 = East, 180 = South, 270 = West
}

/**
 * Calculates Greenwich Mean Sidereal Time (GMST) in hours [0, 24)
 * given a JavaScript Date.
 */
export function getGreenwichMeanSiderealTime(date: Date): number {
  // Julian Date calculation
  const time = date.getTime();
  const jd = time / 86400000 + 2440587.5;
  const d = jd - 2451545.0; // days since J2000.0

  // GMST approximation formula (IAU standard)
  let gmstHours = 18.697374558 + 24.06570982441908 * d;
  gmstHours = ((gmstHours % 24) + 24) % 24;
  return gmstHours;
}

/**
 * Calculates Local Sidereal Time (LST) in hours [0, 24)
 * given a Date and observer longitude in degrees.
 */
export function getLocalSiderealTime(date: Date, longitudeDeg: number): number {
  const gmst = getGreenwichMeanSiderealTime(date);
  const longitudeHours = longitudeDeg / 15.0;
  let lst = (gmst + longitudeHours) % 24;
  if (lst < 0) lst += 24;
  return lst;
}

/**
 * Transforms equatorial coordinates (RA, Dec) into horizontal coordinates (Alt, Az)
 * @param raHours Right ascension in hours (0..24)
 * @param decDeg Declination in degrees (-90..+90)
 * @param latDeg Observer latitude in degrees (-90..+90)
 * @param lonDeg Observer longitude in degrees (-180..+180)
 * @param date Observation date/time
 */
export function raDecToAltAz(
  raHours: number,
  decDeg: number,
  latDeg: number,
  lonDeg: number,
  date: Date
): AltAzCoord {
  const lst = getLocalSiderealTime(date, lonDeg);
  
  // Local Hour Angle in degrees
  let haHours = lst - raHours;
  if (haHours < 0) haHours += 24;
  const haDeg = haHours * 15.0;
  const haRad = haDeg * DEG2RAD;

  const latRad = latDeg * DEG2RAD;
  const decRad = decDeg * DEG2RAD;

  // Spherical trigonometry for Altitude:
  // sin(alt) = sin(dec)*sin(lat) + cos(dec)*cos(lat)*cos(HA)
  const sinAlt = Math.sin(decRad) * Math.sin(latRad) +
                 Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
  const clampedSinAlt = Math.max(-1, Math.min(1, sinAlt));
  const altRad = Math.asin(clampedSinAlt);
  const altitude = altRad * RAD2DEG;

  // Spherical trigonometry for Azimuth:
  // cos(az) = (sin(dec) - sin(alt)*sin(lat)) / (cos(alt)*cos(lat))
  // sin(az) = -cos(dec)*sin(HA) / cos(alt)
  const cosAlt = Math.cos(altRad);
  let azimuth = 0;

  if (Math.abs(cosAlt) > 1e-6) {
    const cosAz = (Math.sin(decRad) - Math.sin(altRad) * Math.sin(latRad)) / (cosAlt * Math.cos(latRad));
    const sinAz = (-Math.cos(decRad) * Math.sin(haRad)) / cosAlt;
    let azRad = Math.atan2(sinAz, cosAz);
    azimuth = azRad * RAD2DEG;
    if (azimuth < 0) azimuth += 360;
  }

  return { altitude, azimuth };
}

/**
 * Computes angular separation (great-circle distance) between two horizontal points
 */
export function angularDistanceDeg(
  alt1: number,
  az1: number,
  alt2: number,
  az2: number
): number {
  const alt1R = alt1 * DEG2RAD;
  const az1R = az1 * DEG2RAD;
  const alt2R = alt2 * DEG2RAD;
  const az2R = az2 * DEG2RAD;

  const cosD = Math.sin(alt1R) * Math.sin(alt2R) +
               Math.cos(alt1R) * Math.cos(alt2R) * Math.cos(az1R - az2R);
  const clamped = Math.max(-1, Math.min(1, cosD));
  return Math.acos(clamped) * RAD2DEG;
}
