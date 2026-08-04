# Finish Forge Studio

Finish Forge Studio is a local-first browser application for importing STEP files,
selecting B-rep faces, applying printable surface relief, and exporting prototype
meshes as 3MF or STL. It is intended to make resin-printed design-review parts
look and feel closer to future injection-molded parts.

> [!IMPORTANT]
> This is a prototyping and visualization tool, not a certified mold-texture,
> metrology, or production-engineering system. Read [DISCLAIMER.md](DISCLAIMER.md)
> before relying on an output.

## Highlights

- Local STEP processing using Open CASCADE WebAssembly
- Face-level visual selection
- MT, SPI/SPE, and VDI 3400 reference libraries
- Organic, wood, fabric, stone, leather, carbon, and industrial patterns
- Adjustable depth, spacing, rotation, and physical texture scale
- 25 µm and 50 µm resin-printing profiles
- Custom grayscale height-map import
- 3MF, binary STL, and assignment JSON export
- No application telemetry or server upload in the supplied build

The built-in patterns are synthesized printable interpretations. They are not
official scans, drawings, plaques, or certificates of conformity.

## Quick start for development

Requirements: Node.js 20 or newer and pnpm.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open the local address printed by Vite. To test and build:

```bash
pnpm test
pnpm build
```

## Windows end-user package

After building, place the contents of `dist/` beside the files in `packaging/`,
preserving the `assets/` directory. Users can then run
`Launch Finish Forge Studio.bat`. The included PowerShell server binds only to
`127.0.0.1`.

## Typical workflow

1. Import a `.step` or `.stp` file, or load the demo part.
2. Click a face; Shift-click to add or remove faces.
3. Select a finish and printer profile.
4. Review depth, spacing, rotation, and the accuracy warning.
5. Apply the finish and inspect the generated mesh.
6. Export 3MF or STL and validate it in the intended slicer.
7. Print test coupons before applying a finish to a full part.

## Documentation

- [Getting started](docs/GETTING_STARTED.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Engineering limitations](docs/ENGINEERING_LIMITATIONS.md)
- [Texture and standards data](docs/STANDARDS_AND_TEXTURE_DATA.md)
- [Validation and testing](docs/VALIDATION_AND_TESTING.md)
- [Legal and safety FAQ](docs/LEGAL_AND_SAFETY_FAQ.md)
- [Maintainer publishing checklist](docs/MAINTAINER_CHECKLIST.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Support policy](SUPPORT.md)
- [Privacy statement](PRIVACY.md)
- [Donation policy and future setup](DONATIONS.md)

## Open-source license

Original Finish Forge Studio code is available under the
[GNU Affero General Public License v3.0 or later](LICENSE). This strong copyleft
license allows commercial use but requires covered modifications and distributed
versions to remain open source; modified network deployments must offer their
corresponding source to users.
Third-party components remain under their respective licenses; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and `licenses/`.

The AGPL applies to covered software copyright. It does not grant rights to
third-party trademarks, proprietary texture drawings, standards publications,
user-imported CAD, or user-imported height maps.

## Project status

Finish Forge Studio is experimental pre-production software. Contributions and
reproducible bug reports are welcome. There is no guaranteed response time,
support entitlement, roadmap, or backward-compatibility commitment.
