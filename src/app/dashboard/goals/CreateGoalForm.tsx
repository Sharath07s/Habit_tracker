'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createGoal } from './actions'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

export function CreateGoalForm() {
  const [open, setOpen] = useState(false)
  
  async function onSubmit(formData: FormData) {
    try {
      await createGoal(formData)
      toast.success('Goal created successfully')
      setOpen(false)
    } catch (error) {
      toast.error('Failed to create goal')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" /> New Goal
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Goal</DialogTitle>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input id="title" name="title" required placeholder="Read 20 books" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="target">Target Amount (Number)</Label>
            <Input id="target" name="target" type="number" min="1" required placeholder="20" />
          </div>
          <Button type="submit" className="w-full mt-2">Save Goal</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
