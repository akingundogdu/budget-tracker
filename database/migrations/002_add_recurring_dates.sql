-- Add start_date and end_date columns to transactions table for recurring transactions
alter table if exists public.transactions
add column if not exists recurring_start_date timestamp with time zone,
add column if not exists recurring_end_date timestamp with time zone;

-- Add check constraint to ensure end_date is after start_date
alter table if exists public.transactions
add constraint recurring_dates_check 
check (recurring_end_date is null or recurring_start_date is null or recurring_end_date >= recurring_start_date);

-- Add indexes for better performance when querying recurring transactions
create index if not exists transactions_recurring_start_date_idx on transactions(recurring_start_date);
create index if not exists transactions_recurring_end_date_idx on transactions(recurring_end_date);

-- Add comments to explain the columns
comment on column public.transactions.recurring_start_date is 'Start date for recurring transactions';
comment on column public.transactions.recurring_end_date is 'End date for recurring transactions'; 