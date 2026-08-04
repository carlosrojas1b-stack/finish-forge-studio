# Architecture

Finish Forge Studio is a Vite-built, client-side JavaScript application.

## Main modules

| Module | Responsibility |
|---|---|
| `src/main.js` | Application state, controls, import/apply/export workflow |
| `src/viewer.js` | Three.js scene, camera, rendering, and face picking |
| `src/step-loader.js` | Open CASCADE WebAssembly STEP import and face extraction |
| `src/presets.js` | Finish reference metadata and synthesized pattern definitions |
| `src/geometry.js` | Mesh refinement, relief displacement, and boundary behavior |
| `src/exporters.js` | 3MF, STL, and assignment JSON output |
| `src/styles.css` | Responsive interface styling |

## Data flow

The browser reads a local STEP file, passes its bytes to `occt-import-js`, and
receives tessellated face meshes. The viewer assigns stable face identifiers for
selection. Applying a finish refines selected mesh regions and displaces vertices
using the chosen procedural pattern or user height map. Exporters serialize the
result without a project server.

## Trust boundaries

STEP parsers, WebAssembly, image decoders, the browser, build dependencies, and
download handling are security boundaries. The included PowerShell launcher is
a static loopback HTTP server, not a multi-user or Internet-facing service. Do
not change its bind address without a separate security review.

## Units and coordinate assumptions

Geometry and preset physical fields are treated as millimetres. Pattern rotation
is mapped in the generated surface coordinate frame. Complex curved surfaces can
produce local stretching or orientation variation; the application is not a UV
authoring or geodesic manufacturing system.

