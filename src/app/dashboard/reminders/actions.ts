'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createReminder(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const reminder_date = formData.get('reminder_date') as string
  const reminder_time = formData.get('reminder_time') as string || null
  const priority = formData.get('priority') as string || 'medium'
  const repeat_type = formData.get('repeat_type') as string || 'none'

  const { error } = await supabase
    .from('reminders')
    .insert({
      user_id: user.id,
      title,
      description,
      reminder_date,
      reminder_time,
      priority,
      repeat_type
    })

  if (error) {
    console.error('Error creating reminder:', error)
    throw new Error('Failed to create reminder')
  }

  revalidatePath('/dashboard/reminders')
  revalidatePath('/dashboard/calendar')
}

export async function toggleReminderStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('reminders')
    .update({ completed: !currentStatus })
    .eq('id', id)

  if (error) {
    console.error('Error updating reminder:', error)
    throw new Error('Failed to update reminder')
  }

  revalidatePath('/dashboard/reminders')
}

export async function deleteReminder(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting reminder:', error)
    throw new Error('Failed to delete reminder')
  }

  revalidatePath('/dashboard/reminders')
  revalidatePath('/dashboard/calendar')
}
