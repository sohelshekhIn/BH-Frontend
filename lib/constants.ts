// Canadian Provinces
export const PROVINCES = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
] as const;

// Common NAICS codes for industrial facilities
export const NAICS_SECTORS = [
  { code: "211", name: "Oil and Gas Extraction" },
  { code: "212", name: "Mining (except Oil and Gas)" },
  { code: "221", name: "Utilities" },
  { code: "311", name: "Food Manufacturing" },
  { code: "321", name: "Wood Product Manufacturing" },
  { code: "322", name: "Paper Manufacturing" },
  { code: "324", name: "Petroleum and Coal Products Manufacturing" },
  { code: "325", name: "Chemical Manufacturing" },
  { code: "327", name: "Non-Metallic Mineral Product Manufacturing" },
  { code: "331", name: "Primary Metal Manufacturing" },
] as const;

// Project Types
export const PROJECT_TYPES = [
  { value: "reforestation", label: "Reforestation", icon: "🌲" },
  { value: "wetland", label: "Wetland", icon: "🌾" },
  { value: "grassland", label: "Grassland", icon: "🌿" },
] as const;

// Credit calculation defaults
export const CREDIT_DEFAULTS = {
  reforestation: {
    seq_factor: 0.8,
    permanence: 0.95,
    survival: 0.85,
  },
  wetland: {
    seq_factor: 0.75,
    permanence: 0.98,
    survival: 0.9,
  },
  grassland: {
    seq_factor: 0.65,
    permanence: 0.92,
    survival: 0.88,
  },
} as const;

// Buffer ranges (km)
export const BUFFER_MIN = 0;
export const BUFFER_MAX = 50;
export const BUFFER_DEFAULT = 20;
export const BUFFER_STEP = 5;

