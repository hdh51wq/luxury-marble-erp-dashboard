"use client"

import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Mail, Phone, MapPin } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Employee {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
  location: string
  hoursWorked: number
  performance: number
  avatar: string
  status: 'active' | 'vacation' | 'sick'
}

const employees: Employee[] = [
  { id: 'EMP-001', name: 'John Smith', role: 'Master Cutter', department: 'Production', email: 'john.smith@marbrerie.com', phone: '+1 234 567 8901', location: 'Warehouse A', hoursWorked: 168, performance: 95, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', status: 'active' },
  { id: 'EMP-002', name: 'Emma Wilson', role: 'Polishing Specialist', department: 'Production', email: 'emma.wilson@marbrerie.com', phone: '+1 234 567 8902', location: 'Warehouse B', hoursWorked: 165, performance: 92, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', status: 'active' },
  { id: 'EMP-003', name: 'Michael Brown', role: 'Quality Inspector', department: 'Quality Control', email: 'michael.brown@marbrerie.com', phone: '+1 234 567 8903', location: 'Main Office', hoursWorked: 160, performance: 88, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', status: 'active' },
  { id: 'EMP-004', name: 'Sarah Davis', role: 'Cutter Operator', department: 'Production', email: 'sarah.davis@marbrerie.com', phone: '+1 234 567 8904', location: 'Warehouse A', hoursWorked: 170, performance: 90, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', status: 'vacation' },
  { id: 'EMP-005', name: 'David Martinez', role: 'Polisher', department: 'Production', email: 'david.martinez@marbrerie.com', phone: '+1 234 567 8905', location: 'Warehouse B', hoursWorked: 162, performance: 87, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', status: 'active' },
  { id: 'EMP-006', name: 'Lisa Anderson', role: 'Packaging Lead', department: 'Logistics', email: 'lisa.anderson@marbrerie.com', phone: '+1 234 567 8906', location: 'Warehouse C', hoursWorked: 158, performance: 93, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', status: 'active' },
  { id: 'EMP-007', name: 'James Taylor', role: 'Senior Polisher', department: 'Production', email: 'james.taylor@marbrerie.com', phone: '+1 234 567 8907', location: 'Warehouse B', hoursWorked: 172, performance: 94, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', status: 'active' },
  { id: 'EMP-008', name: 'Anna White', role: 'Logistics Coordinator', department: 'Logistics', email: 'anna.white@marbrerie.com', phone: '+1 234 567 8908', location: 'Main Office', hoursWorked: 160, performance: 91, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna', status: 'sick' },
]

const performanceData = [
  { name: 'John', value: 95 },
  { name: 'Emma', value: 92 },
  { name: 'Lisa', value: 93 },
  { name: 'James', value: 94 },
  { name: 'Sarah', value: 90 },
  { name: 'Anna', value: 91 },
]

export default function Employees() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Employee Management</h1>
          <p className="text-muted-foreground">Manage your team and track performance</p>
        </div>
        <Button className="gradient-orange text-white premium-shadow">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 glass-panel premium-shadow">
          <div className="text-3xl font-bold text-foreground mb-1">{employees.length}</div>
          <div className="text-sm text-muted-foreground">Total Employees</div>
        </Card>
        <Card className="p-6 glass-panel premium-shadow">
          <div className="text-3xl font-bold text-green-500 mb-1">
            {employees.filter(e => e.status === 'active').length}
          </div>
          <div className="text-sm text-muted-foreground">Active</div>
        </Card>
        <Card className="p-6 glass-panel premium-shadow">
          <div className="text-3xl font-bold text-orange-500 mb-1">
            {Math.round(employees.reduce((acc, e) => acc + e.hoursWorked, 0) / employees.length)}
          </div>
          <div className="text-sm text-muted-foreground">Avg. Hours/Month</div>
        </Card>
        <Card className="p-6 glass-panel premium-shadow">
          <div className="text-3xl font-bold text-foreground mb-1">
            {Math.round(employees.reduce((acc, e) => acc + e.performance, 0) / employees.length)}%
          </div>
          <div className="text-sm text-muted-foreground">Avg. Performance</div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 glass-panel premium-shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search employees..."
            className="pl-10"
          />
        </div>
      </Card>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <Card key={employee.id} className="p-6 glass-panel premium-shadow hover:scale-105 transition-transform duration-300">
            <div className="flex items-start space-x-4 mb-4">
              <Avatar className="w-16 h-16 ring-2 ring-orange-500">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{employee.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{employee.role}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  employee.status === 'active' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : employee.status === 'vacation'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {employee.status}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-2" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mr-2" />
                {employee.phone}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                {employee.location}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Performance</span>
                  <span className="font-semibold text-foreground">{employee.performance}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full gradient-orange transition-all duration-500"
                    style={{ width: `${employee.performance}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Hours This Month</span>
                <span className="font-semibold text-foreground">{employee.hoursWorked}h</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card className="p-6 glass-panel premium-shadow">
        <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey="value" fill="#ff6b35" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}