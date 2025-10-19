// Script para testar o envio de lembretes manualmente
// Execute este comando no terminal: 
// npx supabase functions invoke send-daily-reminders

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🚀 Invocando função send-daily-reminders...')

const { data, error } = await supabase.functions.invoke('send-daily-reminders', {
  body: {}
})

if (error) {
  console.error('❌ Erro:', error)
} else {
  console.log('✅ Resultado:', data)
}
