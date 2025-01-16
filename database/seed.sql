-- First, create a test user in auth.users
INSERT INTO auth.users (id, email)
VALUES ('d0d54e51-cc10-4a05-9273-2af0b6a6d998', 'test@example.com')
ON CONFLICT (id) DO NOTHING;

-- Insert default categories with the test user ID
INSERT INTO categories (user_id, name, color, icon) VALUES
    ('d0d54e51-cc10-4a05-9273-2af0b6a6d998', 'Groceries', '#4CAF50', 'shopping-cart'),
    ('d0d54e51-cc10-4a05-9273-2af0b6a6d998', 'Transportation', '#2196F3', 'car'),
    ('d0d54e51-cc10-4a05-9273-2af0b6a6d998', 'Entertainment', '#9C27B0', 'movie'),
    ('d0d54e51-cc10-4a05-9273-2af0b6a6d998', 'Utilities', '#FF9800', 'bolt'),
    ('d0d54e51-cc10-4a05-9273-2af0b6a6d998', 'Rent', '#795548', 'home'),
    ('d0d54e51-cc10-4a05-9273-2af0b6a6d998', 'Salary', '#66BB6A', 'wallet'),
    ('d0d54e51-cc10-4a05-9273-2af0b6a6d998', 'Freelance', '#26A69A', 'laptop'),
    ('d0d54e51-cc10-4a05-9273-2af0b6a6d998', 'Dining Out', '#EF5350', 'restaurant'),
    ('d0d54e51-cc10-4a05-9273-2af0b6a6d998', 'Healthcare', '#EC407A', 'medical-services'),
    ('d0d54e51-cc10-4a05-9273-2af0b6a6d998', 'Shopping', '#AB47BC', 'shopping-bag');

-- Insert sample transactions with the test user ID
WITH cat AS (SELECT id, name FROM categories WHERE user_id = 'd0d54e51-cc10-4a05-9273-2af0b6a6d998')
INSERT INTO transactions (user_id, category_id, amount, type, description, date)
SELECT
    'd0d54e51-cc10-4a05-9273-2af0b6a6d998',
    cat.id,
    CASE 
        WHEN cat.name IN ('Salary', 'Freelance') THEN 
            (random() * 3000 + 2000)::decimal(12,2)
        ELSE 
            (random() * 200 + 10)::decimal(12,2)
    END,
    CASE 
        WHEN cat.name IN ('Salary', 'Freelance') THEN 'income'
        ELSE 'expense'
    END,
    CASE cat.name
        WHEN 'Groceries' THEN 'Weekly grocery shopping'
        WHEN 'Transportation' THEN 'Monthly transit pass'
        WHEN 'Entertainment' THEN 'Movie night'
        WHEN 'Utilities' THEN 'Electricity bill'
        WHEN 'Rent' THEN 'Monthly rent'
        WHEN 'Salary' THEN 'Monthly salary'
        WHEN 'Freelance' THEN 'Web development project'
        WHEN 'Dining Out' THEN 'Lunch with colleagues'
        WHEN 'Healthcare' THEN 'Doctor appointment'
        WHEN 'Shopping' THEN 'New clothes'
    END,
    timezone('utc', now()) - (random() * interval '30 days')
FROM cat;

-- Insert some recurring reminders with the test user ID
WITH trans AS (SELECT id FROM transactions WHERE user_id = 'd0d54e51-cc10-4a05-9273-2af0b6a6d998' LIMIT 3)
INSERT INTO reminders (user_id, transaction_id, reminder_date, description, is_recurring, recurrence_pattern)
SELECT
    'd0d54e51-cc10-4a05-9273-2af0b6a6d998',
    trans.id,
    timezone('utc', now()) + interval '1 month',
    'Monthly payment reminder',
    true,
    'monthly'
FROM trans; 