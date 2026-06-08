import { useState, useMemo } from 'react';
import {
  sortedBikes as bikes,
  getBrands,
  getModelsByBrand,
  getYearsByBrandModel,
  getBikeByBrandModelYear,
} from '../../data/bikes';
import type { BikeModel, SizeEntry } from '../../data/types';

interface Props {
  onSelect: (bike: BikeModel, size: SizeEntry) => void;
  label?: string;
}

const selectCls = 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed';

export function BikeSelector({ onSelect, label = 'Select a bike' }: Props) {
  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [size, setSize] = useState('');

  const brands = getBrands();
  const models = brand ? getModelsByBrand(brand) : [];
  const years = brand && model ? getYearsByBrandModel(brand, model) : [];
  const selectedBike = brand && model && year
    ? getBikeByBrandModelYear(brand, model, Number(year))
    : undefined;
  const sizes = selectedBike?.sizes ?? [];

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return bikes.filter(
      (b) =>
        b.brand.toLowerCase().includes(q) ||
        b.model.toLowerCase().includes(q) ||
        String(b.year).includes(q)
    );
  }, [query]);

  const handleQuerySelect = (bike: BikeModel) => {
    setBrand(bike.brand);
    setModel(bike.model);
    setYear(bike.year);
    setSize('');
    setQuery('');
  };

  const handleConfirm = () => {
    if (!selectedBike || !size) return;
    const sizeEntry = selectedBike.sizes.find((s) => s.size === size);
    if (sizeEntry) onSelect(selectedBike, sizeEntry);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {label}
      </p>

      {/* Free text search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search brand or model…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
        />
        {filtered.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-52 overflow-y-auto">
            {filtered.map((b) => (
              <li
                key={b.id}
                onClick={() => handleQuerySelect(b)}
                className="px-3 py-2.5 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 flex items-center gap-2"
              >
                <span className="text-xs text-slate-400 dark:text-slate-600 w-12 shrink-0">{b.year}</span>
                {b.brand} {b.model}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Cascading dropdowns */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <select
          value={brand}
          onChange={(e) => { setBrand(e.target.value); setModel(''); setYear(''); setSize(''); }}
          className={selectCls}
        >
          <option value="">Brand</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>

        <select
          value={model}
          onChange={(e) => { setModel(e.target.value); setYear(''); setSize(''); }}
          disabled={!brand}
          className={selectCls}
        >
          <option value="">Model</option>
          {models.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <select
          value={year}
          onChange={(e) => { setYear(Number(e.target.value)); setSize(''); }}
          disabled={!model}
          className={selectCls}
        >
          <option value="">Year</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          disabled={!selectedBike}
          className={selectCls}
        >
          <option value="">Size</option>
          {sizes.map((s) => <option key={s.size} value={s.size}>{s.size}</option>)}
        </select>
      </div>

      <button
        onClick={handleConfirm}
        disabled={!selectedBike || !size}
        className="self-start bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Select
      </button>
    </div>
  );
}
