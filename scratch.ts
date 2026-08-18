import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function test() {
  const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
    email: 'test@example.com', // I don't know the password
    password: 'password123'
  })
  
  // if no user, we can't test RLS easily without one, but let's just see if we can get habits
  const { data: habits, error } = await supabase.from('habits').select('*')
  console.log('Habits:', habits, error)
}

test()
