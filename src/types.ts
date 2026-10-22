import * as THREE from 'three';

export interface City {
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
}

export interface AttackType {
  id: string;
  name: string;
  colorHex: string;
}

export interface MitreTactic {
  id: string;
  name: string;
  shortName: string;
  color: string;
  enabled: boolean;
}

export interface ThreatEvent {
  id: string;
  timestamp: number;
  source: City;
  target: City;
  attackType: AttackType;
  tactic: MitreTactic;
  technique: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  protocol: string;
  port: number;
  cve?: string;
}

export interface AttackArc {
  id: string;
  event: ThreatEvent;
  line: THREE.Line;
  headParticle: THREE.Mesh;
  curve: THREE.QuadraticBezierCurve3;
  progress: number;
  duration: number;
  fadeProgress: number;
  state: 'traveling' | 'impact' | 'fading' | 'done';
  impactRing?: THREE.Mesh;
  totalPoints: number;
}

export interface SimulationConfig {
  speed: number;
  paused: boolean;
  maxConcurrentAttacks: number;
  baseAttackRate: number;
}

export interface Stats {
  totalAttacks: number;
  attacksLastMinute: number[];
  topSourceCountries: Map<string, number>;
  topTargetPorts: Map<number, number>;
  severityCounts: { critical: number; high: number; medium: number; low: number };
}

export const GLOBE_RADIUS = 5;

export const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ff2d55',
  high: '#ff6b35',
  medium: '#ffb800',
  low: '#4d9fff',
};

export const ATTACK_TYPES: AttackType[] = [
  { id: 'ddos', name: 'DDoS', colorHex: '#ff2d55' },
  { id: 'ssh-brute', name: 'SSH Brute Force', colorHex: '#4d9fff' },
  { id: 'port-scan', name: 'Port Scan', colorHex: '#ffb800' },
  { id: 'phishing', name: 'Phishing', colorHex: '#a855f7' },
  { id: 'exploit', name: 'Exploit', colorHex: '#ff6b35' },
  { id: 'malware', name: 'Malware C2', colorHex: '#00d4aa' },
  { id: 'sqli', name: 'SQL Injection', colorHex: '#f97583' },
  { id: 'xss', name: 'XSS', colorHex: '#d2a8ff' },
  { id: 'ransomware', name: 'Ransomware', colorHex: '#ff2d55' },
  { id: 'data-exfil', name: 'Data Exfiltration', colorHex: '#00f0ff' },
];
