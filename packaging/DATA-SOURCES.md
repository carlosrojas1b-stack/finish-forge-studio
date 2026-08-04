# Finish dimension provenance

Finish Forge Studio 0.3.0 stores all model and texture dimensions in millimetres.

## MT reference entries

The MT codes, nominal depths, and draft values in the built-in library are
engineering reference data compiled from publicly available texture charts.
They are useful for prototype planning, but they are not a substitute for a
current Standex Engraving specification or approved physical plaque.

- Standex Engraving technical data:
  https://www.mold-tech.com/technical-information/
- Standex Engraving online texture catalogue registration:
  https://www.mold-tech.com/textures-registration/
- Public A-series reference chart:
  https://attractiveplastics.com/wp-content/themes/Attractive_Plastics/static/download/Mold%20Tech%20surface%20finishes.pdf
- Public A–D reference tables:
  https://www.kemalmfg.com/injection-molding/mold-textures/

Standex describes its catalogue information and texture drawings as
proprietary. Therefore, Finish Forge Studio does not reproduce official texture maps.
The built-in MT entries use the nominal depth metadata with synthesized pattern
geometry. Import an authorized calibrated height map for visual and geometric
matching to a specific plaque.

## Printing interpretation

`depth` is treated as peak-to-valley displacement on the printed part. Pattern
scale is applied in the STEP model's millimetre coordinate system. Natural and
miscellaneous finishes expose a multiplier that changes pattern spacing without
silently changing the part dimensions.

## SPI/SPE and VDI references

SPI/SPE grades are tooling process and appearance references, not displacement
maps. The built-in A-1 through D-3 entries retain the common tooling method and
use a clearly labelled printable preview relief.

VDI 3400 entries retain commonly published Ra reference values. Ra is an
average roughness statistic and cannot uniquely define a 3D surface. The app's
default printable relief uses an approximate peak-to-valley proxy of 4 × Ra and
is labelled accordingly. Confirm production requirements against a licensed
standard, comparator plaque, and the toolmaker.

- Plastics Industry Association standards listing (which identifies its AR-106
  Mold Finish Guide as a companion reference):
  https://access.plasticsindustry.org/PLAS/Store/Item_Detail.aspx?iProductCode=AQ102
- VDI standards portal:
  https://www.vdi.de/en/home/vdi-standards

Changing depth, spacing, or rotation intentionally breaks reference matching.
Finish Forge Studio stores that adjusted state in the project and displays a
warning before the finish is applied.
