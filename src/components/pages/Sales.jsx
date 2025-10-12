"use client"

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Plus, FileText, DollarSign, TrendingUp, Users } from 'lucide-react'

const clients = [
  { id: 'CLI-001', name: 'Robert Johnson', company: 'Hotel Royal Palace', email: 'robert@royalpalace.com', phone: '+1 234 567 8901', totalOrders: 12, totalSpent: '€142K', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert' },
  { id: 'CLI-002', name: 'Maria Garcia', company: 'Villa Moderne', email: 'maria@villamoderne.com', phone: '+1 234 567 8902', totalOrders: 8, totalSpent: '€98K', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' },
  { id: 'CLI-003', name: 'James Wilson', company: 'Office Tower', email: 'james@officetower.com', phone: '+1 234 567 8903', totalOrders: 15, totalSpent: '€186K', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
  { id: 'CLI-004', name: 'Sophie Martin', company: 'Luxury Residence', email: 'sophie@luxuryres.com', phone: '+1 234 567 8904', totalOrders: 6, totalSpent: '€75K', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie' },
  { id: 'CLI-005', name: 'David Lee', company: 'Grand Hotel', email: 'david@grandhotel.com', phone: '+1 234 567 8905', totalOrders: 10, totalSpent: '€125K', status: 'inactive', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { id: 'CLI-006', name: 'Emily Brown', company: 'Modern Villa', email: 'emily@modernvilla.com', phone: '+1 234 567 8906', totalOrders: 4, totalSpent: '€52K', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
]

const projects = [
  { id: 'PRJ-001', name: 'Palace Renovation Phase 2', client: 'Hotel Royal Palace', value: '€85K', status: 'ongoing', progress: 65, deadline: '2024-02-15' },
  { id: 'PRJ-002', name: 'Office Lobby Flooring', client: 'Office Tower', value: '€120K', status: 'ongoing', progress: 45, deadline: '2024-02-20' },
  { id: 'PRJ-003', name: 'Luxury Bath Installation', client: 'Luxury Residence', value: '€45K', status: 'ongoing', progress: 80, deadline: '2024-01-30' },
  { id: 'PRJ-004', name: 'Villa Kitchen Counters', client: 'Villa Moderne', value: '€38K', status: 'completed', progress: 100, deadline: '2024-01-15' },
  { id: 'PRJ-005', name: 'Hotel Spa Upgrade', client: 'Grand Hotel', value: '€92K', status: 'pending', progress: 0, deadline: '2024-03-01' },
]

export default function Sales() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Sales & Client Management</h1>
          <p className="text-muted-foreground">Manage clients, projects, and generate quotations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Generate Quote
          </Button>
          <Button className="gradient-orange text-white premium-shadow">
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </div>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 glass-panel premium-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center premium-shadow">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{clients.length}</div>
          <div className="text-sm text-muted-foreground">Total Clients</div>
        </Card>
        <Card className="p-6 glass-panel premium-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center premium-shadow">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{projects.length}</div>
          <div className="text-sm text-muted-foreground">Active Projects</div>
        </Card>
        <Card className="p-6 glass-panel premium-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center premium-shadow">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">€678K</div>
          <div className="text-sm text-muted-foreground">Total Revenue</div>
        </Card>
        <Card className="p-6 glass-panel premium-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center premium-shadow">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">+24%</div>
          <div className="text-sm text-muted-foreground">Growth Rate</div>
        </Card>
      </div>

      {/* Projects */}
      <Card className="p-6 glass-panel premium-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Ongoing Projects</h3>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center space-x-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{project.name}</h4>
                    <p className="text-xs text-muted-foreground">{project.client}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-foreground">{project.value}</div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'completed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : project.status === 'ongoing'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full gradient-orange transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">Due: {project.deadline}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Clients */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Client List</h3>
          <Card className="p-2 glass-panel">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="pl-9 h-9 w-64"
              />
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="p-6 glass-panel premium-shadow hover:scale-105 transition-transform duration-300">
              <div className="flex items-start space-x-4 mb-4">
                <Avatar className="w-14 h-14 ring-2 ring-orange-500">
                  <AvatarImage src={client.avatar} />
                  <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{client.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{client.company}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    client.status === 'active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                  }`}>
                    {client.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Orders:</span>
                  <span className="font-medium">{client.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Spent:</span>
                  <span className="font-bold text-orange-500">{client.totalSpent}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
                <div className="truncate">{client.email}</div>
                <div>{client.phone}</div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">View Details</Button>
                <Button variant="outline" size="sm" className="flex-1">New Quote</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}