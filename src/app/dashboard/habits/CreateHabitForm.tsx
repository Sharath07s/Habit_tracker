'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createHabit } from './actions'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

export function CreateHabitForm() {
  const [open, setOpen] = useState(false)
  
  async function onSubmit(formData: FormData) {
    try {
      await createHabit(formData)
      toast.success('Habit created successfully')
      setOpen(false)
    } catch (error) {
      toast.error('Failed to create habit')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" /> New Habit
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Habit</DialogTitle>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input id="name" name="name" required placeholder="Read for 20 mins" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="color">Color</Label>
            <Input id="color" name="color" type="color" defaultValue="#3b82f6" className="h-10 px-2 py-1 cursor-pointer" />
          </div>
          <Button type="submit" className="w-full mt-2">Save Habit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
