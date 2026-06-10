# Dialed — Domain Glossary

## Bike Model
A specific road bike identified by brand, model name, and model year. Contains one or more Size
Entries covering the available frame sizes. Identified by a slug: `{brand}-{model}-{year}`.

## Size Entry
One frame size within a Bike Model. Carries the full set of Geometry Values for that size, along
with the manufacturer's recommended rider height range.

## Silhouette Overlay
The SVG visualisation shown on the Compare page, drawing both bikes to scale with the bottom bracket
as the shared origin. Bike A drawn in blue, Bike B in orange.

## Rider Profile
Body measurements and bike fitter outputs stored in the browser's localStorage under the key
`bike-geo-rider-profile`. No authentication; single local user only. Fields: height, age, weight,
torso height, inseam, foot length, foot width, foot arch, shoulder width, fitter stack, fitter reach.

## Fitter Stack / Fitter Reach
Authoritative stack and reach targets (mm) provided by a professional bike fitter after a physical
bike fit session. Override Computed Targets when present, becoming the primary basis for bike
matching and Fit Delta display.

## Computed Targets
Stack/reach ranges estimated by `calcSizingTargets(heightCm, inseamCm)` in `src/utils/sizing.ts`.
Used as primary targets when Fitter Stack/Reach are absent. Shown as a reference alongside Fitter
Stack/Reach when both are present, so the rider can sanity-check the fitter's values.

## Fit Delta
Signed difference between a bike size's actual geometry value and the Fitter Stack or Fitter Reach
target (bike value − fitter target). Displayed as a colour-coded badge on stack/reach rows in
GeometryTable and CompareTable. Thresholds: green ≤ ±15 mm, amber ≤ ±25 mm, red > ±25 mm.

## Fit Match Score
Euclidean distance between a bike size's actual stack/reach and the rider's targets:
`√((stack − targetStack)² + (reach − targetReach)²)`. Lower score = closer fit. Used to rank
bikes on the "Bikes matching your fit" section of the My Fit page. Targets are Fitter Stack/Reach
when present, otherwise Computed Targets.

## Geometry Values
Ten standardised frame measurements per bike size: stack, reach, head tube angle, seat tube angle,
chainstay length, wheelbase, BB drop, standover height, head tube length, seat tube length.
Defined in `src/data/types.ts` as `GeometryValues`.

## Bike Specs
Optional frame-level attributes on a Bike Model (not per size): weight in kg, max tire clearance
in mm (700c assumed), new price in EUR (entry-level build), used price in EUR (typical second-hand
market value — rough estimate only; see priceSearchUrls for live listings). All four fields are
optional and entered manually.
