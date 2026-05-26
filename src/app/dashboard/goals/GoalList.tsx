'use client'

import { useTransition } from 'react'
import { Trash2, Plus, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { updateGoalProgress, deleteGoal } from './actions'
import { toast } from 'sonner'

type Goal = {
  id: string
  title: string
  target: number
  progress: number
}

export function GoalList({ goals }: { goals: Goal[] }) {
  const [isPending, startTransition] = useTransition()

  const handleUpdate = (id: string, newProgress: number) => {
    startTransition(async () => {
      try {
        await updateGoalProgress(id, newProgress)
      } catch {
        toast.error('Failed to update goal')
      }
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteGoal(id)
        toast.success('Goal deleted')
      } catch {
        toast.error('Failed to delete goal')
      }
    })
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No goals yet. Create one to start tracking progress!
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {goals.map((goal) => {
        const percentage = Math.min(100, Math.round((goal.progress / goal.target) * 100))
        const isComplete = goal.progress >= goal.target

        return (
          <Card key={goal.id} className={`overflow-hidden transition-all ${isComplete ? 'bg-muted/50 border-green-500/50' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <CardTitle className={`text-lg ${isComplete ? 'text-muted-foreground line-through' : ''}`}>
                {goal.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive h-8 w-8"
                onClick={() => handleDelete(goal.id)}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex justify-between text-sm mb-2">
                <span>{goal.progress} / {goal.target}</span>
                <span className="font-bold">{percentage}%</span>
              </div>
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-primary'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleUpdate(goal.id, Math.max(0, goal.progress - 1))}
                  disabled={isPending || goal.progress === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleUpdate(goal.id, goal.progress + 1)}
                  disabled={isPending || isComplete}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
