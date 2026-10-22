import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { createGlobe } from './globe';
import { AttackManager } from './attacks';
import { SimulationEngine } from './simulation';
import { UI } from './ui';
import './style.css';

// ---- Scene Setup ----
const canvas = document.getElementById('globe-canvas') as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true, // for screenshots
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060a13);

// Subtle fog for depth
scene.fog = new THREE.FogExp2(0x060a13, 0.02);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(8, 5, 10);
camera.lookAt(0, 0, 0);

// ---- Ambient Light ----
const ambientLight = new THREE.AmbientLight(0x1a2744, 0.5);
scene.add(ambientLight);

// ---- Orbit Controls ----
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 0.8;
controls.minDistance = 6.5;
controls.maxDistance = 25;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.3;
controls.enablePan = false;

// ---- Post-Processing (Bloom) ----
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.2,   // strength
  0.5,   // radius
  0.7    // threshold
);
composer.addPass(bloomPass);

// ---- Globe ----
const globe = createGlobe();
scene.add(globe);

// ---- Background Stars ----
const starsGeo = new THREE.BufferGeometry();
const starsPositions: number[] = [];
for (let i = 0; i < 3000; i++) {
  const r = 50 + Math.random() * 100;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starsPositions.push(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
}
starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starsPositions, 3));
const starsMat = new THREE.PointsMaterial({
  color: 0x4477aa,
  size: 0.15,
  transparent: true,
  opacity: 0.6,
  sizeAttenuation: true,
});
scene.add(new THREE.Points(starsGeo, starsMat));

// ---- Attack Manager ----
const attackManager = new AttackManager(scene);

// ---- Simulation Engine ----
const simulation = new SimulationEngine();

// ---- UI ----
const ui = new UI(simulation);

// Connect simulation events to attack manager + UI
simulation.setEventHandler((event) => {
  attackManager.addAttack(event);
  ui.addFeedItem(event);
});

// ---- Resize Handler ----
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
  bloomPass.resolution.set(w, h);
});

// ---- Animation Loop ----
const clock = new THREE.Clock();
let statsUpdateTimer = 0;

function animate(): void {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // Update controls
  controls.update();

  // Slow globe rotation
  globe.rotation.y += delta * 0.03;

  // Run simulation
  simulation.update(delta);

  // Update attack arcs
  attackManager.update(delta, simulation.config.speed);

  // Update UI stats (throttled to every 500ms)
  statsUpdateTimer += delta;
  if (statsUpdateTimer >= 0.5) {
    statsUpdateTimer = 0;
    ui.updateStats(attackManager.activeCount);
  }

  // Render with bloom
  composer.render();
}

animate();
