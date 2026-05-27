'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AnalyticsCharts({ 
  focusData, 
  reminderStats,
  taskTrendData
}: { 
  focusData: any[], 
  reminderStats: { completed: number, pending: number },
  taskTrendData?: any[]
}) {
  const COLORS = ['#10b981', '#64748b'] // Green for completed, Gray for pending

  const pieData = [
    { name: 'Completed', value: reminderStats.completed },
    { name: 'Pending', value: reminderStats.pending },
  ]

  return (
    <div className="flex flex-col gap-4 h-full">
      <Card className="bg-black/20 backdrop-blur-md border border-white/5">
        <CardHeader>
          <CardTitle>Focus Time (Past 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          {focusData.every(d => d.hours === 0) ? (
            <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground text-sm flex-col gap-2">
              <span className="opacity-50">No focus sessions recorded this week.</span>
            </div>
          ) : (
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={focusData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}h`} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Bar dataKey="hours" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-black/20 backdrop-blur-md border border-white/5">
          <CardHeader>
            <CardTitle>Reminder Completion</CardTitle>
          </CardHeader>
          <CardContent>
            {reminderStats.completed === 0 && reminderStats.pending === 0 ? (
              <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground text-sm">
                <span className="opacity-50">No reminders created.</span>
              </div>
            ) : (
              <div className="h-[250px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="flex justify-center gap-4 text-sm mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                <span>Completed ({reminderStats.completed})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#64748b]"></div>
                <span>Pending ({reminderStats.pending})</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {taskTrendData && (
          <Card className="bg-black/20 backdrop-blur-md border border-white/5">
            <CardHeader>
              <CardTitle>Daily Task Completion</CardTitle>
            </CardHeader>
            <CardContent>
              {taskTrendData.every(d => d.completion === 0) ? (
                <div className="h-[250px] w-full mt-4 flex items-center justify-center text-muted-foreground text-sm">
                  <span className="opacity-50">No tasks completed this week.</span>
                </div>
              ) : (
                <div className="h-[250px] w-full mt-4 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={taskTrendData}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                      <Tooltip cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="completion" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6', stroke: 'transparent' }} activeDot={{ r: 6, fill: '#60a5fa' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="flex justify-center gap-4 text-sm mt-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>Weekly trend (past 7 days)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
