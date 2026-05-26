import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AnalyticsCharts } from './AnalyticsCharts'
import { TodayTasksWidget } from './TodayTasksWidget'
import { format, subDays } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch Reminders
  const { data: reminders, error: remError } = await supabase.from('reminders').select('*')
  if (remError) console.error('Dashboard Reminders Error:', { message: remError.message, code: remError.code })
  const completedReminders = reminders?.filter(r => r.completed).length || 0
  const pendingReminders = reminders?.filter(r => !r.completed).length || 0

  // Fetch Focus Sessions
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i)
    return {
      dateObj: d,
      name: format(d, 'EEE'),
      dateStr: format(d, 'yyyy-MM-dd')
    }
  })

  const { data: sessions, error: sessError } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('completed', true)
  
  if (sessError) console.error('Dashboard Sessions Error:', { message: sessError.message, code: sessError.code })
    
  const focusData = last7Days.map(day => {
    const daySessions = sessions?.filter(s => s.started_at.startsWith(day.dateStr)) || []
    const totalSeconds = daySessions.reduce((acc, s) => acc + s.duration, 0)
    return {
      name: day.name,
      hours: Number((totalSeconds / 3600).toFixed(1))
    }
  })

  const totalFocusSeconds = sessions?.reduce((acc, s) => acc + s.duration, 0) || 0
  const totalFocusHours = (totalFocusSeconds / 3600).toFixed(1)

  // Fetch Habits
  const { count: habitsCount, error: habError } = await supabase.from('habits').select('*', { count: 'exact', head: true })
  if (habError) console.error('Dashboard Habits Error:', { message: habError.message, code: habError.code })

  // Fetch Goals
  const { data: goals, error: goalError } = await supabase.from('goals').select('*')
  if (goalError) console.error('Dashboard Goals Error:', { message: goalError.message, code: goalError.code })
  let goalsProgress = 0
  if (goals && goals.length > 0) {
    const totalProgress = goals.reduce((acc, g) => acc + Math.min(100, (g.progress / g.target) * 100), 0)
    goalsProgress = Math.round(totalProgress / goals.length)
  }

  // Fetch Today Tasks
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const { data: todayTasks, error: tasksError } = await supabase
    .from('daily_tasks')
    .select('*')
    .eq('task_date', todayStr)
    
  if (tasksError) console.error('Dashboard Tasks Error:', { message: tasksError.message, code: tasksError.code })

  // Fetch Past 7 Days Tasks for Analytics
  const { data: pastTasks, error: pastTasksError } = await supabase
    .from('daily_tasks')
    .select('*')
    .gte('task_date', last7Days[0].dateStr)
    .lte('task_date', last7Days[6].dateStr)

  if (pastTasksError) console.error('Dashboard Past Tasks Error:', { message: pastTasksError.message, code: pastTasksError.code })

  const taskTrendData = last7Days.map(day => {
    const dayTasks = pastTasks?.filter(t => t.task_date === day.dateStr) || []
    const total = dayTasks.length
    const completed = dayTasks.filter(t => t.completed).length
    const completionPct = total === 0 ? 0 : Math.round((completed / total) * 100)
    return {
      name: day.name,
      completion: completionPct
    }
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFocusHours}h</div>
            <p className="text-xs text-muted-foreground">
              Total lifetime focus
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{habitsCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently tracking
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalsProgress}%</div>
            <p className="text-xs text-muted-foreground">
              Overall completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReminders}</div>
            <p className="text-xs text-muted-foreground">
              Pending tasks
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 mt-4">
        <div className="lg:col-span-1">
          <TodayTasksWidget initialTasks={todayTasks || []} />
        </div>
        <div className="lg:col-span-2">
          <AnalyticsCharts 
            focusData={focusData} 
            reminderStats={{ completed: completedReminders, pending: pendingReminders }} 
            taskTrendData={taskTrendData}
          />
        </div>
      </div>
    </div>
  )
}
