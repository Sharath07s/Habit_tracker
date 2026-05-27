import { useState, useMemo } from 'react'
import { isAfter, isBefore, format, startOfWeek, endOfWeek, parseISO } from 'date-fns'

export type Reminder = {
  id: string
  title: string
  description: string | null
  reminder_date: string
  reminder_time: string | null
  priority: string
  repeat_type: string
  completed: boolean
  created_at: string
}

export function useCalendarData(initialReminders: Reminder[]) {
  const [reminders, setReminders] = useState(initialReminders)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed' | 'missed' | 'high-priority'>('all')
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

  // Analytics
  const analytics = useMemo(() => {
    const today = new Date()
    const todayStr = format(today, 'yyyy-MM-dd')
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })

    let tasksToday = 0
    let completedToday = 0
    let upcomingReminders = 0
    let overdueReminders = 0
    let weekTotal = 0
    let weekCompleted = 0

    reminders.forEach(r => {
      const isToday = r.reminder_date === todayStr
      const rDate = parseISO(r.reminder_date)
      
      if (isToday) {
        tasksToday++
        if (r.completed) completedToday++
      }

      if (!r.completed && isBefore(rDate, today) && !isToday) {
        overdueReminders++
      }
      
      if (!r.completed && isAfter(rDate, today)) {
        upcomingReminders++
      }

      if (rDate >= weekStart && rDate <= weekEnd) {
        weekTotal++
        if (r.completed) weekCompleted++
      }
    })

    const completionRate = tasksToday > 0 ? Math.round((completedToday / tasksToday) * 100) : 100
    const weeklyScore = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 100

    return {
      tasksToday,
      completedToday,
      upcomingReminders,
      overdueReminders,
      weeklyScore,
      completionRate,
      remainingToday: tasksToday - completedToday
    }
  }, [reminders])

  // Filtering
  const filteredReminders = useMemo(() => {
    const today = new Date()
    const todayStr = format(today, 'yyyy-MM-dd')

    return reminders.filter(r => {
      // Search
      if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !(r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false
      }

      // Filter modes
      switch (filter) {
        case 'today': return r.reminder_date === todayStr
        case 'upcoming': return !r.completed && isAfter(parseISO(r.reminder_date), today) && r.reminder_date !== todayStr
        case 'completed': return r.completed
        case 'missed': return !r.completed && isBefore(parseISO(r.reminder_date), today) && r.reminder_date !== todayStr
        case 'high-priority': return r.priority === 'high' || r.priority === 'urgent'
        default: return true
      }
    })
  }, [reminders, searchQuery, filter])

  // Get reminders for a specific date
  const getRemindersForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return reminders.filter(r => r.reminder_date === dateStr).sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      return (a.reminder_time || '24:00').localeCompare(b.reminder_time || '24:00')
    })
  }

  // Update local state optimistically
  const updateReminderLocally = (updatedReminder: Reminder) => {
    setReminders(prev => prev.map(r => r.id === updatedReminder.id ? updatedReminder : r))
  }
  
  const addReminderLocally = (newReminder: Reminder) => {
    setReminders(prev => [...prev, newReminder])
  }

  const deleteReminderLocally = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  return {
    reminders,
    filteredReminders,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    analytics,
    selectedDate,
    setSelectedDate,
    getRemindersForDate,
    updateReminderLocally,
    addReminderLocally,
    deleteReminderLocally
  }
}
