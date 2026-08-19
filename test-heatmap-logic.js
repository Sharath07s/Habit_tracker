const { format, eachDayOfInterval, startOfYear, endOfYear } = require('date-fns')

const currentYear = 2026
const yearStart = startOfYear(new Date(currentYear, 0, 1))
const yearEnd = endOfYear(new Date(currentYear, 0, 1))
const days = eachDayOfInterval({ start: yearStart, end: yearEnd })
const todayStr = "2026-08-19"

const habits = [
  { id: 1, created_at: "2026-08-19T02:00:00.000Z" },
  { id: 2, created_at: "2026-08-19T10:00:00.000Z" }
]

const habitLogs = [
  { completed_date: "2026-08-19" },
  { completed_date: "2026-08-19" }
]

const data = new Map()

const logsByDate = new Map()
habitLogs.forEach(log => {
  logsByDate.set(log.completed_date, (logsByDate.get(log.completed_date) || 0) + 1)
})

days.forEach(day => {
  const dateStr = format(day, 'yyyy-MM-dd')
  
  const activeHabits = habits.filter(h => {
    const createdDateStr = format(new Date(h.created_at), 'yyyy-MM-dd')
    return createdDateStr <= dateStr
  }).length

  const completed = logsByDate.get(dateStr) || 0
  data.set(dateStr, { completed, total: activeHabits })
})

const getColor = (completed, total, dateStr) => {
  if (dateStr > todayStr) return 'bg-white/5' // Future days
  if (total === 0) return 'bg-white/5'
  if (completed === 0) return 'bg-white/5'

  const ratio = completed / total
  if (ratio >= 1) return 'bg-green-500'
  if (ratio >= 0.75) return 'bg-green-600'
  if (ratio >= 0.5) return 'bg-green-700'
  if (ratio > 0) return 'bg-green-800'
  
  return 'bg-white/5'
}

const res = data.get("2026-08-19")
console.log("2026-08-19:", res)
console.log("Color for 2026-08-19:", getColor(res.completed, res.total, "2026-08-19"))
