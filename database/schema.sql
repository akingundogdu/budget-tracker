-- Enable RLS (Row Level Security)
alter table if exists public.profiles enable row level security;
alter table if exists public.categories enable row level security;
alter table if exists public.transactions enable row level security;
alter table if exists public.reminders enable row level security;

-- Create tables
-- Categories table
create table if not exists public.categories (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    name varchar(255) not null,
    color varchar(50),
    icon varchar(50),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Transactions table
create table if not exists public.transactions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    category_id uuid references public.categories(id),
    amount decimal(12,2) not null,
    type varchar(50) not null check (type in ('expense', 'income')),
    description text,
    date timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reminders table
create table if not exists public.reminders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    transaction_id uuid references public.transactions(id),
    reminder_date timestamp with time zone not null,
    description text,
    is_recurring boolean default false,
    recurrence_pattern varchar(50),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
-- Categories policies
create policy "Users can view their own categories"
    on categories for select
    using (auth.uid() = user_id);

create policy "Users can insert their own categories"
    on categories for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own categories"
    on categories for update
    using (auth.uid() = user_id);

create policy "Users can delete their own categories"
    on categories for delete
    using (auth.uid() = user_id);

-- Transactions policies
create policy "Users can view their own transactions"
    on transactions for select
    using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
    on transactions for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
    on transactions for update
    using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
    on transactions for delete
    using (auth.uid() = user_id);

-- Reminders policies
create policy "Users can view their own reminders"
    on reminders for select
    using (auth.uid() = user_id);

create policy "Users can insert their own reminders"
    on reminders for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own reminders"
    on reminders for update
    using (auth.uid() = user_id);

create policy "Users can delete their own reminders"
    on reminders for delete
    using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists categories_user_id_idx on categories(user_id);
create index if not exists transactions_user_id_idx on transactions(user_id);
create index if not exists transactions_category_id_idx on transactions(category_id);
create index if not exists transactions_date_idx on transactions(date);
create index if not exists reminders_user_id_idx on reminders(user_id);
create index if not exists reminders_transaction_id_idx on reminders(transaction_id); 