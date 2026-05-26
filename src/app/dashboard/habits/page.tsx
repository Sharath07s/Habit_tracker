import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreateHabitForm } from './CreateHabitForm'
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habit Tracker</h1>
          <p className="text-muted-foreground">Build consistency with daily habits.</p>
        </div>
        <CreateHabitForm />
      </div>
      
      <HabitList habits={habits || []} logs={logs || []} />
    </div>
  )
}
