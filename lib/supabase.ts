import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (will be auto-generated when we run: npx supabase gen types typescript)
export type Database = {
  public: {
    Tables: {
      facilities: {
        Row: {
          id: string
          name: string
          latitude: number
          longitude: number
          province: string
          naics_code: string
          naics_description: string | null
          obps_covered: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          latitude: number
          longitude: number
          province: string
          naics_code: string
          naics_description?: string | null
          obps_covered?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          latitude?: number
          longitude?: number
          province?: string
          naics_code?: string
          naics_description?: string | null
          obps_covered?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      emissions: {
        Row: {
          id: number
          facility_id: string
          year: number
          co2e_tonnes: number
          yoy_change: number | null
          is_anomaly: boolean
          created_at: string
        }
        Insert: {
          id?: number
          facility_id: string
          year: number
          co2e_tonnes: number
          yoy_change?: number | null
          is_anomaly?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          facility_id?: string
          year?: number
          co2e_tonnes?: number
          yoy_change?: number | null
          is_anomaly?: boolean
          created_at?: string
        }
      }
      pollutants: {
        Row: {
          id: number
          facility_id: string
          year: number
          nox: number | null
          sox: number | null
          pm25: number | null
          vocs: number | null
          created_at: string
        }
        Insert: {
          id?: number
          facility_id: string
          year: number
          nox?: number | null
          sox?: number | null
          pm25?: number | null
          vocs?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          facility_id?: string
          year?: number
          nox?: number | null
          sox?: number | null
          pm25?: number | null
          vocs?: number | null
          created_at?: string
        }
      }
      protected_areas: {
        Row: {
          id: number
          cpcad_id: string | null
          name: string
          designation_type: string | null
          iucn_category: string | null
          managing_body: string | null
          area_km2: number | null
          created_at: string
        }
      }
      user_projects: {
        Row: {
          id: string
          user_id: string
          facility_id: string
          project_name: string
          project_type: string
          selected_polygons: any | null
          total_credits_mid: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          facility_id: string
          project_name: string
          project_type: string
          selected_polygons?: any | null
          total_credits_mid?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          facility_id?: string
          project_name?: string
          project_type?: string
          selected_polygons?: any | null
          total_credits_mid?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      check_cpcad_intersection: {
        Args: {
          center_lat: number
          center_lng: number
          buffer_km: number
        }
        Returns: {
          protected_area_id: number
          name: string
          designation_type: string
          distance_km: number
        }[]
      }
    }
  }
}

