import type { GeometryValues } from '../../data/types';
import { calcBikePoints, calcViewBox, WHEEL_RADIUS } from '../../utils/svgGeometry';

interface BikeDrawProps {
  geometry: GeometryValues;
  color: string;
  opacity?: number;
}

function BikeSilhouette({ geometry, color, opacity = 0.9 }: BikeDrawProps) {
  const pts = calcBikePoints(geometry);
  const { bb, rearAxle, frontAxle, headTubeBottom, headTubeTop, seatTubeTop } = pts;

  const line = (x1: number, y1: number, x2: number, y2: number, width = 8) => (
    <line
      x1={x1} y1={-y1} x2={x2} y2={-y2}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity={opacity}
    />
  );

  return (
    <g>
      {/* Wheels */}
      <circle cx={rearAxle[0]} cy={-rearAxle[1]} r={WHEEL_RADIUS} stroke={color} strokeWidth={7} fill="none" opacity={opacity * 0.5} />
      <circle cx={frontAxle[0]} cy={-frontAxle[1]} r={WHEEL_RADIUS} stroke={color} strokeWidth={7} fill="none" opacity={opacity * 0.5} />
      {/* Wheel hubs */}
      <circle cx={rearAxle[0]} cy={-rearAxle[1]} r={18} stroke={color} strokeWidth={5} fill="none" opacity={opacity * 0.6} />
      <circle cx={frontAxle[0]} cy={-frontAxle[1]} r={18} stroke={color} strokeWidth={5} fill="none" opacity={opacity * 0.6} />

      {/* Chainstay */}
      {line(bb[0], bb[1], rearAxle[0], rearAxle[1])}
      {/* Seat tube */}
      {line(bb[0], bb[1], seatTubeTop[0], seatTubeTop[1])}
      {/* Top tube */}
      {line(seatTubeTop[0], seatTubeTop[1], headTubeTop[0], headTubeTop[1])}
      {/* Down tube */}
      {line(bb[0], bb[1], headTubeBottom[0], headTubeBottom[1])}
      {/* Head tube */}
      {line(headTubeBottom[0], headTubeBottom[1], headTubeTop[0], headTubeTop[1], 12)}
      {/* Fork */}
      {line(headTubeBottom[0], headTubeBottom[1], frontAxle[0], frontAxle[1])}
      {/* Seat stay */}
      {line(seatTubeTop[0], seatTubeTop[1], rearAxle[0], rearAxle[1])}

      {/* BB dot */}
      <circle cx={bb[0]} cy={-bb[1]} r={14} fill={color} opacity={opacity} />
    </g>
  );
}

interface Props {
  geometryA: GeometryValues;
  geometryB: GeometryValues;
  labelA: string;
  labelB: string;
}

const COLOR_A = '#2563eb';
const COLOR_B = '#ea580c';

export function SilhouetteSVG({ geometryA, geometryB, labelA, labelB }: Props) {
  const ptsA = calcBikePoints(geometryA);
  const ptsB = calcBikePoints(geometryB);
  const vb = calcViewBox([ptsA, ptsB], 100);

  const viewBox = `${vb.minX} ${-(vb.minY + vb.height)} ${vb.width} ${vb.height}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Legend */}
      <div className="flex gap-6 text-sm">
        <span className="flex items-center gap-2">
          <span className="inline-block w-8 h-0.5 rounded" style={{ background: COLOR_A }} />
          <span className="text-blue-600 dark:text-blue-400 font-medium truncate max-w-48">{labelA}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-8 h-0.5 rounded" style={{ background: COLOR_B }} />
          <span className="text-orange-600 dark:text-orange-400 font-medium truncate max-w-48">{labelB}</span>
        </span>
      </div>

      <div className="w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/50">
        <svg
          viewBox={viewBox}
          className="w-full"
          style={{ maxHeight: '380px' }}
          role="img"
          aria-label={`Geometry comparison: ${labelA} vs ${labelB}`}
        >
          <BikeSilhouette geometry={geometryA} color={COLOR_A} opacity={0.9} />
          <BikeSilhouette geometry={geometryB} color={COLOR_B} opacity={0.7} />
        </svg>
      </div>
    </div>
  );
}
