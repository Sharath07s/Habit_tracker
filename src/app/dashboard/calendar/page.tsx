import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CalendarComponent } from './CalendarComponent'

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

  // Transform reminders to calendar events
  const events = (reminders || []).map((reminder) => {
    let start = reminder.reminder_date
    if (reminder.reminder_time) {
      start = `${reminder.reminder_date}T${reminder.reminder_time}`
    }

    return {
      id: reminder.id,
      title: reminder.title,
      start,
      allDay: !reminder.reminder_time,
      backgroundColor: reminder.completed ? 'hsl(var(--muted))' :
                       reminder.priority === 'urgent' ? '#ef4444' :
                       reminder.priority === 'high' ? '#f97316' : 
                       '#3b82f6',
    }
  })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">View your reminders and schedule.</p>
      </div>
      
      <CalendarComponent events={events} />
    </div>
  )
}
