import * as THREE from "three";

// Gemeinsame Shader-Erweiterungen (onBeforeCompile):
//  1) Dissolve: glatte Rausch-Schwelle, dünner Champagner-Rand. uDis 0 = intakt, 1 = weg (Spitze löst sich zuerst, baut sich vom Fuß auf).
//  2) Cat-Eye (3 Schichten): (i) klare Gel-Deckschicht = das Material selbst (Clearcoat, IOR 1,5),
//     (ii) Partikelschicht UNTER der Oberfläche (Parallaxe: Schicht wird entlang des Blickstrahls abgetastet),
//     jede Flocke mit eigener Normale -> Glitzern beim Drehen, Farbe wechselt mit dem Blickwinkel (Hue-Shift, Dünnfilm-artig),
//     Flocken konzentrieren sich in einem seidigen Lichtband (Ward-anisotrop, Magnetachse uM -> wandert mit der Blickrichtung),
//     (iii) dunkler, tiefer Rotbraun-Grund (Textur/Farbe des Materials).
//  Quellen/Hintergrund: Gelbottle Academy "Understanding Magnetic Gel Polish: The Science Behind Cat-Eye Nails",
//  Makartt "The science behind cat eye gel nail polish", three.js Docs MeshPhysicalMaterial (anisotropy/iridescence/clearcoat).
export const dissolve = { value: 0 };
export const catU = {
  uL: { value: new THREE.Vector3(0.4, 0.5, 0.75) }, // Lichtrichtung im Objektraum
  uV: { value: new THREE.Vector3(0, 0, 1) }, // Blickrichtung im Objektraum
  uM: { value: new THREE.Vector3(0.62, -0.78, 0.05).normalize() }, // "Magnetachse" im Objektraum
};

const NOISE = /* glsl */ `
float dhash(vec3 p){ p=fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float dnoise(vec3 x){ vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(dhash(i),dhash(i+vec3(1,0,0)),f.x),mix(dhash(i+vec3(0,1,0)),dhash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(dhash(i+vec3(0,0,1)),dhash(i+vec3(1,0,1)),f.x),mix(dhash(i+vec3(0,1,1)),dhash(i+vec3(1,1,1)),f.x),f.y),f.z); }
`;

const CAT_GLSL = /* glsl */ `
vec3 hsv2rgb(vec3 c){ vec3 p=abs(fract(c.xxx+vec3(0.0,2.0/3.0,1.0/3.0))*6.0-3.0); return c.z*mix(vec3(1.0),clamp(p-1.0,0.0,1.0),c.y); }
float h31(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.x+p.y)*p.z); }
vec3 h33(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.xxy+p.yxx)*p.zyx); }
`;

export function applyShaders(mat: THREE.MeshPhysicalMaterial, cat = false) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uDis = dissolve;
    if (cat) { sh.uniforms.uL = catU.uL; sh.uniforms.uV = catU.uV; sh.uniforms.uM = catU.uM; }
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vObjP;\nvarying vec3 vObjN;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObjP = position;\nvObjN = normal;");
    let fs = sh.fragmentShader
      .replace("#include <common>", `#include <common>\nuniform float uDis;\nvarying vec3 vObjP;\nvarying vec3 vObjN;\n${cat ? "uniform vec3 uL; uniform vec3 uV; uniform vec3 uM;\n" + CAT_GLSL : ""}${NOISE}`)
      .replace("#include <clipping_planes_fragment>", `#include <clipping_planes_fragment>
float dv = 0.0; float dthr = 0.0;
if (uDis > 0.0001) {
  float dn = dnoise(vObjP * 2.2 + vec3(3.1, 1.7, 0.5));
  float dh = clamp((vObjP.y + 1.05) / 2.1, 0.0, 1.0);
  dv = dn * 0.5 + (1.0 - dh) * 0.5;
  dthr = uDis * 1.25 - 0.12;
  if (dv < dthr) discard;
}`)
      .replace("#include <dithering_fragment>", `if (uDis > 0.0001) { float e = 1.0 - smoothstep(0.0, 0.055, dv - dthr); gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 0.80, 0.42), e); }
#include <dithering_fragment>`);
    if (cat) {
      fs = fs.replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
{
  vec3 On = normalize(vObjN) * (gl_FrontFacing ? 1.0 : -1.0);
  vec3 Vo = normalize(uV);
  vec3 Lo = normalize(uL);
  float ndv = max(dot(On, Vo), 0.12);
  vec3 Hh = normalize(Lo + Vo);

  // Seidenband (Chatoyanz): Ward-anisotrop, quer zur Magnetachse
  vec3 Tt = normalize(uM - On * dot(uM, On));
  vec3 Bt = cross(On, Tt);
  float hn = max(dot(Hh, On), 0.08);
  float ax = dot(Hh, Tt) / 0.03;
  float ay = dot(Hh, Bt) / 1.3;
  float band = exp(-(ax * ax + ay * ay) / (hn * hn));
  band = band * band * (3.0 - 2.0 * band);
  float halo = exp(-(ax * ax * 0.05 + ay * ay * 0.2) / (hn * hn));
  float field = clamp(band + halo * 0.5, 0.0, 1.0); // wo die Partikel entlang der Feldlinien stehen

  // Partikelschicht unter dem Gel: Abtastpunkt wandert mit dem Blick (Parallaxe)
  vec3 acc = vec3(0.0);
  for (int k = 0; k < 2; k++) {
    float sc = k == 0 ? 36.0 : 64.0;
    float depth = k == 0 ? 0.045 : 0.09;
    vec3 q = (vObjP - Vo * (depth / ndv)) * sc;
    vec3 id = floor(q); vec3 fp = fract(q);
    vec3 cen = vec3(0.5) + (h33(id) - 0.5) * 0.5;
    float disk = smoothstep(0.38, 0.12, length(fp - cen)) * step(h31(id + 7.0), 0.85);
    // Flocke mit eigener Normale, an die Feldrichtung angelehnt
    vec3 nf = normalize(On + (h33(id + 3.0) - 0.5) * 1.3 + uM * 0.25);
    float spec = pow(max(dot(nf, Hh), 0.0), 26.0);
    float hue = fract(0.965 + (1.0 - ndv) * 1.25 + h31(id) * 0.07 + band * 0.04); // rosé -> kupfer/gold -> grün -> violett zum Rand
    vec3 fc = hsv2rgb(vec3(hue, 0.78, 1.0));
    float mask = 0.3 + 0.7 * field;
    acc += fc * disk * (0.1 + spec * 1.6) * mask * (k == 0 ? 1.0 : 0.6);
  }
  totalEmissiveRadiance += acc;
  // Seidenlicht selbst: warm-champagner mit leichtem Farbwechsel
  totalEmissiveRadiance += hsv2rgb(vec3(fract(0.02 + (1.0 - ndv) * 0.3), 0.1, 1.0)) * (band * 1.25 + halo * 0.12);
}`);
    }
    sh.fragmentShader = fs;
  };
  mat.customProgramCacheKey = () => (cat ? "nail-cat3" : "nail-dis");
  return mat;
}

// pro Frame für Cat Eye: Licht-/Blickrichtung in den Objektraum des Nagels
const q = new THREE.Quaternion();
export function updateCatUniforms(mesh: THREE.Object3D, camera: THREE.Camera, lightWorld: THREE.Vector3) {
  q.copy(mesh.quaternion).invert();
  const v = camera.position.clone().sub(mesh.position).normalize().applyQuaternion(q);
  const l = lightWorld.clone().normalize().applyQuaternion(q);
  catU.uV.value.copy(v);
  catU.uL.value.copy(l);
}
