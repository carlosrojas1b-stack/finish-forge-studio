const MT_SERIES = {
  A: [
    ["11000",0.01016,1],["11010",0.0254,1.5],["11020",0.0381,2.5],["11030",0.0508,3],
    ["11040",0.0762,4.5],["11050",0.1143,6.5],["11060",0.0762,4.5],["11070",0.0762,4.5],
    ["11080",0.0508,3],["11090",0.0889,5.5],["11100",0.1524,9],["11110",0.0635,4],
    ["11120",0.0508,3],["11130",0.0635,4],["11140",0.0635,4],["11150",0.06985,4],["11160",0.1016,6]
  ],
  B: [
    ["11200",0.0762,4.5],["11205",0.0635,4],["11210",0.0889,5.5],["11215",0.1143,6.5],
    ["11220",0.127,7.5],["11225",0.1143,6.5],["11230",0.0635,4],["11235",0.1016,6],
    ["11240",0.0381,2.5],["11245",0.0508,3],["11250",0.0635,4],["11255",0.0508,3],
    ["11260",0.1016,6],["11265",0.127,7],["11270",0.1016,6],["11275",0.0889,5],["11280",0.1397,8]
  ],
  C: [
    ["11300",0.0635,3.5],["11305",0.127,7.5],["11310",0.127,7.5],["11315",0.0254,1.5],
    ["11320",0.0635,4],["11325",0.0762,4.5],["11330",0.0508,3],["11335",0.0508,3],
    ["11340",0.0762,4.5],["11345",0.0762,4.5],["11350",0.0889,5.5],["11355",0.0635,4],
    ["11360",0.0889,5.5],["11365",0.1143,7],["11370",0.1016,6],["11375",0.1016,6],["11380",0.1016,6]
  ],
  D: [
    ["11400",0.0508,3],["11405",0.0635,4],["11410",0.0889,5.5],["11415",0.0508,3],
    ["11420",0.0635,4],["11425",0.0889,5.5],["11430",0.1778,10],["11435",0.254,15],
    ["11440",0.0127,1.5],["11445",0.0381,2.5],["11450",0.0635,4],["11455",0.0762,4.5],
    ["11460",0.0889,5.5],["11465",0.127,7.5],["11470",0.0508,3],["11475",0.0508,3],["11480",0.0762,4.5]
  ]
};

const MT_FAMILY = {
  A: {label:"Fine / matte",pattern:"matte",swatch:"repeating-radial-gradient(circle,#737b77 0 1px,#4b5350 2px,#626a66 3px)"},
  B: {label:"General grain",pattern:"organic",swatch:"repeating-radial-gradient(ellipse at 25% 40%,#757d79 0 3px,#454c49 5px,#646c68 8px)"},
  C: {label:"Coarse / functional",pattern:"technical",swatch:"repeating-conic-gradient(from 20deg,#727a76 0 8deg,#414845 12deg,#5b635f 18deg)"},
  D: {label:"Special / high relief",pattern:"pebble",swatch:"radial-gradient(circle at 30% 45%,#858d89 0 5%,transparent 7%),repeating-radial-gradient(circle at 65% 60%,#5e6662 0 4px,#373e3b 7px,#69716d 10px)"}
};

function mtPatternScale(code, depth, series) {
  const variant = Number(code.slice(-2)) / 100;
  const base = {A:0.48,B:1.15,C:1.75,D:2.4}[series];
  return Number((base + depth * 10 + variant * 0.8).toFixed(3));
}

const mtPresets = Object.entries(MT_SERIES).flatMap(([series, entries]) => entries.map(([code,depth,draft],index) => ({
  id:`mt-${code}`,
  name:`MT-${code} style`,
  code:`MT-${code}`,
  category:"mt",
  series:`${series} Series`,
  description:`${MT_FAMILY[series].label} · reference geometry`,
  scale:mtPatternScale(code,depth,series),
  depth,
  draft,
  seed:Number(code)+index*13,
  pattern:MT_FAMILY[series].pattern,
  swatch:MT_FAMILY[series].swatch,
  adjustable:false,
  dimensionStatus:"Published nominal depth; synthesized pattern spacing"
})));

const naturalPresets = [
  ["oak","Oak grain","Open directional wood grain",5.5,0.32,"wood"],
  ["ash","Ash grain","Long straight wood pores",4.2,0.25,"wood"],
  ["walnut","Walnut grain","Tighter premium wood figure",3.6,0.28,"wood"],
  ["bamboo","Bamboo grain","Fine linear natural fibre",2.8,0.2,"wood"],
  ["leather-fine","Fine leather","Small organic hide grain",2.2,0.22,"organic"],
  ["leather-pebble","Pebbled leather","Rounded medium hide grain",4.5,0.38,"pebble"],
  ["woven","Woven fabric","Balanced warp and weft",2.0,0.26,"woven"],
  ["canvas","Canvas","Coarse plain weave",2.8,0.34,"woven"],
  ["denim","Denim twill","Directional diagonal weave",1.8,0.24,"twill"],
  ["felt","Felt","Soft randomized fibre",1.2,0.16,"matte"],
  ["cork","Cork","Irregular cellular islands",3.8,0.3,"organic"],
  ["stone","Fine stone","Natural mineral stipple",2.4,0.26,"stone"],
  ["tree-bark","Tree bark","Deep longitudinal bark channels",7.5,0.55,"bark"],
  ["reptile","Reptile skin","Irregular biological scales",3.4,0.34,"scales"],
  ["leaf-veins","Leaf veins","Branching botanical vein pattern",5.8,0.28,"veins"],
  ["suede","Suede","Very fine soft-touch fibre",0.75,0.09,"matte"],
  ["linen","Linen","Fine irregular natural weave",1.5,0.18,"woven"],
  ["herringbone","Herringbone fabric","Alternating directional weave",3.2,0.3,"herringbone"],
  ["water-ripple","Water ripple","Soft concentric organic waves",6.5,0.36,"ripple"],
  ["granite","Granite","Mixed mineral crystalline grain",3.1,0.31,"granite"],
  ["sandstone","Sandstone","Layered granular stone",4.6,0.38,"sandstone"],
  ["hammered","Hammered surface","Overlapping shallow dimples",5.2,0.45,"pebble"]
].map((p,index)=>({id:p[0],name:p[1],description:p[2],category:"natural",series:"Natural",scale:p[3],depth:p[4],pattern:p[5],seed:401+index*31,adjustable:true,dimensionStatus:"Physical base scale; user adjustable",swatch:"repeating-radial-gradient(ellipse at 25% 35%,#7c837f 0 3px,#4a514e 5px,#666e6a 8px)"}));

const industrialPresets = [
  ["fine-matte","Fine matte","Uniform micrograin",0.72,0.08,"matte"],
  ["sandblast-120","Sandblast 120","Coarse randomized blast",1.4,0.24,"stone"],
  ["sandblast-240","Sandblast 240","Fine randomized blast",0.95,0.18,"stone"],
  ["spark-fine","Fine spark erosion","Dense EDM-like texture",0.58,0.1,"technical"],
  ["spark-coarse","Coarse spark erosion","Aggressive EDM-like texture",1.25,0.22,"technical"],
  ["brushed","Brushed metal","Directional fine brushing",1.8,0.12,"brushed"],
  ["knurl","Crosshatch grip","Technical diamond grip",3.2,0.42,"crosshatch"],
  ["carbon","Carbon weave","2 × 2 composite twill",3.6,0.24,"twill"],
  ["concrete","Fine concrete","Pitted architectural texture",3.8,0.32,"stone"]
].map((p,index)=>({id:p[0],name:p[1],description:p[2],category:"industrial",series:"Industrial",scale:p[3],depth:p[4],pattern:p[5],seed:811+index*37,adjustable:true,dimensionStatus:"Physical base scale; user adjustable",swatch:"repeating-conic-gradient(from 20deg,#707874 0 9deg,#414845 13deg,#59615d 19deg)"}));

const spiPresets = [
  ["A-1","Grade #3 diamond buff","Mirror polish",0.005,"polish"],
  ["A-2","Grade #6 diamond buff","High gloss polish",0.007,"polish"],
  ["A-3","Grade #15 diamond buff","Gloss polish",0.010,"polish"],
  ["B-1","600-grit paper","Fine semi-gloss",0.012,"brushed"],
  ["B-2","400-grit paper","Medium semi-gloss",0.018,"brushed"],
  ["B-3","320-grit paper","Coarse semi-gloss",0.025,"brushed"],
  ["C-1","600-grit stone","Fine matte stone",0.015,"matte"],
  ["C-2","400-grit stone","Medium matte stone",0.022,"matte"],
  ["C-3","320-grit stone","Coarse matte stone",0.030,"stone"],
  ["D-1","Dry blast glass bead #11","Satin blast",0.025,"stone"],
  ["D-2","Dry blast aluminium oxide #240","Fine dry blast",0.040,"stone"],
  ["D-3","Dry blast aluminium oxide #24","Coarse dry blast",0.080,"stone"]
].map((p,index)=>({
  id:`spi-${p[0].toLowerCase()}`,name:`SPI/SPE ${p[0]}`,code:`SPI ${p[0]}`,category:"spi",series:"SPI/SPE Mold Finish",
  description:`${p[1]} · ${p[2]}`,scale:0.35+index*0.09,depth:p[3],pattern:p[4],seed:1201+index*41,adjustable:true,
  process:p[1],dimensionStatus:"Tooling-method reference; printable relief is a visualization proxy",
  swatch:"linear-gradient(135deg,#8d9691,#444c48 38%,#78817c 58%,#3f4743)"
}));

const VDI_RA_UM = [[0,.10],[3,.14],[6,.20],[9,.28],[12,.40],[15,.56],[18,.80],[21,1.12],[24,1.60],[27,2.24],[30,3.15],[33,4.50],[36,6.30],[39,9.00],[42,12.50],[45,18.00]];
const vdiPresets = VDI_RA_UM.map(([grade,ra],index)=>({
  id:`vdi-${grade}`,name:`VDI 3400 · ${grade}`,code:`VDI ${grade}`,category:"vdi",series:"VDI 3400 reference",
  description:`Reference Ra ≈ ${ra.toFixed(2)} µm`,referenceRaUm:ra,scale:Number(Math.max(.28,ra*.11).toFixed(3)),
  depth:Number(Math.max(.008,ra*4/1000).toFixed(4)),pattern:grade<18?"matte":grade<33?"stone":"technical",seed:1701+index*43,adjustable:true,
  dimensionStatus:"Ra reference retained; printable peak-to-valley relief is an approximate 4×Ra proxy",
  swatch:"repeating-radial-gradient(circle,#828a86 0 1px,#4b534f 2px,#6b736f 3px)"
}));

const customPreset = {
  id:"custom",name:"Custom height map",description:"PNG, JPG, or WebP",category:"custom",series:"Custom",
  scale:2,depth:0.16,pattern:"custom",seed:1,adjustable:true,dimensionStatus:"User calibrated",
  swatch:"linear-gradient(135deg,#59615d 25%,#343a37 25% 50%,#68706c 50% 75%,#414844 75%)"
};

export const PRESETS = [...mtPresets,...spiPresets,...vdiPresets,...naturalPresets,...industrialPresets,customPreset];
export const FINISH_CATEGORIES = [
  {id:"mt",label:"MT library"},{id:"spi",label:"SPI / SPE"},{id:"vdi",label:"VDI 3400"},
  {id:"natural",label:"Organic"},{id:"industrial",label:"Industrial"},{id:"custom",label:"Custom"}
];

export const PRINTER_PROFILES = {
  "resin-25": { name: "Resin · 25 µm ultra-fine", layerHeight:0.025, minFeature: 0.07, minDepth:0.025, meshTarget: 0.16, maxTriangles: 850000 },
  "resin-50": { name: "Resin · 50 µm extra-fine", layerHeight:0.05, minFeature: 0.10, minDepth:0.05, meshTarget: 0.25, maxTriangles: 600000 },
  "resin-fine": { name: "Resin · Fine detail", minFeature: 0.12, minDepth:0.04, meshTarget: 0.35, maxTriangles: 420000 },
  "resin-fast": { name: "Resin · Fast prototype", minFeature: 0.2, minDepth:0.08, meshTarget: 0.55, maxTriangles: 280000 },
  "fdm-fine": { name: "FDM · 0.4 mm nozzle", minFeature: 0.45, minDepth:0.12, meshTarget: 0.75, maxTriangles: 200000 }
};

function fract(value) { return value - Math.floor(value); }
function hash3(x,y,z,seed) { return fract(Math.sin(x*127.1+y*311.7+z*74.7+seed*19.19)*43758.5453123); }
function smooth(t) { return t*t*(3-2*t); }
function valueNoise3(x,y,z,seed) {
  const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z);
  const fx=smooth(fract(x)),fy=smooth(fract(y)),fz=smooth(fract(z));
  const sample=(dx,dy,dz)=>hash3(ix+dx,iy+dy,iz+dz,seed);
  const x00=sample(0,0,0)*(1-fx)+sample(1,0,0)*fx;
  const x10=sample(0,1,0)*(1-fx)+sample(1,1,0)*fx;
  const x01=sample(0,0,1)*(1-fx)+sample(1,0,1)*fx;
  const x11=sample(0,1,1)*(1-fx)+sample(1,1,1)*fx;
  return (x00*(1-fy)+x10*fy)*(1-fz)+(x01*(1-fy)+x11*fy)*fz;
}

export function proceduralHeight(x,y,z,preset) {
  const s=Math.max(0.005,preset.scale),angle=(preset.rotationDeg||0)*Math.PI/180;
  const rx=x*Math.cos(angle)-y*Math.sin(angle),ry=x*Math.sin(angle)+y*Math.cos(angle);
  const px=rx/s,py=ry/s,pz=z/s;
  const n1=valueNoise3(px,py,pz,preset.seed),n2=valueNoise3(px*2.13,py*2.13,pz*2.13,preset.seed+17),n3=valueNoise3(px*4.27,py*4.27,pz*4.27,preset.seed+37);
  let value=n1*.58+n2*.29+n3*.13;
  switch(preset.pattern){
    case "wood": value=.5+.34*Math.sin((px+n2*.75)*Math.PI*2)+.16*(n3-.5); break;
    case "woven": value=.5+.22*Math.sin(px*Math.PI*2)+.22*Math.sin(py*Math.PI*2)+.06*(n2-.5); break;
    case "twill": value=.5+.32*Math.sin((px+py*.65+pz*.2)*Math.PI*2)+.1*(n2-.5); break;
    case "brushed": value=.5+.2*Math.sin(px*Math.PI*8)+.18*(n3-.5); break;
    case "crosshatch": value=.5+.22*Math.sin((px+py)*Math.PI*2)+.22*Math.sin((px-py)*Math.PI*2); break;
    case "bark": value=.5+.3*Math.sin((px+n2*.45)*Math.PI*2)+.14*(n3-.5); break;
    case "scales": value=.5+.3*Math.cos((px+n1*.18)*Math.PI*2)*Math.cos((py+n2*.18)*Math.PI*2); break;
    case "veins": value=.5+.22*Math.sin((px+n2*.8)*Math.PI*2)+.16*Math.sin((py*2+n3)*Math.PI*2); break;
    case "herringbone": value=.5+.3*Math.sin((px+(Math.floor(py)%2?py:-py))*Math.PI*2); break;
    case "ripple": value=.5+.32*Math.sin(Math.hypot(px,py)*Math.PI*2+n2); break;
    case "granite": value=.35*n1+.35*n2+.3*Math.pow(n3,2); break;
    case "sandstone": value=.5+.2*Math.sin(py*Math.PI*2+n1)+.18*(n3-.5); break;
    case "stone": value=Math.pow(value,1.7); break;
    case "organic": value=Math.pow(Math.abs(value-.5)*2,.7); break;
    case "pebble": value=Math.pow(Math.abs(value-.48)*2,.5); break;
    case "technical": value=Math.pow(value,2.3); break;
  }
  return Math.max(-.5,Math.min(.5,value-.5));
}
