-- Update soil_tests table to add tracking date fields
ALTER TABLE soil_tests
ADD COLUMN sample_collection_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN analysis_started_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN completed_date TIMESTAMP WITH TIME ZONE;
