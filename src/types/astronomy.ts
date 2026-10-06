export type SkyObjectType = 'star' | 'planet' | 'constellation';

export interface SkyObject {
  id: string;
  name: string;
  latinName?: string;
  type: SkyObjectType;
  ra: number;        // Right Ascension in hours (0..24) or degrees
  dec: number;       // Declination in degrees (-90..+90)
  magnitude: number; // Apparent magnitude (lower is brighter)
  distanceLightYears?: number;
  constellationId?: string;
  constellationName?: string;
  description: string;
  mythology?: string;
  missionHint?: string;
  // Computed real-time observation properties
  altitude: number;  // Elevation in degrees (-90..+90)
  azimuth: number;   // Bearing in degrees (0..360, North = 0/360, East = 90)
  isVisible: boolean; // Above horizon (altitude > 0)
}

export interface ConstellationLine {
  star1Id: string;
  star2Id: string;
}

export interface Constellation {
  id: string;
  name: string;
  englishName: string;
  centerRa: number;
  centerDec: number;
  stars: string[]; // star IDs
  lines: [string, string][]; // pairs of star IDs
  description: string;
  season: 'all' | 'winter' | 'spring' | 'summer' | 'autumn';
  altitude?: number;
  azimuth?: number;
  isVisible?: boolean;
}

export interface ObserverLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  city?: string;
  country?: string;
  accuracy?: number;
  timestamp: number;
}

export interface DeviceOrientation {
  azimuth: number;     // 0..360 deg, camera pointing compass direction
  altitude: number;    // -90..+90 deg, camera pointing up/down
  roll: number;        // roll tilt
  pitch: number;       // raw pitch
  timestamp: number;
  headingConfidence?: 'high' | 'medium' | 'low';
  matrix?: number[];   // row-major 3x3, device -> world (E,N,U)
}

export interface TouchGrassMission {
  id: string;
  title: string;
  targetObjectId: string;
  targetObjectName: string;
  targetType: SkyObjectType;
  difficulty: 'easy' | 'moderate' | 'expert';
  hint: string;
  instructions: string;
  completed: boolean;
  unlockedAt?: number;
}

export interface AIIdentification {
  provider: string;
  matchedObjectId?: string;
  matchedObjectName?: string;
  confidence: number;
  description: string;
  loreAndFacts: string[];
  suggestedMission?: string;
  isLocalInference: boolean;
  latencyMs: number;
}
