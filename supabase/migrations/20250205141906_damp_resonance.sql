/*
  # Initial Schema for Smart Farm AI Platform

  1. New Tables
    - `soil_tests`
      - For scheduling and storing soil test results
    - `crop_recommendations`
      - For storing AI-based crop recommendations
    - `disease_detections`
      - For storing crop disease analysis results
    - `treatment_plans`
      - For storing fertilizer and treatment recommendations
    - `yield_predictions`
      - For storing yield and profit predictions
    - `market_insights`
      - For storing market price predictions and trends

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Soil Tests
CREATE TABLE IF NOT EXISTS soil_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  location text NOT NULL,
  test_date timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  ph_level decimal,
  nitrogen_level decimal,
  phosphorus_level decimal,
  potassium_level decimal,
  organic_matter decimal,
  moisture_content decimal,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE soil_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own soil tests"
  ON soil_tests
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Crop Recommendations
CREATE TABLE IF NOT EXISTS crop_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  soil_test_id uuid REFERENCES soil_tests(id),
  crop_name text NOT NULL,
  confidence_score decimal NOT NULL,
  expected_yield decimal,
  water_requirements text,
  season text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE crop_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their crop recommendations"
  ON crop_recommendations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Disease Detections
CREATE TABLE IF NOT EXISTS disease_detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  image_url text NOT NULL,
  disease_name text,
  confidence_score decimal,
  symptoms text,
  treatment_suggestions text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE disease_detections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their disease detections"
  ON disease_detections
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Treatment Plans
CREATE TABLE IF NOT EXISTS treatment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  soil_test_id uuid REFERENCES soil_tests(id),
  crop_name text NOT NULL,
  fertilizer_recommendations text,
  pesticide_recommendations text,
  soil_amendments text,
  application_schedule text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their treatment plans"
  ON treatment_plans
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Yield Predictions
CREATE TABLE IF NOT EXISTS yield_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  crop_name text NOT NULL,
  land_area decimal NOT NULL,
  expected_yield decimal NOT NULL,
  estimated_cost decimal NOT NULL,
  estimated_revenue decimal NOT NULL,
  estimated_profit decimal NOT NULL,
  confidence_score decimal NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE yield_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their yield predictions"
  ON yield_predictions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Market Insights
CREATE TABLE IF NOT EXISTS market_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  crop_name text NOT NULL,
  current_price decimal NOT NULL,
  predicted_price decimal NOT NULL,
  price_trend text NOT NULL,
  best_selling_time text,
  market_analysis text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE market_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their market insights"
  ON market_insights
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);