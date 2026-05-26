import Link from 'next/link'
import { Calendar, CheckSquare, Clock, LayoutDashboard, Target, LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/auth/actions'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Reminders', href: '/dashboard/reminders', icon: CheckSquare },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Habits', href: '/dashboard/habits', icon: Target },
  { name: 'Focus Timer', href: '/dashboard/focus', icon: Clock },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full md:w-64 border-r bg-muted/40 p-4 hidden md:flex flex-col">
        <div className="flex h-14 items-center mb-4">
          <span className="font-bold text-xl tracking-tight">Productivity</span>
        </div>
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto">
          <form action={logout}>
            <Button variant="ghost" className="w-full justify-start gap-3" type="submit">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <div className="md:hidden font-bold flex-1">Productivity</div>
          <div className="flex-1 hidden md:block"></div>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
