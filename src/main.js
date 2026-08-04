import "./styles.css";
import { Viewer } from "./viewer.js";
import { PRESETS, FINISH_CATEGORIES, PRINTER_PROFILES } from "./presets.js";
import { createDemoFaces, displaceGeometry, countTriangles } from "./geometry.js";
import { readStepFile } from "./step-loader.js";
import { exportStl, export3mf, exportProject } from "./exporters.js";

const $=selector=>document.querySelector(selector);
const state={
  name:null,faces:[],selected:[],preset:PRESETS[0],assignments:new Map(),
  customSampler:null,profile:PRINTER_PROFILES["resin-25"],loading:false,
  finishCategory:"mt",finishSearch:"",scaleMultiplier:1,depthValue:PRESETS[0].depth,
  rotationDeg:0,adjusted:false,modelDimensions:null
};
const viewer=new Viewer($("#viewer"),selected=>{state.selected=selected;renderSelection();});

function toast(message,type="info"){
  const item=document.createElement("div"); item.className=`toast ${type}`; item.textContent=message;
  $("#toastStack").append(item); setTimeout(()=>item.remove(),4000);
}
function setStatus(text,busy=false){
  $("#viewerStatus span:last-child").textContent=text;
  $("#viewerStatus .status-dot").style.background=busy?"#f3b74d":"#b7f34d";
}
function setLoading(active,title="Reading STEP geometry…",detail="Open CASCADE is processing the model locally."){
  state.loading=active; $("#loadingOverlay").classList.toggle("hidden",!active);
  $("#loadingTitle").textContent=title; $("#loadingDetail").textContent=detail;
}
function renderPresets(){
  const query=state.finishSearch.trim().toLowerCase();
  const categoryPresets=PRESETS.filter(p=>p.category===state.finishCategory);
  const filtered=categoryPresets.filter(p=>!query||`${p.name} ${p.code||""} ${p.description}`.toLowerCase().includes(query));
  $("#finishTabs").innerHTML=FINISH_CATEGORIES.map(category=>`<button class="finish-tab ${category.id===state.finishCategory?"active":""}" data-category="${category.id}">${category.label}</button>`).join("");
  $("#finishSelect").innerHTML=filtered.length
    ? filtered.map(p=>`<option value="${p.id}" ${p.id===state.preset.id?"selected":""}>${p.name} · ${p.depth.toFixed(4)} mm</option>`).join("")
    : `<option value="">No matching finishes</option>`;
  if(filtered.length&&!filtered.some(p=>p.id===state.preset.id)){
    state.preset=filtered[0];state.scaleMultiplier=1;state.depthValue=state.preset.depth;state.rotationDeg=0;state.adjusted=false;
  }
  const p=state.preset;
  const effectiveScale=p.scale*state.scaleMultiplier;
  const effectiveDepth=state.depthValue;
  const thirdLabel=p.referenceRaUm!==undefined?"Ra reference":p.draft!==undefined?"Min. draft":"Rotation";
  const thirdValue=p.referenceRaUm!==undefined?`${p.referenceRaUm.toFixed(2)} µm`:p.draft!==undefined?`${p.draft}°`:`${state.rotationDeg}°`;
  $("#presetList").innerHTML=`
    <div class="preset-card selected">
      <span class="texture-swatch" style="background:${p.swatch}"></span>
      <span class="preset-copy"><strong>${p.name}</strong><span>${p.description}<br>${p.series}</span></span>
      <div class="preset-specs">
        <div><span>Pattern scale</span><strong>${effectiveScale.toFixed(3)} mm</strong></div>
        <div><span>Peak-to-valley</span><strong>${effectiveDepth.toFixed(4)} mm</strong></div>
        <div><span>${thirdLabel}</span><strong>${thirdValue}</strong></div>
      </div>
      <div class="dimension-note">${p.dimensionStatus}${p.category==="mt"?". Exact visual matching requires an authorized scan or physical plaque.":"."}</div>
    </div>`;
  $("#heightMapRow").classList.toggle("hidden",p.id!=="custom");
  $("#sizingTitle").textContent=p.id==="custom"?"Custom map adjustments":"Finish adjustments";
  $("#scaleMultiplier").value=String(Math.round(state.scaleMultiplier*100));
  $("#scaleMultiplierValue").textContent=`${Math.round(state.scaleMultiplier*100)}% · ${effectiveScale.toFixed(3)} mm`;
  $("#finishDepth").value=String(effectiveDepth);
  $("#finishDepthValue").textContent=`${effectiveDepth.toFixed(3)} mm`;
  $("#finishRotation").value=String(state.rotationDeg);
  $("#finishRotationValue").textContent=`${state.rotationDeg}°`;
  $("#accuracyWarning").classList.toggle("hidden",!state.adjusted);
}

function resetFinishAdjustments(){
  state.scaleMultiplier=1;state.depthValue=state.preset.depth;state.rotationDeg=0;state.adjusted=false;
  renderPresets();
}

function updateAdjustmentFlag(){
  state.adjusted=Math.abs(state.scaleMultiplier-1)>1e-6||Math.abs(state.depthValue-state.preset.depth)>1e-6||state.rotationDeg!==0;
}
function renderSelection(){
  const n=state.selected.length;
  $("#selectionCount").textContent=`${n} selected`;
  $("#applySummary").textContent=n?`${n} face${n===1?"":"s"}`:"Select at least one face";
  $("#applyButton").disabled=!n||state.loading;
  if(!state.faces.length){
    $("#faceList").className="face-list empty"; $("#faceList").innerHTML="<span>No model loaded</span>";
  } else if(!n){
    $("#faceList").className="face-list empty"; $("#faceList").innerHTML="<span>Click a face in the viewer</span>";
  } else {
    $("#faceList").className="face-list";
    $("#faceList").innerHTML=state.selected.map(i=>`<div class="face-row"><span>${state.faces[i].meshName}</span><b>${state.faces[i].label}</b></div>`).join("");
  }
}
function renderAvailability(){
  const has=state.faces.length>0;
  ["#selectAllButton","#clearSelectionButton","#saveProjectButton","#exportButton"].forEach(id=>$(id).disabled=!has||state.loading);
  renderSelection();
}
function renderProfile(){
  $("#layerHeight").textContent=state.profile.layerHeight?`${Math.round(state.profile.layerHeight*1000)} µm`:"Preset";
  $("#minFeature").textContent=`${state.profile.minFeature.toFixed(2)} mm`;
  $("#meshTarget").textContent=`${state.profile.meshTarget.toFixed(2)} mm`;
}
function loadFaces(name,faces){
  state.name=name.replace(/\.(step|stp)$/i,""); state.faces=faces; state.assignments.clear(); state.selected=[];
  viewer.loadFaces(faces);
  state.modelDimensions=viewer.getModelDimensions();
  if(state.modelDimensions){
    $("#modelDimensionValue").textContent=`${state.modelDimensions.x.toFixed(2)} × ${state.modelDimensions.y.toFixed(2)} × ${state.modelDimensions.z.toFixed(2)} mm`;
    $("#modelDimensions").classList.remove("hidden");
  }
  renderAvailability(); setStatus(`${name} · ${faces.length} selectable faces · millimetre model space`);
  toast(`${name} loaded — click a face to begin.`);
}
async function importStep(file){
  if(!file)return;
  if(!/\.(step|stp)$/i.test(file.name)){toast("Please choose a .step or .stp file.","error");return;}
  try{
    setLoading(true); setStatus("Importing STEP model…",true);
    await new Promise(r=>setTimeout(r,40));
    const result=await readStepFile(file);
    loadFaces(file.name,result.faces);
  }catch(error){
    console.error(error); toast(error.message||"Could not import the STEP file.","error"); setStatus("Import failed");
  }finally{setLoading(false);renderAvailability();}
}
function customImageSampler(imageData){
  const {data,width,height}=imageData;
  const sample=(u,v)=>{
    u=((u%1)+1)%1; v=((v%1)+1)%1;
    const x=Math.min(width-1,Math.floor(u*width)),y=Math.min(height-1,Math.floor(v*height));
    const i=(y*width+x)*4; return ((data[i]+data[i+1]+data[i+2])/(3*255))-.5;
  };
  return (x,y,z,nx,ny,nz,scale)=>{
    const ax=Math.abs(nx),ay=Math.abs(ny),az=Math.abs(nz);
    if(ax>=ay&&ax>=az)return sample(z/scale,y/scale);
    if(ay>=az)return sample(x/scale,z/scale);
    return sample(x/scale,y/scale);
  };
}
async function readHeightMap(file){
  const bitmap=await createImageBitmap(file);
  const canvas=document.createElement("canvas");
  canvas.width=Math.min(bitmap.width,1024);canvas.height=Math.min(bitmap.height,1024);
  const ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
  state.customSampler=customImageSampler(ctx.getImageData(0,0,canvas.width,canvas.height));
  $("#customFileName").textContent=file.name; toast("Custom height map ready.");
}
async function applyFinish(){
  if(!state.selected.length)return;
  const preset={...state.preset};
  if(preset.id==="custom"){
    if(!state.customSampler){toast("Choose a custom height-map image first.","error");return;}
  }
  preset.scale*=state.scaleMultiplier;preset.depth=state.depthValue;preset.rotationDeg=state.rotationDeg;
  if(preset.depth<state.profile.minDepth)toast(`${preset.name} is only ${preset.depth.toFixed(4)} mm deep; it may be below this printer profile's reliable depth.`,"error");
  if(state.modelDimensions){
    const smallest=Math.min(...[state.modelDimensions.x,state.modelDimensions.y,state.modelDimensions.z].filter(v=>v>0));
    if(preset.scale>smallest*.75)toast(`Pattern scale is large relative to the ${smallest.toFixed(1)} mm smallest part dimension.`);
  }
  try{
    setLoading(true,"Generating printable texture…","Subdividing selected faces and sealing finish boundaries.");
    await new Promise(r=>setTimeout(r,50));
    let total=0;
    for(const index of state.selected){
      const source=viewer.faceMeshes[index].userData.sourceGeometry;
      const generated=displaceGeometry(source,preset,state.profile,preset.id==="custom"?state.customSampler:null);
      total+=countTriangles(generated);
      const assignment={presetId:preset.id,name:preset.name,scale:preset.scale,depth:preset.depth,rotationDeg:preset.rotationDeg,adjusted:state.adjusted};
      viewer.applyGeometry(index,generated,assignment);
      state.assignments.set(index,assignment);
    }
    viewer.setSelection(state.selected);
    toast(`${preset.name} applied · ${total.toLocaleString()} textured triangles.`);
    setStatus(`${state.assignments.size} finished face${state.assignments.size===1?"":"s"} · mesh ready`);
  }catch(error){console.error(error);toast("Texture generation failed: "+error.message,"error");}
  finally{setLoading(false);renderAvailability();}
}
function projectData(){
  return {
    application:"Finish Forge Studio",version:"0.3.0",model:state.name,
    modelDimensionsMm:state.modelDimensions?{x:state.modelDimensions.x,y:state.modelDimensions.y,z:state.modelDimensions.z}:null,
    printerProfile:Object.entries(PRINTER_PROFILES).find(([,p])=>p===state.profile)?.[0]||"resin-25",
    assignments:[...state.assignments].map(([faceIndex,value])=>({faceIndex,...value})),
    note:"Face assignments reference the imported STEP tessellation order."
  };
}
function showExport(){
  const triangles=viewer.faceMeshes.reduce((n,m)=>n+countTriangles(m.geometry),0);
  $("#exportChecks").innerHTML=`
    <div class="check-row"><span>Model</span><b>${state.name}</b></div>
    <div class="check-row"><span>Finished faces</span><b>${state.assignments.size} of ${state.faces.length}</b></div>
    <div class="check-row"><span>Triangle count</span><b>${triangles.toLocaleString()}</b></div>
    <div class="check-row"><span>Units</span><b>Millimetres</b></div>`;
  $("#exportDialog").showModal();
}
async function performExport(event){
  event.preventDefault();
  const format=new FormData($("#exportDialog form")).get("format");
  $("#exportDialog").close();
  try{
    setLoading(true,"Building manufacturing file…","Combining all CAD faces into the export package.");
    await new Promise(r=>setTimeout(r,50));
    const group=viewer.getExportGroup();
    if(format==="stl")exportStl(group,`${state.name}-finished.stl`);
    else export3mf(group,`${state.name}-finished.3mf`,`${state.name} — Finish Forge Studio`);
    group.traverse(o=>o.geometry?.dispose());
    toast(`${format.toUpperCase()} export generated.`);
  }catch(error){console.error(error);toast("Export failed: "+error.message,"error");}
  finally{setLoading(false);}
}

renderPresets();renderProfile();renderAvailability();
$("#finishTabs").addEventListener("click",event=>{
  const tab=event.target.closest("[data-category]");if(!tab)return;
  state.finishCategory=tab.dataset.category;state.finishSearch="";$("#finishSearch").value="";
  state.preset=PRESETS.find(p=>p.category===state.finishCategory);resetFinishAdjustments();
});
$("#finishSearch").addEventListener("input",event=>{state.finishSearch=event.target.value;renderPresets();});
$("#finishSelect").addEventListener("change",event=>{const selected=PRESETS.find(p=>p.id===event.target.value);if(selected){state.preset=selected;resetFinishAdjustments();}});
$("#stepInput").addEventListener("change",e=>importStep(e.target.files[0]));
$("#dropZone").addEventListener("dragover",e=>{e.preventDefault();e.currentTarget.classList.add("dragging");});
$("#dropZone").addEventListener("dragleave",e=>e.currentTarget.classList.remove("dragging"));
$("#dropZone").addEventListener("drop",e=>{e.preventDefault();e.currentTarget.classList.remove("dragging");importStep(e.dataTransfer.files[0]);});
$("#demoButton").addEventListener("click",()=>loadFaces("Demo enclosure",createDemoFaces()));
$("#selectAllButton").addEventListener("click",()=>viewer.selectAll());
$("#clearSelectionButton").addEventListener("click",()=>viewer.clearSelection());
$("#fitButton").addEventListener("click",()=>viewer.fit());
$("#wireframeButton").addEventListener("click",e=>e.currentTarget.classList.toggle("active",viewer.toggleWireframe()));
$("#printerProfile").addEventListener("change",e=>{state.profile=PRINTER_PROFILES[e.target.value];renderProfile();});
$("#heightMapInput").addEventListener("change",e=>readHeightMap(e.target.files[0]));
$("#scaleMultiplier").addEventListener("input",e=>{state.scaleMultiplier=parseFloat(e.target.value)/100;updateAdjustmentFlag();renderPresets();});
$("#finishDepth").addEventListener("input",e=>{state.depthValue=parseFloat(e.target.value);updateAdjustmentFlag();renderPresets();});
$("#finishRotation").addEventListener("input",e=>{state.rotationDeg=parseInt(e.target.value,10);updateAdjustmentFlag();renderPresets();});
$("#resetFinishButton").addEventListener("click",resetFinishAdjustments);
$("#applyButton").addEventListener("click",applyFinish);
$("#exportButton").addEventListener("click",showExport);
$("#confirmExportButton").addEventListener("click",performExport);
$("#licensesButton").addEventListener("click",()=>$("#licensesDialog").showModal());
$("#exportDialog").addEventListener("change",e=>{if(e.target.name==="format")document.querySelectorAll(".format-card").forEach(c=>c.classList.toggle("selected",c.contains(e.target)));});
$("#saveProjectButton").addEventListener("click",()=>exportProject(projectData(),`${state.name}.finishforge.json`));
$("#newProjectButton").addEventListener("click",()=>{
  if(state.faces.length&&!confirm("Start a new project? Unsaved face assignments will be cleared."))return;
  viewer.clear();state.name=null;state.faces=[];state.assignments.clear();state.selected=[];renderAvailability();setStatus("Ready — import a STEP file");
  state.modelDimensions=null;$("#modelDimensions").classList.add("hidden");
});
