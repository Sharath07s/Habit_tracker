import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreateReminderForm } from './CreateReminderForm'
import { ReminderList } from './ReminderList'

export default async function RemindersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  
  const { data: reminders, error } = await supabase
    .from('reminders')
    .select('*')
    .order('reminder_date', { ascending: true })
    .order('reminder_time', { ascending: true })

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 text-red-500 rounded-md border border-red-500/20">
        <h2 className="font-bold text-lg mb-2">Database Error Detected</h2>
        <p><strong>Message:</strong> {error.message}</p>
        <p><strong>Code:</strong> {error.code}</p>
        <p className="mt-4 text-sm opacity-80">
          If the code is 42501 (Permission Denied), please ensure you have run the SQL grant commands in your Supabase SQL Editor as provided in the implementation plan.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
          <p className="text-muted-foreground">Manage your tasks and upcoming events.</p>
        </div>
        <CreateReminderForm />
      </div>
      
      <ReminderList reminders={reminders || []} />
    </div>
  )
}
