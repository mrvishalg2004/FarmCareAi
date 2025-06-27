# FarmCare AI Soil Testing Module

This module provides soil testing functionality for the FarmCare AI application. It allows farmers to schedule soil tests, view test results, and receive AI-driven recommendations based on soil analysis.

## Database Setup

To set up the required database tables for soil testing functionality:

1. Run the initial table creation script:

```bash
psql -U <username> -d <database_name> -f sql/create_soil_tests_table.sql
```

2. Run the migration to add additional fields:

```bash
psql -U <username> -d <database_name> -f sql/002_add_field_size_test_type_to_soil_tests.sql
```

Alternatively, you can execute these SQL scripts in the Supabase dashboard under the SQL Editor.

## Table Structure

The `soil_tests` table has the following structure:

- `id`: UUID (Primary Key)
- `user_id`: UUID (References auth.users)
- `location`: VARCHAR(255) - The location of the soil test
- `test_date`: TIMESTAMP WITH TIME ZONE - When the test is scheduled for
- `status`: VARCHAR(50) - Status of the test (pending, completed, etc.)
- `field_size`: DECIMAL(10,2) - Size of the field in acres 
- `test_type`: VARCHAR(100) - Type of soil test
- `ph_level`: DECIMAL(4,2) - pH level of soil (if available)
- `nitrogen_level`: DECIMAL(5,2) - Nitrogen content (if available)
- `phosphorus_level`: DECIMAL(5,2) - Phosphorus content (if available)
- `potassium_level`: DECIMAL(5,2) - Potassium content (if available)
- `organic_matter`: DECIMAL(5,2) - Organic matter percentage (if available)
- `moisture_content`: DECIMAL(5,2) - Moisture content percentage (if available)
- `created_at`: TIMESTAMP WITH TIME ZONE - When the record was created
- `updated_at`: TIMESTAMP WITH TIME ZONE - When the record was last updated

## Row Level Security

The table includes Row Level Security (RLS) policies to ensure users can only:

- View their own soil tests
- Insert their own soil tests
- Update their own soil tests

## Components

The soil testing functionality is implemented in two components:

1. `/src/pages/soil-testing.tsx` - A simplified overview page with the option to schedule tests
2. `/src/pages/soil-testing/index.tsx` - A more detailed implementation with test management capabilities

Both components integrate with Supabase for data storage and retrieval.
