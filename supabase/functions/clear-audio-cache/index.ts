import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('🗑️ Starting audio cache cleanup...')

    // List all files in the book-audio bucket
    const { data: files, error: listError } = await supabase
      .storage
      .from('book-audio')
      .list()

    if (listError) {
      console.error('Error listing files:', listError)
      throw listError
    }

    console.log(`📋 Found ${files?.length || 0} folders to process`)

    let totalDeleted = 0

    // Process each folder (each folder is a summary_id)
    if (files && files.length > 0) {
      for (const folder of files) {
        if (folder.name) {
          // List files in each folder
          const { data: audioFiles, error: folderError } = await supabase
            .storage
            .from('book-audio')
            .list(folder.name)

          if (folderError) {
            console.error(`Error listing files in ${folder.name}:`, folderError)
            continue
          }

          if (audioFiles && audioFiles.length > 0) {
            // Delete all files in this folder
            const filePaths = audioFiles.map(file => `${folder.name}/${file.name}`)
            
            const { error: deleteError } = await supabase
              .storage
              .from('book-audio')
              .remove(filePaths)

            if (deleteError) {
              console.error(`Error deleting files in ${folder.name}:`, deleteError)
            } else {
              totalDeleted += filePaths.length
              console.log(`✅ Deleted ${filePaths.length} files from ${folder.name}`)
            }
          }
        }
      }
    }

    console.log(`🎉 Audio cache cleanup complete! Deleted ${totalDeleted} files`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully deleted ${totalDeleted} cached audio files`,
        totalDeleted 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in clear-audio-cache:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})