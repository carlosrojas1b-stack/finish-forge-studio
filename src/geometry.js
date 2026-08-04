import * as THREE from "three";
import { proceduralHeight } from "./presets.js";

const keyOf = (v) => `${v.x.toFixed(7)},${v.y.toFixed(7)},${v.z.toFixed(7)}`;

export function geometryFromFace(meshData, faceRange) {
  const positions = meshData.attributes.position.array;
  const normals = meshData.attributes.normal?.array;
  const triangles = meshData.index.array;
  const compactPositions = [];
  const compactNormals = [];
  const compactIndices = [];
  const remap = new Map();
  const positionsAreTuples = Array.isArray(positions[0]);
  const normalsAreTuples = normals ? Array.isArray(normals[0]) : false;
  const trianglesAreTuples = Array.isArray(triangles[0]);
  const triangleCount = trianglesAreTuples ? triangles.length : Math.floor(triangles.length / 3);
  const first = Math.max(0, faceRange.first);
  const last = Math.min(triangleCount - 1, faceRange.last);

  const getTriangle = triangleIndex => trianglesAreTuples
    ? triangles[triangleIndex]
    : [
        triangles[triangleIndex * 3],
        triangles[triangleIndex * 3 + 1],
        triangles[triangleIndex * 3 + 2]
      ];
  const getPosition = vertexIndex => positionsAreTuples
    ? positions[vertexIndex]
    : [
        positions[vertexIndex * 3],
        positions[vertexIndex * 3 + 1],
        positions[vertexIndex * 3 + 2]
      ];
  const getNormal = vertexIndex => normalsAreTuples
    ? normals[vertexIndex]
    : [
        normals[vertexIndex * 3],
        normals[vertexIndex * 3 + 1],
        normals[vertexIndex * 3 + 2]
      ];

  for (let triangleIndex = first; triangleIndex <= last; triangleIndex += 1) {
    const triangle = getTriangle(triangleIndex);
    for (const sourceIndex of triangle) {
      let targetIndex = remap.get(sourceIndex);
      if (targetIndex === undefined) {
        targetIndex = compactPositions.length / 3;
        remap.set(sourceIndex, targetIndex);
        compactPositions.push(...getPosition(sourceIndex));
        if (normals) compactNormals.push(...getNormal(sourceIndex));
      }
      compactIndices.push(targetIndex);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(compactPositions, 3));
  if (compactNormals.length) geometry.setAttribute("normal", new THREE.Float32BufferAttribute(compactNormals, 3));
  else geometry.computeVertexNormals();
  geometry.setIndex(compactIndices);
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

export function createDemoFaces() {
  const dimensions = [42, 30, 18];
  const source = new THREE.BoxGeometry(...dimensions).toNonIndexed();
  const position = source.getAttribute("position");
  const normal = source.getAttribute("normal");
  const faces = [];
  for (let side = 0; side < 6; side += 1) {
    const p = [], n = [];
    const start = side * 6;
    for (let i = 0; i < 6; i += 1) {
      p.push(position.getX(start+i), position.getY(start+i), position.getZ(start+i));
      n.push(normal.getX(start+i), normal.getY(start+i), normal.getZ(start+i));
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(n, 3));
    geometry.setIndex([0,1,2,3,4,5]);
    faces.push({ geometry, label: `Face ${side + 1}`, meshName: "Demo enclosure" });
  }
  source.dispose();
  return faces;
}

function midpoint(a, b) {
  return new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
}

function normalizedMidpoint(a, b) {
  return new THREE.Vector3().addVectors(a, b).normalize();
}

export function subdivideGeometry(source, targetEdge = 0.5, maxTriangles = 250000) {
  const geometry = source.index ? source : source.toNonIndexed();
  const pos = geometry.getAttribute("position");
  const norm = geometry.getAttribute("normal");
  const index = geometry.getIndex();
  let triangles = [];
  const count = index ? index.count : pos.count;

  for (let i = 0; i < count; i += 3) {
    const ids = index ? [index.getX(i), index.getX(i+1), index.getX(i+2)] : [i,i+1,i+2];
    triangles.push(ids.map(id => ({
      p: new THREE.Vector3(pos.getX(id), pos.getY(id), pos.getZ(id)),
      n: new THREE.Vector3(norm.getX(id), norm.getY(id), norm.getZ(id))
    })));
  }

  for (let pass = 0; pass < 10; pass += 1) {
    let changed = false;
    const next = [];
    for (const tri of triangles) {
      const [a,b,c] = tri;
      const longest = Math.max(a.p.distanceTo(b.p), b.p.distanceTo(c.p), c.p.distanceTo(a.p));
      if (longest <= targetEdge || next.length + (triangles.length - next.length) * 4 > maxTriangles) {
        next.push(tri);
        continue;
      }
      changed = true;
      const ab = { p: midpoint(a.p,b.p), n: normalizedMidpoint(a.n,b.n) };
      const bc = { p: midpoint(b.p,c.p), n: normalizedMidpoint(b.n,c.n) };
      const ca = { p: midpoint(c.p,a.p), n: normalizedMidpoint(c.n,a.n) };
      next.push([a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]);
      if (next.length >= maxTriangles) break;
    }
    triangles = next;
    if (!changed || triangles.length >= maxTriangles) break;
  }

  const vertices = [], normals = [], indices = [], map = new Map();
  for (const tri of triangles) {
    for (const vertex of tri) {
      const key = keyOf(vertex.p);
      let id = map.get(key);
      if (id === undefined) {
        id = vertices.length / 3;
        map.set(key, id);
        vertices.push(vertex.p.x,vertex.p.y,vertex.p.z);
        normals.push(vertex.n.x,vertex.n.y,vertex.n.z);
      }
      indices.push(id);
    }
  }
  const result = new THREE.BufferGeometry();
  result.setAttribute("position", new THREE.Float32BufferAttribute(vertices,3));
  result.setAttribute("normal", new THREE.Float32BufferAttribute(normals,3));
  result.setIndex(indices);
  return result;
}

function findBoundaryDistances(geometry, fadeWidth) {
  const pos = geometry.getAttribute("position");
  const idx = geometry.getIndex();
  const edgeCounts = new Map();
  const adjacency = Array.from({length: pos.count}, () => new Map());
  const addEdge = (a,b) => {
    const key = a < b ? `${a}:${b}` : `${b}:${a}`;
    edgeCounts.set(key, (edgeCounts.get(key) || 0) + 1);
    const ax=pos.getX(a), ay=pos.getY(a), az=pos.getZ(a);
    const bx=pos.getX(b), by=pos.getY(b), bz=pos.getZ(b);
    const length = Math.hypot(ax-bx,ay-by,az-bz);
    adjacency[a].set(b,length); adjacency[b].set(a,length);
  };
  for (let i=0;i<idx.count;i+=3) {
    const a=idx.getX(i),b=idx.getX(i+1),c=idx.getX(i+2);
    addEdge(a,b); addEdge(b,c); addEdge(c,a);
  }
  const distances = new Float32Array(pos.count); distances.fill(Infinity);
  const queue = [];
  const heapPush = item => {
    queue.push(item);
    let i=queue.length-1;
    while(i>0){
      const p=(i-1)>>1;
      if(queue[p].distance<=item.distance)break;
      queue[i]=queue[p];i=p;
    }
    queue[i]=item;
  };
  const heapPop = () => {
    const root=queue[0],last=queue.pop();
    if(queue.length){
      let i=0;
      while(true){
        let child=i*2+1;
        if(child>=queue.length)break;
        if(child+1<queue.length&&queue[child+1].distance<queue[child].distance)child++;
        if(queue[child].distance>=last.distance)break;
        queue[i]=queue[child];i=child;
      }
      queue[i]=last;
    }
    return root;
  };
  for (const [key,count] of edgeCounts) {
    if (count !== 1) continue;
    for (const id of key.split(":").map(Number)) {
      if (distances[id] !== 0) { distances[id]=0; heapPush({id,distance:0}); }
    }
  }
  while (queue.length) {
    const item=heapPop(),current=item.id;
    if(item.distance!==distances[current]||item.distance>=fadeWidth)continue;
    for (const [next,length] of adjacency[current]) {
      const candidate=item.distance+length;
      if (candidate < distances[next] && candidate <= fadeWidth) {
        distances[next]=candidate; heapPush({id:next,distance:candidate});
      }
    }
  }
  return distances;
}

export function displaceGeometry(source, preset, profile, imageSampler = null) {
  // STEP coordinates and every finish dimension are millimetres. Refine enough
  // to represent the pattern, but never below the printer's physical feature limit.
  const target = Math.max(profile.minFeature, Math.min(profile.meshTarget, preset.scale / 4));
  const geometry = subdivideGeometry(source, target, profile.maxTriangles);
  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  const fadeWidth = Math.max(target * 2.2, preset.depth * 4);
  const boundaryDistances = findBoundaryDistances(geometry, fadeWidth);
  const angle=(preset.rotationDeg||0)*Math.PI/180,cos=Math.cos(angle),sin=Math.sin(angle);

  for (let i=0;i<position.count;i+=1) {
    const x=position.getX(i), y=position.getY(i), z=position.getZ(i);
    const nx=normal.getX(i),ny=normal.getY(i),nz=normal.getZ(i);
    const rotatedX=x*cos-y*sin,rotatedY=x*sin+y*cos;
    const rotatedNx=nx*cos-ny*sin,rotatedNy=nx*sin+ny*cos;
    let height = imageSampler
      ? imageSampler(rotatedX,rotatedY,z,rotatedNx,rotatedNy,nz,preset.scale)
      : proceduralHeight(x,y,z,preset);
    const t = Math.min(1, boundaryDistances[i] / fadeWidth);
    const fade = t * t * (3 - 2 * t);
    height *= preset.depth * fade;
    position.setXYZ(i,
      x + nx*height,
      y + ny*height,
      z + nz*height
    );
  }
  position.needsUpdate=true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

export function countTriangles(geometry) {
  return geometry.index ? geometry.index.count / 3 : geometry.getAttribute("position").count / 3;
}
