import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background">
      <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl mb-6">
        Focus on what <br /> matters.
      </h1>
      <p className="text-muted-foreground max-w-[600px] text-lg sm:text-xl mb-8">
        A modern, distraction-free productivity platform that combines reminders, a calendar, habit tracking, and a focus timer.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" size="lg">Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
