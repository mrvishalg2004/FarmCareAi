-- First create the setup function
CREATE OR REPLACE FUNCTION public.setup_soil_tests_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create the table if it doesn't exist
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

  -- Create the uuid extension if it doesn't exist
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  -- Enable RLS
  ALTER TABLE soil_tests ENABLE ROW LEVEL SECURITY;

  -- Create policies if they don't exist
  DO $$ 
  BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS soil_tests_user_policy ON soil_tests;
    DROP POLICY IF EXISTS soil_tests_insert_policy ON soil_tests;
    DROP POLICY IF EXISTS soil_tests_update_policy ON soil_tests;
    
    -- Create new policies
    CREATE POLICY soil_tests_user_policy ON soil_tests 
      FOR ALL 
      USING (auth.uid() = user_id);

    CREATE POLICY soil_tests_insert_policy ON soil_tests 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY soil_tests_update_policy ON soil_tests 
      FOR UPDATE 
      USING (auth.uid() = user_id);
  END $$;

  -- Create index if it doesn't exist
  CREATE INDEX IF NOT EXISTS soil_tests_user_id_idx ON soil_tests(user_id);
END;
$$;

-- Now execute the function to set up everything
SELECT setup_soil_tests_table();
