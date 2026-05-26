import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreateGoalForm } from './CreateGoalForm'
import { GoalList } from './GoalList'

export default async function GoalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  
  const { data: goals, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching goals:', { message: error.message, code: error.code })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground">Set targets and track your progress.</p>
        </div>
        <CreateGoalForm />
      </div>
      
      <GoalList goals={goals || []} />
    </div>
  )
}
