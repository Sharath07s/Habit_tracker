import { useState, useEffect, useMemo } from 'react'
import { subDays, format } from 'date-fns'

export type Habit = {
  id: string
  name: string
  color: string
  streak: number
  target_days?: number
}

export type HabitLog = {
  habit_id: string
  completed_date: string
}

export type HabitMeta = {
  icon?: string
  priority?: 'low' | 'medium' | 'high'
  tags?: string[]
  targetTime?: string
  notes?: string
}

export function useHabitsData(habits: Habit[], initialLogs: HabitLog[]) {
  // Local storage for extra metadata
  const [habitMeta, setHabitMeta] = useState<Record<string, HabitMeta>>({})
  const [prevInitialLogs, setPrevInitialLogs] = useState(initialLogs)
  const [logs, setLogs] = useState<HabitLog[]>(initialLogs)

  if (initialLogs !== prevInitialLogs) {
    setPrevInitialLogs(initialLogs)
    setLogs(initialLogs)
  }

  const toggleOptimisticLog = (habitId: string, dateStr: string, currentStatus: boolean) => {
    if (currentStatus) {
      setLogs(prev => prev.filter(l => !(l.habit_id === habitId && l.completed_date === dateStr)))
    } else {
      setLogs(prev => [...prev, { habit_id: habitId, completed_date: dateStr }])
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('habit_meta')
        if (stored) {
          setHabitMeta(JSON.parse(stored))
        }
      } catch (e) {
        console.error('Failed to load habit metadata', e)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const updateHabitMeta = (id: string, meta: Partial<HabitMeta>) => {
    setHabitMeta(prev => {
      const updated = {
        ...prev,
        [id]: { ...(prev[id] || {}), ...meta }
      }
      localStorage.setItem('habit_meta', JSON.stringify(updated))
      return updated
    })
  }

  // Analytics Calculation
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  
  const analytics = useMemo(() => {
    const todayDate = new Date()
    let completedToday = 0
    let bestStreak = 0
    let weeklyScore = 0

    const last7Days = Array.from({ length: 7 }).map((_, i) => format(subDays(todayDate, 6 - i), 'yyyy-MM-dd'))

    habits.forEach(habit => {
      if (habit.streak > bestStreak) {
        bestStreak = habit.streak
      }

      const hasCompletedToday = logs.some(log => log.habit_id === habit.id && log.completed_date === todayStr)
      if (hasCompletedToday) completedToday++

      const weeklyCompletions = logs.filter(log => log.habit_id === habit.id && last7Days.includes(log.completed_date)).length
      weeklyScore += weeklyCompletions
    })

    const totalHabits = habits.length
    const overallPercentage = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100)
    const normalizedWeeklyScore = totalHabits === 0 ? 0 : Math.round((weeklyScore / (totalHabits * 7)) * 100)

    const remainingToday = habits.filter(habit => !logs.some(log => log.habit_id === habit.id && log.completed_date === todayStr))

    return {
      completedToday,
      totalHabits,
      bestStreak,
      weeklyScore: normalizedWeeklyScore,
      overallPercentage,
      remainingToday
    }
  }, [habits, logs, todayStr])

  const getHabitInsights = (habitId: string) => {
    const habitLogs = logs.filter(log => log.habit_id === habitId).map(l => l.completed_date).sort()
    
    // Last 30 days
    const last30Days = Array.from({ length: 30 }).map((_, i) => format(subDays(today, 29 - i), 'yyyy-MM-dd'))
    const last30Completions = habitLogs.filter(date => last30Days.includes(date)).length
    const consistency = Math.round((last30Completions / 30) * 100)
    
    // Status Logic
    let status = 'On Track'
    if (consistency < 30) status = 'Needs Attention'
    else if (consistency < 60) status = 'Falling Behind'
    else if (consistency > 85) status = 'Excellent Consistency'

    // Smart message
    let message = ''
    const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd')
    const completedYesterday = habitLogs.includes(yesterdayStr)
    const completedToday = habitLogs.includes(todayStr)

    if (consistency === 100) message = 'Perfect month!'
    else if (!completedYesterday && !completedToday) message = 'Missed yesterday, bounce back today!'
    else if (completedYesterday && !completedToday) message = 'Keep the momentum going!'
    else if (completedToday) message = 'Done for today!'

    return {
      consistency,
      status,
      message,
      last30Completions
    }
  }

  return {
    habitMeta,
    updateHabitMeta,
    analytics,
    getHabitInsights,
    logs,
    toggleOptimisticLog
  }
}
