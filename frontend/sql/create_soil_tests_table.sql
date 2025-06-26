-- Create soil_tests table if it doesn't exist
CREATE TABLE IF NOT EXISTS soil_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  location VARCHAR(255) NOT NULL,
  field_size DECIMAL(10,2),
  test_type VARCHAR(100),
  test_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  ph_level DECIMAL(4,2),
  nitrogen_level DECIMAL(5,2),
  phosphorus_level DECIMAL(5,2),
  potassium_level DECIMAL(5,2),
  organic_matter DECIMAL(5,2),
  moisture_content DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS on the table
ALTER TABLE soil_tests ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own soil tests
CREATE POLICY soil_tests_user_policy ON soil_tests 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own soil tests
CREATE POLICY soil_tests_insert_policy ON soil_tests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own soil tests
CREATE POLICY soil_tests_update_policy ON soil_tests 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create an index on user_id for faster queries
CREATE INDEX soil_tests_user_id_idx ON soil_tests(user_id);

-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add a comment to explain the table
COMMENT ON TABLE soil_tests IS 'Stores soil test data for users';
