'use client'

import React, { useState, useMemo } from 'react'
import { format, eachDayOfInterval, startOfMonth, endOfMonth, parseISO, isSameYear, getDayOfYear, getDaysInYear } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type HabitStudyAnalysisProps = {
  habits: any[]
  habitLogs: any[]
  focusSessions: any[]
}

export function HabitStudyAnalysis({ habits, habitLogs, focusSessions }: HabitStudyAnalysisProps) {
  const [view, setView] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // --- Monthly Calculation ---
  const monthlyData = useMemo(() => {
    const monthStart = startOfMonth(selectedMonth)
    const monthEnd = endOfMonth(selectedMonth)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    let totalHabitsCompleted = 0
    let totalStudySeconds = 0
    let daysWithHabits = 0
    let daysWithStudy = 0
    let bestStudyDay = 0
    
    // Group logs by day
    const logsByDay = new Map<string, number>()
    habitLogs.forEach(log => {
      logsByDay.set(log.completed_date, (logsByDay.get(log.completed_date) || 0) + 1)
    })

    // Group study by day
    const studyByDay = new Map<string, number>()
    focusSessions.forEach(session => {
      const dateStr = format(new Date(session.started_at), 'yyyy-MM-dd')
      studyByDay.set(dateStr, (studyByDay.get(dateStr) || 0) + session.duration)
    })

    daysInMonth.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const hCompleted = logsByDay.get(dateStr) || 0
      const sSeconds = studyByDay.get(dateStr) || 0

      totalHabitsCompleted += hCompleted
      totalStudySeconds += sSeconds

      if (hCompleted > 0) daysWithHabits++
      if (sSeconds > 0) {
        daysWithStudy++
        if (sSeconds > bestStudyDay) bestStudyDay = sSeconds
      }
    })

    const avgStudySeconds = daysInMonth.length > 0 ? Math.round(totalStudySeconds / daysInMonth.length) : 0
    const avgHabits = daysInMonth.length > 0 ? Number((totalHabitsCompleted / daysInMonth.length).toFixed(1)) : 0

    return {
      totalHabitsCompleted,
      daysWithHabits,
      avgHabits,
      totalStudySeconds,
      avgStudySeconds,
      daysWithStudy,
      bestStudyDay
    }
  }, [selectedMonth, habitLogs, focusSessions])

  // --- Yearly Calculation ---
  const yearlyData = useMemo(() => {
    let totalHabits = 0
    let totalStudySeconds = 0
    const monthStats = Array.from({ length: 12 }).map(() => ({ habits: 0, studySeconds: 0 }))

    habitLogs.forEach(log => {
      if (log.completed_date.startsWith(`${selectedYear}-`)) {
        totalHabits++
        const monthIndex = parseInt(log.completed_date.split('-')[1], 10) - 1
        monthStats[monthIndex].habits++
      }
    })

    focusSessions.forEach(session => {
      const localDateStr = format(new Date(session.started_at), 'yyyy-MM-dd')
      if (localDateStr.startsWith(`${selectedYear}-`)) {
        totalStudySeconds += session.duration
        const monthIndex = parseInt(localDateStr.split('-')[1], 10) - 1
        monthStats[monthIndex].studySeconds += session.duration
      }
    })

    const daysInYear = isSameYear(new Date(selectedYear, 0, 1), new Date()) ? getDayOfYear(new Date()) : getDaysInYear(new Date(selectedYear, 0, 1))
    const avgStudySeconds = daysInYear > 0 ? Math.round(totalStudySeconds / daysInYear) : 0
    const avgHabits = daysInYear > 0 ? Number((totalHabits / daysInYear).toFixed(1)) : 0

    return {
      totalHabits,
      totalStudySeconds,
      avgStudySeconds,
      avgHabits,
      monthStats
    }
  }, [selectedYear, habitLogs, focusSessions])

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    if (h > 0 && m > 0) return `${h}h ${m}m`
    if (h > 0) return `${h}h`
    return `${m}m`
  }

  return (
    <Card className="bg-black/20 backdrop-blur-md border border-white/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-4">
          <select 
            value={view} 
            onChange={(e) => setView(e.target.value as any)}
            className="bg-transparent border-none text-lg font-semibold focus:ring-0 cursor-pointer text-white"
          >
            <option value="monthly" className="text-black">Monthly Analysis</option>
            <option value="yearly" className="text-black">Yearly Analysis</option>
          </select>
        </CardTitle>
        <div>
          {view === 'monthly' ? (
            <input 
              type="month" 
              value={format(selectedMonth, 'yyyy-MM')}
              onChange={(e) => {
                if (e.target.value) setSelectedMonth(parseISO(e.target.value + '-01'))
              }}
              className="bg-black/40 border border-white/20 rounded px-2 py-1 text-sm text-white"
            />
          ) : (
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="bg-black/40 border border-white/20 rounded px-2 py-1 text-sm text-white"
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const y = new Date().getFullYear() - i
                return <option key={y} value={y} className="text-black">{y}</option>
              })}
            </select>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {view === 'monthly' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Habits Completed</span>
              <span className="text-2xl font-bold">{monthlyData.totalHabitsCompleted}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Avg Habits/Day</span>
              <span className="text-2xl font-bold">{monthlyData.avgHabits}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Study Time</span>
              <span className="text-2xl font-bold">{formatTime(monthlyData.totalStudySeconds)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Avg Study/Day</span>
              <span className="text-2xl font-bold">{formatTime(monthlyData.avgStudySeconds)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Days Studied</span>
              <span className="text-2xl font-bold">{monthlyData.daysWithStudy}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Best Study Day</span>
              <span className="text-2xl font-bold text-purple-400">{formatTime(monthlyData.bestStudyDay)}</span>
            </div>
          </div>
        )}

        {view === 'yearly' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Habits</span>
              <span className="text-2xl font-bold">{yearlyData.totalHabits}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Avg Habits/Day</span>
              <span className="text-2xl font-bold">{yearlyData.avgHabits}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Total Study Time</span>
              <span className="text-2xl font-bold">{formatTime(yearlyData.totalStudySeconds)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Avg Study/Day</span>
              <span className="text-2xl font-bold">{formatTime(yearlyData.avgStudySeconds)}</span>
            </div>
            
            <div className="col-span-2 md:col-span-4 mt-4">
              <span className="text-sm font-medium mb-2 block text-muted-foreground">Month by Month Overview</span>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
                {yearlyData.monthStats.map((stat, i) => {
                  const mName = format(new Date(2020, i, 1), 'MMM')
                  return (
                    <div key={i} className="flex flex-col bg-black/40 p-2 rounded items-center justify-center text-center">
                      <span className="text-xs font-semibold text-gray-400">{mName}</span>
                      <span className="text-sm font-bold text-blue-400 mt-1">{stat.habits}</span>
                      <span className="text-xs text-purple-400">{formatTime(stat.studySeconds)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
