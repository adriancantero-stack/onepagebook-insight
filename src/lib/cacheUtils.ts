import { supabase } from "@/integrations/supabase/client";

/**
 * Normalizes text by removing accents, converting to lowercase, and removing extra spaces
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}

/**
 * Creates a cache key from book title, author, and language
 */
export function createCacheKey(title: string, author: string, lang: string): string {
  const normalizedTitle = normalizeText(title);
  const normalizedAuthor = normalizeText(author);
  return `${normalizedTitle}|${normalizedAuthor}|${lang}`;
}

/**
 * Checks if a summary exists in cache
 */
export async function getCachedSummary(title: string, author: string, lang: string) {
  const cacheKey = createCacheKey(title, author, lang);
  
  console.log('🔍 [Cache] Looking for summary with key:', cacheKey);
  
  const { data, error } = await supabase
    .from('book_summaries')
    .select('*')
    .eq('norm_key', cacheKey)
    .maybeSingle();

  if (error) {
    console.error('🚨 [Cache] Error checking cache:', error);
    return null;
  }

  if (data) {
    console.log('✅ [Cache] Found cached summary:', data.id);
  } else {
    console.log('❌ [Cache] No cached summary found');
  }

  return data;
}

/**
 * Saves a summary with cache key
 */
export async function saveSummaryWithCache(summaryData: any, title: string, author: string, lang: string) {
  const cacheKey = createCacheKey(title, author, lang);
  
  console.log('💾 [Cache] Saving summary with key:', cacheKey);
  
  const { data, error } = await supabase
    .from('book_summaries')
    .insert({
      ...summaryData,
      norm_key: cacheKey,
    })
    .select()
    .single();

  if (error) {
    console.error('🚨 [Cache] Error saving summary:', error);
    throw error;
  }

  console.log('✅ [Cache] Summary saved:', data.id);
  return data;
}

/**
 * Updates existing summary with cache key
 */
export async function updateSummaryCache(summaryId: string, title: string, author: string, lang: string) {
  const cacheKey = createCacheKey(title, author, lang);
  
  console.log('🔄 [Cache] Updating summary cache key:', cacheKey);
  
  const { error } = await supabase
    .from('book_summaries')
    .update({ norm_key: cacheKey })
    .eq('id', summaryId);

  if (error) {
    console.error('🚨 [Cache] Error updating cache key:', error);
    throw error;
  }

  console.log('✅ [Cache] Cache key updated');
}

/**
 * Gets cached audio for a summary
 */
export async function getCachedAudio(summaryId: string, lang: string) {
  console.log('🔍 [Cache] Looking for audio:', { summaryId, lang });
  
  const { data, error } = await supabase
    .from('book_audio')
    .select('*')
    .eq('book_summary_id', summaryId)
    .eq('language', lang)
    .maybeSingle();

  if (error) {
    console.error('🚨 [Cache] Error checking audio cache:', error);
    return null;
  }

  if (data) {
    console.log('✅ [Cache] Found cached audio:', data.audio_url);
    
    // Get signed URL for the audio file
    const { data: urlData } = await supabase.storage
      .from('book-audio')
      .createSignedUrl(data.audio_url, 3600); // 1 hour expiry

    if (urlData?.signedUrl) {
      return {
        ...data,
        signedUrl: urlData.signedUrl
      };
    }
  } else {
    console.log('❌ [Cache] No cached audio found');
  }

  return null;
}

/**
 * Saves audio to storage and cache
 */
export async function saveAudioToCache(
  summaryId: string,
  lang: string,
  audioChunks: string[],
  mimeType: string = 'audio/mpeg'
) {
  console.log('💾 [Cache] Saving audio to storage...');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Combine all chunks into one blob
  const audioBlobs = audioChunks.map(chunk =>
    new Blob(
      [Uint8Array.from(atob(chunk), c => c.charCodeAt(0))],
      { type: mimeType }
    )
  );

  const combinedBlob = new Blob(audioBlobs, { type: mimeType });
  const fileSize = combinedBlob.size;
  
  // Generate file path: user_id/summary_id_lang.mp3
  const filePath = `${user.id}/${summaryId}_${lang}.mp3`;
  
  console.log('📤 [Cache] Uploading audio file:', filePath, 'Size:', fileSize);

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('book-audio')
    .upload(filePath, combinedBlob, {
      contentType: mimeType,
      upsert: true
    });

  if (uploadError) {
    console.error('🚨 [Cache] Error uploading audio:', uploadError);
    throw uploadError;
  }

  console.log('✅ [Cache] Audio uploaded, saving to database...');

  // Save reference in database
  const { data, error } = await supabase
    .from('book_audio')
    .insert({
      book_summary_id: summaryId,
      language: lang,
      audio_url: filePath,
      file_size: fileSize,
    })
    .select()
    .single();

  if (error) {
    console.error('🚨 [Cache] Error saving audio reference:', error);
    throw error;
  }

  console.log('✅ [Cache] Audio cached successfully');
  return data;
}
