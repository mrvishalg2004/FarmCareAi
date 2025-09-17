// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          location: string | null;
          farm_size: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          location?: string | null;
          farm_size?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          location?: string | null;
          farm_size?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      soil_tests: {
        Row: SoilTest;
        Insert: Omit<SoilTest, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SoilTest, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export interface SoilTest {
  id: string;
  user_id: string;
  location: string;
  field_size: number | null;
  test_type: string;
  test_date: string;
  status: 'pending' | 'sample_collection' | 'analyzing' | 'completed';
  created_at: string;
  updated_at: string;
  sample_collection_date?: string;
  analysis_started_date?: string;
  completed_date?: string;
  ph_level?: number;
  nitrogen_level?: number;
  phosphorus_level?: number;
  potassium_level?: number;
}

export interface CropRecommendation {
  id: string;
  user_id: string;
  soil_test_id: string;
  crop_name: string;
  confidence_score: number;
  expected_yield?: number;
  water_requirements?: string;
  season?: string;
  created_at: string;
}

export interface DiseaseDetection {
  id: string;
  user_id: string;
  image_url: string;
  disease_name?: string;
  confidence_score?: number;
  symptoms?: string;
  treatment_suggestions?: string;
  created_at: string;
}

export interface TreatmentPlan {
  id: string;
  user_id: string;
  soil_test_id: string;
  crop_name: string;
  fertilizer_recommendations: string;
  pesticide_recommendations: string;
  soil_amendments: string;
  application_schedule: string;
  created_at: string;
}

export interface YieldPrediction {
  id: string;
  user_id: string;
  crop_name: string;
  land_area: number;
  expected_yield: number;
  estimated_cost: number;
  estimated_revenue: number;
  estimated_profit: number;
  confidence_score: number;
  created_at: string;
}

export interface MarketInsight {
  id: string;
  user_id: string;
  crop_name: string;
  current_price: number;
  predicted_price: number;
  price_trend: string;
  best_selling_time?: string;
  market_analysis?: string;
  created_at: string;
}