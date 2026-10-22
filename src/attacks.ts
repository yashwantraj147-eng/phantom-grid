import * as THREE from 'three';
import { AttackArc, ThreatEvent, GLOBE_RADIUS } from './types';
import { latLngToVector3 } from './geo-data';
import { createGlowTexture } from './globe';

const ARC_POINTS = 60;
const TRAVEL_DURATION_BASE = 2.0; // seconds
const FADE_DURATION = 1.2;
const MAX_ARCS = 30;

let glowTex: THREE.CanvasTexture | null = null;

function getGlowTexture(): THREE.CanvasTexture {
  if (!glowTex) glowTex = createGlowTexture();
  return glowTex;
}

export class AttackManager {
  private arcs: AttackArc[] = [];
  private scene: THREE.Scene;
  private arcGroup: THREE.Group;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.arcGroup = new THREE.Group();
    this.scene.add(this.arcGroup);
  }

  get activeCount(): number {
    return this.arcs.filter(a => a.state !== 'done').length;
  }

  addAttack(event: ThreatEvent): AttackArc | null {
    if (this.activeCount >= MAX_ARCS) return null;

    const sourcePos = latLngToVector3(event.source.lat, event.source.lng, GLOBE_RADIUS + 0.05);
    const targetPos = latLngToVector3(event.target.lat, event.target.lng, GLOBE_RADIUS + 0.05);

    // Create arc curve
    const distance = sourcePos.distanceTo(targetPos);
    const mid = sourcePos.clone().add(targetPos).multiplyScalar(0.5);
    const altitude = GLOBE_RADIUS * 0.15 + distance * 0.35;
    mid.normalize().multiplyScalar(GLOBE_RADIUS + altitude);

    const curve = new THREE.QuadraticBezierCurve3(sourcePos, mid, targetPos);

    // Create line geometry
    const points = curve.getPoints(ARC_POINTS);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setDrawRange(0, 0);

    const color = new THREE.Color(event.attackType.colorHex);
    const material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const line = new THREE.Line(geometry, material);
    this.arcGroup.add(line);

    // Head particle (glowing sphere)
    const headGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const headMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const headParticle = new THREE.Mesh(headGeo, headMat);
    headParticle.position.copy(sourcePos);

    // Add a sprite glow around the head
    const spriteMat = new THREE.SpriteMaterial({
      map: getGlowTexture(),
      color: color,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(0.5, 0.5, 0.5);
    headParticle.add(sprite);

    this.arcGroup.add(headParticle);

    // Duration scales with distance
    const duration = TRAVEL_DURATION_BASE + (distance / GLOBE_RADIUS) * 0.8;

    const arc: AttackArc = {
      id: event.id,
      event,
      line,
      headParticle,
      curve,
      progress: 0,
      duration,
      fadeProgress: 0,
      state: 'traveling',
      totalPoints: ARC_POINTS + 1,
    };

    this.arcs.push(arc);
    return arc;
  }

  update(delta: number, speed: number): void {
    const dt = delta * speed;

    for (const arc of this.arcs) {
      if (arc.state === 'done') continue;

      if (arc.state === 'traveling') {
        arc.progress += dt / arc.duration;

        if (arc.progress >= 1) {
          arc.progress = 1;
          arc.state = 'impact';
          this.createImpactEffect(arc);
        }

        // Update draw range
        const count = Math.floor(arc.progress * arc.totalPoints);
        arc.line.geometry.setDrawRange(0, count);

        // Update head position
        const headPos = arc.curve.getPoint(arc.progress);
        arc.headParticle.position.copy(headPos);

        // Scale head based on progress (bigger at midpoint)
        const scale = 1.0 + Math.sin(arc.progress * Math.PI) * 0.5;
        arc.headParticle.scale.setScalar(scale);

      } else if (arc.state === 'impact') {
        arc.fadeProgress += dt * 2;
        if (arc.fadeProgress >= 0.3) {
          arc.state = 'fading';
        }

        // Animate impact ring
        if (arc.impactRing) {
          const s = 1 + arc.fadeProgress * 3;
          arc.impactRing.scale.setScalar(s);
          (arc.impactRing.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - arc.fadeProgress / 0.3);
        }

      } else if (arc.state === 'fading') {
        arc.fadeProgress += dt / FADE_DURATION;

        const fadeAlpha = Math.max(0, 1 - arc.fadeProgress);
        (arc.line.material as THREE.LineBasicMaterial).opacity = fadeAlpha * 0.8;
        (arc.headParticle.material as THREE.MeshBasicMaterial).opacity = fadeAlpha;

        if (arc.impactRing) {
          (arc.impactRing.material as THREE.MeshBasicMaterial).opacity = fadeAlpha * 0.3;
        }

        if (arc.fadeProgress >= 1) {
          arc.state = 'done';
        }
      }
    }

    // Cleanup done arcs
    this.arcs = this.arcs.filter(arc => {
      if (arc.state === 'done') {
        this.arcGroup.remove(arc.line);
        this.arcGroup.remove(arc.headParticle);
        if (arc.impactRing) this.arcGroup.remove(arc.impactRing);
        arc.line.geometry.dispose();
        (arc.line.material as THREE.Material).dispose();
        arc.headParticle.geometry.dispose();
        (arc.headParticle.material as THREE.Material).dispose();
        if (arc.impactRing) {
          arc.impactRing.geometry.dispose();
          (arc.impactRing.material as THREE.Material).dispose();
        }
        return false;
      }
      return true;
    });
  }

  private createImpactEffect(arc: AttackArc): void {
    const targetPos = arc.curve.getPoint(1);
    const ringGeo = new THREE.RingGeometry(0.05, 0.15, 24);
    const color = new THREE.Color(arc.event.attackType.colorHex);
    const ringMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(targetPos);
    ring.lookAt(new THREE.Vector3(0, 0, 0));
    arc.impactRing = ring;
    this.arcGroup.add(ring);

    // Hide head particle
    arc.headParticle.visible = false;
  }

  getArcs(): AttackArc[] {
    return this.arcs;
  }
}
