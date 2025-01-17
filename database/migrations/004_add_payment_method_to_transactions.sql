-- Add payment_method column to transactions table
ALTER TABLE transactions
ADD COLUMN payment_method VARCHAR(20) DEFAULT 'cash' NOT NULL;

-- Add check constraint to ensure only valid payment methods are inserted
ALTER TABLE transactions
ADD CONSTRAINT check_payment_method 
CHECK (payment_method IN ('credit_card', 'bank', 'cash')); 