# Third-party notices

Finish Forge Studio depends on third-party software. Those components are not
relicensed under the project's AGPL-3.0-or-later license.

| Component | Version used | License | Included notice |
|---|---:|---|---|
| Three.js | 0.180.x | MIT | `licenses/THREE-MIT.txt` |
| occt-import-js | 0.0.23 | GNU LGPL 2.1 | `licenses/OCCT-IMPORT-JS-LGPL-2.1.txt` |
| Open CASCADE Technology, distributed through occt-import-js | dependency-provided build | GNU LGPL 2.1 with the Open CASCADE exception and notices | `licenses/OPEN-CASCADE-LGPL-2.1-EXCEPTION.txt` |

Development dependencies and their transitive dependencies are recorded in
`pnpm-lock.yaml` and retain their own licenses. Before publishing a release,
regenerate a software-bill-of-materials or dependency-license report and review
it for the exact resolved versions.

When distributing a compiled browser bundle, preserve these notices, make the
corresponding source available through this repository, and independently
confirm that the chosen distribution method satisfies all third-party terms.
No legal conclusion about a particular distribution model is provided here.
