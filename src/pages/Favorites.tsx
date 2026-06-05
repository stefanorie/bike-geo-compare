import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { getBikeById } from '../data/bikes';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavorites();
  const favBikes = favorites.map((id) => getBikeById(id)).filter(Boolean);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-8">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-3 flex items-center gap-1.5 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Favorites</h1>
      </div>

      {favBikes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 py-16 text-center">
          <p className="text-slate-400 dark:text-slate-600 text-sm">
            No favorites yet. Star a bike from the home page or bike detail page.
          </p>
        </div>
      ) : (
        <div className="grid gap-1.5">
          {favBikes.map((bike) =>
            bike ? (
              <div
                key={bike.id}
                className="group flex items-center justify-between rounded-xl px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                onClick={() => navigate(`/bike/${bike.id}`)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {bike.brand}
                  </span>
                  <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{bike.model}</span>
                  <span className="text-slate-400 text-sm">{bike.year}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFavorite(bike.id); }}
                    className="text-lg leading-none text-amber-400 hover:text-slate-300 dark:hover:text-slate-700 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    ★
                  </button>
                  <span className="text-slate-300 dark:text-slate-700 group-hover:text-slate-400 transition-colors text-sm">→</span>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </main>
  );
}
