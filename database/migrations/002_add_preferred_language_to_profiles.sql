-- Add preferred_language column to auth.users table
alter table auth.users
add column if not exists preferred_language varchar(2) default 'en' check (preferred_language in ('en', 'tr'));

-- Update existing users to have preferred_language as 'en'
update auth.users
set preferred_language = 'en'
where preferred_language is null;

-- Create index for better performance
create index if not exists users_preferred_language_idx on auth.users(preferred_language);

-- Add comment to explain the column
comment on column auth.users.preferred_language is 'User preferred language: en or tr'; 