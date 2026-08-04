# Standards and texture data

All application dimensions are stored in millimetres. The preset library is
engineering reference data for prototyping, not a substitute for controlled
standards, supplier specifications, or licensed texture assets.

## MT/Mold-Tech references

Built-in MT codes retain nominal depth and draft metadata compiled from publicly
available charts. Pattern geometry is synthesized. Standex describes its catalog
information, textures, and drawings as proprietary, so official maps and scans
are not included. Use a currently authorized specification and physical plaque
for production approval.

Primary context:

- https://www.mold-tech.com/technical-information/
- https://www.mold-tech.com/textures-registration/

## SPI/SPE references

SPI/SPE grades identify common mold finishing or polishing levels and tooling
methods. They do not specify a unique displacement map. Application relief values
are explicitly preview-oriented approximations.

Industry context:

- https://access.plasticsindustry.org/PLAS/Store/Item_Detail.aspx?iProductCode=AQ102

## VDI 3400 references

VDI entries retain commonly published roughness reference values. Ra is an
average statistic, not a complete spatial surface description. The software's
printable peak-to-valley proxy is an implementation choice and must not be
reported as official VDI conformance.

Standards portal:

- https://www.vdi.de/en/home/vdi-standards

## Contribution rules for data

Every new preset should document name, category, intended physical unit,
reference or derivation, whether the value is nominal or synthesized, and a
license compatible with repository distribution. Do not transcribe substantial
standards content or add proprietary scans, vendor artwork, plaque captures,
customer data, or trade secrets. A publicly visible source is not automatically
openly licensed.

Changing depth, spacing, rotation, procedural parameters, or scale means the
result no longer matches even the stored reference. The application must keep
that state visible and serializable.

