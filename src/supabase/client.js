import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dzqfyytyujlscgqnusbw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6cWZ5eXR5dWpsc2NncW51c2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3OTcyNzEsImV4cCI6MjA3OTM3MzI3MX0.mqwYmXiL0AcVaA6zDHzncIt3qk5h38w2L2ZHX9jguds'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
