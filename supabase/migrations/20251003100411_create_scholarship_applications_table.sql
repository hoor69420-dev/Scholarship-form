/*
  # Create scholarship applications table

  1. New Tables
    - `scholarship_applications`
      - `id` (uuid, primary key)
      - `organization_name` (text) - Name of the organization applying
      - `contact_person` (text) - Contact person name
      - `email` (text) - Organization email address
      - `phone` (text) - Phone number
      - `num_students` (integer) - Number of students applying for
      - `grade_level` (text) - Grade level of students
      - `reason` (text) - Reason for requesting scholarship
      - `document_url` (text, optional) - URL to uploaded supporting document
      - `confirmed` (boolean) - Confirmation checkbox status
      - `created_at` (timestamptz) - Application submission timestamp
      - `status` (text) - Application status (pending, approved, rejected)
  
  2. Security
    - Enable RLS on `scholarship_applications` table
    - Add policy for anyone to submit applications (public access for inserts)
    - Add policy for authenticated users to view all applications
*/

CREATE TABLE IF NOT EXISTS scholarship_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  num_students integer NOT NULL,
  grade_level text NOT NULL,
  reason text NOT NULL,
  document_url text,
  confirmed boolean DEFAULT false,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scholarship_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit scholarship applications"
  ON scholarship_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all applications"
  ON scholarship_applications
  FOR SELECT
  TO authenticated
  USING (true);