-- =============================================
-- E-Prayog Supabase Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'Student' CHECK (role IN ('Student', 'Teacher', 'Admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Users can read their own data
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own data (on signup)
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- 4. Auto-insert user on signup (trigger function)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, role, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    'Student',
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    email = COALESCE(EXCLUDED.email, public.users.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger: run after auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Phase 2 Additions: Expanded Profile
-- =============================================
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS grade TEXT,
  ADD COLUMN IF NOT EXISTS syllabus TEXT,
  ADD COLUMN IF NOT EXISTS institution TEXT,
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English',
  ADD COLUMN IF NOT EXISTS avatar TEXT,
  ADD COLUMN IF NOT EXISTS progress JSONB DEFAULT '{"physics": 0, "chemistry": 0, "biology": 0, "math": 0, "cs": 0}'::jsonb,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS recent_lab_id TEXT,
  ADD COLUMN IF NOT EXISTS recent_subject_id TEXT,
  ADD COLUMN IF NOT EXISTS teacherUid TEXT,
  ADD COLUMN IF NOT EXISTS teacherCode TEXT;

-- 6. Quiz Scores table
CREATE TABLE IF NOT EXISTS public.quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  lab_id TEXT NOT NULL,
  subject_id TEXT,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lab_id)
);

ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz scores"
  ON public.quiz_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update own quiz scores"
  ON public.quiz_scores FOR ALL
  USING (auth.uid() = user_id);

-- 7. Teachers and Codes tables
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.teacher_codes (
  code TEXT PRIMARY KEY,
  teacher_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.teacher_students (
  teacher_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (teacher_id, student_id)
);

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view teacher codes" ON public.teacher_codes FOR SELECT USING (true);
CREATE POLICY "Teachers manage their codes" ON public.teacher_codes FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers view their profiles" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Teachers manage their profiles" ON public.teachers FOR ALL USING (auth.uid() = id);
CREATE POLICY "Teachers view their students" ON public.teacher_students FOR SELECT USING (auth.uid() = teacher_id OR auth.uid() = student_id);
CREATE POLICY "Students join teachers" ON public.teacher_students FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students leave/Teachers remove" ON public.teacher_students FOR DELETE USING (auth.uid() = teacher_id OR auth.uid() = student_id);
