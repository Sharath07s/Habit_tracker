'use client'

import React from 'react'
import { format } from 'date-fns'
import { CheckCircle2, Clock, ListTodo, Flame } from 'lucide-react'

type TodayOverviewPanelProps = {
  habitsCompleted: number
  pendingReminders: number
  focusHours: string
  insight: string
}

export function TodayOverviewPanel({
  habitsCompleted,
  pendingReminders,
  focusHours,
  insight
}: TodayOverviewPanelProps) {
  const today = format(new Date(), 'EEEE, MMMM do')

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
        
        {/* Left Side: Info */}
        <div className="flex-1 space-y-6">
          <div>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-1">
              TODAY — {today}
            </h2>
            <p className="text-2xl font-light text-foreground/90">
              {insight}
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold">{habitsCompleted}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Habits Done</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-500/10 text-orange-400">
                <ListTodo className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold">{pendingReminders}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Pending Reminders</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/10 text-purple-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold">{focusHours}h</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Focus Time</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
