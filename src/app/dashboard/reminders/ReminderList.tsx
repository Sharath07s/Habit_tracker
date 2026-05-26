'use client'

import { format } from 'date-fns'
import { Trash2, Calendar, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { toggleReminderStatus, deleteReminder } from './actions'
import { toast } from 'sonner'
import { useTransition } from 'react'

type Reminder = {
  id: string
  title: string
  description: string | null
  reminder_date: string
  reminder_time: string | null
  priority: string
  repeat_type: string
  completed: boolean
}

export function ReminderList({ reminders }: { reminders: Reminder[] }) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await toggleReminderStatus(id, currentStatus)
      } catch {
        toast.error('Failed to update status')
      }
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteReminder(id)
        toast.success('Reminder deleted')
      } catch {
        toast.error('Failed to delete reminder')
      }
    })
  }

  if (reminders.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No reminders yet. Create one to get started!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <Card key={reminder.id} className={`transition-all ${reminder.completed ? 'opacity-60 bg-muted/50' : ''}`}>
          <CardContent className="flex items-start gap-4 p-4">
            <Checkbox
              checked={reminder.completed}
              onCheckedChange={() => handleToggle(reminder.id, reminder.completed)}
              className="mt-1"
              disabled={isPending}
            />
            <div className="flex-1 space-y-1">
              <p className={`font-medium ${reminder.completed ? 'line-through text-muted-foreground' : ''}`}>
                {reminder.title}
              </p>
              {reminder.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {reminder.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(reminder.reminder_date), 'MMM d, yyyy')}
                </div>
                {reminder.reminder_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {reminder.reminder_time.slice(0, 5)}
                  </div>
                )}
                {reminder.priority !== 'medium' && (
                  <div className={`flex items-center gap-1 ${
                    reminder.priority === 'urgent' ? 'text-red-500' :
                    reminder.priority === 'high' ? 'text-orange-500' : ''
                  }`}>
                    <AlertCircle className="h-3 w-3" />
                    <span className="capitalize">{reminder.priority}</span>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => handleDelete(reminder.id)}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
