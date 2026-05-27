import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { HabitList } from './HabitList'

export default async function HabitsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  
  const { data: habits, error: habitsError } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: true })

  if (habitsError) {
    console.error('Error fetching habits:', { message: habitsError.message, code: habitsError.code })
  }

  // Only fetch logs for the past 7 days roughly, but for now we'll fetch all or limit
  // A better approach is to filter by date in the query.
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 7)
  const dateStr = sevenDaysAgo.toISOString().split('T')[0]

  const { data: logs, error: logsError } = await supabase
    .from('habit_logs')
    .select('*')
    .gte('completed_date', dateStr)

  if (logsError) {
    console.error('Error fetching habit logs:', { message: logsError.message, code: logsError.code })
  }

  const todayStr = today.toISOString().split('T')[0]
  const { data: reminders, error: remindersError } = await supabase
    .from('reminders')
    .select('*')
    .eq('reminder_date', todayStr)
    .order('reminder_time', { ascending: true })

  if (remindersError) {
    console.error('Error fetching reminders:', { message: remindersError.message, code: remindersError.code })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <HabitList habits={habits || []} logs={logs || []} reminders={reminders || []} />
    </div>
  )
}
