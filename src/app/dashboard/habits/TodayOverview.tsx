'use client'

import { format } from 'date-fns'
import { motion } from 'framer-motion'

type TodayOverviewProps = {
  analytics: {
    totalHabits: number
    completedToday: number
    overallPercentage: number
    bestStreak: number
  }
}

export function TodayOverview({ analytics }: TodayOverviewProps) {
  const today = new Date()
  
  let message = "Let's make today count."
  if (analytics.overallPercentage === 100 && analytics.totalHabits > 0) {
    message = "All habits completed today 🎉"
  } else if (analytics.overallPercentage > 50) {
    message = "Great progress, keep going!"
  } else if (analytics.completedToday === 0 && analytics.totalHabits > 0) {
    message = "Start with one small win today."
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="sticky top-4 z-10 w-full mb-8"
    >
      <div className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Subtle glow effect in the background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <h2 className="text-sm font-semibold tracking-wider text-primary uppercase">
                Today
              </h2>
              <span className="text-muted-foreground text-sm flex items-center gap-2">
                — {format(today, 'EEEE, MMM do')}
              </span>
            </div>
            <p className="text-2xl font-bold tracking-tight">
              {message}
            </p>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{analytics.completedToday}/{analytics.totalHabits} habits</span>
            </div>
            <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <motion.div 
                className="h-full bg-primary relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${analytics.overallPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
              </motion.div>
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  )
}
