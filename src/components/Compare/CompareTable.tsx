import type { GeometryValues } from '../../data/types';
import { GEOMETRY_LABELS, GEOMETRY_UNITS } from '../../data/types';

interface FitTargets {
  stack?: number;
  reach?: number;
}

interface Props {
  bikeALabel: string;
  bikeBLabel: string;
  geometryA: GeometryValues;
  geometryB: GeometryValues;
  fitTargets?: FitTargets;
}

function FitBadge({ bikeVal, target }: { bikeVal: number; target: number }) {
  const delta = bikeVal - target;
  const abs = Math.abs(delta);
  const cls =
    abs <= 15 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60' :
    abs <= 25 ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60' :
    'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/60';
  return (
    <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded font-semibold ${cls}`}>
      {delta > 0 ? '+' : ''}{delta}
    </span>
  );
}

export function CompareTable({ bikeALabel, bikeBLabel, geometryA, geometryB, fitTargets }: Props) {
  const keys = Object.keys(GEOMETRY_LABELS) as (keyof GeometryValues)[];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-slate-200 dark:border-slate-700">
            <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 w-40">
              Measurement
            </th>
            <th className="py-2 px-3 text-right font-semibold text-blue-600 dark:text-blue-400 text-xs truncate max-w-28">
              {bikeALabel}
            </th>
            <th className="py-2 px-3 text-right font-semibold text-orange-500 dark:text-orange-400 text-xs truncate max-w-28">
              {bikeBLabel}
            </th>
            <th className="py-2 pl-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Delta
            </th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => {
            const a = geometryA[key];
            const b = geometryB[key];
            const delta = b - a;
            const isAngle = GEOMETRY_UNITS[key] === '°';
            const fitTarget = (key === 'stack' || key === 'reach') ? fitTargets?.[key] : undefined;

            return (
              <tr key={key} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">{GEOMETRY_LABELS[key]}</td>
                <td className="py-2.5 px-3 text-right font-mono text-blue-600 dark:text-blue-400">
                  {a}<span className="text-slate-300 dark:text-slate-700 ml-0.5 text-xs">{GEOMETRY_UNITS[key]}</span>
                  {fitTarget !== undefined && <FitBadge bikeVal={a} target={fitTarget} />}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-orange-500 dark:text-orange-400">
                  {b}<span className="text-slate-300 dark:text-slate-700 ml-0.5 text-xs">{GEOMETRY_UNITS[key]}</span>
                  {fitTarget !== undefined && <FitBadge bikeVal={b} target={fitTarget} />}
                </td>
                <td className="py-2.5 pl-3 text-right font-mono text-xs">
                  {delta === 0 ? (
                    <span className="text-slate-300 dark:text-slate-700">—</span>
                  ) : (
                    <span className={delta > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-500 dark:text-red-400'
                    }>
                      {delta > 0 ? '+' : ''}{isAngle ? delta.toFixed(1) : delta}
                      <span className="text-slate-300 dark:text-slate-700 ml-0.5">{GEOMETRY_UNITS[key]}</span>
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
