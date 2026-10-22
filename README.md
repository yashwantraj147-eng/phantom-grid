# 🌐 PHANTOM-GRID

<div align="center">

```
  ____  _   _    _    _   _ _____ ___  __  __       ____ ____  ___ ____  
 |  _ \| | | |  / \  | \ | |_   _/ _ \|  \/  |     / ___|  _ \|_ _|  _ \ 
 | |_) | |_| | / _ \ |  \| | | || | | | |\/| |____| |  _| |_) || || | | |
 |  __/|  _  |/ ___ \| |\  | | || |_| | |  | |____| |_| |  _ <  | || |_| |
 |_|   |_| |_/_/   \_\_| \_| |_| \___/|_|  |_|     \____|_| \_\|___|____/ 
```

**Real-Time 3D Cyber Threat Intelligence & Attack Simulation Engine**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.169-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub_Pages-22c55e?style=for-the-badge&logo=githubactions&logoColor=white)](https://pages.github.com/)

[**Live Demo**](https://yashwantraj147-eng.github.io/phantom-grid/) • [**Key Features**](#-key-features) • [**Architecture**](#-architecture) • [**MITRE ATT&CK**](#-mitre-attck-matrix) • [**Getting Started**](#-quick-start)

---

</div>

## ⚡ Overview

**PHANTOM-GRID** is a cutting-edge, browser-native 3D cyber threat intelligence visualizer built with **Three.js** and **TypeScript**. Inspired by modern Security Operations Centers (SOC) and military-grade command dashboards, it simulates and renders live attack vectors traversing the globe with realistic ballistic trajectory arcs, bloom post-processing, and interactive telemetry analytics mapped against the **MITRE ATT&CK Enterprise Matrix**.

---

## ✨ Key Features

- 🌍 **Interactive 3D Geospatial Engine**: High-fidelity WebGL globe featuring procedural landmass point-clouds, atmospheric scattering shaders, night-sky starfield, and 60+ geolocated threat monitoring nodes.
- ⚡ **Dynamic Attack Arcs**: Quadratic Bézier trajectories with animated line draws, particle lead heads, radiant glow sprites, and pulsing shockwave impact rings.
- 🛡️ **MITRE ATT&CK Enterprise Integration**: Real-time tagging and filtering across 10 core tactics (Reconnaissance, Initial Access, Execution, Persistence, Lateral Movement, Exfiltration, etc.) and specific technique mappings with real CVE correlations.
- 📊 **Real-Time SOC Telemetry**:
  - Live Attacks Per Second (APS) computation
  - Severity-weighted distribution (Critical, High, Medium, Low)
  - Dynamic Top-5 Target Port histograms (HTTP, HTTPS, SSH, RDP, DNS, SMB)
  - Real-time Top Source Country geographic breakdown
- ⏱️ **Time Dilation Controls**: Variable simulation speed slider (0.1× to 5.0×) and instant freeze/resume state for granular incident inspection.
- 🔍 **Incident Forensics Card**: Click any live threat in the feed to inspect source/target geolocation, synthetic IP routing, protocol details, and associated CVE vulnerability records.
- 📸 **Built-in Mission Snapshot**: One-click high-resolution canvas capture for incident reporting and documentation.
- 🚀 **Zero Backend Dependency**: Ultra-fast static bundle deployable instantly to GitHub Pages or any static CDN.

---

## 🏛️ Architecture

```
                                  +---------------------+
                                  |   SimulationEngine  |
                                  | (Generates Threats) |
                                  +----------+----------+
                                             |
                   +-------------------------+-------------------------+
                   |                                                   |
                   v                                                   v
         +-------------------+                               +-------------------+
         |   AttackManager   |                               |   UI Controller   |
         | (Three.js Arcs &  |                               | (Live Feed, Stats,|
         |  Impact Shaders)  |                               |  MITRE Filters)   |
         +---------+---------+                               +---------+---------+
                   |                                                   |
                   +-------------------------+-------------------------+
                                             |
                                             v
                                  +---------------------+
                                  |   EffectComposer    |
                                  |  (UnrealBloomPass & |
                                  |   OrbitControls)    |
                                  +---------------------+
                                             |
                                             v
                                  +---------------------+
                                  |  WebGL Canvas (DOM) |
                                  +---------------------+
```

---

## 🛡️ MITRE ATT&CK Matrix

PHANTOM-GRID models threat actors using real-world cyber techniques:

| Tactic Code | Tactic Name | Sample Techniques | Example CVEs |
|---|---|---|---|
| **TA0043** | Reconnaissance | Active Scanning, Phishing for Info | CVE-2023-38606 |
| **TA0001** | Initial Access | Exploit Public-Facing App, External Remote Services | CVE-2021-44228 (Log4j) |
| **TA0002** | Execution | Command & Scripting Interpreter, Scheduled Task | CVE-2023-34362 (MOVEit) |
| **TA0003** | Persistence | Account Manipulation, Boot/Logon Autostart | CVE-2023-4966 (Citrix Bleed) |
| **TA0004** | Privilege Escalation | Process Injection, Exploitation for Privilege | CVE-2024-3094 (XZ Utils) |
| **TA0005** | Defense Evasion | Masquerading, Impair Defenses, Subvert Trust Controls | CVE-2022-22965 (Spring4Shell) |
| **TA0006** | Credential Access | OS Credential Dumping, Brute Force | CVE-2023-22515 |
| **TA0007** | Discovery | Network Service Discovery, System Info Discovery | CVE-2024-21762 |
| **TA0008** | Lateral Movement | Remote Services (SMB/RDP), Use of Alternate Auth | CVE-2020-1472 (ZeroLogon) |
| **TA0010** | Exfiltration | Exfiltration Over C2, Automated Exfiltration | CVE-2023-46805 |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or newer recommended)
- `npm` or `pnpm` / `yarn`

### Installation

```bash
# Clone the repository
git clone https://github.com/yashwantraj147-eng/phantom-grid.git
cd phantom-grid

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
```

The optimized static assets will be output to the `dist/` folder, ready for deployment.

---

## 🎮 Controls & Interactions

| Action | Control |
|---|---|
| **Rotate Globe** | Left Click + Drag |
| **Zoom In / Out** | Mouse Wheel / Pinch Gesture |
| **Inspect Threat** | Click any event row in the Live Threat Feed |
| **Filter Tactics** | Toggle individual MITRE ATT&CK badges in the right dock |
| **Time Dilation** | Adjust the speed slider (0.1× – 5×) or toggle Pause/Play |
| **Screenshot** | Click the camera icon in the top right header |

---

## ⚙️ Tech Stack

- **Graphics Core**: [Three.js](https://threejs.org/) (WebGL, Custom GLSL Shaders, UnrealBloomPass post-processing)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type safety, custom data models)
- **Bundler**: [Vite](https://vitejs.dev/) (Lightning-fast HMR and tree-shaken production builds)
- **UI & Aesthetics**: Cyberpunk glassmorphism, responsive grid layouts, HUD-inspired visual feedback
- **CI/CD**: GitHub Actions workflow for zero-config deployment to GitHub Pages

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

<div align="center">
<sub>Crafted with precision for next-generation cyber defense visualization.</sub>
</div>
