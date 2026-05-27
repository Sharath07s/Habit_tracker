'use client'

import { useState } from 'react'
import { Reminder, useCalendarData } from './useCalendarData'
import { CalendarInsights } from './CalendarInsights'
import { CalendarToolbar } from './CalendarToolbar'
import { CalendarComponent } from './CalendarComponent'
import { AgendaPanel } from './AgendaPanel'

export function CalendarDashboard({ 
  initialReminders,
  habitLogs,
  focusSessions,
  dailyTasks
}: { 
  initialReminders: Reminder[],
  habitLogs: { completed_date: string }[],
  focusSessions: { started_at: string }[],
  dailyTasks: { task_date: string; completed: boolean }[]
}) {
  const {
    filteredReminders,
    reminders, // all raw
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    analytics,
    selectedDate,
    setSelectedDate,
    getRemindersForDate,
    addReminderLocally,
    updateReminderLocally,
    deleteReminderLocally
  } = useCalendarData(initialReminders)

  const [isAgendaOpen, setIsAgendaOpen] = useState(false)

  // Transform reminders to FullCalendar events
  const events = filteredReminders.map(r => ({
    id: r.id,
    title: r.title,
    start: r.reminder_time ? `${r.reminder_date}T${r.reminder_time}` : r.reminder_date,
    allDay: !r.reminder_time,
    extendedProps: {
      completed: r.completed,
      priority: r.priority
    }
  }))

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsAgendaOpen(true)
  }

  const selectedDayReminders = selectedDate ? getRemindersForDate(selectedDate) : []

  return (
    <div className="relative">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Schedule</h1>
          <p className="text-muted-foreground">Your intelligent productivity calendar.</p>
        </div>
      </div>

      <CalendarInsights 
        analytics={analytics} 
        reminders={reminders} 
        habitLogs={habitLogs}
        focusSessions={focusSessions}
        dailyTasks={dailyTasks}
      />
      
      <CalendarToolbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filter={filter}
        setFilter={setFilter}
      />

      <div className="flex gap-6 h-[75vh]">
        <div className="flex-1 w-full overflow-hidden relative">
          <CalendarComponent 
            events={events}
            onDateClick={handleDateClick}
          />
        </div>

        <AgendaPanel 
          isOpen={isAgendaOpen}
          onClose={() => setIsAgendaOpen(false)}
          selectedDate={selectedDate}
          reminders={selectedDayReminders}
          onAddLocally={addReminderLocally}
          onUpdateLocally={updateReminderLocally}
          onDeleteLocally={deleteReminderLocally}
        />
      </div>

    </div>
  )
}
