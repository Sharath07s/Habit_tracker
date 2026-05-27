import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CalendarDashboard } from './CalendarDashboard'

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  
  // Fetch reminders
  const { data: reminders, error } = await supabase
    .from('reminders')
    .select('*')

  // Fetch habit logs
  const { data: habitLogs } = await supabase.from('habit_logs').select('*')
  
  // Fetch focus sessions
  const { data: focusSessions } = await supabase.from('focus_sessions').select('*').eq('completed', true)
  
  // Fetch daily tasks
  const { data: dailyTasks } = await supabase.from('daily_tasks').select('*').eq('completed', true)

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 text-red-500 rounded-md border border-red-500/20 max-w-5xl mx-auto mt-6">
        <h2 className="font-bold text-lg mb-2">Database Error Detected</h2>
        <p><strong>Message:</strong> {error.message}</p>
        <p><strong>Code:</strong> {error.code}</p>
        <p className="mt-4 text-sm opacity-80">
          Please run the SQL grant commands in your Supabase SQL Editor as provided in the implementation plan to fix permission issues.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <CalendarDashboard 
        initialReminders={reminders || []} 
        habitLogs={habitLogs || []}
        focusSessions={focusSessions || []}
        dailyTasks={dailyTasks || []}
      />
    </div>
  )
}
