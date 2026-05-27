'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createHabit } from './actions'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function CreateHabitForm({ onCreated }: { onCreated?: (id: string, meta: { priority: 'low' | 'medium' | 'high'; targetTime: string }) => void }) {
  const [open, setOpen] = useState(false)
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [targetTime, setTargetTime] = useState('')
  const [isPending, setIsPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    try {
      const habit = await createHabit(formData)
      if (onCreated && habit) {
        onCreated(habit.id, { priority, targetTime })
      }
      toast.success('Habit created successfully')
      setOpen(false)
      setPriority('medium')
      setTargetTime('')
    } catch {
      toast.error('Failed to create habit')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all" />}>
        <Plus className="mr-2 h-4 w-4" /> New Habit
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Read for 20 mins" className="bg-black/20" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(val) => { if (val) setPriority(val) }}>
              <SelectTrigger className="bg-black/20">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="targetTime">Target Time (Optional)</Label>
            <Input 
              id="targetTime" 
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              placeholder="e.g. Morning, 8:00 AM" 
              className="bg-black/20" 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="color">Theme Color</Label>
            <div className="flex gap-2 items-center">
              <Input id="color" name="color" type="color" defaultValue="#3b82f6" className="w-14 h-10 p-1 cursor-pointer bg-black/20" />
              <span className="text-xs text-muted-foreground">Used for charts and highlights</span>
            </div>
          </div>
          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending ? 'Creating...' : 'Save Habit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

