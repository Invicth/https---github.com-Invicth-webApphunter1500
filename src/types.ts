
export interface HunterDataPoint {
  units: number;
  caudal: number; // Caudal in l/s
}

export interface PotablePipe {
  nominal: string; // e.g., "1/2""
  nominal_mm: number; // e.g., 15
  id_mm: number; // internal diameter in mm
}

export interface PotableWaterResult {
    theoreticalDiameter: number;
    commercialPipe: PotablePipe;
}

export interface DrainageResult {
    recommendedDiameter: number;
    flowVelocity: number;
    pipeCapacityLps: number;
    waterHeight: number;
}
