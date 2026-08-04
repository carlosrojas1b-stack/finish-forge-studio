# Getting started

## End-user workflow

1. Start the packaged local server and open the displayed loopback address.
2. Import a STEP file or choose the demo part.
3. Confirm the displayed bounding-box dimensions and units. STEP files do not
   always convey unit intent consistently; compare against a known dimension.
4. Select one or more faces in the visualizer.
5. Choose a finish family and preset.
6. Choose a printer profile, then review depth, spacing, rotation, and scale.
7. Apply the finish. A warning appears when settings depart from the reference.
8. Inspect all boundaries and critical regions before exporting.
9. Open the output in the intended slicer and run its mesh checks.
10. Print and measure a small coupon before committing to the complete part.

The application uses millimetres internally. Printer layer height does not equal
XY resolution, dimensional accuracy, minimum printable relief, or texture
fidelity. A 25 µm layer option only controls the profile assumptions used by the
mesh generator.

## Selection controls

- Click a face to select it.
- Shift-click to add or remove an individual face.
- Orbit, pan, and zoom to inspect hidden areas.
- Recheck selected faces before applying a high-resolution pattern.

## Custom height maps

Use a grayscale image for custom relief only when you own it or have permission.
Dark-to-light values are interpreted as relative relief; the physical result
depends on depth and pattern scale. An image alone is not calibrated metrology.
Remove metadata and confidential markings before sharing project screenshots or
reproduction files.

## Troubleshooting

If import fails, try a smaller single-body STEP file, confirm the extension is
`.step` or `.stp`, reload the page, and capture the exact error and browser
console output. Assemblies, malformed files, unusual entities, and very large
models may exceed the current importer or browser memory limits.

If the part looks smooth, increase preview visibility cautiously and verify that
the printer's XY capability, resin, orientation, exposure, antialiasing, and
post-processing can reproduce the selected feature size.

