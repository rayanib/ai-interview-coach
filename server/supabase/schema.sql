-- Enable UUID generation for primary keys.
create extension if not exists "pgcrypto";

-- Profiles can hold a user's basic information.
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  created_at timestamp with time zone default now()
);

-- Each session connects one CV with one target job.
create table if not exists interview_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete set null,
  cv_text text not null,
  job_description text,
  match_percentage int check (match_percentage between 0 and 100),
  strong_skills text[] default '{}',
  missing_skills text[] default '{}',
  suggested_topics text[] default '{}',
  created_at timestamp with time zone default now()
);

-- Questions belong to an interview session and have a stable display order.
create table if not exists interview_questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references interview_sessions(id) on delete cascade,
  question_text text not null,
  question_type text not null,
  order_number int not null,
  created_at timestamp with time zone default now(),
  unique (session_id, order_number)
);

-- Answers store both the user's text and the generated feedback.
create table if not exists interview_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references interview_questions(id) on delete cascade,
  answer_text text not null,
  score int check (score between 1 and 100),
  good_points text[] default '{}',
  missing_points text[] default '{}',
  improved_answer text,
  created_at timestamp with time zone default now()
);

-- Final reports keep a JSON snapshot of the complete calculated report.
create table if not exists final_reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references interview_sessions(id) on delete cascade,
  report_data jsonb not null,
  created_at timestamp with time zone default now()
);

-- Version 1 has no login system, so these tables remain accessible through the anon key.
-- Before production, add Supabase Auth, enable Row Level Security, and create user policies.
