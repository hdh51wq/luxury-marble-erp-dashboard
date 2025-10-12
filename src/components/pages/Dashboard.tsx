"use client"

import { Card } from '@/components/ui/card'
import { Package, TrendingUp, Activity, DollarSign, ArrowUp, ArrowDown } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const kpiData = [
  {
    title: 'Total Stock',
    value: '8,524',
    unit: 'm²',
    change: '+12.5%',
    trend: 'up',
    icon: Package,
    color: 'bg-blue-500',
  },
  {
    title: 'Active Orders',
    value: '47',
    unit: 'orders',
    change: '+8.2%',
    trend: 'up',
    icon: Activity,
    color: 'bg-orange-500',
  },
  {
    title: 'Production Progress',
    value: '87%',
    unit: 'complete',
    change: '-2.1%',
    trend: 'down',
    icon: TrendingUp,
    color: 'bg-green-500',
  },
  {
    title: 'Monthly Revenue',
    value: '€542K',
    unit: 'this month',
    change: '+18.7%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-purple-500',
  },
]

const revenueData = [
  { month: 'Jan', revenue: 320 },
  { month: 'Feb', revenue: 380 },
  { month: 'Mar', revenue: 420 },
  { month: 'Apr', revenue: 390 },
  { month: 'May', revenue: 480 },
  { month: 'Jun', revenue: 542 },
]

const productionData = [
  { stage: 'Cutting', value: 35 },
  { stage: 'Polishing', value: 28 },
  { stage: 'Packaging', value: 22 },
  { stage: 'Delivery', value: 15 },
]

const marbleTypes = [
  { name: 'Carrara', value: 30, color: '#ff6b35' },
  { name: 'Calacatta', value: 25, color: '#000000' },
  { name: 'Nero Marquina', value: 20, color: '#6b7280' },
  { name: 'Statuario', value: 15, color: '#f59e0b' },
  { name: 'Others', value: 10, color: '#8b5cf6' },
]

const recentOrders = [
  { id: '#ORD-1245', client: 'Hotel Royal Palace', type: 'Carrara White', quantity: '250 m²', status: 'Processing', date: '2024-01-15' },
  { id: '#ORD-1244', client: 'Villa Moderne', type: 'Calacatta Gold', quantity: '180 m²', status: 'Delivered', date: '2024-01-14' },
  { id: '#ORD-1243', client: 'Office Tower', type: 'Nero Marquina', quantity: '320 m²', status: 'Cutting', date: '2024-01-14' },
  { id: '#ORD-1242', client: 'Luxury Residence', type: 'Statuario', quantity: '145 m²', status: 'Polishing', date: '2024-01-13' },
]

const machineActivity = [
  { name: 'Cutter A1', status: 'Active', progress: 87, operator: 'John Smith' },
  { name: 'Polisher B2', status: 'Active', progress: 65, operator: 'Emma Wilson' },
  { name: 'Cutter A2', status: 'Maintenance', progress: 0, operator: '-' },
  { name: 'Polisher B1', status: 'Active', progress: 92, operator: 'Michael Brown' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your marble operations overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index} className="p-6 glass-panel premium-shadow hover:scale-105 transition-transform duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                  <div className="flex items-baseline space-x-2 mb-2">
                    <h3 className="text-3xl font-bold text-foreground">{kpi.value}</h3>
                    <span className="text-sm text-muted-foreground">{kpi.unit}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {kpi.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl ${kpi.color} flex items-center justify-center premium-shadow`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6 glass-panel premium-shadow">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff6b35" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Production Stages */}
        <Card className="p-6 glass-panel premium-shadow">
          <h3 className="text-lg font-semibold mb-4">Production by Stage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="stage" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="value" fill="#ff6b35" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Marble Types Distribution */}
        <Card className="p-6 glass-panel premium-shadow">
          <h3 className="text-lg font-semibold mb-4">Stock by Marble Type</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marbleTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {marbleTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {marbleTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                  <span className="text-muted-foreground">{type.name}</span>
                </div>
                <span className="font-medium">{type.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Machine Activity */}
        <Card className="p-6 glass-panel premium-shadow xl:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Machine Activity</h3>
          <div className="space-y-4">
            {machineActivity.map((machine, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-sm">{machine.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        machine.status === 'Active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {machine.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">{machine.operator}</span>
                      <span className="text-sm font-semibold">{machine.progress}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full gradient-orange transition-all duration-500"
                      style={{ width: `${machine.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6 glass-panel premium-shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Client</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Marble Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Quantity</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium">{order.id}</td>
                  <td className="py-4 px-4 text-sm">{order.client}</td>
                  <td className="py-4 px-4 text-sm">{order.type}</td>
                  <td className="py-4 px-4 text-sm">{order.quantity}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : order.status === 'Processing'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}