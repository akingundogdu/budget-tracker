-- Create feedback table
create table if not exists feedback (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    full_name text not null,
    email text not null,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS policies
alter table feedback enable row level security;

create policy "Users can create their own feedback"
    on feedback for insert
    with check (auth.uid() = user_id);

create policy "Users can view their own feedback"
    on feedback for select
    using (auth.uid() = user_id); 