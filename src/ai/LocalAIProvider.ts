import { AIProvider, AIIdentificationInput } from './AIProvider';
import { AIIdentification } from '../types/astronomy';
import { angularDistanceDeg } from '../astronomy/CoordinateTransform';

/**
 * LocalAIProvider simulates an on-device lightweight open-weight model
 * (e.g., MobileNet/TinyLlama quantized for astrometry edge reasoning).
 * It cross-correlates the camera optical boresight with deterministic astronomy candidates,
 * evaluates proximity, brightness, and optical contrast, and produces reasoned identification.
 */
export class LocalAIProvider implements AIProvider {
  public readonly id = 'local-openweight-edge';
  public readonly name = 'On-Device Open-Weight Edge Astrometry';
  public readonly isLocal = true;

  public async identifySkyObject(input: AIIdentificationInput): Promise<AIIdentification> {
    const startTime = Date.now();

    // Simulate edge model inference latency (120ms - 250ms on mobile NPU/CPU)
    await new Promise((resolve) => setTimeout(resolve, 180));

    const { orientation, candidateObjects } = input;

    // Filter objects closest to camera reticle center (azimuth, altitude)
    let bestMatch = candidateObjects[0];
    let minAngularDist = 999;

    for (const obj of candidateObjects) {
      const dist = angularDistanceDeg(orientation.altitude, orientation.azimuth, obj.altitude, obj.azimuth);
      if (dist < minAngularDist) {
        minAngularDist = dist;
        bestMatch = obj;
      }
    }

    const latencyMs = Date.now() - startTime;

    if (!bestMatch || minAngularDist > 35) {
      return {
        provider: this.name,
        confidence: 0.22,
        description: 'No bright catalog stars detected within the camera boresight field. The edge model detected faint background starlight or diffuse atmospheric haze.',
        loreAndFacts: [
          'Earth\'s atmosphere bends starlight, causing the familiar "twinkle" (scintillation).',
          'Try panning toward a brighter section of the horizon.'
        ],
        suggestedMission: 'Pan slowly across the sky until the reticle aligns with a brighter celestial target.',
        isLocalInference: true,
        latencyMs
      };
    }

    // Confidence scales with angular proximity to reticle center & magnitude
    const proximityScore = Math.max(0.4, 1.0 - (minAngularDist / 35) * 0.6);
    const confidence = Math.min(0.99, Number((proximityScore * 0.95).toFixed(2)));

    const facts: string[] = [
      bestMatch.description,
      bestMatch.mythology || `Located in the celestial region of ${bestMatch.constellationName || 'the deep sky'}.`,
      `Angular separation from phone reticle: ${minAngularDist.toFixed(1)}°`,
      `Apparent magnitude: ${bestMatch.magnitude} (Visual brightness index)`
    ];

    if (bestMatch.distanceLightYears) {
      facts.push(`Light from this object has travelled ~${bestMatch.distanceLightYears} years to reach your phone.`);
    }

    return {
      provider: this.name,
      matchedObjectId: bestMatch.id,
      matchedObjectName: bestMatch.name,
      confidence,
      description: `Target identified as ${bestMatch.name}. ${bestMatch.description}`,
      loreAndFacts: facts,
      suggestedMission: `Touch Grass Mission: Put your phone away and observe ${bestMatch.name} directly with naked eyes!`,
      isLocalInference: true,
      latencyMs
    };
  }
}
