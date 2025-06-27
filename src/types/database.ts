export type SoilTestStatus = 'pending' | 'sample_collection' | 'analyzing' | 'completed';

export interface SoilTest {
  id: string;
  user_id: string;
  location: string;
  field_size?: number;
  test_type: string;
  test_date: string;
  status: SoilTestStatus;
  ph_level?: number;
  nitrogen_level?: number;
  phosphorus_level?: number;
  potassium_level?: number;
  organic_matter?: number;
  moisture_content?: number;
  created_at: string;
  updated_at: string;
  sample_collection_date?: string;
  analysis_started_date?: string;
  completed_date?: string;
}