'use client'


import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Bell } from 'lucide-react'

export type Reminder = {
  id: string
  title: string
  description: string | null
  reminder_time: string | null
  priority: string
  completed: boolean
}

export function TodayReminders({ reminders }: { reminders: Reminder[] }) {
  if (reminders.length === 0) return null;

  return (
    <div className="bg-black/20 rounded-2xl p-6 border border-white/5 h-fit sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-primary" />
        <h3 className="font-semibold tracking-tight">Today&apos;s Reminders</h3>
      </div>
      
      <div className="space-y-3">
        {reminders.map((reminder, i) => (
          <motion.div 
            key={reminder.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-3 rounded-xl border flex items-start gap-3 ${
              reminder.completed 
                ? 'bg-white/5 border-white/5 opacity-50' 
                : 'bg-black/40 border-white/10'
            }`}
          >
            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border ${
              reminder.completed ? 'bg-primary border-primary text-black' : 'border-white/20'
            }`}>
              {reminder.completed && <CheckCircle2 className="w-3 h-3" />}
            </div>
            <div className="flex-1">
              <h4 className={`text-sm font-medium ${reminder.completed ? 'line-through text-muted-foreground' : ''}`}>
                {reminder.title}
              </h4>
              {reminder.reminder_time && (
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{reminder.reminder_time.substring(0,5)}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
