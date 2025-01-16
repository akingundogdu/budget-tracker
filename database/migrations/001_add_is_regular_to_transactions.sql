-- Add is_regular and period columns to transactions table
alter table if exists public.transactions
add column if not exists is_regular boolean default false,
add column if not exists regular_period varchar(20) check (regular_period in ('weekly', 'monthly', 'quarterly', 'yearly'));

-- Update existing transactions to have is_regular as false and period as null
update public.transactions
set is_regular = false,
    regular_period = null
where is_regular is null;

-- Create indexes for better performance when querying regular expenses
create index if not exists transactions_is_regular_idx on transactions(is_regular);
create index if not exists transactions_regular_period_idx on transactions(regular_period);

-- Add comments to explain the columns
comment on column public.transactions.is_regular is 'Indicates if this is a regular expense';
comment on column public.transactions.regular_period is 'Period of the regular expense: weekly, monthly, quarterly, yearly'; 