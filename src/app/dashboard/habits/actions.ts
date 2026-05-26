'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

export async function createHabit(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const name = formData.get('name') as string
  const color = formData.get('color') as string || '#3b82f6'

  const { error } = await supabase.from('habits').insert({
    user_id: user.id,
    name,
    color,
  })

  if (error) throw new Error('Failed to create habit')
  revalidatePath('/dashboard/habits')
}

export async function toggleHabitLog(habitId: string, date: Date, currentStatus: boolean) {
  const supabase = await createClient()
  const dateStr = format(date, 'yyyy-MM-dd')

  if (currentStatus) {
    // Delete log
    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('habit_id', habitId)
      .eq('completed_date', dateStr)

    if (error) throw new Error('Failed to update habit log')
  } else {
    // Insert log
    const { error } = await supabase
      .from('habit_logs')
      .insert({
        habit_id: habitId,
        completed_date: dateStr,
        completed: true
      })

    if (error) throw new Error('Failed to update habit log')
  }

  // Basic streak update logic would go here, 
  // but for simplicity, we rely on aggregating the logs on the client or via a cron/view.

  revalidatePath('/dashboard/habits')
}

export async function deleteHabit(habitId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('habits').delete().eq('id', habitId)
  
  if (error) throw new Error('Failed to delete habit')
  revalidatePath('/dashboard/habits')
}
