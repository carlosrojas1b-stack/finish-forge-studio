# Engineering limitations

## Model import and tessellation

The importer tessellates boundary-representation geometry. Tessellation is an
approximation and can differ from the analytic STEP surface. Assemblies, trimmed
surfaces, periodic seams, tiny faces, invalid topology, and extreme model scales
may import imperfectly or not at all.

## Texture displacement

Relief changes the mesh and therefore changes the part envelope, mass, local
thickness, clearance, and contact geometry. Boundary fading reduces abrupt
transitions but does not guarantee continuity, watertightness, or preservation of
the original surface. Deep relief can self-intersect or erase thin features.

## Preset meaning

- MT entries use nominal reference metadata with synthesized pattern geometry.
- SPI/SPE entries are printable visual interpretations of finishing categories,
  not exact microtopography.
- VDI entries use roughness references to create approximate relief; Ra does not
  uniquely determine a surface.
- Organic and miscellaneous patterns are artistic procedural textures, not
  faithful replicas of a named natural material.

Depth, spacing, rotation, scale, and random seed all influence the output. A
warning indicates departure from the stored reference, but it cannot determine
whether the result is manufacturable or dimensionally acceptable.

## Printer reality

Layer height is only Z sampling. Effective texture reproduction also depends on
pixel/laser spot size, optical blur, exposure, peel forces, resin viscosity,
support strategy, orientation, compensation, washing, cure, shrinkage, coating,
and human perception. Nominal 25 µm or 50 µm layers do not guarantee features of
that size.

## Validation boundary

Use a controlled coupon containing flat, curved, vertical, and drafted faces.
Measure the result with suitable equipment and obtain stakeholder approval. For
production mold callouts, use the current licensed specification, official or
authorized comparator, and toolmaker process—not an exported prototype mesh.

