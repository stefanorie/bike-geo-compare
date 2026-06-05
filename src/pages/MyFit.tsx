import { useRiderProfile } from '../hooks/useRiderProfile';
import { calcSizingTargets } from '../utils/sizing';
import type { RiderProfile } from '../data/types';

const inputCls =
  'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 ' +
  'text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm w-full ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400';
const labelCls = 'text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500';
const sectionTitleCls = 'text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

function numVal(v: number | undefined) {
  return v !== undefined ? String(v) : '';
}

function parseNum(s: string): number | undefined {
  return s ? Number(s) : undefined;
}

export function MyFitPage() {
  const { profile, setProfile } = useRiderProfile();

  const set = <K extends keyof RiderProfile>(key: K, val: RiderProfile[K]) =>
    setProfile({ [key]: val } as Partial<RiderProfile>);

  const computedTargets =
    profile.heightCm && profile.inseamCm && profile.inseamCm < profile.heightCm
      ? calcSizingTargets(profile.heightCm, profile.inseamCm)
      : null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My Fit</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Stored locally in your browser. Used to personalise size suggestions and show fit indicators per bike.
        </p>
      </div>

      {/* Body Measurements */}
      <section className="flex flex-col gap-5">
        <h2 className={sectionTitleCls}>Body Measurements</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Height (cm)">
            <input
              type="number" min={140} max={220}
              value={numVal(profile.heightCm)}
              onChange={(e) => set('heightCm', parseNum(e.target.value))}
              placeholder="e.g. 182"
              className={inputCls}
            />
          </Field>
          <Field label="Age">
            <input
              type="number" min={10} max={100}
              value={numVal(profile.age)}
              onChange={(e) => set('age', parseNum(e.target.value))}
              placeholder="e.g. 35"
              className={inputCls}
            />
          </Field>
          <Field label="Weight (kg)">
            <input
              type="number" min={30} max={200}
              value={numVal(profile.weightKg)}
              onChange={(e) => set('weightKg', parseNum(e.target.value))}
              placeholder="e.g. 75"
              className={inputCls}
            />
          </Field>
          <Field label="Torso height (cm)">
            <input
              type="number" min={40} max={100}
              value={numVal(profile.torsoCm)}
              onChange={(e) => set('torsoCm', parseNum(e.target.value))}
              placeholder="e.g. 62"
              className={inputCls}
            />
          </Field>
          <Field label="Inseam (cm)">
            <input
              type="number" min={60} max={120}
              value={numVal(profile.inseamCm)}
              onChange={(e) => set('inseamCm', parseNum(e.target.value))}
              placeholder="e.g. 82"
              className={inputCls}
            />
          </Field>
          <Field label="Shoulder width (cm)">
            <input
              type="number" min={30} max={60}
              value={numVal(profile.shoulderWidthCm)}
              onChange={(e) => set('shoulderWidthCm', parseNum(e.target.value))}
              placeholder="e.g. 42"
              className={inputCls}
            />
          </Field>
          <Field label="Foot length (cm)">
            <input
              type="number" min={20} max={35} step={0.5}
              value={numVal(profile.footLengthCm)}
              onChange={(e) => set('footLengthCm', parseNum(e.target.value))}
              placeholder="e.g. 27.5"
              className={inputCls}
            />
          </Field>
          <Field label="Foot width (cm)">
            <input
              type="number" min={6} max={15} step={0.5}
              value={numVal(profile.footWidthCm)}
              onChange={(e) => set('footWidthCm', parseNum(e.target.value))}
              placeholder="e.g. 9.5"
              className={inputCls}
            />
          </Field>
          <Field label="Foot arch">
            <select
              value={profile.footArch ?? ''}
              onChange={(e) =>
                set('footArch', (e.target.value as RiderProfile['footArch']) || undefined)
              }
              className={inputCls}
            >
              <option value="">Select…</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </Field>
        </div>
      </section>

      {/* Bike Fit */}
      <section className="flex flex-col gap-5">
        <div>
          <h2 className={sectionTitleCls}>Bike Fit</h2>
          <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
            Values from a professional bike fitter. Used as primary targets when finding matching bikes.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Recommended Stack (mm)">
            <input
              type="number" min={400} max={700}
              value={numVal(profile.fitterStack)}
              onChange={(e) => set('fitterStack', parseNum(e.target.value))}
              placeholder="e.g. 540"
              className={inputCls}
            />
          </Field>
          <Field label="Recommended Reach (mm)">
            <input
              type="number" min={300} max={500}
              value={numVal(profile.fitterReach)}
              onChange={(e) => set('fitterReach', parseNum(e.target.value))}
              placeholder="e.g. 385"
              className={inputCls}
            />
          </Field>
        </div>
        {computedTargets && (
          <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            Formula estimate —{' '}
            Stack{' '}
            <span className="text-slate-600 dark:text-slate-300">
              {computedTargets.stackMin}–{computedTargets.stackMax} mm
            </span>
            {'  ·  '}
            Reach{' '}
            <span className="text-slate-600 dark:text-slate-300">
              {computedTargets.reachMin}–{computedTargets.reachMax} mm
            </span>
          </p>
        )}
      </section>
    </main>
  );
}
