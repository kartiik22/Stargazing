import { AIProvider, AIIdentificationInput } from './AIProvider';
import { AIIdentification } from '../types/astronomy';

export class MockAIProvider implements AIProvider {
  public readonly id = 'mock-llm-provider';
  public readonly name = 'Stellar Explorer (Offline AI)';
  public readonly isLocal = true;

  public async identifySkyObject(input: AIIdentificationInput): Promise<AIIdentification> {
    const candidate = input.candidateObjects[0];
    return {
      provider: this.name,
      matchedObjectId: candidate ? candidate.id : 'unknown',
      matchedObjectName: candidate ? candidate.name : 'Unknown Luminary',
      confidence: 0.90,
      description: candidate
        ? `Celestial feature: ${candidate.name}. ${candidate.description}`
        : 'Diffuse night sky background.',
      loreAndFacts: [
        'Open-weight models analyze photon field patterns and match against ephemeris tensors.',
        'Stargazing is best enjoyed after 15 minutes of eye dark adaptation.'
      ],
      isLocalInference: true,
      latencyMs: 50
    };
  }
}
