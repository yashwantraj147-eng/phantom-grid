import * as THREE from 'three';
import { GLOBE_RADIUS } from './types';
import { isLand, latLngToVector3, CITIES } from './geo-data';

export function createGlobe(): THREE.Group {
  const group = new THREE.Group();

  // ---- Main Globe Sphere ----
  const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
  const globeMat = new THREE.MeshBasicMaterial({
    color: 0x0a0e1a,
    transparent: true,
    opacity: 0.85,
  });
  const globeMesh = new THREE.Mesh(globeGeo, globeMat);
  group.add(globeMesh);

  // ---- Grid Lines (latitude & longitude) ----
  const gridMat = new THREE.LineBasicMaterial({
    color: 0x1a2744,
    transparent: true,
    opacity: 0.25,
  });

  // Latitude lines
  for (let lat = -75; lat <= 75; lat += 15) {
    const points: THREE.Vector3[] = [];
    for (let lng = -180; lng <= 180; lng += 3) {
      points.push(latLngToVector3(lat, lng, GLOBE_RADIUS + 0.01));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    group.add(new THREE.Line(geo, gridMat));
  }

  // Longitude lines
  for (let lng = -180; lng < 180; lng += 20) {
    const points: THREE.Vector3[] = [];
    for (let lat = -90; lat <= 90; lat += 3) {
      points.push(latLngToVector3(lat, lng, GLOBE_RADIUS + 0.01));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    group.add(new THREE.Line(geo, gridMat));
  }

  // ---- Land Mass Dots ----
  const landPositions: number[] = [];
  const landColors: number[] = [];
  const landSizes: number[] = [];

  const landColor = new THREE.Color(0x00d4aa);
  const highlightColor = new THREE.Color(0x00f0ff);

  for (let lat = -80; lat <= 80; lat += 1.8) {
    for (let lng = -180; lng <= 180; lng += 1.8) {
      if (isLand(lat, lng)) {
        const jitter = (Math.random() - 0.5) * 0.4;
        const pos = latLngToVector3(lat + jitter, lng + jitter, GLOBE_RADIUS + 0.02);
        landPositions.push(pos.x, pos.y, pos.z);

        const isHighlight = Math.random() < 0.08;
        const c = isHighlight ? highlightColor : landColor;
        landColors.push(c.r, c.g, c.b);
        landSizes.push(isHighlight ? 2.5 : 1.2 + Math.random() * 0.8);
      }
    }
  }

  const landGeo = new THREE.BufferGeometry();
  landGeo.setAttribute('position', new THREE.Float32BufferAttribute(landPositions, 3));
  landGeo.setAttribute('color', new THREE.Float32BufferAttribute(landColors, 3));
  landGeo.setAttribute('size', new THREE.Float32BufferAttribute(landSizes, 1));

  const landMat = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (280.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
        gl_FragColor = vec4(vColor, alpha * 0.7);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const landPoints = new THREE.Points(landGeo, landMat);
  group.add(landPoints);

  // ---- City Markers ----
  const cityPositions: number[] = [];
  const citySizes: number[] = [];
  const cityColors: number[] = [];
  const cityColor = new THREE.Color(0x00f0ff);

  for (const city of CITIES) {
    const pos = latLngToVector3(city.lat, city.lng, GLOBE_RADIUS + 0.04);
    cityPositions.push(pos.x, pos.y, pos.z);
    citySizes.push(3.5);
    cityColors.push(cityColor.r, cityColor.g, cityColor.b);
  }

  const cityGeo = new THREE.BufferGeometry();
  cityGeo.setAttribute('position', new THREE.Float32BufferAttribute(cityPositions, 3));
  cityGeo.setAttribute('size', new THREE.Float32BufferAttribute(citySizes, 1));
  cityGeo.setAttribute('color', new THREE.Float32BufferAttribute(cityColors, 3));

  const cityMat = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (280.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float glow = exp(-dist * 6.0);
        float alpha = glow * 0.9;
        gl_FragColor = vec4(vColor * (1.0 + glow * 0.5), alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const cityPoints = new THREE.Points(cityGeo, cityMat);
  group.add(cityPoints);

  // ---- Atmosphere Glow ----
  const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 64, 64);
  const atmosMat = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0x1a6bff) },
      viewVector: { value: new THREE.Vector3() },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fresnel = 1.0 - dot(viewDir, vNormal);
        fresnel = pow(fresnel, 4.0);
        gl_FragColor = vec4(glowColor, fresnel * 0.35);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
  group.add(atmosMesh);

  // ---- Inner glow ring (subtle equatorial glow) ----
  const ringGeo = new THREE.RingGeometry(GLOBE_RADIUS * 1.01, GLOBE_RADIUS * 1.08, 128);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.04,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  return group;
}

// Create a glow texture for attack head particles
export function createGlowTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.15, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}
