import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BikeSelector } from '../components/Search/BikeSelector';
import { SizingSuggestion } from '../components/SizingSuggestion/SizingSuggestion';
import { sortedBikes as bikes } from '../data/bikes';
import { useFavorites } from '../hooks/useFavorites';
import type { BikeModel, SizeEntry } from '../data/types';

const BRAND_COLORS: Record<string, string> = {
  Trek: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
  Specialized: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
  Canyon: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  Giant: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  'Cervélo': 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
  Pinarello: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
  BMC: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
  Colnago: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
  Bianchi: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400',
  Scott: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
};

function BrandBadge({ brand }: { brand: string }) {
  const cls = BRAND_COLORS[brand] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${cls}`}>
      {brand}
    </span>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
      {children}
    </h2>
  );
}

export function Home() {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [compareA, setCompareA] = useState<{ bike: BikeModel; size: SizeEntry } | null>(null);

  const handleSelectA = (bike: BikeModel, size: SizeEntry) => setCompareA({ bike, size });

  const handleSelectB = (bike: BikeModel, size: SizeEntry) => {
    if (!compareA) return;
    navigate(`/compare?a=${compareA.bike.id}__${compareA.size.size}&b=${bike.id}__${size.size}`);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-12">

      {/* Hero */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Road bike geometry,<br className="hidden sm:block" /> compared.
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Find your fit. Compare frames. Pick your next bike.
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => navigate('/compare')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Compare bikes →
          </button>
          <button
            onClick={() => document.getElementById('find-size')?.scrollIntoView({ behavior: 'smooth' })}
            className="border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Find my size
          </button>
        </div>
      </div>

      {/* Quick compare */}
      <section className="flex flex-col gap-4">
        <SectionHeader>Quick compare</SectionHeader>
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col gap-5 bg-slate-50 dark:bg-slate-900">
          <BikeSelector label="Bike A" onSelect={handleSelectA} />
          {compareA ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {compareA.bike.brand} {compareA.bike.model} {compareA.bike.year} — Size {compareA.size.size}
                </span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <BikeSelector label="Bike B" onSelect={handleSelectB} />
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400">Select Bike A, then pick Bike B to jump straight to the comparison.</p>
          )}
        </div>
      </section>

      {/* Find my size */}
      <section id="find-size" className="flex flex-col gap-4">
        <SectionHeader>Find my size</SectionHeader>
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50 dark:bg-slate-900">
          <SizingSuggestion />
        </div>
      </section>

      {/* Bike catalog */}
      <section className="flex flex-col gap-4">
        <SectionHeader>{bikes.length} bikes in catalog</SectionHeader>
        <div className="grid gap-1.5">
          {bikes.map((bike) => (
            <div
              key={bike.id}
              className="group flex items-center justify-between rounded-xl px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              onClick={() => navigate(`/bike/${bike.id}`)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <BrandBadge brand={bike.brand} />
                <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                  {bike.model}
                </span>
                <span className="text-slate-400 dark:text-slate-600 text-sm shrink-0">{bike.year}</span>
                <span className="text-slate-300 dark:text-slate-700 text-xs shrink-0 hidden sm:inline">
                  {bike.sizes.length} sizes
                </span>
              </div>
              <div className="flex items-center gap-3 ml-3 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(bike.id); }}
                  className={`text-lg leading-none transition-colors ${
                    isFavorite(bike.id)
                      ? 'text-amber-400'
                      : 'text-slate-300 dark:text-slate-700 hover:text-amber-400'
                  }`}
                  aria-label={isFavorite(bike.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite(bike.id) ? '★' : '☆'}
                </button>
                <span className="text-slate-300 dark:text-slate-700 group-hover:text-slate-400 transition-colors text-sm">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
