import type { GeometryValues } from '../../data/types';
import { GEOMETRY_LABELS, GEOMETRY_UNITS } from '../../data/types';

interface FitTargets {
  stack?: number;
  reach?: number;
}

interface Props {
  geometry: GeometryValues;
  fitTargets?: FitTargets;
}

function deltaBadgeCls(absDelta: number) {
  if (absDelta <= 15) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60';
  if (absDelta <= 25) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60';
  return 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/60';
}

export function GeometryTable({ geometry, fitTargets }: Props) {
  const keys = Object.keys(GEOMETRY_LABELS) as (keyof GeometryValues)[];

  return (
    <table className="w-full text-sm">
      <tbody>
        {keys.map((key) => {
          const fitTarget = (key === 'stack' || key === 'reach') ? fitTargets?.[key] : undefined;
          const delta = fitTarget !== undefined ? geometry[key] - fitTarget : null;

          return (
            <tr key={key} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
              <td className="py-2 pr-4 text-slate-500 dark:text-slate-400">{GEOMETRY_LABELS[key]}</td>
              <td className="py-2 text-right font-mono text-slate-900 dark:text-slate-100">
                {geometry[key]}
                <span className="text-slate-400 dark:text-slate-600 ml-1 text-xs">{GEOMETRY_UNITS[key]}</span>
                {delta !== null && (
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded font-semibold ${deltaBadgeCls(Math.abs(delta))}`}>
                    {delta > 0 ? '+' : ''}{delta} mm
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
