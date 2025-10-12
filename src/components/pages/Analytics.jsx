"use client"

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Activity } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const monthlyData = [
  { month: 'Jul', sales: 320, production: 280, revenue: 420 },
  { month: 'Aug', sales: 380, production: 340, revenue: 480 },
  { month: 'Sep', sales: 420, production: 390, revenue: 520 },
  { month: 'Oct', sales: 390, production: 360, revenue: 490 },
  { month: 'Nov', sales: 480, production: 440, revenue: 580 },
  { month: 'Dec', sales: 542, production: 510, revenue: 642 },
]

const wasteData = [
  { month: 'Jul', waste: 8.5 },
  { month: 'Aug', waste: 7.8 },
  { month: 'Sep', waste: 6.9 },
  { month: 'Oct', waste: 6.2 },
  { month: 'Nov', waste: 5.5 },
  { month: 'Dec', waste: 4.8 },
]

const productMix = [
  { name: 'Carrara', value: 35, color: '#ff6b35' },
  { name: 'Calacatta', value: 28, color: '#000000' },
  { name: 'Nero Marquina', value: 18, color: '#6b7280' },
  { name: 'Statuario', value: 12, color: '#f59e0b' },
  { name: 'Others', value: 7, color: '#8b5cf6' },
]

const efficiencyData = [
  { department: 'Cutting', efficiency: 92 },
  { department: 'Polishing', efficiency: 88 },
  { department: 'Packaging', efficiency: 95 },
  { department: 'Delivery', efficiency: 90 },
  { department: 'Quality Control', efficiency: 94 },
]

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Insights</h1>
        <p className="text-muted-foreground">Comprehensive business intelligence and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="p-6 glass-panel premium-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Monthly Sales</p>
              <div className="flex items-baseline space-x-2 mb-2">
                <h3 className="text-3xl font-bold text-foreground">€542K</h3>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">+18.7%</span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center premium-shadow">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-panel premium-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Production Output</p>
              <div className="flex items-baseline space-x-2 mb-2">
                <h3 className="text-3xl font-bold text-foreground">510</h3>
                <span className="text-sm text-muted-foreground">units</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">+12.3%</span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center premium-shadow">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-panel premium-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Waste Reduction</p>
              <div className="flex items-baseline space-x-2 mb-2">
                <h3 className="text-3xl font-bold text-foreground">4.8%</h3>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingDown className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">-3.7%</span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center premium-shadow">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-panel premium-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Customer Growth</p>
              <div className="flex items-baseline space-x-2 mb-2">
                <h3 className="text-3xl font-bold text-foreground">+24</h3>
                <span className="text-sm text-muted-foreground">clients</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">+15.2%</span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center premium-shadow">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue & Production Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-6 glass-panel premium-shadow">
          <h3 className="text-lg font-semibold mb-4">Revenue & Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff6b35" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000000" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="sales" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 glass-panel premium-shadow">
          <h3 className="text-lg font-semibold mb-4">Waste Reduction Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={wasteData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="waste" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Product Mix & Efficiency */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-6 glass-panel premium-shadow">
          <h3 className="text-lg font-semibold mb-4">Product Mix Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productMix}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {productMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 glass-panel premium-shadow">
          <h3 className="text-lg font-semibold mb-4">Department Efficiency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={efficiencyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="department" type="category" stroke="#6b7280" width={120} />
              <Tooltip />
              <Bar dataKey="efficiency" fill="#ff6b35" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 glass-panel premium-shadow">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Top Performing Product</h3>
          <div className="text-2xl font-bold text-foreground mb-2">Carrara White</div>
          <div className="text-sm text-muted-foreground">35% of total sales</div>
          <div className="mt-4 w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="h-full gradient-orange" style={{ width: '35%' }} />
          </div>
        </Card>

        <Card className="p-6 glass-panel premium-shadow">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Average Order Value</h3>
          <div className="text-2xl font-bold text-foreground mb-2">€12,450</div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">+8.3%</span>
            <span className="text-xs text-muted-foreground">from last month</span>
          </div>
        </Card>

        <Card className="p-6 glass-panel premium-shadow">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Customer Satisfaction</h3>
          <div className="text-2xl font-bold text-foreground mb-2">4.8/5.0</div>
          <div className="text-sm text-muted-foreground">Based on 127 reviews</div>
          <div className="mt-4 flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className={`w-6 h-6 ${star <= 5 ? 'text-orange-500' : 'text-gray-300'}`}>★</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}