import { supabase } from '@/integrations/supabase/client';

async function populateBooks() {
  console.log('Calling populate-personal-development function...');
  
  const { data, error } = await supabase.functions.invoke('populate-personal-development');
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
}

// Auto-execute
populateBooks();
