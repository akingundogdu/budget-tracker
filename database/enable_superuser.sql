-- Enable superuser access to insert test user
BEGIN;
  SET LOCAL ROLE postgres;
  
  -- Run your seed.sql contents here
  
COMMIT; 