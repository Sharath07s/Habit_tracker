'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateStudyGoal(minutes: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.auth.updateUser({
    data: { daily_study_goal: minutes }
  })

  if (error) {
    console.error('Error updating study goal:', error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
}
