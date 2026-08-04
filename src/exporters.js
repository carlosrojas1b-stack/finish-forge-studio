import * as THREE from "three";
import { STLExporter } from "three/addons/exporters/STLExporter.js";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportStl(group, filename) {
  const exporter = new STLExporter();
  const data = exporter.parse(group, { binary: true });
  downloadBlob(new Blob([data], {type:"model/stl"}), filename);
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let k=0;k<8;k++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const u16 = value => [value & 255, (value>>>8)&255];
const u32 = value => [value&255,(value>>>8)&255,(value>>>16)&255,(value>>>24)&255];

export function createStoredZip(files) {
  const encoder = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = typeof file.data === "string" ? encoder.encode(file.data) : file.data;
    const crc = crc32(data);
    const local = new Uint8Array([
      ...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),
      ...u32(crc),...u32(data.length),...u32(data.length),...u16(name.length),...u16(0),...name
    ]);
    chunks.push(local,data);
    central.push(new Uint8Array([
      ...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),
      ...u32(crc),...u32(data.length),...u32(data.length),...u16(name.length),...u16(0),...u16(0),
      ...u16(0),...u16(0),...u32(0),...u32(offset),...name
    ]));
    offset += local.length + data.length;
  }
  const centralSize = central.reduce((sum,item)=>sum+item.length,0);
  const end = new Uint8Array([
    ...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),
    ...u32(centralSize),...u32(offset),...u16(0)
  ]);
  const total = [...chunks,...central,end].reduce((sum,item)=>sum+item.length,0);
  const output = new Uint8Array(total);
  let cursor=0;
  for (const chunk of [...chunks,...central,end]) { output.set(chunk,cursor); cursor+=chunk.length; }
  return output;
}

function meshTo3mf(group) {
  const vertices = [];
  const triangles = [];
  const vertexMap = new Map();
  group.updateMatrixWorld(true);
  const point = new THREE.Vector3();
  group.traverse(object => {
    if (!object.isMesh || !object.visible) return;
    const geometry=object.geometry, pos=geometry.getAttribute("position"), idx=geometry.getIndex();
    const localMap = new Map();
    for (let i=0;i<pos.count;i++) {
      point.set(pos.getX(i),pos.getY(i),pos.getZ(i)).applyMatrix4(object.matrixWorld);
      const key=`${point.x.toFixed(6)},${point.y.toFixed(6)},${point.z.toFixed(6)}`;
      let id=vertexMap.get(key);
      if (id===undefined) { id=vertices.length; vertexMap.set(key,id); vertices.push([point.x,point.y,point.z]); }
      localMap.set(i,id);
    }
    const count=idx?idx.count:pos.count;
    for (let i=0;i<count;i+=3) triangles.push([
      localMap.get(idx?idx.getX(i):i),
      localMap.get(idx?idx.getX(i+1):i+1),
      localMap.get(idx?idx.getX(i+2):i+2)
    ]);
  });
  return {vertices,triangles};
}

export function build3mf(group, title="Finish Forge Studio export") {
  const {vertices,triangles}=meshTo3mf(group);
  const esc = value => value.replace(/[<>&'"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"}[c]));
  const model=`<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
<metadata name="Title">${esc(title)}</metadata><metadata name="Application">Finish Forge Studio 0.3</metadata>
<resources><object id="1" type="model"><mesh><vertices>
${vertices.map(v=>`<vertex x="${v[0]}" y="${v[1]}" z="${v[2]}"/>`).join("")}
</vertices><triangles>
${triangles.map(t=>`<triangle v1="${t[0]}" v2="${t[1]}" v3="${t[2]}"/>`).join("")}
</triangles></mesh></object></resources><build><item objectid="1"/></build></model>`;
  const types=`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/></Types>`;
  const rels=`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/></Relationships>`;
  return createStoredZip([
    {name:"[Content_Types].xml",data:types},
    {name:"_rels/.rels",data:rels},
    {name:"3D/3dmodel.model",data:model}
  ]);
}

export function export3mf(group, filename, title) {
  downloadBlob(new Blob([build3mf(group,title)], {type:"model/3mf"}), filename);
}

export function exportProject(project, filename) {
  downloadBlob(new Blob([JSON.stringify(project,null,2)], {type:"application/json"}), filename);
}
