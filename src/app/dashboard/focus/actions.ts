'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function logFocusSession(duration: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('focus_sessions').insert({
    user_id: user.id,
    duration, // duration in seconds
    completed: true,
  })

  if (error) throw new Error('Failed to log focus session')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/focus')
}
