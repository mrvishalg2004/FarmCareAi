-- Migration file for soil_tests table
-- This migration adds field_size and test_type fields to soil_tests

ALTER TABLE IF EXISTS soil_tests 
ADD COLUMN IF NOT EXISTS field_size DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS test_type VARCHAR(100);

-- Add an index for faster queries on test_date
CREATE INDEX IF NOT EXISTS idx_soil_tests_test_date ON soil_tests(test_date);
