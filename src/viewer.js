import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const BASE = new THREE.MeshStandardMaterial({color:0x6f7d76,metalness:0.03,roughness:0.68,side:THREE.DoubleSide});
const SELECTED = new THREE.MeshStandardMaterial({color:0xb7f34d,emissive:0x24350d,metalness:0.02,roughness:0.56,side:THREE.DoubleSide});
const ASSIGNED = new THREE.MeshStandardMaterial({color:0xc3a876,metalness:0.02,roughness:0.9,side:THREE.DoubleSide});

export class Viewer {
  constructor(container, onSelection) {
    this.container=container; this.onSelection=onSelection; this.faceMeshes=[]; this.selected=new Set();
    this.scene=new THREE.Scene();
    this.scene.background=new THREE.Color(0xd3d7d5);
    this.scene.fog=new THREE.FogExp2(0xd3d7d5,0.0015);
    this.camera=new THREE.PerspectiveCamera(40,1,0.05,100000);
    this.camera.position.set(70,55,70);
    this.renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled=true;
    container.appendChild(this.renderer.domElement);
    this.controls=new OrbitControls(this.camera,this.renderer.domElement);
    this.controls.enableDamping=true; this.controls.dampingFactor=.08;
    this.controls.mouseButtons.LEFT=THREE.MOUSE.ROTATE;
    this.controls.mouseButtons.RIGHT=THREE.MOUSE.PAN;
    this.modelGroup=new THREE.Group(); this.scene.add(this.modelGroup);
    const hemi=new THREE.HemisphereLight(0xffffff,0x68716c,2.1); this.scene.add(hemi);
    const key=new THREE.DirectionalLight(0xffffff,2.7); key.position.set(80,120,70); this.scene.add(key);
    const rim=new THREE.DirectionalLight(0x9bc6dc,1.1); rim.position.set(-80,30,-90); this.scene.add(rim);
    this.grid=new THREE.GridHelper(240,24,0x87918c,0xb6bdba); this.grid.position.y=-20; this.scene.add(this.grid);
    this.raycaster=new THREE.Raycaster(); this.pointer=new THREE.Vector2();
    this.down={x:0,y:0};
    this.renderer.domElement.addEventListener("pointerdown",e=>this.down={x:e.clientX,y:e.clientY});
    this.renderer.domElement.addEventListener("pointerup",e=>this.handlePick(e));
    this.resizeObserver=new ResizeObserver(()=>this.resize()); this.resizeObserver.observe(container);
    this.animate();
  }
  animate=()=>{ requestAnimationFrame(this.animate); this.controls.update(); this.renderer.render(this.scene,this.camera); };
  resize(){
    const w=this.container.clientWidth,h=this.container.clientHeight;
    this.renderer.setSize(w,h,false); this.camera.aspect=w/h; this.camera.updateProjectionMatrix();
  }
  clear(){
    for (const mesh of this.faceMeshes) { mesh.geometry.dispose(); this.modelGroup.remove(mesh); }
    this.faceMeshes=[]; this.selected.clear();
  }
  loadFaces(faces){
    this.clear();
    faces.forEach((face,index)=>{
      const mesh=new THREE.Mesh(face.geometry,BASE.clone());
      mesh.userData={faceIndex:index,assignment:null,label:face.label,meshName:face.meshName,sourceGeometry:face.geometry.clone()};
      this.faceMeshes.push(mesh); this.modelGroup.add(mesh);
    });
    this.fit();
  }
  handlePick(event){
    if (Math.hypot(event.clientX-this.down.x,event.clientY-this.down.y)>5) return;
    const rect=this.renderer.domElement.getBoundingClientRect();
    this.pointer.x=((event.clientX-rect.left)/rect.width)*2-1;
    this.pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;
    this.raycaster.setFromCamera(this.pointer,this.camera);
    const hit=this.raycaster.intersectObjects(this.faceMeshes,false)[0];
    if (!hit) { if(!event.shiftKey)this.setSelection([]); return; }
    const index=hit.object.userData.faceIndex;
    if (event.shiftKey) {
      const next=new Set(this.selected);
      next.has(index)?next.delete(index):next.add(index);
      this.setSelection([...next]);
    } else this.setSelection([index]);
  }
  setSelection(indices){
    this.selected=new Set(indices);
    this.faceMeshes.forEach((mesh,index)=>{
      mesh.material = this.selected.has(index) ? SELECTED : (mesh.userData.assignment ? ASSIGNED : BASE);
    });
    this.onSelection([...this.selected]);
  }
  selectAll(){ this.setSelection(this.faceMeshes.map((_,i)=>i)); }
  clearSelection(){ this.setSelection([]); }
  fit(){
    if(!this.faceMeshes.length)return;
    const box=new THREE.Box3().setFromObject(this.modelGroup);
    const center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
    const radius=Math.max(size.x,size.y,size.z);
    this.controls.target.copy(center);
    this.camera.position.copy(center).add(new THREE.Vector3(radius*1.35,radius*.95,radius*1.35));
    this.camera.near=Math.max(.01,radius/1000); this.camera.far=Math.max(1000,radius*100);
    this.camera.updateProjectionMatrix(); this.grid.position.y=box.min.y-1.5;
    this.controls.update();
  }
  toggleWireframe(){
    this.faceMeshes.forEach(mesh=>mesh.material.wireframe=!mesh.material.wireframe);
    return this.faceMeshes[0]?.material.wireframe||false;
  }
  applyGeometry(index,geometry,assignment){
    const mesh=this.faceMeshes[index];
    if(!mesh)return;
    if(mesh.geometry!==mesh.userData.sourceGeometry)mesh.geometry.dispose();
    mesh.geometry=geometry; mesh.userData.assignment=assignment;
  }
  resetGeometry(index){
    const mesh=this.faceMeshes[index]; if(!mesh)return;
    mesh.geometry=mesh.userData.sourceGeometry.clone(); mesh.userData.assignment=null;
  }
  getExportGroup(){
    const group=new THREE.Group();
    this.faceMeshes.forEach(mesh=>group.add(new THREE.Mesh(mesh.geometry.clone(),BASE)));
    return group;
  }
  getModelDimensions(){
    if(!this.faceMeshes.length)return null;
    return new THREE.Box3().setFromObject(this.modelGroup).getSize(new THREE.Vector3());
  }
}
