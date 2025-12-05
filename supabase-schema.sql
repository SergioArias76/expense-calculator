-- Calculadora de Gastos - Database Schema
-- Ejecuta este script en Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: profile_data (salary for each profile)
CREATE TABLE IF NOT EXISTS profile_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  salary NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: expenses
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('one-time', 'installment', 'subscription')),
  current_payment INTEGER,
  total_payments INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
CREATE POLICY "Users can view own profiles"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profiles"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiles"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profiles"
  ON profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for profile_data table
CREATE POLICY "Users can view own profile data"
  ON profile_data FOR SELECT
  USING (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create own profile data"
  ON profile_data FOR INSERT
  WITH CHECK (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own profile data"
  ON profile_data FOR UPDATE
  USING (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own profile data"
  ON profile_data FOR DELETE
  USING (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

-- Policies for expenses table
CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  USING (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create own expenses"
  ON expenses FOR INSERT
  WITH CHECK (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  USING (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  USING (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_profile_id ON expenses(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_data_profile_id ON profile_data(profile_id);
