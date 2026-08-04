import occtimportjs from "occt-import-js";
import wasmUrl from "occt-import-js/dist/occt-import-js.wasm?url";
import { geometryFromFace } from "./geometry.js";

let occtPromise;

async function getOcct() {
  if (!occtPromise) occtPromise = occtimportjs({ locateFile: file => file.endsWith(".wasm") ? wasmUrl : file });
  return occtPromise;
}

export async function readStepFile(file) {
  const occt = await getOcct();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const result = occt.ReadStepFile(bytes, {
    linearUnit: "millimeter",
    linearDeflectionType: "absolute_value",
    linearDeflection: 0.22,
    angularDeflection: 0.35
  });
  if (!result.success) throw new Error("Open CASCADE could not read this STEP file.");
  const faces = [];
  result.meshes.forEach((meshData, meshIndex) => {
    meshData.brep_faces.forEach((faceRange, faceIndex) => {
      faces.push({
        geometry: geometryFromFace(meshData, faceRange),
        label: `Face ${faceIndex + 1}`,
        meshName: meshData.name || `Body ${meshIndex + 1}`,
        source: { meshIndex, faceIndex }
      });
    });
  });
  if (!faces.length) throw new Error("The STEP file contains no tessellated faces.");
  return { faces, hierarchy: result.root };
}
