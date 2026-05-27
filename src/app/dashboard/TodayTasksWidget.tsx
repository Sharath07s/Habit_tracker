'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, Plus } from 'lucide-react'
import { addTodayTask, toggleTodayTaskComplete, deleteTodayTask } from './todayTasksActions'
import { format } from 'date-fns'
import { toast } from 'sonner'

export type DailyTask = {
  id: string
  title: string
  completed: boolean
  task_date: string
}

export function TodayTasksWidget({ initialTasks }: { initialTasks: DailyTask[] }) {
  const [tasks, setTasks] = useState<DailyTask[]>(initialTasks)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const todayStr = format(new Date(), 'yyyy-MM-dd')

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    setIsSubmitting(true)
    const title = newTaskTitle.trim()
    setNewTaskTitle('')
    
    // Optimistic UI update
    const tempId = crypto.randomUUID()
    setTasks(prev => [...prev, { id: tempId, title, completed: false, task_date: todayStr }])

    try {
      await addTodayTask(title, todayStr)
      // Note: revalidatePath in the action will refresh the page data
    } catch {
      toast.error('Failed to add task')
      setTasks(prev => prev.filter(t => t.id !== tempId)) // Revert
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggleComplete(id: string, completed: boolean) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed } : t))
    try {
      await toggleTodayTaskComplete(id, completed)
    } catch {
      toast.error('Failed to update task')
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t)) // Revert
    }
  }

  async function handleDelete(id: string) {
    const taskToDelete = tasks.find(t => t.id === id)
    setTasks(prev => prev.filter(t => t.id !== id))
    try {
      await deleteTodayTask(id)
    } catch {
      toast.error('Failed to delete task')
      if (taskToDelete) {
        setTasks(prev => [...prev, taskToDelete]) // Revert
      }
    }
  }

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Today Tasks</CardTitle>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mt-2">
          <div 
            className="bg-primary h-full transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-4">
        <form onSubmit={handleAddTask} className="flex gap-2">
          <Input
            placeholder="Add a task for today..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            disabled={isSubmitting}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newTaskTitle.trim() || isSubmitting}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] pr-1">
          {tasks.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No tasks for today. Add one to get started!
            </div>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id} 
                className="group flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Checkbox 
                    checked={task.completed} 
                    onCheckedChange={(checked) => handleToggleComplete(task.id, checked as boolean)}
                  />
                  <span className={`text-sm truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                  onClick={() => handleDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
