'use client'

import { format, isSameDay } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, Circle, Clock, Trash2, Plus, CalendarDays } from 'lucide-react'
import { Reminder } from './useCalendarData'
import { useState, useTransition } from 'react'
import { toggleReminderStatus, deleteReminder, createReminder } from '../reminders/actions'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type AgendaPanelProps = {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date | null
  reminders: Reminder[]
  onAddLocally: (r: Reminder) => void
  onUpdateLocally: (r: Reminder) => void
  onDeleteLocally: (id: string) => void
}

export function AgendaPanel({ isOpen, onClose, selectedDate, reminders, onAddLocally, onUpdateLocally, onDeleteLocally }: AgendaPanelProps) {
  const [isPending, startTransition] = useTransition()
  const [newTaskTitle, setNewTaskTitle] = useState('')

  if (!selectedDate) return null

  const isToday = isSameDay(selectedDate, new Date())

  const handleToggle = (reminder: Reminder) => {
    // Optimistic update
    onUpdateLocally({ ...reminder, completed: !reminder.completed })
    
    startTransition(async () => {
      try {
        await toggleReminderStatus(reminder.id, reminder.completed)
      } catch {
        toast.error('Failed to update reminder')
        // Revert optimistic update
        onUpdateLocally(reminder)
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this reminder?')) return
    
    const reminderToRestore = reminders.find(r => r.id === id)
    onDeleteLocally(id)

    startTransition(async () => {
      try {
        await deleteReminder(id)
        toast.success('Reminder deleted')
      } catch {
        toast.error('Failed to delete reminder')
        if (reminderToRestore) onAddLocally(reminderToRestore)
      }
    })
  }

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const formData = new FormData()
    formData.append('title', newTaskTitle)
    formData.append('reminder_date', format(selectedDate, 'yyyy-MM-dd'))
    
    // We don't have the new ID immediately for a true optimistic UI without a complex sync,
    // but we can await the server action, then refresh data. 
    // Wait, the prompt says "preserve existing backend logic".
    
    startTransition(async () => {
      try {
        await createReminder(formData)
        setNewTaskTitle('')
        toast.success('Reminder added')
        // Data will refresh because createReminder calls revalidatePath, which triggers server component to pass down new data.
      } catch {
        toast.error('Failed to add reminder')
      }
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      default: return 'text-green-400 bg-green-400/10 border-green-400/20'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed lg:static top-0 right-0 w-full max-w-sm lg:max-w-[320px] xl:max-w-md h-full lg:h-[80vh] z-50 bg-black/80 lg:bg-black/20 backdrop-blur-2xl border-l lg:border border-white/10 shadow-2xl flex flex-col lg:rounded-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {isToday ? 'Today' : format(selectedDate, 'EEEE')}
                </h2>
                <p className="text-muted-foreground">{format(selectedDate, 'MMMM do, yyyy')}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Add */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
              <form onSubmit={handleQuickAdd} className="flex gap-2">
                <Input 
                  placeholder="Quick add reminder..." 
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="bg-black/40 border-white/10"
                  disabled={isPending}
                />
                <Button type="submit" size="icon" disabled={isPending || !newTaskTitle.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Reminder List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {reminders.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No reminders scheduled.</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Plan your day intentionally.</p>
                </div>
              ) : (
                reminders.map(reminder => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={reminder.id}
                    className={`group p-3 rounded-xl border transition-all relative overflow-hidden ${
                      reminder.completed ? 'bg-white/5 border-white/5' : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3 relative z-10">
                      <button 
                        onClick={() => handleToggle(reminder)}
                        disabled={isPending}
                        className="mt-0.5 flex-shrink-0 focus:outline-none"
                      >
                        {reminder.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground hover:text-white transition-colors" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate transition-colors ${reminder.completed ? 'line-through text-muted-foreground' : 'text-white'}`}>
                          {reminder.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {reminder.reminder_time && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {reminder.reminder_time.substring(0,5)}
                            </span>
                          )}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getPriorityColor(reminder.priority)} uppercase tracking-wider`}>
                            {reminder.priority}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(reminder.id)}
                        disabled={isPending}
                        className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-md opacity-0 group-hover:opacity-100 transition-all focus:outline-none"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
