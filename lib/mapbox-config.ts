export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export const MAP_STYLES = {
  dark: "mapbox://styles/mapbox/dark-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  topo: "mapbox://styles/mapbox/outdoors-v12",
} as const;

export type MapStyle = keyof typeof MAP_STYLES;

export const DEFAULT_MAP_STYLE: MapStyle = "dark";

export const CANADA_CENTER: [number, number] = [-96.0, 56.1304];
export const CANADA_ZOOM = 4;

// Emissions color scale based on CO2e tonnes
export const getEmissionColor = (co2eTonnes: number): string => {
  if (co2eTonnes < 50000) return "#3b82f6"; // blue - low
  if (co2eTonnes < 100000) return "#f59e0b"; // amber - medium
  return "#ef4444"; // red - high
};

// Emissions circle radius based on CO2e tonnes
export const getEmissionRadius = (co2eTonnes: number): number => {
  return Math.sqrt(co2eTonnes) / 100;
};

// Suitability color scale (0-1)
// Using yellow-green gradient to distinguish from emerald conserved areas
export const getSuitabilityColor = (score: number): string => {
  if (score < 0.4) return "#eab308"; // yellow-500 - needs improvement
  if (score < 0.7) return "#84cc16"; // lime-500 - good potential
  return "#22c55e"; // green-500 - excellent (distinct from emerald conserved areas)
};

// Generate Mapbox Static API URL for satellite imagery
export const getSatelliteImageUrl = (
  latitude: number,
  longitude: number,
  zoom: number = 24,
  width: number = 600,
  height: number = 600,
  addMarker: boolean = true
): string => {
  // Add simple red marker at facility location (using basic pin)
  const marker = addMarker ? `pin-l+ef4444(${longitude},${latitude})/` : "";

  // Mapbox Static Images API - satellite style
  return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${marker}${longitude},${latitude},${zoom}/${width}x${height}@2x?access_token=${MAPBOX_TOKEN}`;
};
