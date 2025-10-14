-- Update avatar URLs for the three people
UPDATE people_picks 
SET avatar_url = '/people/sam-altman.jpg'
WHERE person_id = 'sam-altman';

UPDATE people_picks 
SET avatar_url = '/people/tim-cook.jpg'
WHERE person_id = 'tim-cook';

UPDATE people_picks 
SET avatar_url = '/people/warren-buffett.jpg'
WHERE person_id = 'warren-buffett';