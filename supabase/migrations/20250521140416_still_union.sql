/*
  # Create translation history table

  1. New Tables
    - `translation_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `source_text` (text)
      - `translated_text` (text)
      - `source_language` (text)
      - `target_language` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `translation_history` table
    - Add policies for authenticated users to:
      - Read their own translation history
      - Insert new translations
*/

CREATE TABLE IF NOT EXISTS translation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  source_text text NOT NULL,
  translated_text text NOT NULL,
  source_language text NOT NULL,
  target_language text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE translation_history ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own translation history
CREATE POLICY "Users can read own translation history"
  ON translation_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert new translations
CREATE POLICY "Users can insert new translations"
  ON translation_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);