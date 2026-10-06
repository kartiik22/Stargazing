/**
 * Projection helpers.
 *
 * World frame:  X = East, Y = North, Z = Up.
 * Device frame: x = right of screen, y = top of screen, z = out of the screen (toward you).
 *               The BACK camera looks along -z.
 *
 * Mat3 is ROW-MAJOR and maps DEVICE -> WORLD:  v_world = M * v_device
 * so the columns of M are the device axes written in world coordinates.
 */

export type Mat3 = number[]; // length 9, row-major

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Unit vector in world coords (E, N, U) for a given altitude / azimuth (degrees). */
export function altAzToWorld(altDeg: number, azDeg: number): [number, number, number] {
  const alt = altDeg * D2R;
  const az = azDeg * D2R;
  return [Math.cos(alt) * Math.sin(az), Math.cos(alt) * Math.cos(az), Math.sin(alt)];
}

/**
 * Build a device->world matrix for a camera pointing at (alt, az) with zero roll.
 * Used for the manual test-bench override so it goes through the SAME projection code as live sensors.
 */
export function matrixFromAltAz(altDeg: number, azDeg: number): Mat3 {
  const az = azDeg * D2R;
  const f = altAzToWorld(altDeg, azDeg); // camera forward in world

  // right = horizontal vector 90° clockwise from the viewing azimuth (never degenerate, even at zenith)
  const r: [number, number, number] = [Math.cos(az), -Math.sin(az), 0];

  // up_cam (device y) = right x forward
  const u: [number, number, number] = [
    r[1] * f[2] - r[2] * f[1],
    r[2] * f[0] - r[0] * f[2],
    r[0] * f[1] - r[1] * f[0],
  ];

  // device z = -forward
  const z: [number, number, number] = [-f[0], -f[1], -f[2]];

  // columns = r, u, z
  return [r[0], u[0], z[0], r[1], u[1], z[1], r[2], u[2], z[2]];
}

/** Camera boresight altitude / azimuth / roll from the matrix (for HUD, haptics, AI). */
export function orientationFromMatrix(M: Mat3): { altitude: number; azimuth: number; roll: number } {
  const fE = -M[2];
  const fN = -M[5];
  const fU = -M[8];

  const altitude = Math.asin(clamp(fU, -1, 1)) * R2D;

  let azimuth: number;
  if (Math.abs(fU) > 0.995) {
    // Looking (almost) straight up/down: boresight azimuth is undefined, use the top-of-phone direction instead.
    const yE = M[1];
    const yN = M[4];
    azimuth = fU > 0 ? Math.atan2(-yE, -yN) * R2D : Math.atan2(yE, yN) * R2D;
  } else {
    azimuth = Math.atan2(fE, fN) * R2D;
  }
  if (azimuth < 0) azimuth += 360;

  // Right-hand axis height above the horizon = sideways tilt
  const roll = Math.asin(clamp(M[6], -1, 1)) * R2D;

  return { altitude, azimuth, roll };
}

export interface ScreenPoint {
  x: number;
  y: number;
  nx: number; // normalized: -1..+1 spans the screen width
  ny: number; // normalized: -1..+1 spans the screen height
  depth: number;
}

/**
 * Project a sky position onto the screen.
 * Only the VERTICAL field of view is a parameter; horizontal FOV follows from the screen aspect
 * ratio because the camera preview is cropped ("cover") to fill the screen.
 */
export function projectToScreen(
  objAltDeg: number,
  objAzDeg: number,
  M: Mat3,
  verticalFovDeg: number,
  screenW: number,
  screenH: number,
  minDepth = 0.1
): ScreenPoint | null {
  const v = altAzToWorld(objAltDeg, objAzDeg);

  // device coords = M^T * v
  const xd = M[0] * v[0] + M[3] * v[1] + M[6] * v[2];
  const yd = M[1] * v[0] + M[4] * v[1] + M[7] * v[2];
  const zd = M[2] * v[0] + M[5] * v[1] + M[8] * v[2];

  const depth = -zd; // camera looks along -z
  if (depth <= minDepth) return null;

  const tanV = Math.tan((verticalFovDeg / 2) * D2R);
  const tanH = tanV * (screenW / screenH);

  const nx = xd / (depth * tanH);
  const ny = yd / (depth * tanV);

  return {
    x: screenW / 2 + nx * (screenW / 2),
    y: screenH / 2 - ny * (screenH / 2),
    nx,
    ny,
    depth,
  };
}
