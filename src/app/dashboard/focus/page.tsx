import { FocusTimer } from './FocusTimer'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function FocusPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }
  
  // Fetch stats (simplified)
  const { data: sessions, error } = await supabase
    .from('focus_sessions')
    .select('duration')
    .eq('completed', true)
    
  if (error) {
    console.error('Error fetching focus sessions:', { message: error.message, code: error.code })
  }
    
  const totalSeconds = sessions?.reduce((acc, session) => acc + session.duration, 0) || 0
  const totalHours = (totalSeconds / 3600).toFixed(1)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Focus Timer</h1>
        <p className="text-muted-foreground">Distraction-free environment for deep work.</p>
      </div>
      
      <FocusTimer />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mt-8">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Focus Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalHours}h</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{sessions?.length || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
