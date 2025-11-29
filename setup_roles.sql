-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'officer' check (role in ('admin', 'officer'))
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create a trigger to automatically create a profile entry when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'officer'); -- Default role is 'officer'
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- INSTRUCTIONS FOR MANUAL ROLE ASSIGNMENT:
-- 1. Run this script in the Supabase SQL Editor.
-- 2. Sign up a user via the app.
-- 3. Go to the 'profiles' table in Supabase Table Editor.
-- 4. Manually change the 'role' column to 'admin' for your admin user.
