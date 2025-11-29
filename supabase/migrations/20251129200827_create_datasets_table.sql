/*
  # Create datasets and data cleaning tables

  1. New Tables
    - `datasets`
      - `id` (uuid, primary key)
      - `name` (text) - user-friendly name for the dataset
      - `filename` (text) - original filename
      - `row_count` (integer) - number of rows
      - `column_count` (integer) - number of columns
      - `columns_meta` (jsonb) - metadata about columns (names, types, null counts)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `dataset_rows`
      - `id` (uuid, primary key)
      - `dataset_id` (uuid, foreign key to datasets)
      - `row_data` (jsonb) - the actual row data
      - `is_cleaned` (boolean) - whether this row has been cleaned
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (for hackathon demo purposes)
*/

CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  filename text NOT NULL,
  row_count integer DEFAULT 0,
  column_count integer DEFAULT 0,
  columns_meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dataset_rows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE,
  row_data jsonb NOT NULL,
  is_cleaned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dataset_rows_dataset_id ON dataset_rows(dataset_id);

ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_rows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view datasets"
  ON datasets FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert datasets"
  ON datasets FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update datasets"
  ON datasets FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete datasets"
  ON datasets FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Anyone can view dataset rows"
  ON dataset_rows FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert dataset rows"
  ON dataset_rows FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update dataset rows"
  ON dataset_rows FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete dataset rows"
  ON dataset_rows FOR DELETE
  TO public
  USING (true);