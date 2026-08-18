'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle } from 'lucide-react'
import { Habit } from './useHabitsData'
import { toggleHabitLog } from './actions'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

type TodayRemainingProps = {
  remaining: Habit[]
}

export function TodayRemaining({ remaining }: TodayRemainingProps) {
  const [isPending, startTransition] = useTransition()

  if (remaining.length === 0) return null

  const handleToggle = (habitId: string) => {
    startTransition(async () => {
      try {
        const todayStr = format(new Date(), 'yyyy-MM-dd')
        await toggleHabitLog(habitId, todayStr, false)
      } catch {
        toast.error('Failed to complete habit')
      }
    })
  }

  return (
    <Card className="bg-black/20 backdrop-blur-md border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] mb-8">
      <CardHeader className="pb-3 border-b border-white/5">
        <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          <Circle className="w-4 h-4 text-orange-500" /> Today Remaining
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          {remaining.map((habit, i) => (
            <motion.div 
              key={habit.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group cursor-pointer"
              onClick={() => handleToggle(habit.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }} />
                <span className="font-medium">{habit.name}</span>
              </div>
              <button 
                disabled={isPending}
                className="text-muted-foreground group-hover:text-primary transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 opacity-50 group-hover:opacity-100" />
              </button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
