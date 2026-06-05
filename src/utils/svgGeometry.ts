import type { GeometryValues } from '../data/types';

export interface BikePoints {
  bb: [number, number];
  rearAxle: [number, number];
  frontAxle: [number, number];
  headTubeBottom: [number, number];
  headTubeTop: [number, number];
  seatTubeTop: [number, number];
  rearWheelCenter: [number, number];
  frontWheelCenter: [number, number];
}

const WHEEL_RADIUS = 336; // 700c in mm

export function calcBikePoints(g: GeometryValues): BikePoints {
  const bb: [number, number] = [0, 0];

  // Rear axle: chainstay length behind BB, at same height (simplified, ignoring BB drop)
  const rearAxle: [number, number] = [-g.chainstayLength, 0];

  // Front axle: wheelbase - chainstay ahead of BB
  const frontAxleX = g.wheelbase - g.chainstayLength;
  const frontAxle: [number, number] = [frontAxleX, 0];

  // Head tube bottom: reach forward, stack up from BB
  // Head tube angle affects the tube direction
  const htaRad = (g.headTubeAngle * Math.PI) / 180;
  const htbX = g.reach;
  const htbY = g.stack - g.headTubeLength * Math.cos(htaRad);
  const headTubeBottom: [number, number] = [htbX, htbY];

  // Head tube top: extend head tube length along the head tube angle
  const htTopX = htbX - g.headTubeLength * Math.sin(htaRad);
  const htTopY = htbY + g.headTubeLength * Math.cos(htaRad);
  const headTubeTop: [number, number] = [htTopX, htTopY];

  // Seat tube top: extend from BB along seat tube angle
  const staRad = (g.seatTubeAngle * Math.PI) / 180;
  const stTopX = -(g.seatTubeLength * Math.cos(staRad));
  const stTopY = g.seatTubeLength * Math.sin(staRad);
  const seatTubeTop: [number, number] = [stTopX, stTopY];

  return {
    bb,
    rearAxle,
    frontAxle,
    headTubeBottom,
    headTubeTop,
    seatTubeTop,
    rearWheelCenter: rearAxle,
    frontWheelCenter: frontAxle,
  };
}

export interface ViewBox {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

export function calcViewBox(pointSets: BikePoints[], padding = 80): ViewBox {
  const allX: number[] = [];
  const allY: number[] = [];

  for (const pts of pointSets) {
    for (const pt of Object.values(pts) as [number, number][]) {
      allX.push(pt[0]);
      allY.push(pt[1]);
    }
    // Include wheel extents
    allY.push(pts.rearWheelCenter[1] - WHEEL_RADIUS);
    allY.push(pts.frontWheelCenter[1] - WHEEL_RADIUS);
  }

  const minX = Math.min(...allX) - padding;
  const maxX = Math.max(...allX) + padding;
  const minY = Math.min(...allY) - padding;
  const maxY = Math.max(...allY) + padding;

  return { minX, minY, width: maxX - minX, height: maxY - minY };
}

export { WHEEL_RADIUS };
