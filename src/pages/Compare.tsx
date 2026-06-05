import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getBikeById } from '../data/bikes';
import { CompareTable } from '../components/Compare/CompareTable';
import { SilhouetteSVG } from '../components/Compare/SilhouetteSVG';
import { BikeSelector } from '../components/Search/BikeSelector';
import type { BikeModel, SizeEntry } from '../data/types';
import { useRiderProfile } from '../hooks/useRiderProfile';

function parseBikeParam(param: string | null): { bikeId: string; sizeId: string } | null {
  if (!param) return null;
  const [bikeId, sizeId] = param.split('__');
  if (!bikeId || !sizeId) return null;
  return { bikeId, sizeId };
}

export function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { profile } = useRiderProfile();
  const fitTargets =
    profile.fitterStack || profile.fitterReach
      ? { stack: profile.fitterStack, reach: profile.fitterReach }
      : undefined;

  const paramA = parseBikeParam(searchParams.get('a'));
  const paramB = parseBikeParam(searchParams.get('b'));

  const bikeA = paramA ? getBikeById(paramA.bikeId) : undefined;
  const bikeB = paramB ? getBikeById(paramB.bikeId) : undefined;
  const sizeA = bikeA?.sizes.find((s) => s.size === paramA?.sizeId);
  const sizeB = bikeB?.sizes.find((s) => s.size === paramB?.sizeId);

  const handleSelectA = (bike: BikeModel, size: SizeEntry) => {
    const b = searchParams.get('b');
    setSearchParams({ a: `${bike.id}__${size.size}`, ...(b ? { b } : {}) });
  };

  const handleSelectB = (bike: BikeModel, size: SizeEntry) => {
    const a = searchParams.get('a');
    setSearchParams({ ...(a ? { a } : {}), b: `${bike.id}__${size.size}` });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const labelA = bikeA && sizeA
    ? `${bikeA.brand} ${bikeA.model} ${bikeA.year} (${sizeA.size})`
    : 'Bike A';
  const labelB = bikeB && sizeB
    ? `${bikeB.brand} ${bikeB.model} ${bikeB.year} (${sizeB.size})`
    : 'Bike B';

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-2 flex items-center gap-1.5 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Compare</h1>
        </div>
        {bikeA && bikeB && sizeA && sizeB && (
          <button
            onClick={handleShare}
            className={`text-sm px-3 py-2 border rounded-lg font-medium transition-colors ${
              copied
                ? 'border-green-300 text-green-600 dark:border-green-700 dark:text-green-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {copied ? '✓ Copied!' : 'Share link'}
          </button>
        )}
      </div>

      {/* Bike selectors */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-blue-200 dark:border-blue-900 rounded-2xl p-5 bg-blue-50/40 dark:bg-blue-950/30">
          <BikeSelector label="Bike A" onSelect={handleSelectA} />
          {bikeA && sizeA && (
            <p className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              {labelA}
            </p>
          )}
        </div>
        <div className="border border-orange-200 dark:border-orange-900 rounded-2xl p-5 bg-orange-50/40 dark:bg-orange-950/30">
          <BikeSelector label="Bike B" onSelect={handleSelectB} />
          {bikeB && sizeB && (
            <p className="mt-3 text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
              {labelB}
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {bikeA && bikeB && sizeA && sizeB ? (
        <div className="flex flex-col gap-8">
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900">
            <SilhouetteSVG
              geometryA={sizeA.geometry}
              geometryB={sizeB.geometry}
              labelA={labelA}
              labelB={labelB}
            />
          </div>
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
              Geometry comparison
            </p>
            <CompareTable
              bikeALabel={labelA}
              bikeBLabel={labelB}
              geometryA={sizeA.geometry}
              geometryB={sizeB.geometry}
              fitTargets={fitTargets}
              specsA={bikeA}
              specsB={bikeB}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 py-16 text-center">
          <p className="text-slate-400 dark:text-slate-600">Select both bikes above to compare.</p>
        </div>
      )}
    </main>
  );
}
