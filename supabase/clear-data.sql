-- Clear all data from tables (but keep the schema)
-- Run this in your Supabase SQL Editor to reset the database

-- Delete all data (in correct order to respect foreign keys if any)
DELETE FROM notifications;
DELETE FROM campaigns;
DELETE FROM segments;
DELETE FROM contacts;
DELETE FROM users;

-- Reset sequences if any
-- Note: UUIDs don't use sequences, so no reset needed

-- Optional: Reset updated_at triggers by ensuring they're still active
-- The triggers remain in place, just clearing the data

