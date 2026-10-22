import { MitreTactic } from './types';

export const MITRE_TACTICS: MitreTactic[] = [
  { id: 'TA0043', name: 'Reconnaissance', shortName: 'RECON', color: '#a855f7', enabled: true },
  { id: 'TA0001', name: 'Initial Access', shortName: 'ACCESS', color: '#ff2d55', enabled: true },
  { id: 'TA0002', name: 'Execution', shortName: 'EXEC', color: '#ff6b35', enabled: true },
  { id: 'TA0003', name: 'Persistence', shortName: 'PERSIST', color: '#ffb800', enabled: true },
  { id: 'TA0004', name: 'Privilege Escalation', shortName: 'PRIVESC', color: '#e3b341', enabled: true },
  { id: 'TA0005', name: 'Defense Evasion', shortName: 'EVASION', color: '#4d9fff', enabled: true },
  { id: 'TA0006', name: 'Credential Access', shortName: 'CREDS', color: '#00d4aa', enabled: true },
  { id: 'TA0007', name: 'Discovery', shortName: 'DISCO', color: '#00f0ff', enabled: true },
  { id: 'TA0008', name: 'Lateral Movement', shortName: 'LATERAL', color: '#f97583', enabled: true },
  { id: 'TA0011', name: 'Command & Control', shortName: 'C2', color: '#d2a8ff', enabled: true },
  { id: 'TA0010', name: 'Exfiltration', shortName: 'EXFIL', color: '#ff7b72', enabled: true },
  { id: 'TA0040', name: 'Impact', shortName: 'IMPACT', color: '#ff2d55', enabled: true },
];

export const TECHNIQUES: Record<string, string[]> = {
  'TA0043': ['Active Scanning', 'Search Open Websites', 'Gather Victim Identity Info', 'Phishing for Information'],
  'TA0001': ['Phishing', 'Exploit Public-Facing Application', 'Drive-by Compromise', 'Valid Accounts'],
  'TA0002': ['Command & Scripting Interpreter', 'Exploitation for Client Execution', 'User Execution'],
  'TA0003': ['Registry Run Keys', 'Scheduled Task/Job', 'Create Account', 'Server Software Component'],
  'TA0004': ['Exploitation for Privilege Escalation', 'Process Injection', 'Access Token Manipulation'],
  'TA0005': ['Obfuscated Files or Information', 'Masquerading', 'Rootkit', 'Indicator Removal'],
  'TA0006': ['Brute Force', 'OS Credential Dumping', 'Steal Web Session Cookie', 'Kerberoasting'],
  'TA0007': ['Network Service Discovery', 'System Info Discovery', 'Remote System Discovery'],
  'TA0008': ['Remote Services', 'Lateral Tool Transfer', 'Internal Spearphishing', 'Taint Shared Content'],
  'TA0011': ['Application Layer Protocol', 'Encrypted Channel', 'Proxy', 'Web Service C2'],
  'TA0010': ['Exfiltration Over C2 Channel', 'Exfiltration Over Web Service', 'Automated Exfiltration'],
  'TA0040': ['Data Destruction', 'Defacement', 'Disk Wipe', 'Endpoint Denial of Service'],
};

export const CVES = [
  'CVE-2024-3400', 'CVE-2024-21887', 'CVE-2023-44228', 'CVE-2023-34362',
  'CVE-2023-27997', 'CVE-2024-1709', 'CVE-2023-46805', 'CVE-2024-23917',
  'CVE-2023-20198', 'CVE-2024-0012', 'CVE-2023-42793', 'CVE-2024-47575',
  'CVE-2023-38831', 'CVE-2024-9474', 'CVE-2023-36884', 'CVE-2024-21762',
];
