-- Supabase Setup Script for Productivity Platform

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Reminders Table
create table if not exists public.reminders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  reminder_date date not null,
  reminder_time time without time zone,
  repeat_type text default 'none' check (repeat_type in ('none', 'daily', 'weekly', 'monthly', 'yearly')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Habits Table
create table if not exists public.habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  color text default '#3b82f6',
  target_days integer default 7,
  streak integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Habit Logs Table
create table if not exists public.habit_logs (
  id uuid default uuid_generate_v4() primary key,
  habit_id uuid references public.habits on delete cascade not null,
  completed_date date not null,
  completed boolean default true,
  unique(habit_id, completed_date)
);

-- 4. Focus Sessions Table
create table if not exists public.focus_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  duration integer not null, -- duration in seconds
  completed boolean default false,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Daily Tasks Table
create table if not exists public.daily_tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  completed boolean default false,
  task_date date not null default current_date,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Goals Table
create table if not exists public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  target integer not null, -- generic target number
  progress integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- Setup Row Level Security (RLS)

-- Reminders
alter table public.reminders enable row level security;
create policy "Users can view their own reminders." on public.reminders for select using (auth.uid() = user_id);
create policy "Users can insert their own reminders." on public.reminders for insert with check (auth.uid() = user_id);
create policy "Users can update their own reminders." on public.reminders for update using (auth.uid() = user_id);
create policy "Users can delete their own reminders." on public.reminders for delete using (auth.uid() = user_id);

-- Habits
alter table public.habits enable row level security;
create policy "Users can view their own habits." on public.habits for select using (auth.uid() = user_id);
create policy "Users can insert their own habits." on public.habits for insert with check (auth.uid() = user_id);
create policy "Users can update their own habits." on public.habits for update using (auth.uid() = user_id);
create policy "Users can delete their own habits." on public.habits for delete using (auth.uid() = user_id);

-- Habit Logs
alter table public.habit_logs enable row level security;
create policy "Users can view their own habit logs." on public.habit_logs for select using (
  exists (select 1 from public.habits where id = habit_id and user_id = auth.uid())
);
create policy "Users can insert their own habit logs." on public.habit_logs for insert with check (
  exists (select 1 from public.habits where id = habit_id and user_id = auth.uid())
);
create policy "Users can update their own habit logs." on public.habit_logs for update using (
  exists (select 1 from public.habits where id = habit_id and user_id = auth.uid())
);
create policy "Users can delete their own habit logs." on public.habit_logs for delete using (
  exists (select 1 from public.habits where id = habit_id and user_id = auth.uid())
);

-- Focus Sessions
alter table public.focus_sessions enable row level security;
create policy "Users can view their own focus sessions." on public.focus_sessions for select using (auth.uid() = user_id);
create policy "Users can insert their own focus sessions." on public.focus_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update their own focus sessions." on public.focus_sessions for update using (auth.uid() = user_id);
create policy "Users can delete their own focus sessions." on public.focus_sessions for delete using (auth.uid() = user_id);

-- Daily Tasks
alter table public.daily_tasks enable row level security;
create policy "Users can view their own daily tasks." on public.daily_tasks for select using (auth.uid() = user_id);
create policy "Users can insert their own daily tasks." on public.daily_tasks for insert with check (auth.uid() = user_id);
create policy "Users can update their own daily tasks." on public.daily_tasks for update using (auth.uid() = user_id);
create policy "Users can delete their own daily tasks." on public.daily_tasks for delete using (auth.uid() = user_id);

-- Goals
alter table public.goals enable row level security;
create policy "Users can view their own goals." on public.goals for select using (auth.uid() = user_id);
create policy "Users can insert their own goals." on public.goals for insert with check (auth.uid() = user_id);
create policy "Users can update their own goals." on public.goals for update using (auth.uid() = user_id);
create policy "Users can delete their own goals." on public.goals for delete using (auth.uid() = user_id);

-- Explicitly grant usage on the public schema to API roles
grant usage on schema public to postgres, anon, authenticated, service_role;

-- Grant full access to existing tables and sequences in the public schema
grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

-- Ensure future tables and sequences automatically inherit these privileges
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;
