'use client'

import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import { EventInput, DayCellContentArg, EventContentArg } from '@fullcalendar/core'

type CalendarProps = {
  events: EventInput[]
  onDateClick: (date: Date) => void
  currentView?: string
}

export function CalendarComponent({ events, onDateClick, currentView = 'dayGridMonth' }: CalendarProps) {
  
  const renderDayCell = (info: DayCellContentArg) => {
    const isToday = info.isToday
    return (
      <div className="flex justify-between items-start w-full px-1 pt-1">
        <span className={`text-sm ${isToday ? 'text-primary font-bold' : 'text-muted-foreground font-medium'}`}>
          {info.dayNumberText}
        </span>
        {isToday && (
          <span className="text-[9px] font-bold text-primary bg-primary/20 px-1.5 py-0.5 rounded uppercase tracking-wider shadow-[0_0_10px_rgba(var(--primary),0.2)]">
            Today
          </span>
        )}
      </div>
    )
  }

  const renderEvent = (info: EventContentArg) => {
    const { event } = info
    const isCompleted = event.extendedProps.completed
    const priority = event.extendedProps.priority

    const priorityColor = 
      priority === 'urgent' ? 'bg-red-500' :
      priority === 'high' ? 'bg-orange-500' :
      priority === 'low' ? 'bg-blue-500' : 'bg-green-500'

    return (
      <div className={`flex items-center gap-1.5 px-1.5 py-0.5 w-full overflow-hidden text-xs rounded transition-all group ${
        isCompleted ? 'opacity-50 line-through text-muted-foreground' : 'text-foreground hover:bg-white/10'
      }`}>
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isCompleted ? 'bg-muted-foreground' : priorityColor}`} />
        <span className="truncate">{event.title}</span>
      </div>
    )
  }

  return (
    <div className="bg-black/20 backdrop-blur-md text-card-foreground border border-white/10 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] h-[75vh] w-full overflow-hidden calendar-override">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={currentView}
        headerToolbar={false} // We are hiding the default toolbar because we built a custom one
        events={events}
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={3}
        height="100%"
        dateClick={(info) => {
          onDateClick(info.date)
        }}
        eventClick={(info) => {
          // Pass the start date of the event so the agenda can open on that day
          if (info.event.start) {
            onDateClick(info.event.start)
          }
        }}
        dayCellContent={renderDayCell}
        eventContent={renderEvent}
      />
      <style dangerouslySetInnerHTML={{__html: `
        .calendar-override .fc-theme-standard td, 
        .calendar-override .fc-theme-standard th, 
        .calendar-override .fc-theme-standard .fc-scrollgrid {
          border-color: rgba(255,255,255,0.05);
        }
        .calendar-override .fc-col-header-cell {
          padding: 12px 0;
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 600;
          color: hsl(var(--muted-foreground));
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        .calendar-override .fc-daygrid-day {
          transition: background-color 0.2s ease;
          cursor: pointer;
        }
        .calendar-override .fc-daygrid-day:hover {
          background-color: rgba(255,255,255,0.02);
        }
        .calendar-override .fc-day-today {
          background-color: transparent !important;
        }
        .calendar-override .fc-day-today .fc-daygrid-day-frame {
          box-shadow: inset 0 0 0 1px hsl(var(--primary) / 0.5), inset 0 0 20px hsl(var(--primary) / 0.1);
          background-color: rgba(var(--primary), 0.05);
        }
        .calendar-override .fc-h-event {
          background: transparent;
          border: none;
        }
        .calendar-override .fc-event-main {
          color: inherit;
        }
        .calendar-override .fc-daygrid-day-frame {
          min-height: 110px;
          display: flex;
          flex-direction: column;
          padding: 4px;
        }
        .calendar-override .fc-daygrid-day-top {
          display: flex;
          flex-direction: row;
          opacity: 1; /* override any default hiding */
        }
        .calendar-override .fc-daygrid-day-events {
          flex: 1;
          margin-top: 4px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .calendar-override .fc-daygrid-event-harness {
          margin-bottom: 2px;
        }
        .calendar-override .fc-daygrid-body {
          width: 100% !important;
        }
        .calendar-override .fc-scrollgrid-sync-table {
          width: 100% !important;
        }
      `}} />
    </div>
  )
}
