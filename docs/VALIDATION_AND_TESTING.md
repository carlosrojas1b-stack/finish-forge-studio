# Validation and testing

## Automated checks

Run before every merge and release:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

Automated tests reduce regression risk but do not establish geometric,
manufacturing, security, standards, or regulatory fitness.

## Manual release checks

- Load the demo part and select single and multiple faces.
- Import small single-body STEP files in millimetres and inches with known bounds.
- Try an assembly, curved face, trimmed face, and model with tiny features.
- Exercise every finish category and the custom height-map path.
- Confirm reference-change warnings for depth, spacing, and rotation.
- Export both 3MF and STL, reopen them in at least one independent mesh tool and
  the target slicer, and inspect for scale, manifold, and normal problems.
- Confirm the local launcher binds only to `127.0.0.1`.
- Confirm no network requests occur during normal import, editing, and export.
- Review dependency and license changes.

## Physical validation

Print traceable coupons with known dimensions and record printer, firmware,
slicer, resin, orientation, support, exposure, temperature, wash, cure, layer
height, and compensation. Measure critical dimensions and relief using suitable
calibrated equipment. Visual and tactile approval should use consistent lighting,
coating, color, and comparison method.

Do not claim a preset is validated for a printer or manufacturing specification
unless the test protocol, sample count, acceptance limits, equipment calibration,
and results are documented and reproducible.

