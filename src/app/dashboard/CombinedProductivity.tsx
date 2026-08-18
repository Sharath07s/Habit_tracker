'use client'

import React, { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Edit2, Flame, Trophy } from 'lucide-react'
import { updateStudyGoal } from './actions'

import { AnimatedNumber } from '@/components/animations/AnimatedNumber'
import { motion } from 'framer-motion'

type CombinedProductivityProps = {
  habitsCompletedToday: number
  totalHabitsActive: number
  studySecondsToday: number
  studyGoalMinutes: number // from user_metadata
  currentDailyStreak: number
  bestDailyStreak: number
}

export function CombinedProductivity({
  habitsCompletedToday,
  totalHabitsActive,
  studySecondsToday,
  studyGoalMinutes,
  currentDailyStreak,
  bestDailyStreak
}: CombinedProductivityProps) {
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState(studyGoalMinutes ? (studyGoalMinutes / 60).toString() : '7')
  const [isPending, startTransition] = useTransition()

  const habitPercentage = totalHabitsActive === 0 ? 0 : Math.round((habitsCompletedToday / totalHabitsActive) * 100)
  
  const studyGoalSeconds = studyGoalMinutes * 60
  const studyPercentage = studyGoalSeconds === 0 ? 0 : Math.min(100, Math.round((studySecondsToday / studyGoalSeconds) * 100))
  
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    if (h > 0 && m > 0) return <><AnimatedNumber value={h} />h <AnimatedNumber value={m} />m</>
    if (h > 0) return <><AnimatedNumber value={h} />h</>
    return <><AnimatedNumber value={m} />m</>
  }

  const studyTimeFormatted = formatTime(studySecondsToday)
  const studyGoalFormatted = studyGoalMinutes ? formatTime(studyGoalMinutes * 60) : 'Not set'
  
  const overAchievementSeconds = Math.max(0, studySecondsToday - studyGoalSeconds)
  
  const handleSaveGoal = () => {
    const hours = parseFloat(goalInput)
    if (isNaN(hours) || hours <= 0) return
    
    startTransition(async () => {
      await updateStudyGoal(Math.round(hours * 60))
      setIsEditingGoal(false)
    })
  }

  return (
    <Card className="bg-black/20 backdrop-blur-md border border-white/5 h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Today's Productivity</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-orange-400 group" title="Current Streak">
            <Flame size={16} className="transition-transform group-hover:scale-110" />
            <span className="font-bold"><AnimatedNumber value={currentDailyStreak} /> days</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-400 group" title="Best Streak">
            <Trophy size={16} className="transition-transform group-hover:scale-110" />
            <span className="font-bold"><AnimatedNumber value={bestDailyStreak} /> days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        
        {/* Habits Progress */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Habits</span>
            <span><AnimatedNumber value={habitsCompletedToday} /> / {totalHabitsActive} completed (<AnimatedNumber value={habitPercentage} />%)</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${habitPercentage}%` }} 
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Study Progress */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground font-medium flex items-center gap-2">
              Study Goal
              {!isEditingGoal && (
                <button onClick={() => setIsEditingGoal(true)} className="hover:text-white transition-colors">
                  <Edit2 size={12} />
                </button>
              )}
            </span>
            {isEditingGoal ? (
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  step="0.5"
                  className="w-16 h-6 px-1 text-sm bg-black/40 border border-white/20 rounded"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  disabled={isPending}
                />
                <span className="text-xs text-muted-foreground">hours</span>
                <button 
                  onClick={handleSaveGoal}
                  disabled={isPending}
                  className="text-green-400 hover:text-green-300 ml-1"
                >
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <span>
                {studyTimeFormatted} / {studyGoalFormatted} (<AnimatedNumber value={studyPercentage} />%)
              </span>
            )}
          </div>
          
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${studyPercentage >= 100 ? 'bg-green-500' : 'bg-purple-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${studyPercentage}%` }} 
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          
          {studyPercentage >= 100 && (
            <div className="flex justify-between items-center text-xs text-green-400 mt-1">
              <span>🎯 Daily Goal Completed</span>
              {overAchievementSeconds > 0 && (
                <span>+{formatTime(overAchievementSeconds)} beyond goal</span>
              )}
            </div>
          )}
          {studyPercentage < 100 && studyGoalSeconds > 0 && (
            <div className="text-xs text-muted-foreground mt-1 text-right">
              Remaining: {formatTime(studyGoalSeconds - studySecondsToday)}
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  )
}
