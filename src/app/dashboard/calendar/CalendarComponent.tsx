'use client'

import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

type Event = {
  id: string
  title: string
  date?: string
  start?: string
  end?: string
  allDay?: boolean
  backgroundColor?: string
}

export function CalendarComponent({ events }: { events: Event[] }) {
  return (
    <div className="bg-card text-card-foreground border rounded-xl p-4 shadow-sm h-[80vh]">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        height="100%"
        eventClick={(info) => {
          // Could open a modal to show event details
          console.log('Event clicked', info.event)
        }}
      />
    </div>
  )
}
