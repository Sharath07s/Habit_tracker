'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Habit, HabitLog, HabitMeta } from './useHabitsData'
import { format, isSameDay, subDays, isAfter } from 'date-fns'
import { toggleHabitLog, deleteHabit } from './actions'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Flame, AlertCircle, TrendingUp, CheckCircle, ChevronDown, Lock } from 'lucide-react'

type HabitCardProps = {
  habit: Habit
  logs: HabitLog[]
  meta?: HabitMeta
  insights: {
    consistency: number
    status: string
    message: string
    last30Completions: number
  }
  onToggleLog: (habitId: string, dateStr: string, currentStatus: boolean) => void
}

export function HabitCard({ habit, logs, meta, insights, onToggleLog }: HabitCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const today = new Date()

  // Last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(today, 6 - i))
  const last14Days = Array.from({ length: 14 }).map((_, i) => subDays(today, 13 - i))

  const handleToggle = (date: Date, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation()
    const dateStr = format(date, 'yyyy-MM-dd')
    
    // Optimistic UI update
    onToggleLog(habit.id, dateStr, currentStatus)

    startTransition(async () => {
      try {
        await toggleHabitLog(habit.id, date, currentStatus)
      } catch {
        toast.error('Failed to update habit')
        // Revert on error
        onToggleLog(habit.id, dateStr, !currentStatus)
      }
    })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this habit?')) {
      startTransition(async () => {
        try {
          await deleteHabit(habit.id)
          toast.success('Habit deleted')
        } catch {
          toast.error('Failed to delete habit')
        }
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent Consistency': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'Needs Attention': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'Falling Behind': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20' // On Track
    }
  }

  const completedThisWeek = last7Days.filter(d => 
    logs.some(l => l.habit_id === habit.id && l.completed_date === format(d, 'yyyy-MM-dd'))
  ).length

  return (
    <motion.div
      layout
      className="mb-4"
    >
      <Card 
        className="overflow-hidden bg-black/20 backdrop-blur-md border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:border-white/20 transition-all cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardContent className="p-0">
          
          {/* Top Section */}
          <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: habit.color }} />
            
            <div className="flex items-center gap-4 relative z-10">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${habit.color}20`, border: `1px solid ${habit.color}40` }}
              >
                <div className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: habit.color, color: habit.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{habit.name}</h3>
                  {meta?.priority && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      meta.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                      meta.priority === 'medium' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {meta.priority}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" /> {habit.streak} Day Streak</span>
                  <span>•</span>
                  <span>{insights.consistency}% Consistency</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
              <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 whitespace-nowrap ${getStatusColor(insights.status)}`}>
                {insights.status === 'Needs Attention' ? <AlertCircle className="w-3 h-3" /> : 
                 insights.status === 'Excellent Consistency' ? <CheckCircle className="w-3 h-3" /> : 
                 <TrendingUp className="w-3 h-3" />}
                {insights.status}
              </span>
              <button 
                onClick={handleDelete}
                className="p-2 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              </motion.div>
            </div>
          </div>

          {/* Expanded Details Section */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-white/5 bg-black/10"
              >
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Weekly Heatmap</h4>
                    <div className="flex gap-1.5 flex-wrap">
                      {last14Days.map(date => {
                        const isCompleted = logs.some(l => l.habit_id === habit.id && l.completed_date === format(date, 'yyyy-MM-dd'))
                        return (
                          <div 
                            key={date.toISOString()}
                            className="w-4 h-4 rounded-sm"
                            style={{ 
                              backgroundColor: isCompleted ? habit.color : 'rgba(255,255,255,0.05)',
                              opacity: isCompleted ? 1 : 0.5
                            }}
                            title={format(date, 'MMM d, yyyy')}
                          />
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Insights</h4>
                    <p className="text-sm italic border-l-2 pl-3 py-1 text-muted-foreground" style={{ borderColor: habit.color }}>
                      &quot;{insights.message}&quot;
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">30-Day Score</span>
                      <span className="font-medium">{insights.last30Completions}/30 days</span>
                    </div>
                    {meta?.targetTime && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Target Time</span>
                        <span className="font-medium">{meta.targetTime}</span>
                      </div>
                    )}
                  </div>
                  
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Section - The Check-in Area */}
          <div className="p-5 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent">
            <div className="flex justify-between items-center gap-2 overflow-x-auto pb-2 px-2">
              {last7Days.map((date) => {
                const dateStr = format(date, 'yyyy-MM-dd')
                const isCompleted = logs.some(log => log.habit_id === habit.id && log.completed_date === dateStr)
                const isToday = isSameDay(date, today)
                
                return (
                  <div key={dateStr} className={`flex flex-col items-center gap-2 min-w-[3.5rem] relative group/day ${!isToday ? 'opacity-40 grayscale-[0.3]' : ''}`}>
                    {!isToday && (
                      <div className="absolute -top-10 scale-0 group-hover/day:scale-100 transition-all duration-200 z-50 bg-black/90 backdrop-blur-md border border-white/20 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none origin-bottom">
                        {isAfter(date, today) ? "Future habits cannot be completed yet" : "Past days cannot be modified"}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-solid border-t-black/90 border-t-4 border-x-transparent border-x-4 border-b-0"></div>
                      </div>
                    )}
                    {isToday && (
                      <span className="absolute -top-6 text-[10px] font-bold text-primary animate-pulse whitespace-nowrap bg-primary/20 px-1.5 py-0.5 rounded">
                        TODAY
                      </span>
                    )}
                    <span className={`text-xs uppercase tracking-wider ${isToday ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                      {format(date, 'EEE')}
                    </span>
                    <button
                      disabled={isPending || !isToday}
                      onClick={(e) => isToday && handleToggle(date, isCompleted, e)}
                      className={`w-12 h-12 rounded-2xl transition-all duration-300 flex items-center justify-center relative overflow-hidden ${
                        isCompleted 
                          ? 'shadow-lg scale-105' 
                          : 'bg-white/5 border border-white/5'
                      } ${isToday && !isCompleted ? 'border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.3)] ring-1 ring-primary/30 hover:bg-white/10 hover:scale-105 cursor-pointer' : ''}
                        ${!isToday ? 'cursor-not-allowed' : 'cursor-pointer'}
                      `}
                      style={{ 
                        backgroundColor: isCompleted ? habit.color : undefined,
                        boxShadow: isCompleted && isToday ? `0 0 20px ${habit.color}80` : undefined
                      }}
                    >
                      {isCompleted ? (
                        <motion.svg 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 text-white drop-shadow-sm relative z-10" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      ) : (
                        !isToday ? <Lock className="w-4 h-4 text-white/30 relative z-10" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20 relative z-10" />
                      )}
                      
                      {/* Shine effect on complete */}
                      {isCompleted && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="text-center mt-3 text-xs text-muted-foreground">
              Completed {completedThisWeek}/7 this week
            </div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  )
}
