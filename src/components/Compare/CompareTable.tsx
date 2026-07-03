import type { BikeModel, GeometryValues } from '../../data/types';
import { GEOMETRY_LABELS, GEOMETRY_UNITS } from '../../data/types';
import { formatDelta } from '../../utils/format';

interface FitTargets {
  stack?: number;
  reach?: number;
}

type BikeSpecs = Pick<BikeModel, 'weightKg' | 'maxTireClearance' | 'newPrice' | 'usedPrice'>;

interface Props {
  bikeALabel: string;
  bikeBLabel: string;
  geometryA: GeometryValues;
  geometryB: GeometryValues;
  fitTargets?: FitTargets;
  specsA?: BikeSpecs;
  specsB?: BikeSpecs;
}

const SPEC_ROWS: { key: keyof BikeSpecs; label: string; format: (v: number) => string; unit: string }[] = [
  { key: 'weightKg',         label: 'Weight',             format: (v) => `${v}`,                          unit: 'kg' },
  { key: 'maxTireClearance', label: 'Max Tire Clearance', format: (v) => `${v}`,                          unit: 'mm' },
  { key: 'newPrice',         label: 'New Price',          format: (v) => `€${v.toLocaleString('nl-NL')}`, unit: '' },
  { key: 'usedPrice',        label: 'Used Price',         format: (v) => `€${v.toLocaleString('nl-NL')}`, unit: '' },
];

function FitBadge({ bikeVal, target }: { bikeVal: number; target: number }) {
  const delta = bikeVal - target;
  const abs = Math.abs(delta);
  const cls =
    abs <= 15 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60' :
    abs <= 25 ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60' :
    'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/60';
  return (
    <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded font-semibold ${cls}`}>
      {delta > 0 ? '+' : ''}{formatDelta(delta)}
    </span>
  );
}

export function CompareTable({ bikeALabel, bikeBLabel, geometryA, geometryB, fitTargets, specsA, specsB }: Props) {
  const keys = Object.keys(GEOMETRY_LABELS) as (keyof GeometryValues)[];
  const visibleSpecs = SPEC_ROWS.filter(r => specsA?.[r.key] !== undefined || specsB?.[r.key] !== undefined);

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
          {visibleSpecs.length > 0 && (
            <>
              <tr>
                <td colSpan={4} className="pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Specs
                </td>
              </tr>
              {visibleSpecs.map(({ key, label, format, unit }) => {
                const a = specsA?.[key] as number | undefined;
                const b = specsB?.[key] as number | undefined;
                const delta = a !== undefined && b !== undefined ? b - a : null;
                return (
                  <tr key={key} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">{label}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-blue-600 dark:text-blue-400">
                      {a !== undefined ? <>{format(a)}{unit && <span className="text-slate-300 dark:text-slate-700 ml-0.5 text-xs">{unit}</span>}</> : <span className="text-slate-300 dark:text-slate-700">—</span>}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-orange-500 dark:text-orange-400">
                      {b !== undefined ? <>{format(b)}{unit && <span className="text-slate-300 dark:text-slate-700 ml-0.5 text-xs">{unit}</span>}</> : <span className="text-slate-300 dark:text-slate-700">—</span>}
                    </td>
                    <td className="py-2.5 pl-3 text-right font-mono text-xs">
                      {delta === null || delta === 0 ? (
                        <span className="text-slate-300 dark:text-slate-700">—</span>
                      ) : (
                        <span className={delta > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}>
                          {delta > 0 ? '+' : ''}{formatDelta(delta)}{unit && <span className="text-slate-300 dark:text-slate-700 ml-0.5">{unit}</span>}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={4} className="pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Geometry
                </td>
              </tr>
            </>
          )}
          {keys.map((key) => {
            const a = geometryA[key];
            const b = geometryB[key];
            const delta = b - a;
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
                      {delta > 0 ? '+' : ''}{formatDelta(delta)}
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
