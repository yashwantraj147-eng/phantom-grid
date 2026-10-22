import { ThreatEvent, SimulationConfig, Stats, ATTACK_TYPES } from './types';
import { MITRE_TACTICS, TECHNIQUES, CVES } from './mitre';
import { randomCity, randomCityExcept, COMMON_PORTS, PROTOCOLS, generateFakeIP } from './geo-data';

let eventCounter = 0;

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedSeverity(): 'critical' | 'high' | 'medium' | 'low' {
  const r = Math.random();
  if (r < 0.08) return 'critical';
  if (r < 0.25) return 'high';
  if (r < 0.55) return 'medium';
  return 'low';
}

export class SimulationEngine {
  config: SimulationConfig;
  stats: Stats;
  private accumulator: number = 0;
  private enabledTactics: Set<string>;
  private onEvent: ((event: ThreatEvent) => void) | null = null;

  constructor() {
    this.config = {
      speed: 1,
      paused: false,
      maxConcurrentAttacks: 30,
      baseAttackRate: 1.2,
    };

    this.stats = {
      totalAttacks: 0,
      attacksLastMinute: [],
      topSourceCountries: new Map(),
      topTargetPorts: new Map(),
      severityCounts: { critical: 0, high: 0, medium: 0, low: 0 },
    };

    this.enabledTactics = new Set(MITRE_TACTICS.map(t => t.id));
  }

  setEventHandler(handler: (event: ThreatEvent) => void): void {
    this.onEvent = handler;
  }

  toggleTactic(tacticId: string): boolean {
    if (this.enabledTactics.has(tacticId)) {
      this.enabledTactics.delete(tacticId);
      return false;
    } else {
      this.enabledTactics.add(tacticId);
      return true;
    }
  }

  isTacticEnabled(tacticId: string): boolean {
    return this.enabledTactics.has(tacticId);
  }

  update(delta: number): void {
    if (this.config.paused) return;

    const effectiveDelta = delta * this.config.speed;
    this.accumulator += effectiveDelta;

    // Variable attack rate with some randomness
    const rate = this.config.baseAttackRate * (0.7 + Math.random() * 0.6);
    const interval = 1 / rate;

    while (this.accumulator >= interval) {
      this.accumulator -= interval;
      this.generateEvent();
    }

    // Clean up old timestamps (keep last 60 seconds)
    const now = Date.now();
    this.stats.attacksLastMinute = this.stats.attacksLastMinute.filter(t => now - t < 60000);
  }

  getAttacksPerSecond(): number {
    const now = Date.now();
    const recent = this.stats.attacksLastMinute.filter(t => now - t < 5000);
    return recent.length / 5;
  }

  private generateEvent(): void {
    // Pick a tactic that's enabled
    const enabledList = MITRE_TACTICS.filter(t => this.enabledTactics.has(t.id));
    if (enabledList.length === 0) return;

    const tactic = randomFrom(enabledList);
    const techniques = TECHNIQUES[tactic.id] || ['Unknown Technique'];
    const technique = randomFrom(techniques);

    const source = randomCity();
    const target = randomCityExcept(source);
    const attackType = randomFrom(ATTACK_TYPES);
    const severity = weightedSeverity();
    const port = randomFrom(COMMON_PORTS);
    const protocol = randomFrom(PROTOCOLS);
    const cve = Math.random() < 0.3 ? randomFrom(CVES) : undefined;

    const event: ThreatEvent = {
      id: `evt-${++eventCounter}`,
      timestamp: Date.now(),
      source,
      target,
      attackType,
      tactic: { ...tactic },
      technique,
      severity,
      protocol,
      port,
      cve,
    };

    // Update stats
    this.stats.totalAttacks++;
    this.stats.attacksLastMinute.push(Date.now());
    this.stats.severityCounts[severity]++;

    const srcCountry = source.countryCode;
    this.stats.topSourceCountries.set(srcCountry, (this.stats.topSourceCountries.get(srcCountry) || 0) + 1);

    this.stats.topTargetPorts.set(port, (this.stats.topTargetPorts.get(port) || 0) + 1);

    if (this.onEvent) {
      this.onEvent(event);
    }
  }
}
