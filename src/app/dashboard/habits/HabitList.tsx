'use client'

import { useHabitsData, Habit, HabitLog } from './useHabitsData'
import { HabitCard } from './HabitCard'
import { TodayOverview } from './TodayOverview'
import { TodayRemaining } from './TodayRemaining'
import { MiniAnalytics } from './MiniAnalytics'
import { CreateHabitForm } from './CreateHabitForm'
import { TodayReminders, Reminder } from './TodayReminders'
import { motion, LayoutGroup } from 'framer-motion'

export function HabitList({ habits, logs: initialLogs, reminders }: { habits: Habit[], logs: HabitLog[], reminders: Reminder[] }) {
  const { habitMeta, updateHabitMeta, analytics, getHabitInsights, logs, toggleOptimisticLog } = useHabitsData(habits, initialLogs)

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Habit Tracker</h1>
          <p className="text-muted-foreground">Build consistency with intelligent tracking.</p>
        </div>
        <div className="flex items-center gap-4 flex-col sm:flex-row w-full lg:w-auto">
          <MiniAnalytics analytics={analytics} />
          <CreateHabitForm onCreated={updateHabitMeta} />
        </div>
      </div>

      <TodayOverview analytics={analytics} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-2">
          {habits.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground bg-black/10 rounded-2xl border border-white/5">
              No habits yet. Start with one small win today!
            </div>
          ) : (
            <LayoutGroup>
              {habits.map((habit, i) => (
                <motion.div 
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <HabitCard 
                    habit={habit} 
                    logs={logs} 
                    meta={habitMeta[habit.id]} 
                    insights={getHabitInsights(habit.id)}
                    onToggleLog={toggleOptimisticLog}
                  />
                </motion.div>
              ))}
            </LayoutGroup>
          )}
        </div>
        
        <div className="space-y-6">
          <TodayReminders reminders={reminders || []} />
          <TodayRemaining remaining={analytics.remainingToday} />
        </div>
      </div>
    </div>
  )
}
