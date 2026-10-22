import * as THREE from 'three';
import { City, GLOBE_RADIUS } from './types';

export const CITIES: City[] = [
  // North America
  { name: 'New York', country: 'United States', countryCode: 'US', lat: 40.71, lng: -74.01 },
  { name: 'Washington DC', country: 'United States', countryCode: 'US', lat: 38.91, lng: -77.04 },
  { name: 'San Francisco', country: 'United States', countryCode: 'US', lat: 37.77, lng: -122.42 },
  { name: 'Los Angeles', country: 'United States', countryCode: 'US', lat: 34.05, lng: -118.24 },
  { name: 'Chicago', country: 'United States', countryCode: 'US', lat: 41.88, lng: -87.63 },
  { name: 'Dallas', country: 'United States', countryCode: 'US', lat: 32.78, lng: -96.80 },
  { name: 'Miami', country: 'United States', countryCode: 'US', lat: 25.76, lng: -80.19 },
  { name: 'Seattle', country: 'United States', countryCode: 'US', lat: 47.61, lng: -122.33 },
  { name: 'Denver', country: 'United States', countryCode: 'US', lat: 39.74, lng: -104.99 },
  { name: 'Atlanta', country: 'United States', countryCode: 'US', lat: 33.75, lng: -84.39 },
  { name: 'Toronto', country: 'Canada', countryCode: 'CA', lat: 43.65, lng: -79.38 },
  { name: 'Vancouver', country: 'Canada', countryCode: 'CA', lat: 49.28, lng: -123.12 },
  { name: 'Mexico City', country: 'Mexico', countryCode: 'MX', lat: 19.43, lng: -99.13 },
  // South America
  { name: 'São Paulo', country: 'Brazil', countryCode: 'BR', lat: -23.55, lng: -46.63 },
  { name: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', lat: -34.60, lng: -58.38 },
  { name: 'Bogotá', country: 'Colombia', countryCode: 'CO', lat: 4.71, lng: -74.07 },
  { name: 'Lima', country: 'Peru', countryCode: 'PE', lat: -12.05, lng: -77.04 },
  { name: 'Santiago', country: 'Chile', countryCode: 'CL', lat: -33.45, lng: -70.67 },
  // Europe
  { name: 'London', country: 'United Kingdom', countryCode: 'GB', lat: 51.51, lng: -0.13 },
  { name: 'Paris', country: 'France', countryCode: 'FR', lat: 48.86, lng: 2.35 },
  { name: 'Berlin', country: 'Germany', countryCode: 'DE', lat: 52.52, lng: 13.41 },
  { name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', lat: 52.37, lng: 4.90 },
  { name: 'Frankfurt', country: 'Germany', countryCode: 'DE', lat: 50.11, lng: 8.68 },
  { name: 'Stockholm', country: 'Sweden', countryCode: 'SE', lat: 59.33, lng: 18.07 },
  { name: 'Moscow', country: 'Russia', countryCode: 'RU', lat: 55.76, lng: 37.62 },
  { name: 'St Petersburg', country: 'Russia', countryCode: 'RU', lat: 59.93, lng: 30.32 },
  { name: 'Kyiv', country: 'Ukraine', countryCode: 'UA', lat: 50.45, lng: 30.52 },
  { name: 'Warsaw', country: 'Poland', countryCode: 'PL', lat: 52.23, lng: 21.01 },
  { name: 'Rome', country: 'Italy', countryCode: 'IT', lat: 41.90, lng: 12.50 },
  { name: 'Madrid', country: 'Spain', countryCode: 'ES', lat: 40.42, lng: -3.70 },
  { name: 'Zurich', country: 'Switzerland', countryCode: 'CH', lat: 47.38, lng: 8.54 },
  { name: 'Bucharest', country: 'Romania', countryCode: 'RO', lat: 44.43, lng: 26.10 },
  { name: 'Helsinki', country: 'Finland', countryCode: 'FI', lat: 60.17, lng: 24.94 },
  // Middle East
  { name: 'Dubai', country: 'UAE', countryCode: 'AE', lat: 25.20, lng: 55.27 },
  { name: 'Tehran', country: 'Iran', countryCode: 'IR', lat: 35.69, lng: 51.39 },
  { name: 'Tel Aviv', country: 'Israel', countryCode: 'IL', lat: 32.08, lng: 34.78 },
  { name: 'Istanbul', country: 'Turkey', countryCode: 'TR', lat: 41.01, lng: 28.98 },
  { name: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', lat: 24.71, lng: 46.67 },
  // Asia
  { name: 'Beijing', country: 'China', countryCode: 'CN', lat: 39.90, lng: 116.40 },
  { name: 'Shanghai', country: 'China', countryCode: 'CN', lat: 31.23, lng: 121.47 },
  { name: 'Shenzhen', country: 'China', countryCode: 'CN', lat: 22.54, lng: 114.06 },
  { name: 'Tokyo', country: 'Japan', countryCode: 'JP', lat: 35.68, lng: 139.69 },
  { name: 'Osaka', country: 'Japan', countryCode: 'JP', lat: 34.69, lng: 135.50 },
  { name: 'Seoul', country: 'South Korea', countryCode: 'KR', lat: 37.57, lng: 126.98 },
  { name: 'Mumbai', country: 'India', countryCode: 'IN', lat: 19.08, lng: 72.88 },
  { name: 'New Delhi', country: 'India', countryCode: 'IN', lat: 28.61, lng: 77.21 },
  { name: 'Bangalore', country: 'India', countryCode: 'IN', lat: 12.97, lng: 77.59 },
  { name: 'Singapore', country: 'Singapore', countryCode: 'SG', lat: 1.35, lng: 103.82 },
  { name: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', lat: 22.32, lng: 114.17 },
  { name: 'Taipei', country: 'Taiwan', countryCode: 'TW', lat: 25.03, lng: 121.57 },
  { name: 'Bangkok', country: 'Thailand', countryCode: 'TH', lat: 13.76, lng: 100.50 },
  { name: 'Jakarta', country: 'Indonesia', countryCode: 'ID', lat: -6.21, lng: 106.85 },
  { name: 'Hanoi', country: 'Vietnam', countryCode: 'VN', lat: 21.03, lng: 105.85 },
  { name: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', lat: 3.14, lng: 101.69 },
  // Africa
  { name: 'Lagos', country: 'Nigeria', countryCode: 'NG', lat: 6.52, lng: 3.38 },
  { name: 'Cairo', country: 'Egypt', countryCode: 'EG', lat: 30.04, lng: 31.24 },
  { name: 'Johannesburg', country: 'South Africa', countryCode: 'ZA', lat: -26.20, lng: 28.04 },
  { name: 'Nairobi', country: 'Kenya', countryCode: 'KE', lat: -1.29, lng: 36.82 },
  { name: 'Cape Town', country: 'South Africa', countryCode: 'ZA', lat: -33.93, lng: 18.42 },
  // Oceania
  { name: 'Sydney', country: 'Australia', countryCode: 'AU', lat: -33.87, lng: 151.21 },
  { name: 'Melbourne', country: 'Australia', countryCode: 'AU', lat: -37.81, lng: 144.96 },
  { name: 'Auckland', country: 'New Zealand', countryCode: 'NZ', lat: -36.85, lng: 174.76 },
];

// Simplified land regions: [latMin, latMax, lngMin, lngMax]
const LAND_BOUNDS: number[][] = [
  // North America
  [48, 72, -168, -55], [25, 48, -128, -65], [15, 25, -118, -85],
  [60, 75, -170, -140], // Alaska
  // Central America
  [7, 20, -92, -77],
  // South America
  [0, 12, -82, -50], [-15, 0, -80, -35], [-55, -15, -75, -45],
  [-40, -15, -72, -55],
  // Europe
  [36, 60, -10, 30], [55, 71, 5, 40], [50, 59, -11, 2],
  [63, 66, -24, -13], // Iceland
  // Africa
  [20, 37, -18, 35], [-5, 20, -18, 52], [-35, -5, 12, 42],
  [0, 15, -18, 0],
  // Middle East
  [12, 42, 30, 60],
  // Asia
  [20, 55, 60, 135], [55, 72, 60, 180], [-10, 20, 95, 140],
  [8, 35, 68, 90], // India
  [30, 45, 128, 146], // Japan/Korea
  [0, 8, 100, 120], // Malay peninsula
  // Australia
  [-40, -10, 113, 154],
  // New Zealand
  [-47, -34, 166, 178],
  // Indonesia
  [-8, 2, 95, 141],
  // UK
  [50, 59, -8, 2],
  // Scandinavia
  [55, 71, 4, 32],
];

export function isLand(lat: number, lng: number): boolean {
  for (const [latMin, latMax, lngMin, lngMax] of LAND_BOUNDS) {
    if (lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax) {
      return true;
    }
  }
  return false;
}

export function latLngToVector3(lat: number, lng: number, radius: number = GLOBE_RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export function randomCity(): City {
  return CITIES[Math.floor(Math.random() * CITIES.length)];
}

export function randomCityExcept(exclude: City): City {
  let city: City;
  do {
    city = randomCity();
  } while (city.name === exclude.name);
  return city;
}

export function generateFakeIP(): string {
  const blocks = [
    () => `${10 + Math.floor(Math.random() * 240)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
  ];
  return blocks[0]();
}

export const COMMON_PORTS = [22, 23, 25, 53, 80, 110, 143, 443, 445, 993, 995, 1433, 1521, 3306, 3389, 5432, 5900, 6379, 8080, 8443, 9200, 27017];

export const PROTOCOLS = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'SSH', 'DNS', 'SMTP', 'FTP', 'RDP', 'SMB'];
