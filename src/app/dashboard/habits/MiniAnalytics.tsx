'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Activity, CheckCircle2, Flame, Target } from 'lucide-react'
import { motion } from 'framer-motion'

type MiniAnalyticsProps = {
  analytics: {
    totalHabits: number
    completedToday: number
    bestStreak: number
    weeklyScore: number
  }
}

export function MiniAnalytics({ analytics }: MiniAnalyticsProps) {
  const stats = [
    { label: 'Total Habits', value: analytics.totalHabits, icon: Target, color: 'text-blue-500' },
    { label: 'Completed Today', value: analytics.completedToday, icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Best Streak', value: `${analytics.bestStreak}d`, icon: Flame, color: 'text-orange-500' },
    { label: 'Weekly Score', value: `${analytics.weeklyScore}%`, icon: Activity, color: 'text-purple-500' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
      {stats.map((stat, i) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        >
          <Card className="bg-black/20 backdrop-blur-md border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:bg-black/40 transition-colors">
            <CardContent className="p-3 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-black/30 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{stat.label}</p>
                <p className="text-lg font-bold leading-none">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
