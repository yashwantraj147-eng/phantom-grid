import { ThreatEvent, Stats, SEVERITY_COLORS } from './types';
import { MITRE_TACTICS } from './mitre';
import { SimulationEngine } from './simulation';
import { generateFakeIP } from './geo-data';

const MAX_FEED_ITEMS = 40;

export class UI {
  private simulation: SimulationEngine;
  private feedList: HTMLElement;
  private tacticFilters: HTMLElement;
  private tacticCounts: Map<string, number> = new Map();

  // Stats elements
  private statAps: HTMLElement;
  private statTotal: HTMLElement;
  private statActive: HTMLElement;
  private statCritical: HTMLElement;
  private statHigh: HTMLElement;
  private statMedium: HTMLElement;
  private topPorts: HTMLElement;
  private topCountries: HTMLElement;
  private speedLabel: HTMLElement;
  private speedSlider: HTMLInputElement;

  constructor(simulation: SimulationEngine) {
    this.simulation = simulation;

    this.feedList = document.getElementById('feed-list')!;
    this.tacticFilters = document.getElementById('tactic-filters')!;
    this.statAps = document.getElementById('stat-aps')!;
    this.statTotal = document.getElementById('stat-total')!;
    this.statActive = document.getElementById('stat-active')!;
    this.statCritical = document.getElementById('stat-critical')!;
    this.statHigh = document.getElementById('stat-high')!;
    this.statMedium = document.getElementById('stat-medium')!;
    this.topPorts = document.getElementById('top-ports')!;
    this.topCountries = document.getElementById('top-countries')!;
    this.speedLabel = document.getElementById('speed-label')!;
    this.speedSlider = document.getElementById('speed-slider') as HTMLInputElement;

    this.initTacticFilters();
    this.initTimeControls();
    this.initScreenshot();
    this.initDetailClose();
  }

  private initTacticFilters(): void {
    for (const tactic of MITRE_TACTICS) {
      this.tacticCounts.set(tactic.id, 0);

      const btn = document.createElement('button');
      btn.className = 'tactic-toggle active';
      btn.dataset.tacticId = tactic.id;
      btn.innerHTML = `
        <span class="tactic-dot" style="background: ${tactic.color}"></span>
        <span class="tactic-name">${tactic.shortName}</span>
        <span class="tactic-count" id="tc-${tactic.id}">0</span>
      `;
      btn.addEventListener('click', () => {
        const enabled = this.simulation.toggleTactic(tactic.id);
        btn.className = `tactic-toggle ${enabled ? 'active' : 'inactive'}`;
      });
      this.tacticFilters.appendChild(btn);
    }
  }

  private initTimeControls(): void {
    const btnPause = document.getElementById('btn-pause')!;
    const btnSlower = document.getElementById('btn-slower')!;
    const btnFaster = document.getElementById('btn-faster')!;
    const pauseIcon = document.getElementById('pause-icon')!;
    const playIcon = document.getElementById('play-icon')!;

    btnPause.addEventListener('click', () => {
      this.simulation.config.paused = !this.simulation.config.paused;
      pauseIcon.style.display = this.simulation.config.paused ? 'none' : 'block';
      playIcon.style.display = this.simulation.config.paused ? 'block' : 'none';
    });

    btnSlower.addEventListener('click', () => {
      this.simulation.config.speed = Math.max(0.1, this.simulation.config.speed - 0.2);
      this.speedSlider.value = String(this.simulation.config.speed);
      this.updateSpeedLabel();
    });

    btnFaster.addEventListener('click', () => {
      this.simulation.config.speed = Math.min(5, this.simulation.config.speed + 0.2);
      this.speedSlider.value = String(this.simulation.config.speed);
      this.updateSpeedLabel();
    });

    this.speedSlider.addEventListener('input', () => {
      this.simulation.config.speed = parseFloat(this.speedSlider.value);
      this.updateSpeedLabel();
    });
  }

  private initScreenshot(): void {
    const btn = document.getElementById('btn-screenshot')!;
    btn.addEventListener('click', () => {
      const canvas = document.getElementById('globe-canvas') as HTMLCanvasElement;
      const link = document.createElement('a');
      link.download = `phantom-grid-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  private initDetailClose(): void {
    const closeBtn = document.getElementById('detail-close')!;
    closeBtn.addEventListener('click', () => {
      document.getElementById('attack-detail')!.classList.add('hidden');
    });
  }

  private updateSpeedLabel(): void {
    this.speedLabel.textContent = `${this.simulation.config.speed.toFixed(1)}×`;
  }

  addFeedItem(event: ThreatEvent): void {
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.addEventListener('click', () => this.showDetail(event));

    const srcIP = generateFakeIP();
    const dstIP = generateFakeIP();
    const timeStr = new Date(event.timestamp).toLocaleTimeString('en-US', { hour12: false });

    item.innerHTML = `
      <div class="feed-severity ${event.severity}"></div>
      <div class="feed-body">
        <div class="feed-header">
          <span class="feed-type">${event.attackType.name}</span>
          <span class="feed-time">${timeStr}</span>
        </div>
        <div class="feed-route">${event.source.name} → ${event.target.name}</div>
        <div class="feed-meta">
          <span class="feed-tag tactic" style="color: ${event.tactic.color}">${event.tactic.shortName}</span>
          <span class="feed-tag">${event.protocol}:${event.port}</span>
          ${event.cve ? `<span class="feed-tag" style="color: var(--accent-red)">${event.cve}</span>` : ''}
        </div>
      </div>
    `;

    // Insert at top
    this.feedList.insertBefore(item, this.feedList.firstChild);

    // Trim old items
    while (this.feedList.children.length > MAX_FEED_ITEMS) {
      this.feedList.removeChild(this.feedList.lastChild!);
    }

    // Update tactic count
    const current = this.tacticCounts.get(event.tactic.id) || 0;
    this.tacticCounts.set(event.tactic.id, current + 1);
    const countEl = document.getElementById(`tc-${event.tactic.id}`);
    if (countEl) countEl.textContent = String(current + 1);
  }

  updateStats(activeArcs: number): void {
    const stats = this.simulation.stats;
    const aps = this.simulation.getAttacksPerSecond();

    this.updateStatValue(this.statAps, aps.toFixed(1));
    this.updateStatValue(this.statTotal, this.formatNumber(stats.totalAttacks));
    this.updateStatValue(this.statActive, String(activeArcs));
    this.updateStatValue(this.statCritical, String(stats.severityCounts.critical));
    this.updateStatValue(this.statHigh, String(stats.severityCounts.high));
    this.updateStatValue(this.statMedium, String(stats.severityCounts.medium));

    this.updateTopPorts(stats);
    this.updateTopCountries(stats);
  }

  private updateStatValue(el: HTMLElement, value: string): void {
    if (el.textContent !== value) {
      el.textContent = value;
      el.classList.remove('updated');
      void el.offsetWidth; // force reflow
      el.classList.add('updated');
    }
  }

  private formatNumber(n: number): string {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
  }

  private updateTopPorts(stats: Stats): void {
    const sorted = Array.from(stats.topTargetPorts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    if (sorted.length === 0) return;
    const maxCount = sorted[0][1];

    this.topPorts.innerHTML = sorted.map(([port, count]) => `
      <div class="bar-item">
        <span class="bar-label">${port}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${(count / maxCount) * 100}%; background: var(--accent-cyan)"></div>
        </div>
        <span class="bar-count">${count}</span>
      </div>
    `).join('');
  }

  private updateTopCountries(stats: Stats): void {
    const sorted = Array.from(stats.topSourceCountries.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    if (sorted.length === 0) return;
    const maxCount = sorted[0][1];

    this.topCountries.innerHTML = sorted.map(([code, count]) => `
      <div class="bar-item">
        <span class="bar-label">${code}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${(count / maxCount) * 100}%; background: var(--accent-purple)"></div>
        </div>
        <span class="bar-count">${count}</span>
      </div>
    `).join('');
  }

  showDetail(event: ThreatEvent): void {
    const card = document.getElementById('attack-detail')!;
    const content = document.getElementById('detail-content')!;

    const srcIP = generateFakeIP();
    const dstIP = generateFakeIP();

    content.innerHTML = `
      <div class="detail-title">${event.attackType.name} Attack</div>
      <div class="detail-row">
        <span class="detail-key">SEVERITY</span>
        <span class="detail-severity-badge ${event.severity}">${event.severity}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">SOURCE</span>
        <span class="detail-val">${event.source.name} (${event.source.countryCode})</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">SOURCE IP</span>
        <span class="detail-val">${srcIP}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">TARGET</span>
        <span class="detail-val">${event.target.name} (${event.target.countryCode})</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">TARGET IP</span>
        <span class="detail-val">${dstIP}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">PROTOCOL</span>
        <span class="detail-val">${event.protocol}:${event.port}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">TACTIC</span>
        <span class="detail-val" style="color: ${event.tactic.color}">${event.tactic.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">TECHNIQUE</span>
        <span class="detail-val">${event.technique}</span>
      </div>
      ${event.cve ? `
      <div class="detail-row">
        <span class="detail-key">CVE</span>
        <span class="detail-val" style="color: var(--accent-red)">${event.cve}</span>
      </div>
      ` : ''}
      <div class="detail-row">
        <span class="detail-key">TIMESTAMP</span>
        <span class="detail-val">${new Date(event.timestamp).toLocaleString()}</span>
      </div>
    `;

    card.classList.remove('hidden');
  }
}
