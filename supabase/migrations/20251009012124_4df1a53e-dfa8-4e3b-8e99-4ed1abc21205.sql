-- Deactivate books with invalid titles
UPDATE books 
SET is_active = false 
WHERE title IS NULL 
   OR title = '' 
   OR title = 'Unknown Title' 
   OR title = 'Unknown';