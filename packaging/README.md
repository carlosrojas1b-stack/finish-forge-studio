# Finish Forge Studio 0.3.0

Finish Forge Studio converts selected STEP faces into textured meshes for realistic
pre-injection-molding prototypes. The application runs locally; imported CAD
files are not uploaded.

## Start on Windows

1. Extract the complete `Finish Forge Studio` folder.
2. Double-click `Launch Finish Forge Studio.bat`.
3. Keep the launcher window open while using the application.
4. Your browser opens to `http://127.0.0.1:8765/`.

If Windows asks whether to allow PowerShell, choose the option that permits this
local launcher. It only serves files to the loopback address on your computer.

## Workflow

1. Drop a `.step` or `.stp` file into the import area.
2. Click a face. Shift-click to add or remove individual faces.
3. Pick a finish and printer profile.
4. Click **Apply finish**.
5. Inspect the generated mesh, then export 3MF or STL.

Use **Try the demo part** to explore the interface without a CAD file.

## Included

- Local Open CASCADE WebAssembly STEP import
- B-rep face-level picking
- Searchable, tabbed libraries for MT, SPI/SPE, and VDI 3400 references
- Universal depth, spacing, and rotation controls with accuracy warnings
- 25 µm and 50 µm resin-printing profiles
- Published nominal MT depth and draft metadata in millimetres
- Expanded wood, bark, leather, reptile, botanical, fabric, stone, carbon, brushed, blast, and EDM-style finishes
- Adjustable physical pattern scale for natural and miscellaneous textures
- Automatic display of imported part dimensions in millimetres
- Custom grayscale height-map import
- Resin and FDM mesh profiles
- Crack-resistant boundary fade between finished and unfinished faces
- 3MF and binary STL export
- Finish Forge Studio JSON assignment export

See `DATA-SOURCES.md` for finish-dimension provenance and interpretation.

## Important limitations

- MT preset depths and draft values use published reference dimensions. Pattern
  geometry is synthesized because the official texture drawings and scans are
  proprietary. Accurate visual matching requires an authorized calibrated
  height map or scan and printed sample-chip validation.
- This is an MVP. Very large assemblies or extremely small textures can create
  hundreds of thousands of triangles and take time to process.
- The importer tessellates STEP geometry at 0.22 mm. Texture geometry is then
  adaptively refined according to the chosen printer profile.
- Always inspect the exported part in your slicer and verify tolerances. Avoid
  applying texture to threads, sealing faces, snap fits, and mating surfaces.
- Texture visibility depends on printer, material, orientation, layer height,
  and post-processing.

## Licenses

Finish Forge Studio uses Three.js (MIT) and occt-import-js/Open CASCADE components
(LGPL licenses and applicable exceptions). Notices are included in the
`licenses` folder.
