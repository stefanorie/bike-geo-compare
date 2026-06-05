# Bike Geo Compare — Project Context

Road bike geometry comparison web app. Fully static (no backend, no database). All bike data is hardcoded TypeScript. Claude helps populate geometry data at dev time by searching manufacturer websites and geometry databases.

## Tech stack

- React + Vite + TypeScript
- Tailwind CSS v4 (uses `@tailwindcss/vite` plugin, NOT the old `tailwind.config.js` approach)
- React Router v6 (hash-free routes, `BrowserRouter`)
- No backend, no database, no auth

## Project structure

```
src/
  data/
    types.ts        ← BikeModel, SizeEntry, GeometryValues interfaces + label/unit maps
    bikes.ts        ← all hardcoded bike data + query helpers (getBikeById, getBrands, etc.)
  components/
    Search/BikeSelector.tsx       ← free text search + cascading dropdowns (Brand→Model→Year→Size)
    BikeDetail/GeometryTable.tsx  ← single-bike geometry table
    Compare/CompareTable.tsx      ← side-by-side diff table with delta column
    Compare/SilhouetteSVG.tsx     ← SVG frame+wheels overlay (two bikes, blue vs orange)
    SizingSuggestion/SizingSuggestion.tsx ← height+inseam → size recommendations
    Favorites/                    ← (not yet used as standalone component)
  hooks/
    useFavorites.ts  ← localStorage-backed favorites (array of bike IDs)
  pages/
    Home.tsx         ← hero, quick compare flow, sizing suggestion, bike catalog list
    BikeDetail.tsx   ← all sizes for one bike, price links, favorite toggle
    Compare.tsx      ← reads ?a=bikeId__size&b=bikeId__size from URL
    Favorites.tsx    ← favorites list from localStorage
  utils/
    sizing.ts        ← calcSizingTargets(heightCm, inseamCm) → stack/reach target range
    svgGeometry.ts   ← calcBikePoints(geometry) → SVG coordinates for frame drawing
```

## Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `Home.tsx` | Hero banner, quick-compare widget (two selectors → navigate to `/compare`), sizing suggestion widget, full bike catalog with favorite toggles |
| `/bike/:id` | `BikeDetail.tsx` | All sizes for one bike with geometry table, manufacturer height ranges, Fit Delta badges if profile set, price search links (Marktplaats / 2dehands / Fietsenzo), favorite toggle |
| `/compare` | `Compare.tsx` | Side-by-side comparison of two bikes (`?a=bikeId__size&b=bikeId__size`). Silhouette Overlay SVG + CompareTable with delta column and Fit Delta badges. Share button copies URL to clipboard. |
| `/favorites` | `Favorites.tsx` | List of saved Bike Models from localStorage. One-click removal, links to detail pages. |
| `/profile` | `MyFit.tsx` | Rider Profile editor (body measurements + Fitter Stack/Reach). Displays Computed Targets alongside fitter values for sanity-checking. Planned: "Bikes matching your fit" section. |

## Design decisions

### Data
- Bike data lives in `src/data/bikes.ts` as a plain TypeScript array
- 10 core geometry fields per size: stack, reach, headTubeAngle, seatTubeAngle, chainstayLength, wheelbase, bbDrop, standoverHeight, headTubeLength, seatTubeLength (c-t)
- Standover heights and some secondary fields are estimated where manufacturers don't publish them — this is fine for comparison purposes
- Pinarello X1/X3/X5 share identical frame geometry (differ only in groupset/carbon grade) — this is accurate
- Geometry data sourced from: BikeInsights, Canyon official, Trek official, Specialized official. Avoid GeometryGeeks — it returns corrupted data for many bikes (impossible head tube angles like 61° or 81°)

### URL structure
- Comparison URL format: `/compare?a=trek-madone-slr-2024__54&b=specialized-tarmac-sl8-2024__54`
- Bike ID format: `{brand-slug}-{model-slug}-{year}` e.g. `canyon-endurace-cfr-2026`
- Size separator in URL: double underscore `__`

### SVG silhouette
- BB is the coordinate origin `(0, 0)`
- Y-axis is flipped in SVG render (`-y`) because SVG y goes down
- Wheel radius: 336mm (700c)
- Frame points calculated in `calcBikePoints()` — rear axle, front axle, head tube top/bottom, seat tube top
- Two bikes drawn in the same `<svg>` with different opacity (bike A: 0.9, bike B: 0.7) — blue (`#2563eb`) and orange (`#ea580c`)
- ViewBox calculated dynamically from both bikes' bounding boxes + 100mm padding

### Sizing suggestion
- Two methods shown: manufacturer height chart + calculated stack/reach target
- Stack estimate: `inseam × 6.8` (rough fit formula)
- Reach estimate: derived from torso + arm length approximation
- Tolerance: ±15mm on both stack and reach for "calculated" matches
- Source badges: "Mfg + Calc" (both match), "Mfg chart", "Calculated"

### Favorites
- Stored as `string[]` of bike IDs in `localStorage` key `bike-geo-favorites`
- No sync across devices — by design

### Price lookup
- No live price API. Pre-built search URLs per bike in `BikeModel.priceSearchUrls`
- Links to: Marktplaats, 2dehands, Fietsenzo (Dutch market focus)
- Open in new tab

### Dark mode
- Auto via `prefers-color-scheme: dark` CSS media query
- Tailwind `dark:` classes throughout all components
- No manual toggle (by design — keeps it simple)

## Current bike catalog (25 bikes)

| Brand | Model | Year | Sizes |
|---|---|---|---|
| Trek | Madone SLR | 2024 | 44–62 (8) |
| Trek | Madone SLR | 2026 | XS–XL (6) |
| Trek | Émonda SLR | 2025 | 47–62 (8) |
| Trek | Domane SLR | 2026 | 47–62 (8) |
| Specialized | Tarmac SL8 | 2024 | 44–61 (7) |
| Specialized | Aethos | 2026 | 49–61 (6) |
| Canyon | Ultimate CFR | 2024 | XS–XL (5) |
| Canyon | Aeroad CFR | 2026 | 2XS–2XL (7) |
| Canyon | Endurace CFR | 2026 | 2XS–XL (6) |
| Canyon | Endurace CF SLX | 2026 | 2XS–2XL (7) |
| Canyon | Endurace CF SLX | 2027 | 2XS–2XL (7) |
| Giant | TCR Advanced SL | 2024 | XS–XL (6) |
| Cervélo | R5 | 2024 | 44–61 (7) |
| Orbea | Orca | 2026 | 47–60 (7) |
| Pinarello | X1 | 2025 | 43–60 (9) |
| Pinarello | X3 | 2025 | 43–60 (9) |
| Pinarello | X5 | 2025 | 43–60 (9) |
| Pinarello | F9 | 2026 | 43–59.5 (9) |
| BMC | Teammachine SLR | 2025 | 47–61 (6) |
| Colnago | V4Rs | 2025 | 42–57 (7) |
| Bianchi | Oltre RC | 2025 | 47–59 (6) |
| Cube | Agree C:62 SLT | 2025 | 50–62 (6) |
| Cube | Agree C:62 SLT | 2026 | 53–62 (4) |
| Rose | Shave FF | 2026 | XS–XL (6) |
| Rose | Shave | 2026 | XS–XL (6) |

## Adding a new bike

1. Find geometry from official brand website or BikeInsights (avoid GeometryGeeks)
2. Add a `BikeModel` entry to the `bikes` array in `src/data/bikes.ts`
3. ID format: `{brand}-{model}-{year}` all lowercase, spaces → hyphens, accents stripped
4. Add Marktplaats/2dehands search URLs in `priceSearchUrls`
5. Run `npm run build` to verify no TypeScript errors

## Running locally

```bash
cd "C:\VSCode Projects\bike-geo-compare"
npm run dev        # dev server at http://localhost:5173
npm run build      # production build + type check
```

Preview server launch config: `C:\Users\Stefan\Claude code\.claude\launch.json`
Wrapper script (needed for path-with-spaces): `C:\dev-launchers\bike-geo.cmd`

## Next steps

### High priority
- [ ] Update existing 2024 bikes to 2025/2026 models where available (Trek Madone SLR 2025, Giant TCR 2025, Cervélo R5 2025)
- [ ] Add missing brands: Scott Addict RC 2025, Pinarello Dogma F 2025, Cannondale SuperSix EVO, Look 795
- [ ] Fix compare table column overflow on mobile — consider hiding the delta column at small widths, or using a stacked layout
- [ ] Sizing suggestion formula needs calibration — current stack estimate (inseam × 6.8) may be too generous for smaller riders

### Medium priority
- [ ] Compare page: pre-populate selectors from URL params (currently dropdowns reset on navigation even when URL has valid a/b params)
- [ ] Home page: group bikes by brand in the catalog list
- [ ] Add a "suggest comparison" feature — when viewing a bike detail, show similar bikes by stack/reach
- [ ] Bike detail: visual stack/reach dot on a scatter plot vs. all bikes in catalog
- [ ] My Fit page: "Bikes matching your fit" section (below profile form)
  - Rank all bikes by Fit Match Score: √(stackDelta² + reachDelta²), one best size per bike
  - Use Fitter Stack/Reach if present, else fall back to Computed Targets (with a label)
  - Show top 5 results; "Show more" reveals full ranked list
  - Each card: Euclidean distance score + individual stack/reach Fit Delta badges (green/amber/red)
  - Card actions: link to `/bike/:id` + "Compare" button → `/compare?a=bikeId__size`
  - No cutoff threshold — always show top 5 even if deltas are large

### Nice to have
- [ ] Add a third bike to comparison (bike C in a third color)
- [ ] Export comparison as PNG/PDF
- [ ] Fietsenzo search URL support (currently only Marktplaats + 2dehands)
- [ ] Add CONTEXT.md glossary for domain terms (stack, reach, BB drop, etc.)
