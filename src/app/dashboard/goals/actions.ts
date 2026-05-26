'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createGoal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const target = parseInt(formData.get('target') as string, 10)

  const { error } = await supabase.from('goals').insert({
    user_id: user.id,
    title,
    target,
    progress: 0,
  })

  if (error) throw new Error('Failed to create goal')
  revalidatePath('/dashboard/goals')
}

export async function updateGoalProgress(goalId: string, progress: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('goals')
    .update({ progress })
    .eq('id', goalId)

  if (error) throw new Error('Failed to update progress')
  revalidatePath('/dashboard/goals')
}

export async function deleteGoal(goalId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('goals').delete().eq('id', goalId)
  
  if (error) throw new Error('Failed to delete goal')
  revalidatePath('/dashboard/goals')
}
