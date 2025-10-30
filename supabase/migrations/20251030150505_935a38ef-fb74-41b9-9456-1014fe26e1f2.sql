-- Add processing_at column for optimistic locking
ALTER TABLE welcome_emails_queue 
ADD COLUMN processing_at TIMESTAMPTZ;

-- Add index for efficient pending queries
CREATE INDEX IF NOT EXISTS idx_welcome_emails_queue_processing 
ON welcome_emails_queue(processing_at, sent_at) 
WHERE sent_at IS NULL;

-- Add index for recent sent emails check (for duplicate prevention)
CREATE INDEX IF NOT EXISTS idx_welcome_emails_queue_user_sent 
ON welcome_emails_queue(user_id, sent_at DESC) 
WHERE sent_at IS NOT NULL;