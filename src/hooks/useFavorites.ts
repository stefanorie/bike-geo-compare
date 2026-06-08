import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bike-geo-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f !== id));
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // id = exact `bikeId__size` key
  const isFavorite = (id: string) => favorites.includes(id);

  // bikeId only — true if any size of that bike is favorited
  const isFavoriteAny = (bikeId: string) =>
    favorites.some((f) => f.startsWith(bikeId + '__'));

  return { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, isFavoriteAny };
}
