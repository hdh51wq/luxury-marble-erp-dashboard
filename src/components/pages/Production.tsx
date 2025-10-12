"use client"

import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Scissors, Sparkles, Package, Truck, Clock, CheckCircle2 } from 'lucide-react'

interface ProductionTask {
  id: string
  orderId: string
  client: string
  marbleType: string
  quantity: string
  stage: 'cutting' | 'polishing' | 'packaging' | 'delivery'
  progress: number
  assignedTo: string[]
  startDate: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
}

const stages = [
  { id: 'cutting', name: 'Cutting', icon: Scissors, color: 'bg-blue-500' },
  { id: 'polishing', name: 'Polishing', icon: Sparkles, color: 'bg-purple-500' },
  { id: 'packaging', name: 'Packaging', icon: Package, color: 'bg-orange-500' },
  { id: 'delivery', name: 'Delivery', icon: Truck, color: 'bg-green-500' },
]

const tasks: ProductionTask[] = [
  { id: 'TASK-001', orderId: '#ORD-1245', client: 'Hotel Royal Palace', marbleType: 'Carrara White', quantity: '250 m²', stage: 'cutting', progress: 65, assignedTo: ['John', 'Mike'], startDate: '2024-01-15', dueDate: '2024-01-20', priority: 'high' },
  { id: 'TASK-002', orderId: '#ORD-1243', client: 'Office Tower', marbleType: 'Nero Marquina', quantity: '320 m²', stage: 'cutting', progress: 45, assignedTo: ['Sarah'], startDate: '2024-01-14', dueDate: '2024-01-22', priority: 'medium' },
  { id: 'TASK-003', orderId: '#ORD-1242', client: 'Luxury Residence', marbleType: 'Statuario', quantity: '145 m²', stage: 'polishing', progress: 80, assignedTo: ['Emma', 'James'], startDate: '2024-01-13', dueDate: '2024-01-18', priority: 'high' },
  { id: 'TASK-004', orderId: '#ORD-1240', client: 'Grand Hotel', marbleType: 'Calacatta Gold', quantity: '180 m²', stage: 'polishing', progress: 55, assignedTo: ['David'], startDate: '2024-01-12', dueDate: '2024-01-19', priority: 'medium' },
  { id: 'TASK-005', orderId: '#ORD-1238', client: 'Modern Villa', marbleType: 'Emperador Dark', quantity: '95 m²', stage: 'packaging', progress: 90, assignedTo: ['Lisa', 'Tom'], startDate: '2024-01-10', dueDate: '2024-01-16', priority: 'low' },
  { id: 'TASK-006', orderId: '#ORD-1235', client: 'Business Center', marbleType: 'Travertino', quantity: '210 m²', stage: 'packaging', progress: 70, assignedTo: ['Anna'], startDate: '2024-01-09', dueDate: '2024-01-17', priority: 'medium' },
  { id: 'TASK-007', orderId: '#ORD-1230', client: 'Luxury Apartment', marbleType: 'Bianco Lasa', quantity: '125 m²', stage: 'delivery', progress: 100, assignedTo: ['Robert'], startDate: '2024-01-08', dueDate: '2024-01-15', priority: 'high' },
  { id: 'TASK-008', orderId: '#ORD-1228', client: 'Restaurant Elite', marbleType: 'Rosso Verona', quantity: '85 m²', stage: 'delivery', progress: 95, assignedTo: ['Chris'], startDate: '2024-01-07', dueDate: '2024-01-14', priority: 'low' },
]

const getInitials = (name: string) => name.charAt(0).toUpperCase()

export default function Production() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Production Tracking</h1>
        <p className="text-muted-foreground">Monitor your production workflow from quarry to delivery</p>
      </div>

      {/* Stage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stages.map((stage) => {
          const Icon = stage.icon
          const stageTasks = tasks.filter(t => t.stage === stage.id)
          return (
            <Card key={stage.id} className="p-6 glass-panel premium-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stage.color} flex items-center justify-center premium-shadow`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-foreground">{stageTasks.length}</span>
              </div>
              <h3 className="font-semibold text-lg mb-1">{stage.name}</h3>
              <p className="text-sm text-muted-foreground">Active tasks</p>
            </Card>
          )
        })}
      </div>

      {/* Workflow Board */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {stages.map((stage) => {
          const Icon = stage.icon
          const stageTasks = tasks.filter(t => t.stage === stage.id)
          
          return (
            <div key={stage.id} className="space-y-4">
              {/* Stage Header */}
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg ${stage.color} flex items-center justify-center premium-shadow`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{stage.name}</h3>
                  <p className="text-xs text-muted-foreground">{stageTasks.length} tasks</p>
                </div>
              </div>

              {/* Task Cards */}
              <div className="space-y-3">
                {stageTasks.map((task) => (
                  <Card key={task.id} className="p-4 glass-panel premium-shadow hover:scale-105 transition-transform duration-200">
                    {/* Priority Badge */}
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'high' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : task.priority === 'medium'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {task.priority.toUpperCase()}
                      </span>
                      {task.progress === 100 && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>

                    {/* Task Info */}
                    <div className="space-y-2 mb-3">
                      <h4 className="font-semibold text-sm text-foreground">{task.client}</h4>
                      <p className="text-xs text-muted-foreground">{task.orderId}</p>
                      <p className="text-sm text-foreground">{task.marbleType}</p>
                      <p className="text-xs text-muted-foreground">{task.quantity}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-foreground">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full gradient-orange transition-all duration-500"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Team & Dates */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex -space-x-2">
                        {task.assignedTo.map((member, idx) => (
                          <Avatar key={idx} className="w-7 h-7 ring-2 ring-card">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member}`} />
                            <AvatarFallback className="text-xs">{getInitials(member)}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.dueDate}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Production Stats */}
      <Card className="p-6 glass-panel premium-shadow">
        <h3 className="text-lg font-semibold mb-4">Production Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">{tasks.length}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-1">
              {tasks.filter(t => t.progress === 100).length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">
              {tasks.filter(t => t.progress > 0 && t.progress < 100).length}
            </div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">
              {Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / tasks.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Average Progress</div>
          </div>
        </div>
      </Card>
    </div>
  )
}