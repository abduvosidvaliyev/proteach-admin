
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zigutmfvscprwnrrqfwc.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZ3V0bWZ2c2NwcnducnJxZndjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNDU2MjYsImV4cCI6MjA2NzcyMTYyNn0.Se7v7A0pf5kz_V2wFxD6tPSnqvJxjlLWCZBQfIVMcBI"
export const supabase = createClient(supabaseUrl, supabaseKey)