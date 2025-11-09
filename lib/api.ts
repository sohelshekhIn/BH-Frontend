import type {
  Facility,
  FacilityDetail,
  FacilityMapPoint,
  FacilitySearchParams,
  EmissionsData,
  PollutantData,
  OBPSStatus,
  ProtectedArea,
  SuitabilityAnalysisRequest,
  SuitabilityAnalysisResponse,
  SuitabilityPolygon,
  ShapFeature,
} from "@/types/facility";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Facility endpoints
  async getFacilities(params?: FacilitySearchParams): Promise<{
    facilities: Facility[];
    total: number;
    page: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.q) queryParams.set("q", params.q);
    if (params?.province) queryParams.set("province", params.province);
    if (params?.naics) queryParams.set("naics", params.naics);
    if (params?.min_co2e)
      queryParams.set("min_co2e", params.min_co2e.toString());
    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());

    const query = queryParams.toString();
    return this.fetch(`/api/facilities${query ? `?${query}` : ""}`);
  }

  async getFacility(id: string): Promise<FacilityDetail> {
    return this.fetch(`/api/facilities/${id}`);
  }

  async searchFacilities(query: string): Promise<Facility[]> {
    return this.fetch(`/api/facilities/search?q=${encodeURIComponent(query)}`);
  }

  async getFacilitiesInViewport(params: {
    bounds: [number, number, number, number];
    zoom?: number;
  }): Promise<FacilityMapPoint[]> {
    let [minLng, minLat, maxLng, maxLat] = params.bounds;

    // Normalize longitude to -180 to 180 range
    const normalizeLng = (lng: number) => {
      while (lng > 180) lng -= 360;
      while (lng < -180) lng += 360;
      return lng;
    };

    minLng = normalizeLng(minLng);
    maxLng = normalizeLng(maxLng);

    // Clamp latitude to -90 to 90
    minLat = Math.max(-90, Math.min(90, minLat));
    maxLat = Math.max(-90, Math.min(90, maxLat));

    const boundsStr = `${minLng},${minLat},${maxLng},${maxLat}`;
    return this.fetch(`/api/facilities/map?bounds=${boundsStr}`);
  }

  async getEmissionsHistory(facilityId: string): Promise<EmissionsData[]> {
    return this.fetch(`/api/facilities/${facilityId}/emissions-history`);
  }

  async getPollutants(facilityId: string): Promise<PollutantData> {
    return this.fetch(`/api/facilities/${facilityId}/pollutants`);
  }

  async getOBPSStatus(facilityId: string): Promise<OBPSStatus> {
    return this.fetch(`/api/facilities/${facilityId}/obps-status`);
  }

  async getTopPolluters(
    limit: number = 5,
    year: number = 2023
  ): Promise<Facility[]> {
    return this.fetch(
      `/api/facilities/top-polluters?limit=${limit}&year=${year}`
    );
  }

  async checkCPCADProximity(
    facilityId: string,
    bufferKm: number = 5
  ): Promise<{
    facility_id: string;
    buffer_km: number;
    near_protected_area: boolean;
    protected_areas_count: number;
    nearest_areas: Array<{
      name: string;
      designation_type: string;
      distance_km: number;
    }>;
  }> {
    return this.fetch(
      `/api/facilities/${facilityId}/cpcad-proximity?buffer_km=${bufferKm}`
    );
  }

  async checkIndigenousTerritories(facilityId: string): Promise<{
    facility_id: string;
    has_indigenous_overlap: boolean;
    territories: Array<{ Name: string; Slug: string; description?: string }>;
    treaties: Array<{ Name: string; Slug: string; description?: string }>;
    consultation_required: boolean;
    details: Record<string, unknown>;
  }> {
    return this.fetch(`/api/facilities/${facilityId}/indigenous-check`);
  }

  // Projects endpoints
  async generateBrief(request: {
    facility_id: string;
    project_type: string;
    selected_polygon_ids: string[];
    all_polygons: any[];
    buffer_km: number;
  }): Promise<any> {
    return this.fetch(`/api/projects/generate-brief`, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  // Geospatial endpoints
  async getProtectedAreas(
    bounds: [number, number, number, number]
  ): Promise<ProtectedArea[]> {
    const [minLng, minLat, maxLng, maxLat] = bounds;
    return this.fetch(
      `/api/protected-areas?bounds=${minLng},${minLat},${maxLng},${maxLat}`
    );
  }

  // Suitability analysis endpoints
  async analyzeSuitability(
    request: SuitabilityAnalysisRequest
  ): Promise<SuitabilityAnalysisResponse> {
    return this.fetch(`/api/suitability/analyze`, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getPolygonThumbnail(polygonId: string): Promise<string> {
    return this.fetch(`/api/suitability/polygon/${polygonId}/thumbnail`);
  }

  async getShapFeatures(polygonId: string): Promise<ShapFeature[]> {
    return this.fetch(`/api/suitability/shap-features/${polygonId}`);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
