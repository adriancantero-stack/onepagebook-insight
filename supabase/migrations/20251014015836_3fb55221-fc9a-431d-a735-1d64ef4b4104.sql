-- Remove avatar URLs to show initials instead
UPDATE people_picks 
SET avatar_url = NULL
WHERE person_id IN ('sam-altman', 'tim-cook', 'warren-buffett');