'use client'

import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type CalendarToolbarProps = {
  searchQuery: string
  setSearchQuery: (q: string) => void
  filter: string
  setFilter: (f: 'all' | 'today' | 'upcoming' | 'completed' | 'missed' | 'high-priority') => void
}

export function CalendarToolbar({ searchQuery, setSearchQuery, filter, setFilter }: CalendarToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
      
      {/* Search */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search reminders by title or description..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-black/20 border-white/10 text-sm h-10 w-full rounded-xl"
        />
      </div>

      {/* Filter */}
      <div className="w-full sm:w-[200px]">
        <Select value={filter} onValueChange={(val: any) => setFilter(val)}>
          <SelectTrigger className="w-full h-10 bg-black/20 border-white/10 rounded-xl">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <SelectValue placeholder="Filter..." />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-xl border-white/10">
            <SelectItem value="all">All Reminders</SelectItem>
            <SelectItem value="today">Today Only</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="high-priority">High Priority</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="missed">Missed / Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  )
}
