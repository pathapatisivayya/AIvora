import * as THREE from "three";

/** Rough land density 0–1 from lat/lon (degrees) for continent-shaped mesh density. */
export function continentDensity(lat, lon) {
  const r = (laMin, laMax, loMin, loMax) =>
    lat >= laMin && lat <= laMax && lon >= loMin && lon <= loMax;

  let d = 0.12;
  if (r(18, 72, -168, -52)) d = Math.max(d, 0.9);
  if (r(-56, 16, -82, -34)) d = Math.max(d, 0.88);
  if (r(35, 72, -12, 42)) d = Math.max(d, 0.88);
  if (r(-35, 38, -20, 52)) d = Math.max(d, 0.86);
  if (r(8, 72, 42, 145)) d = Math.max(d, 0.92);
  if (r(-44, -10, 112, 154)) d = Math.max(d, 0.82);
  if (r(50, 72, -12, 42)) d = Math.max(d, 0.75);
  if (r(-35, 38, 42, 55)) d = Math.max(d, 0.7);
  return d;
}

export function latLonToVector3(lat, lon, radius) {
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  return new THREE.Vector3(
    radius * Math.cos(latRad) * Math.cos(lonRad),
    radius * Math.sin(latRad),
    radius * Math.cos(latRad) * Math.sin(lonRad),
  );
}

/**
 * Wireframe globe: grid nodes + edges, brighter/denser on continents.
 */
export function buildGlobeNetwork(radius = 2.4, latSteps = 44, lonSteps = 88) {
  const nodes = [];
  const index = new Map();

  for (let i = 0; i <= latSteps; i++) {
    const lat = -90 + (180 * i) / latSteps;
    for (let j = 0; j <= lonSteps; j++) {
      const lon = -180 + (360 * j) / lonSteps;
      const density = continentDensity(lat, lon);
      const pos = latLonToVector3(lat, lon, radius);
      const idx = nodes.length;
      nodes.push({ pos, density, lat, lon });
      index.set(`${i},${j}`, idx);
    }
  }

  const lineVerts = [];
  const pointVerts = [];
  const pointSizes = [];
  const pointColors = [];

  const addLine = (a, b) => {
    lineVerts.push(a.x, a.y, a.z, b.x, b.y, b.z);
  };

  for (let i = 0; i <= latSteps; i++) {
    for (let j = 0; j <= lonSteps; j++) {
      const n = nodes[index.get(`${i},${j}`)];
      const d = n.density;

      pointVerts.push(n.pos.x, n.pos.y, n.pos.z);
      pointSizes.push(0.02 + d * 0.045);
      const c = new THREE.Color().setHSL(0.52 + d * 0.06, 0.85, 0.45 + d * 0.35);
      pointColors.push(c.r, c.g, c.b);

      if (j < lonSteps) {
        const east = nodes[index.get(`${i},${j + 1}`)];
        const edgeD = (d + east.density) * 0.5;
        if (edgeD > 0.2) addLine(n.pos, east.pos);
      }
      if (i < latSteps) {
        const south = nodes[index.get(`${i + 1},${j}`)];
        const edgeD = (d + south.density) * 0.5;
        if (edgeD > 0.2) addLine(n.pos, south.pos);
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineVerts, 3));

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.Float32BufferAttribute(pointVerts, 3));
  pointsGeo.setAttribute("color", new THREE.Float32BufferAttribute(pointColors, 3));

  return { lineGeo, pointsGeo, nodeCount: nodes.length };
}

/** Sparse 3D network behind the globe (CoRE-AI-style field). */
export function buildBackgroundNetwork(count = 140, spread = 12) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * spread * 2,
        (Math.random() - 0.5) * spread * 0.9,
        (Math.random() - 0.5) * spread - 3,
      ),
    );
  }

  const lineVerts = [];
  const maxDist = 2.8;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].distanceTo(nodes[j]) < maxDist) {
        lineVerts.push(
          nodes[i].x,
          nodes[i].y,
          nodes[i].z,
          nodes[j].x,
          nodes[j].y,
          nodes[j].z,
        );
      }
    }
  }

  const positions = new Float32Array(nodes.length * 3);
  nodes.forEach((v, i) => {
    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;
  });

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineVerts, 3));

  return { lineGeo, positions, nodeCount: nodes.length };
}
