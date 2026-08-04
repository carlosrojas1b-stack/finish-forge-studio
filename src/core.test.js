import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { proceduralHeight, PRESETS, PRINTER_PROFILES } from "./presets.js";
import { createDemoFaces, displaceGeometry, countTriangles, geometryFromFace } from "./geometry.js";
import { createStoredZip, build3mf } from "./exporters.js";

describe("finish generation",()=>{
  it("contains a broad physically dimensioned finish catalog",()=>{
    expect(PRESETS.filter(p=>p.category==="mt").length).toBe(68);
    const mt11100=PRESETS.find(p=>p.code==="MT-11100");
    expect(mt11100.depth).toBeCloseTo(0.1524,6);
    expect(mt11100.draft).toBe(9);
    expect(PRESETS.some(p=>p.id==="oak"&&p.adjustable)).toBe(true);
    expect(PRESETS.some(p=>p.id==="woven"&&p.adjustable)).toBe(true);
    expect(PRESETS.filter(p=>p.category==="spi").length).toBe(12);
    expect(PRESETS.filter(p=>p.category==="vdi").length).toBe(16);
    expect(PRESETS.find(p=>p.id==="vdi-45").referenceRaUm).toBe(18);
    expect(PRINTER_PROFILES["resin-25"].layerHeight).toBe(0.025);
    expect(PRINTER_PROFILES["resin-50"].layerHeight).toBe(0.05);
  });
  it("accepts the flat buffers returned by occt-import-js",()=>{
    const mesh={
      attributes:{
        position:{array:[0,0,0, 1,0,0, 1,1,0, 0,1,0]},
        normal:{array:[0,0,1, 0,0,1, 0,0,1, 0,0,1]}
      },
      index:{array:[0,1,2, 0,2,3]}
    };
    const geometry=geometryFromFace(mesh,{first:0,last:1});
    expect(geometry.getAttribute("position").count).toBe(4);
    expect(geometry.getIndex().count).toBe(6);
  });
  it("also accepts nested triplet buffers",()=>{
    const mesh={
      attributes:{
        position:{array:[[0,0,0],[1,0,0],[1,1,0]]},
        normal:{array:[[0,0,1],[0,0,1],[0,0,1]]}
      },
      index:{array:[[0,1,2]]}
    };
    const geometry=geometryFromFace(mesh,{first:0,last:0});
    expect(geometry.getAttribute("position").count).toBe(3);
    expect(geometry.getIndex().count).toBe(3);
  });
  it("is deterministic and bounded",()=>{
    const a=proceduralHeight(1.2,3.4,5.6,PRESETS[0]);
    expect(a).toBe(proceduralHeight(1.2,3.4,5.6,PRESETS[0]));
    expect(a).toBeGreaterThanOrEqual(-.5);expect(a).toBeLessThanOrEqual(.5);
  });
  it("rotates directional patterns",()=>{
    const wood=PRESETS.find(p=>p.id==="oak");
    const unrotated=proceduralHeight(1.2,3.4,5.6,{...wood,rotationDeg:0});
    const rotated=proceduralHeight(1.2,3.4,5.6,{...wood,rotationDeg:90});
    expect(rotated).not.toBe(unrotated);
  });
  it("subdivides a demo face and keeps boundary vertices fixed",()=>{
    const source=createDemoFaces()[0].geometry;
    const result=displaceGeometry(source,PRESETS[0],{...PRINTER_PROFILES["resin-fine"],meshTarget:2,maxTriangles:5000});
    expect(countTriangles(result)).toBeGreaterThan(countTriangles(source));
    const original=source.getAttribute("position"),generated=result.getAttribute("position");
    for(let i=0;i<original.count;i++){
      let found=false;
      for(let j=0;j<generated.count;j++){
        if(Math.hypot(
          original.getX(i)-generated.getX(j),
          original.getY(i)-generated.getY(j),
          original.getZ(i)-generated.getZ(j)
        )<1e-5){found=true;break;}
      }
      expect(found).toBe(true);
    }
  });
});

describe("export",()=>{
  it("creates a structurally valid stored zip",()=>{
    const zip=createStoredZip([{name:"hello.txt",data:"hello"}]);
    expect([...zip.slice(0,4)]).toEqual([0x50,0x4b,0x03,0x04]);
    expect([...zip.slice(-22,-18)]).toEqual([0x50,0x4b,0x05,0x06]);
  });
  it("creates a 3mf package",()=>{
    const group=new THREE.Group();group.add(new THREE.Mesh(new THREE.BoxGeometry(1,1,1)));
    const file=build3mf(group,"test");
    const text=new TextDecoder().decode(file);
    expect(text).toContain("3D/3dmodel.model");
    expect(text).toContain("<model unit=\"millimeter\"");
  });
});
