
-- Add unique constraint to prevent duplicate email queue entries
ALTER TABLE welcome_emails_queue 
ADD CONSTRAINT welcome_emails_queue_user_id_key UNIQUE (user_id);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_welcome_emails_queue_sent_at 
ON welcome_emails_queue(sent_at) 
WHERE sent_at IS NULL;
