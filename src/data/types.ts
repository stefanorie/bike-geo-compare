export interface GeometryValues {
  stack: number;
  reach: number;
  headTubeAngle: number;
  seatTubeAngle: number;
  chainstayLength: number;
  wheelbase: number;
  bbDrop: number;
  standoverHeight: number;
  headTubeLength: number;
  seatTubeLength: number;
}

export const GEOMETRY_LABELS: Record<keyof GeometryValues, string> = {
  stack: 'Stack',
  reach: 'Reach',
  headTubeAngle: 'Head Tube Angle',
  seatTubeAngle: 'Seat Tube Angle',
  chainstayLength: 'Chainstay Length',
  wheelbase: 'Wheelbase',
  bbDrop: 'BB Drop',
  standoverHeight: 'Standover Height',
  headTubeLength: 'Head Tube Length',
  seatTubeLength: 'Seat Tube Length',
};

export const GEOMETRY_UNITS: Record<keyof GeometryValues, string> = {
  stack: 'mm',
  reach: 'mm',
  headTubeAngle: '°',
  seatTubeAngle: '°',
  chainstayLength: 'mm',
  wheelbase: 'mm',
  bbDrop: 'mm',
  standoverHeight: 'mm',
  headTubeLength: 'mm',
  seatTubeLength: 'mm',
};

export interface SizeEntry {
  size: string;
  manufacturerHeightRange: [number, number];
  geometry: GeometryValues;
}

export interface BikeModel {
  id: string;
  brand: string;
  model: string;
  year: number;
  sizes: SizeEntry[];
  priceSearchUrls: {
    fietsenzo?: string;
    marktplaats?: string;
    tweedehands?: string;
  };
}

export interface RiderProfile {
  heightCm?: number;
  age?: number;
  weightKg?: number;
  torsoCm?: number;
  inseamCm?: number;
  footLengthCm?: number;
  footWidthCm?: number;
  footArch?: 'low' | 'medium' | 'high';
  shoulderWidthCm?: number;
  fitterStack?: number;
  fitterReach?: number;
}
