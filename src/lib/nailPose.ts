import * as THREE from "three";

// Startpose jedes Nagels: SPITZE NACH UNTEN, Fuß (offene Seite) oben, Körper ~45° nach rechts geneigt
// (Spitze unten-links, Fuß oben-rechts), leicht gedreht (3/4), damit die Wölbung sichtbar ist.
export const NAIL_HOME = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.22, 0.38, 2.36, "XYZ"));
