import { useParams, useNavigate } from 'react-router-dom';
import { getBikeById } from '../data/bikes';
import { GeometryTable } from '../components/BikeDetail/GeometryTable';
import { useFavorites } from '../hooks/useFavorites';
import { useRiderProfile } from '../hooks/useRiderProfile';

export function BikeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { profile } = useRiderProfile();
  const bike = id ? getBikeById(id) : undefined;
  const fitTargets =
    profile.fitterStack || profile.fitterReach
      ? { stack: profile.fitterStack, reach: profile.fitterReach }
      : undefined;

  if (!bike) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-slate-500">Bike not found.</p>
        <button onClick={() => navigate('/')} className="mt-3 text-blue-600 text-sm hover:underline">
          ← Back to home
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-8">

      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-3 flex items-center gap-1.5 transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
              {bike.brand}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {bike.model}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{bike.year}</p>
          </div>
          <button
            onClick={() => toggleFavorite(bike.id)}
            className={`text-2xl mt-2 transition-colors ${
              isFavorite(bike.id) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700 hover:text-amber-400'
            }`}
            aria-label={isFavorite(bike.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite(bike.id) ? '★' : '☆'}
          </button>
        </div>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-3">
        {bike.sizes.map((sizeEntry) => (
          <div
            key={sizeEntry.size}
            className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900"
          >
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Size {sizeEntry.size}
                </span>
                <span className="text-sm text-slate-400">
                  {sizeEntry.manufacturerHeightRange[0]}–{sizeEntry.manufacturerHeightRange[1]} cm
                </span>
              </div>
              <button
                onClick={() => navigate(`/compare?a=${bike.id}__${sizeEntry.size}`)}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Compare →
              </button>
            </div>
            <div className="px-5 py-4">
              <GeometryTable geometry={sizeEntry.geometry} fitTargets={fitTargets} specs={bike} />
            </div>
          </div>
        ))}
      </div>

      {/* Price links */}
      {(bike.priceSearchUrls.marktplaats || bike.priceSearchUrls.tweedehands || bike.priceSearchUrls.fietsenzo) && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Find for sale
          </h2>
          <div className="flex flex-wrap gap-2">
            {bike.priceSearchUrls.fietsenzo && (
              <a
                href={bike.priceSearchUrls.fietsenzo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Fietsenzo →
              </a>
            )}
            {bike.priceSearchUrls.marktplaats && (
              <a
                href={bike.priceSearchUrls.marktplaats}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Marktplaats →
              </a>
            )}
            {bike.priceSearchUrls.tweedehands && (
              <a
                href={bike.priceSearchUrls.tweedehands}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                2dehands →
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
