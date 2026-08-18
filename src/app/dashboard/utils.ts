import { format, subDays, differenceInDays } from 'date-fns'

export function calculateProductivityStreaks(habitLogs: any[]) {
  const activeDays = new Set<string>()
  habitLogs.forEach(log => activeDays.add(log.completed_date))
  const sortedDays = Array.from(activeDays).sort() // Ascending

  let currentDailyStreak = 0
  let bestDailyStreak = 0
  let tempStreak = 0
  let lastDateStr: string | null = null
  
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd')

  sortedDays.forEach(dateStr => {
    if (!lastDateStr) {
      tempStreak = 1
    } else {
      const diff = differenceInDays(new Date(dateStr), new Date(lastDateStr))
      if (diff === 1) {
        tempStreak++
      } else if (diff > 1) {
        tempStreak = 1
      }
    }
    
    if (tempStreak > bestDailyStreak) {
      bestDailyStreak = tempStreak
    }
    lastDateStr = dateStr
  })

  if (lastDateStr === todayStr || lastDateStr === yesterdayStr) {
    currentDailyStreak = tempStreak
  } else {
    currentDailyStreak = 0
  }

  return { currentDailyStreak, bestDailyStreak }
}
