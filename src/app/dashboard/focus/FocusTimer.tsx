'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { logFocusSession } from './actions'
import { toast } from 'sonner'

export function FocusTimer() {
  const [mode, setMode] = useState<number>(25 * 60) // Default 25 min
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [endTime, setEndTime] = useState<number | null>(null)

  const handleComplete = useCallback(async () => {
    setIsActive(false)
    setEndTime(null)
    if (!isBreak) {
      toast.success('Focus session completed! Great job.')
      try {
        await logFocusSession(mode)
      } catch {
        toast.error('Failed to log session')
      }
      setIsBreak(true)
      setTimeLeft(5 * 60) // 5 min break
    } else {
      toast.info('Break is over. Ready to focus again?')
      setIsBreak(false)
      setTimeLeft(mode)
    }
  }, [isBreak, mode])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive && endTime) {
      interval = setInterval(() => {
        const now = Date.now()
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000))
        setTimeLeft(remaining)
        
        if (remaining === 0) {
          handleComplete()
        }
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, endTime, handleComplete])

  const toggleTimer = () => {
    if (!isActive) {
      setEndTime(Date.now() + timeLeft * 1000)
    } else {
      setEndTime(null)
    }
    setIsActive(!isActive)
  }
  
  const resetTimer = () => {
    setIsActive(false)
    setEndTime(null)
    setIsBreak(false)
    setTimeLeft(mode)
  }

  const handleModeChange = (val: string | null) => {
    if (!val) return
    const newMode = parseInt(val, 10) * 60
    setMode(newMode)
    setTimeLeft(newMode)
    setIsActive(false)
    setIsBreak(false)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <Card className="max-w-md mx-auto overflow-hidden">
      <CardContent className="p-8 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-8">
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${isBreak ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
            {isBreak ? 'Break Time' : 'Focus Session'}
          </span>
          <Select disabled={isActive} onValueChange={handleModeChange} defaultValue="25">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">Pomodoro (25m)</SelectItem>
              <SelectItem value="50">Deep Work (50m)</SelectItem>
              <SelectItem value="15">Short Focus (15m)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-7xl sm:text-8xl font-bold tracking-tighter tabular-nums mb-10 text-primary">
          {formatTime(timeLeft)}
        </div>

        <div className="flex gap-4">
          <Button
            size="lg"
            className="w-16 h-16 rounded-full"
            onClick={toggleTimer}
            variant={isActive ? "secondary" : "default"}
          >
            {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
          </Button>
          <Button
            size="lg"
            className="w-16 h-16 rounded-full"
            variant="outline"
            onClick={resetTimer}
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
