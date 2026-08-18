'use client'

import React, { useState, useMemo } from 'react'
import { format, eachDayOfInterval, startOfYear, endOfYear, getDay, isAfter } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

type HabitHeatmapProps = {
  habits: any[]
  habitLogs: any[]
}

export function HabitHeatmap({ habits, habitLogs }: HabitHeatmapProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const shouldReduceMotion = useReducedMotion()

  const yearStart = startOfYear(new Date(currentYear, 0, 1))
  const yearEnd = endOfYear(new Date(currentYear, 0, 1))
  const today = new Date()

  const days = useMemo(() => {
    return eachDayOfInterval({ start: yearStart, end: yearEnd })
  }, [currentYear, yearStart, yearEnd])

  const heatmapData = useMemo(() => {
    const data = new Map<string, { completed: number; total: number }>()

    // Precompute logs count per day
    const logsByDate = new Map<string, number>()
    habitLogs.forEach(log => {
      logsByDate.set(log.completed_date, (logsByDate.get(log.completed_date) || 0) + 1)
    })

    days.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      
      // Calculate total habits active on this day
      const activeHabits = habits.filter(h => {
        const createdAt = new Date(h.created_at)
        return createdAt <= day
      }).length

      const completed = logsByDate.get(dateStr) || 0
      data.set(dateStr, { completed, total: activeHabits })
    })

    return data
  }, [days, habits, habitLogs])

  const getColor = (completed: number, total: number, date: Date) => {
    if (isAfter(date, today)) return 'bg-white/5' // Future days
    if (total === 0) return 'bg-white/5'
    if (completed === 0) return 'bg-white/5'

    const ratio = completed / total
    if (ratio >= 1) return 'bg-green-500'
    if (ratio >= 0.75) return 'bg-green-600'
    if (ratio >= 0.5) return 'bg-green-700'
    if (ratio > 0) return 'bg-green-800'
    
    return 'bg-white/5'
  }

  // Calculate grid layout
  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  // Pad the first week to align days correctly (Sunday = 0)
  const firstDayOfWeek = getDay(yearStart)
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(new Date(0)) // Dummy date for padding
  }

  days.forEach(day => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(new Date(0)) // Dummy date for padding
    }
    weeks.push(currentWeek)
  }

  return (
    <Card className="bg-black/20 backdrop-blur-md border border-white/5 w-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Habit Contributions</CardTitle>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentYear(y => y - 1)}
            className="p-1 hover:bg-white/10 rounded"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium">{currentYear}</span>
          <button 
            onClick={() => setCurrentYear(y => Math.min(new Date().getFullYear(), y + 1))}
            disabled={currentYear >= new Date().getFullYear()}
            className="p-1 hover:bg-white/10 rounded disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.005
              }
            }
          }}
        >
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1">
              {week.map((day, dIndex) => {
                if (day.getTime() === 0) {
                  return <div key={dIndex} className="w-3 h-3 bg-transparent rounded-sm" />
                }
                const dateStr = format(day, 'yyyy-MM-dd')
                const { completed, total } = heatmapData.get(dateStr) || { completed: 0, total: 0 }
                const colorClass = getColor(completed, total, day)

                return (
                  <motion.div
                    key={dateStr}
                    variants={{
                      hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 },
                      visible: { 
                        opacity: 1, 
                        scale: 1,
                        transition: { duration: 0.2 }
                      }
                    }}
                    className={`w-3 h-3 rounded-sm ${colorClass} transition-colors duration-200 cursor-help group relative`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-10 w-max bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none">
                      <span className="font-semibold">{format(day, 'MMM d, yyyy')}</span>
                      <span>{completed} of {total} habits completed</span>
                      {total > 0 && <span>{Math.round((completed / total) * 100)}% completion</span>}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  )
}
