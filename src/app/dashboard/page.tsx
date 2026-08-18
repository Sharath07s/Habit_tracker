import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from './DashboardClient'
import { subDays, format } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch Reminders
  const { data: reminders, error: remError } = await supabase.from('reminders').select('*')
  if (remError) console.error('Dashboard Reminders Error:', { message: remError.message })

  // Fetch Focus Sessions
  const { data: focusSessions, error: sessError } = await supabase.from('focus_sessions').select('*').eq('completed', true)
  if (sessError) console.error('Dashboard Sessions Error:', { message: sessError.message })

  // Fetch Habits
  const { data: habits, error: habError } = await supabase.from('habits').select('*')
  if (habError) console.error('Dashboard Habits Error:', { message: habError.message })

  // Fetch Habit Logs
  const { data: habitLogs, error: logsError } = await supabase.from('habit_logs').select('*')
  if (logsError) console.error('Dashboard Habit Logs Error:', { message: logsError.message })

  // Fetch Goals
  const { data: goals, error: goalError } = await supabase.from('goals').select('*')
  if (goalError) console.error('Dashboard Goals Error:', { message: goalError.message })

  // Fetch Daily Tasks
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const { data: todayTasks, error: tasksError } = await supabase
    .from('daily_tasks')
    .select('*')
    .eq('task_date', todayStr)
  if (tasksError) console.error('Dashboard Tasks Error:', { message: tasksError.message })

  // Fetch past tasks for trends (7 days)
  const last7DaysStr = format(subDays(new Date(), 6), 'yyyy-MM-dd')
  const { data: pastTasks, error: pastTasksError } = await supabase
    .from('daily_tasks')
    .select('*')
    .gte('task_date', last7DaysStr)
  if (pastTasksError) console.error('Dashboard Past Tasks Error:', { message: pastTasksError.message })

  return (
    <div className="max-w-[1400px] mx-auto">
      <DashboardClient 
        initialReminders={reminders || []}
        initialFocusSessions={focusSessions || []}
        initialHabits={habits || []}
        initialHabitLogs={habitLogs || []}
        initialGoals={goals || []}
        initialTasks={todayTasks || []}
        pastTasks={pastTasks || []}
        studyGoalMinutes={user.user_metadata?.daily_study_goal || 0}
      />
    </div>
  )
}
