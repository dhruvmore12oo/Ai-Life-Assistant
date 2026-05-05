-- Supabase Postgres Schema for AI Life Admin Assistant

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom ENUM types for application-layer consistency
CREATE TYPE task_type AS ENUM ('Bill', 'Assignment', 'Reminder', 'Appointment');
CREATE TYPE task_priority AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE task_status AS ENUM ('Pending', 'Completed');

-- Core tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type task_type NOT NULL,
    deadline TIMESTAMPTZ,
    priority task_priority DEFAULT 'Medium',
    status task_status DEFAULT 'Pending',
    notes TEXT,
    ai_confidence INTEGER CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
    user_id UUID, -- Placeholder: For future-ready multi-user authentication boundary
    source_type VARCHAR(50) DEFAULT 'image', -- Tracks origin (image, pdf, audio, text)
    reminder_sent_day_before BOOLEAN DEFAULT FALSE,
    reminder_sent_same_day BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient chronological querying
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_status ON tasks(status);

-- Note: When Auth is merged, enable RLS:
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users query their own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- User Profiles Extension
-- ==========================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    timezone VARCHAR(100) DEFAULT 'America/New_York',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Function to automatically create a profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, '');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
