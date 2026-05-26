'use client'

import { useState, useTransition } from 'react'
import { format, subDays, isSameDay } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toggleHabitLog, deleteHabit } from './actions'
import { toast } from 'sonner'

type Habit = {
  id: string
  name: string
  color: string
  streak: number
}

type HabitLog = {
  habit_id: string
  completed_date: string
}

export function HabitList({ habits, logs }: { habits: Habit[], logs: HabitLog[] }) {
  const [isPending, startTransition] = useTransition()
  
  // Get last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i))

  const handleToggle = (habitId: string, date: Date, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await toggleHabitLog(habitId, date, currentStatus)
      } catch {
        toast.error('Failed to update habit')
      }
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteHabit(id)
        toast.success('Habit deleted')
      } catch {
        toast.error('Failed to delete habit')
      }
    })
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No habits yet. Create one to build a streak!
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {habits.map((habit) => (
        <Card key={habit.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 border-b">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: habit.color }} />
              <CardTitle className="text-lg">{habit.name}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive h-8 w-8"
              onClick={() => handleDelete(habit.id)}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 bg-muted/20">
            <div className="flex justify-between items-center gap-2 overflow-x-auto pb-2">
              {last7Days.map((date, i) => {
                const dateStr = format(date, 'yyyy-MM-dd')
                const isCompleted = logs.some(log => log.habit_id === habit.id && log.completed_date === dateStr)
                const isToday = isSameDay(date, new Date())
                
                return (
                  <div key={i} className="flex flex-col items-center gap-1 min-w-[3rem]">
                    <span className={`text-xs ${isToday ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                      {format(date, 'EEE')}
                    </span>
                    <button
                      disabled={isPending}
                      onClick={() => handleToggle(habit.id, date, isCompleted)}
                      className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                        isCompleted ? 'ring-2 ring-offset-2 ring-offset-background' : 'bg-muted hover:bg-muted/80'
                      }`}
                      style={{ 
                        backgroundColor: isCompleted ? habit.color : undefined
                      }}
                    >
                      {isCompleted && (
                        <svg className="w-5 h-5 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
