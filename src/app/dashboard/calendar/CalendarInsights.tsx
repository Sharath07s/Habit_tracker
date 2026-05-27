'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, ListTodo, AlertCircle, TrendingUp, CalendarDays } from 'lucide-react'
import { Reminder } from './useCalendarData'
import { subDays, format, isSameDay } from 'date-fns'

type CalendarInsightsProps = {
  analytics: {
    tasksToday: number
    completedToday: number
    upcomingReminders: number
    overdueReminders: number
    weeklyScore: number
    completionRate: number
  }
  reminders: Reminder[]
  habitLogs?: { completed_date: string }[]
  focusSessions?: { started_at: string }[]
  dailyTasks?: { task_date: string; completed: boolean }[]
}

export function CalendarInsights({ 
  analytics, 
  reminders,
  habitLogs = [],
  focusSessions = [],
  dailyTasks = []
}: CalendarInsightsProps) {
  const today = new Date()
  const last30Days = Array.from({ length: 30 }).map((_, idx) => subDays(today, 29 - idx)).reverse()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      
      {/* Metric Cards */}
      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <ListTodo className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-medium uppercase tracking-wider">Tasks Today</span>
        </div>
        <div className="text-2xl font-bold">{analytics.completedToday} <span className="text-muted-foreground text-base font-normal">/ {analytics.tasksToday}</span></div>
        <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${analytics.completionRate}%` }}
            className="h-full bg-blue-500"
          />
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-xs font-medium uppercase tracking-wider">Weekly Score</span>
        </div>
        <div className="text-2xl font-bold">{analytics.weeklyScore}%</div>
        <p className="text-xs text-muted-foreground mt-2">Consistency this week</p>
      </div>

      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <CalendarDays className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-medium uppercase tracking-wider">Upcoming</span>
        </div>
        <div className="text-2xl font-bold">{analytics.upcomingReminders}</div>
        <p className="text-xs text-muted-foreground mt-2">Future scheduled</p>
      </div>

      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-red-500/10 p-4 flex flex-col justify-between">
        <div className="flex items-center gap-2 text-red-400/80 mb-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Overdue</span>
        </div>
        <div className="text-2xl font-bold text-red-400">{analytics.overdueReminders}</div>
        <p className="text-xs text-red-400/60 mt-2">Requires attention</p>
      </div>

      {/* Mini Heatmap */}
      <div className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/5 p-4 hidden lg:flex flex-col justify-between relative overflow-visible">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider">30-Day Activity</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-[3px] mt-2 relative">
          {last30Days.map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd')
            
            const completedHabits = habitLogs.filter(l => l.completed_date === dateStr).length
            const completedReminders = reminders.filter(r => r.reminder_date === dateStr && r.completed).length
            const completedTasks = dailyTasks.filter(t => t.task_date === dateStr && t.completed).length
            const dayFocusSessions = focusSessions.filter(s => s.started_at.startsWith(dateStr))
            
            const numFocusSessions = dayFocusSessions.length
            const totalActions = completedHabits + completedReminders + completedTasks + numFocusSessions
            const points = completedHabits + completedReminders + completedTasks + (numFocusSessions * 2)

            let intensityClass = 'bg-white/5'
            if (points > 0 && points <= 2) intensityClass = 'bg-primary/40'
            else if (points > 2 && points <= 5) intensityClass = 'bg-primary/70 shadow-[0_0_6px_rgba(var(--primary),0.3)]'
            else if (points > 5) intensityClass = 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.6)]'

            const isToday = isSameDay(date, today)
            const todayClass = isToday ? 'ring-2 ring-primary ring-offset-1 ring-offset-background animate-pulse z-10' : ''

            return (
              <div key={dateStr} className="relative group">
                <div 
                  className={`w-[11px] h-[11px] rounded-[2px] transition-all duration-300 hover:ring-1 hover:ring-primary/80 cursor-pointer ${intensityClass} ${todayClass}`}
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[180px] pointer-events-none opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-[100]">
                  <div className="bg-zinc-900 border border-white/10 rounded-lg shadow-xl p-3 text-xs text-zinc-300 relative">
                    <div className="font-semibold text-white mb-2 pb-1 border-b border-white/10 flex justify-between items-center">
                      <span>{format(date, 'MMM d, yyyy')}</span>
                      {isToday && <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">TODAY</span>}
                    </div>
                    {totalActions === 0 ? (
                      <span className="text-zinc-500 italic block text-center py-1">No activity recorded.</span>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <div className="text-white font-medium mb-1">{totalActions} productivity action{totalActions !== 1 && 's'}</div>
                        {completedHabits > 0 && <div className="flex justify-between items-center"><span className="text-zinc-400">Habits</span><span className="font-mono text-white bg-white/10 px-1 rounded">{completedHabits}</span></div>}
                        {completedReminders > 0 && <div className="flex justify-between items-center"><span className="text-zinc-400">Reminders</span><span className="font-mono text-white bg-white/10 px-1 rounded">{completedReminders}</span></div>}
                        {completedTasks > 0 && <div className="flex justify-between items-center"><span className="text-zinc-400">Tasks</span><span className="font-mono text-white bg-white/10 px-1 rounded">{completedTasks}</span></div>}
                        {numFocusSessions > 0 && <div className="flex justify-between items-center"><span className="text-zinc-400">Focus</span><span className="font-mono text-white bg-white/10 px-1 rounded">{numFocusSessions}</span></div>}
                      </div>
                    )}
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
