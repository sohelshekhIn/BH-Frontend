// Facility and Emissions Types
export interface Facility {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  province: string;
  naics_code: string;
  naics_description: string;
  co2e_2023: number;
  co2e_trend?: number[]; // Last 5 years
  obps_covered: boolean;
}

export interface FacilityMapPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  province: string;
  co2e_2023: number;
}

export interface FacilityDetail extends Facility {
  emissions_history: EmissionsData[];
  pollutants: PollutantData;
  obps_status: OBPSStatus;
  regulatory_context: RegulatoryContext;
}

export interface EmissionsData {
  year: number;
  co2e: number;
  yoy_change?: number;
  is_anomaly?: boolean;
}

export interface PollutantData {
  nox: number | null;
  sox: number | null;
  pm25: number | null;
  vocs: number | null;
}

export interface OBPSStatus {
  covered: boolean;
  compliance_info?: string;
  reporting_method?: string;
}

export interface RegulatoryContext {
  ghgrp_method: string;
  last_verification_date: string;
  eccc_link: string;
}

// Geospatial Types
export interface ProtectedArea {
  id: string;
  name: string;
  type: string;
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
}

// Credit Builder Types
export type ProjectType = "reforestation" | "wetland" | "grassland";

export interface Constraints {
  exclude_cpcad: boolean;
  water_buffer: boolean;
  slope_limit: boolean;
  exclude_infrastructure: boolean;
  warn_indigenous: boolean;
}

export interface SuitabilityPolygon {
  id: string;
  area_ha: number;
  suitability_score: number;
  est_credits_low: number;
  est_credits_mid: number;
  est_credits_high: number;
  geometry: GeoJSON.Polygon;
  constraints_warnings: string[];
  shap_features: ShapFeature[];
  thumbnail_url?: string;
}

export interface ShapFeature {
  name: string;
  value: number;
  impact: number; // -1 to 1
}

export interface CreditCalculation {
  area_ha: number;
  seq_factor: number;
  permanence: number;
  survival: number;
  total_credits: number;
}

// Search and Filters
export interface FacilitySearchParams {
  q?: string;
  province?: string;
  naics?: string;
  min_co2e?: number;
  page?: number;
  limit?: number;
}

export interface SuitabilityAnalysisRequest {
  facility_id: string;
  buffer_km: number;
  project_type: ProjectType;
  constraints: Constraints;
}

export interface SuitabilityAnalysisResponse {
  polygons: SuitabilityPolygon[];
  total_area_ha: number;
  avg_suitability: number;
}
