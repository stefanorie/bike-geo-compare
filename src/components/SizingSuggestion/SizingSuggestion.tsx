import { useState } from 'react';
import { bikes } from '../../data/bikes';
import { calcSizingTargets } from '../../utils/sizing';
import type { SizingTargets } from '../../utils/sizing';
import { useNavigate } from 'react-router-dom';
import { useRiderProfile } from '../../hooks/useRiderProfile';

type MatchSource = 'manufacturer' | 'calculated' | 'both';

interface SuggestionResults {
  targets: SizingTargets;
  computed: SizingTargets;
  hasFitterTargets: boolean;
  matches: { bikeId: string; label: string; size: string; source: MatchSource }[];
}

export function SizingSuggestion() {
  const { profile } = useRiderProfile();
  const [height, setHeight] = useState(() => profile.heightCm?.toString() ?? '');
  const [inseam, setInseam] = useState(() => profile.inseamCm?.toString() ?? '');
  const [results, setResults] = useState<SuggestionResults | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = Number(height);
    const i = Number(inseam);
    if (h > 0 && i > 0 && i < h) {
      const computed = calcSizingTargets(h, i);
      const hasFitterTargets = !!(profile.fitterStack && profile.fitterReach);
      const targets: SizingTargets = hasFitterTargets
        ? {
            stackMin: profile.fitterStack! - 15,
            stackMax: profile.fitterStack! + 15,
            reachMin: profile.fitterReach! - 15,
            reachMax: profile.fitterReach! + 15,
          }
        : computed;

      const matches: SuggestionResults['matches'] = [];
      for (const bike of bikes) {
        for (const sizeEntry of bike.sizes) {
          const mfgMatch =
            h >= sizeEntry.manufacturerHeightRange[0] && h <= sizeEntry.manufacturerHeightRange[1];
          const calcMatch =
            sizeEntry.geometry.stack >= targets.stackMin &&
            sizeEntry.geometry.stack <= targets.stackMax &&
            sizeEntry.geometry.reach >= targets.reachMin &&
            sizeEntry.geometry.reach <= targets.reachMax;

          if (mfgMatch || calcMatch) {
            matches.push({
              bikeId: bike.id,
              label: `${bike.brand} ${bike.model} ${bike.year}`,
              size: sizeEntry.size,
              source: mfgMatch && calcMatch ? 'both' : mfgMatch ? 'manufacturer' : 'calculated',
            });
          }
        }
      }
      setResults({ targets, computed, hasFitterTargets, matches });
    }
  };

  const sourceMeta: Record<MatchSource, { label: string; cls: string }> = {
    both:         { label: 'Mfg + Calc',  cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' },
    manufacturer: { label: 'Mfg chart',   cls: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' },
    calculated:   { label: 'Calculated',  cls: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400' },
  };

  const inputCls = 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400';

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Height (cm)
          </label>
          <input
            type="number"
            min={140}
            max={220}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g. 180"
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Inseam (cm)
          </label>
          <input
            type="number"
            min={60}
            max={120}
            value={inseam}
            onChange={(e) => setInseam(e.target.value)}
            placeholder="e.g. 82"
            className={inputCls}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Find my size
        </button>
      </form>

      {results && (
        <div className="flex flex-col gap-4">
          {results.hasFitterTargets ? (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Fitter targets —{' '}
                Stack{' '}
                <span className="text-slate-900 dark:text-slate-100 font-semibold">
                  {profile.fitterStack} mm
                </span>
                {'  ·  '}
                Reach{' '}
                <span className="text-slate-900 dark:text-slate-100 font-semibold">
                  {profile.fitterReach} mm
                </span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-600 font-mono">
                Formula estimate — Stack {results.computed.stackMin}–{results.computed.stackMax} mm
                {'  ·  '}
                Reach {results.computed.reachMin}–{results.computed.reachMax} mm
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Stack target{' '}
              <span className="text-slate-900 dark:text-slate-100">
                {results.targets.stackMin}–{results.targets.stackMax} mm
              </span>
              {'  '}·{'  '}
              Reach target{' '}
              <span className="text-slate-900 dark:text-slate-100">
                {results.targets.reachMin}–{results.targets.reachMax} mm
              </span>
            </p>
          )}

          {results.matches.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No matches found for these measurements.</p>
          ) : (
            <div className="grid gap-1.5">
              {results.matches.map((m, i) => {
                const meta = sourceMeta[m.source];
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/bike/${m.bikeId}`)}
                  >
                    <div>
                      <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{m.label}</span>
                      <span className="ml-2 text-slate-400 text-sm">Size {m.size}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${meta.cls}`}>
                      {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
