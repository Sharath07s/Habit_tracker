'use client'

import React, { useMemo } from 'react'
import { format, subDays, isSameDay } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsCharts } from './AnalyticsCharts'
import { TodayTasksWidget, DailyTask } from './TodayTasksWidget'
import { TodayOverviewPanel } from './TodayOverviewPanel'

import { HabitHeatmap } from './HabitHeatmap'
import { HabitStudyAnalysis } from './HabitStudyAnalysis'
import { CombinedProductivity } from './CombinedProductivity'
import { calculateProductivityStreaks } from './utils'
import { StaggerContainer, FadeIn } from '@/components/animations/FadeIn'

type DashboardClientProps = {
  initialReminders: any[]
  initialFocusSessions: any[]
  initialHabits: any[]
  initialHabitLogs: any[]
  initialGoals: any[]
  initialTasks: DailyTask[]
  pastTasks: DailyTask[]
  studyGoalMinutes?: number
}

export function DashboardClient({
  initialReminders,
  initialFocusSessions,
  initialHabits,
  initialHabitLogs,
  initialGoals,
  initialTasks,
  pastTasks,
  studyGoalMinutes = 0
}: DashboardClientProps) {
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  // --- Reminders ---
  const completedReminders = initialReminders.filter(r => r.completed).length
  const pendingReminders = initialReminders.filter(r => !r.completed).length

  // --- Focus Sessions ---
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i)
    return {
      dateObj: d,
      name: format(d, 'EEE'),
      dateStr: format(d, 'yyyy-MM-dd')
    }
  })

  const focusData = last7Days.map(day => {
    const daySessions = initialFocusSessions.filter(s => format(new Date(s.started_at), 'yyyy-MM-dd') === day.dateStr)
    const totalSeconds = daySessions.reduce((acc, s) => acc + s.duration, 0)
    return {
      name: day.name,
      hours: Number((totalSeconds / 3600).toFixed(1))
    }
  })

  const totalFocusSeconds = initialFocusSessions.reduce((acc, s) => acc + s.duration, 0)
  const totalFocusHours = (totalFocusSeconds / 3600).toFixed(1)
  const todayFocusSeconds = initialFocusSessions.filter(s => format(new Date(s.started_at), 'yyyy-MM-dd') === todayStr).reduce((acc, s) => acc + s.duration, 0)
  const todayFocusHours = (todayFocusSeconds / 3600).toFixed(1)

  // --- Habits ---
  const habitsCount = initialHabits.length
  const habitsCompletedToday = initialHabitLogs.filter(log => log.completed_date === todayStr).length

  // --- Goals ---
  let goalsProgress = 0
  if (initialGoals.length > 0) {
    const totalProgress = initialGoals.reduce((acc, g) => acc + Math.min(100, (g.progress / g.target) * 100), 0)
    goalsProgress = Math.round(totalProgress / initialGoals.length)
  }

  // --- Daily Tasks (Trend) ---
  const taskTrendData = last7Days.map(day => {
    // For trends, combine daily tasks + habits completed to give a real completion percentage
    // But since the user wants daily tasks completion %:
    const dayTasks = pastTasks.filter(t => t.task_date === day.dateStr)
    const total = dayTasks.length
    const completed = dayTasks.filter(t => t.completed).length
    const completionPct = total === 0 ? 0 : Math.round((completed / total) * 100)
    return {
      name: day.name,
      completion: completionPct
    }
  })

  // Determine Insight
  let insight = "Start completing items to build momentum!"
  const todayTasksCompleted = initialTasks.filter(t => t.completed).length
  const totalCompleted = habitsCompletedToday + todayTasksCompleted

  if (totalCompleted > 5) insight = "Incredible productivity today! Keep it up."
  else if (totalCompleted > 2) insight = "Solid progress. You're doing great!"
  else if (habitsCompletedToday > 0) insight = "Good start on your habits!"

  const { currentDailyStreak, bestDailyStreak } = useMemo(() => {
    return calculateProductivityStreaks(initialHabitLogs)
  }, [initialHabitLogs])

  return (
    <div className="flex flex-col gap-6">
      <FadeIn>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      </FadeIn>

      {/* TOP ROW: Overview Panel & Heatmap */}
      <StaggerContainer className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <FadeIn className="lg:col-span-1 h-full">
          <TodayOverviewPanel 
            habitsCompleted={habitsCompletedToday}
            pendingReminders={pendingReminders}
            focusHours={todayFocusHours}
            insight={insight}
          />
        </FadeIn>
        <FadeIn className="lg:col-span-2 h-full">
          <HabitHeatmap habits={initialHabits} habitLogs={initialHabitLogs} />
        </FadeIn>
      </StaggerContainer>

      {/* STATS CARDS */}
      <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FadeIn>
          <Card className="bg-black/20 backdrop-blur-md border border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Lifetime Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFocusHours}h</div>
            </CardContent>
          </Card>
        </FadeIn>
        <FadeIn>
          <Card className="bg-black/20 backdrop-blur-md border border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Habits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{habitsCount}</div>
            </CardContent>
          </Card>
        </FadeIn>
        <FadeIn>
          <Card className="bg-black/20 backdrop-blur-md border border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Goals Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goalsProgress}%</div>
            </CardContent>
          </Card>
        </FadeIn>
        <FadeIn>
          <Card className="bg-black/20 backdrop-blur-md border border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReminders}</div>
            </CardContent>
          </Card>
        </FadeIn>
      </StaggerContainer>

      {/* PRODUCTIVITY & ANALYSIS ROW */}
      <StaggerContainer className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <FadeIn className="lg:col-span-1">
          <CombinedProductivity 
             habitsCompletedToday={habitsCompletedToday}
             totalHabitsActive={habitsCount}
             studySecondsToday={todayFocusSeconds}
             studyGoalMinutes={studyGoalMinutes}
             currentDailyStreak={currentDailyStreak}
             bestDailyStreak={bestDailyStreak}
          />
        </FadeIn>
        <FadeIn className="lg:col-span-2">
          <HabitStudyAnalysis 
            habits={initialHabits} 
            habitLogs={initialHabitLogs} 
            focusSessions={initialFocusSessions} 
          />
        </FadeIn>
      </StaggerContainer>

      {/* LOWER WIDGETS */}
      <StaggerContainer className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <FadeIn className="lg:col-span-1">
          <TodayTasksWidget initialTasks={initialTasks} />
        </FadeIn>
        <FadeIn className="lg:col-span-2">
          <AnalyticsCharts 
            focusData={focusData} 
            reminderStats={{ completed: completedReminders, pending: pendingReminders }} 
            taskTrendData={taskTrendData}
          />
        </FadeIn>
      </StaggerContainer>
    </div>
  )
}
