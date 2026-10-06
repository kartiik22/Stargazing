import { AIIdentification, SkyObject, ObserverLocation, DeviceOrientation } from '../types/astronomy';

export interface AIIdentificationInput {
  imageUri?: string;
  location: ObserverLocation;
  orientation: DeviceOrientation;
  timestamp: number;
  candidateObjects: SkyObject[];
}

export interface AIProvider {
  id: string;
  name: string;
  isLocal: boolean;
  identifySkyObject(input: AIIdentificationInput): Promise<AIIdentification>;
}
