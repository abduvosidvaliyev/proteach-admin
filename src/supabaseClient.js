
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tyvwmmygayysravdtnbs.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dndtbXlnYXl5c3JhdmR0bmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMDczMzksImV4cCI6MjA3NjU4MzMzOX0.576bFnoZzjJ_3C-XvMxXspbgL1yiEXUQ1XJBolQduhM"
export const supabase = createClient(supabaseUrl, supabaseKey)
