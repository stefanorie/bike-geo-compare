import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { BikeDetailPage } from './pages/BikeDetail';
import { ComparePage } from './pages/Compare';
import { FavoritesPage } from './pages/Favorites';
import { MyFitPage } from './pages/MyFit';

function WheelIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="9.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11" cy="11" r="2" fill="currentColor" />
      <line x1="11" y1="1.5" x2="11" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="13" x2="11" y2="20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1.5" y1="11" x2="9" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="13" y1="11" x2="20.5" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3.4" y1="3.4" x2="9.1" y2="9.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12.9" y1="12.9" x2="18.6" y2="18.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18.6" y1="3.4" x2="12.9" y2="9.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9.1" y1="12.9" x2="3.4" y2="18.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Nav() {
  const { pathname } = useLocation();

  const navLink = (to: string, label: string) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`relative text-sm font-medium px-1 py-4 transition-colors ${
          active
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
        }`}
      >
        {label}
        {active && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 flex items-center gap-3 sm:gap-6 h-14">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-sm shrink-0"
        >
          <span className="text-blue-600 dark:text-blue-400">
            <WheelIcon />
          </span>
          <span className="hidden sm:inline">Dialed</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-5">
          {navLink('/', 'Home')}
          {navLink('/compare', 'Compare')}
          {navLink('/favorites', 'Favorites')}
          {navLink('/profile', 'My Fit')}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bike/:id" element={<BikeDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/profile" element={<MyFitPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
