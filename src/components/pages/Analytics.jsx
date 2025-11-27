"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Activity, Pencil } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { toast } from 'sonner'

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
  const [editDialog, setEditDialog] = useState({ open: false, type: null, data: {} })
  
  // State for editable metrics
  const [metrics, setMetrics] = useState({
    monthlySales: { value: 542, change: 18.7 },
    productionOutput: { value: 510, change: 12.3 },
    wasteReduction: { value: 4.8, change: -3.7 },
    customerGrowth: { value: 24, change: 15.2 },
    topProduct: { name: 'Carrara White', percentage: 35 },
    averageOrder: { value: 12450, change: 8.3 },
    satisfaction: { rating: 4.8, reviews: 127 }
  })

  const openEditDialog = (type) => {
    let data = {}
    switch(type) {
      case 'monthlySales':
        data = { value: metrics.monthlySales.value, change: metrics.monthlySales.change }
        break
      case 'productionOutput':
        data = { value: metrics.productionOutput.value, change: metrics.productionOutput.change }
        break
      case 'wasteReduction':
        data = { value: metrics.wasteReduction.value, change: metrics.wasteReduction.change }
        break
      case 'customerGrowth':
        data = { value: metrics.customerGrowth.value, change: metrics.customerGrowth.change }
        break
      case 'topProduct':
        data = { name: metrics.topProduct.name, percentage: metrics.topProduct.percentage }
        break
      case 'averageOrder':
        data = { value: metrics.averageOrder.value, change: metrics.averageOrder.change }
        break
      case 'satisfaction':
        data = { rating: metrics.satisfaction.rating, reviews: metrics.satisfaction.reviews }
        break
    }
    setEditDialog({ open: true, type, data })
  }

  const handleSave = () => {
    const { type, data } = editDialog
    setMetrics(prev => ({
      ...prev,
      [type]: data
    }))
    setEditDialog({ open: false, type: null, data: {} })
    toast.success("Metric updated successfully!")
  }

  const updateDialogData = (field, value) => {
    setEditDialog(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Insights</h1>
        <p className="text-muted-foreground">Comprehensive business intelligence and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="p-6 glass-panel premium-shadow relative group">
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => openEditDialog('monthlySales')}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Monthly Sales</p>
              <div className="flex items-baseline space-x-2 mb-2">
                <h3 className="text-3xl font-bold text-foreground">€{metrics.monthlySales.value}K</h3>
              </div>
              <div className="flex items-center space-x-1">
                {metrics.monthlySales.change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${metrics.monthlySales.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.monthlySales.change >= 0 ? '+' : ''}{metrics.monthlySales.change}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center premium-shadow">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-panel premium-shadow relative group">
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => openEditDialog('productionOutput')}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Production Output</p>
              <div className="flex items-baseline space-x-2 mb-2">
                <h3 className="text-3xl font-bold text-foreground">{metrics.productionOutput.value}</h3>
                <span className="text-sm text-muted-foreground">units</span>
              </div>
              <div className="flex items-center space-x-1">
                {metrics.productionOutput.change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${metrics.productionOutput.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.productionOutput.change >= 0 ? '+' : ''}{metrics.productionOutput.change}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center premium-shadow">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-panel premium-shadow relative group">
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => openEditDialog('wasteReduction')}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Waste Reduction</p>
              <div className="flex items-baseline space-x-2 mb-2">
                <h3 className="text-3xl font-bold text-foreground">{metrics.wasteReduction.value}%</h3>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingDown className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-500">
                  {metrics.wasteReduction.change}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center premium-shadow">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 glass-panel premium-shadow relative group">
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => openEditDialog('customerGrowth')}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Customer Growth</p>
              <div className="flex items-baseline space-x-2 mb-2">
                <h3 className="text-3xl font-bold text-foreground">+{metrics.customerGrowth.value}</h3>
                <span className="text-sm text-muted-foreground">clients</span>
              </div>
              <div className="flex items-center space-x-1">
                {metrics.customerGrowth.change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${metrics.customerGrowth.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.customerGrowth.change >= 0 ? '+' : ''}{metrics.customerGrowth.change}%
                </span>
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
        <Card className="p-6 glass-panel premium-shadow relative group">
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => openEditDialog('topProduct')}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Top Performing Product</h3>
          <div className="text-2xl font-bold text-foreground mb-2">{metrics.topProduct.name}</div>
          <div className="text-sm text-muted-foreground">{metrics.topProduct.percentage}% of total sales</div>
          <div className="mt-4 w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="h-full gradient-orange" style={{ width: `${metrics.topProduct.percentage}%` }} />
          </div>
        </Card>

        <Card className="p-6 glass-panel premium-shadow relative group">
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => openEditDialog('averageOrder')}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Average Order Value</h3>
          <div className="text-2xl font-bold text-foreground mb-2">€{metrics.averageOrder.value.toLocaleString()}</div>
          <div className="flex items-center space-x-1">
            {metrics.averageOrder.change >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${metrics.averageOrder.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.averageOrder.change >= 0 ? '+' : ''}{metrics.averageOrder.change}%
            </span>
            <span className="text-xs text-muted-foreground">from last month</span>
          </div>
        </Card>

        <Card className="p-6 glass-panel premium-shadow relative group">
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => openEditDialog('satisfaction')}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Customer Satisfaction</h3>
          <div className="text-2xl font-bold text-foreground mb-2">{metrics.satisfaction.rating}/5.0</div>
          <div className="text-sm text-muted-foreground">Based on {metrics.satisfaction.reviews} reviews</div>
          <div className="mt-4 flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className={`w-6 h-6 ${star <= Math.round(metrics.satisfaction.rating) ? 'text-orange-500' : 'text-gray-300'}`}>★</div>
            ))}
          </div>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, type: null, data: {} })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Metric</DialogTitle>
            <DialogDescription>
              Update the values for this metric
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {editDialog.type === 'monthlySales' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="value">Monthly Sales (K€)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={editDialog.data.value || ''}
                    onChange={(e) => updateDialogData('value', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="change">Change (%)</Label>
                  <Input
                    id="change"
                    type="number"
                    step="0.1"
                    value={editDialog.data.change || ''}
                    onChange={(e) => updateDialogData('change', parseFloat(e.target.value))}
                  />
                </div>
              </>
            )}

            {editDialog.type === 'productionOutput' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="value">Production Output (units)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={editDialog.data.value || ''}
                    onChange={(e) => updateDialogData('value', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="change">Change (%)</Label>
                  <Input
                    id="change"
                    type="number"
                    step="0.1"
                    value={editDialog.data.change || ''}
                    onChange={(e) => updateDialogData('change', parseFloat(e.target.value))}
                  />
                </div>
              </>
            )}

            {editDialog.type === 'wasteReduction' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="value">Waste Reduction (%)</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.1"
                    value={editDialog.data.value || ''}
                    onChange={(e) => updateDialogData('value', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="change">Change (%)</Label>
                  <Input
                    id="change"
                    type="number"
                    step="0.1"
                    value={editDialog.data.change || ''}
                    onChange={(e) => updateDialogData('change', parseFloat(e.target.value))}
                  />
                </div>
              </>
            )}

            {editDialog.type === 'customerGrowth' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="value">New Clients</Label>
                  <Input
                    id="value"
                    type="number"
                    value={editDialog.data.value || ''}
                    onChange={(e) => updateDialogData('value', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="change">Change (%)</Label>
                  <Input
                    id="change"
                    type="number"
                    step="0.1"
                    value={editDialog.data.change || ''}
                    onChange={(e) => updateDialogData('change', parseFloat(e.target.value))}
                  />
                </div>
              </>
            )}

            {editDialog.type === 'topProduct' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={editDialog.data.name || ''}
                    onChange={(e) => updateDialogData('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="percentage">Sales Percentage (%)</Label>
                  <Input
                    id="percentage"
                    type="number"
                    value={editDialog.data.percentage || ''}
                    onChange={(e) => updateDialogData('percentage', parseInt(e.target.value))}
                  />
                </div>
              </>
            )}

            {editDialog.type === 'averageOrder' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="value">Average Order Value (€)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={editDialog.data.value || ''}
                    onChange={(e) => updateDialogData('value', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="change">Change (%)</Label>
                  <Input
                    id="change"
                    type="number"
                    step="0.1"
                    value={editDialog.data.change || ''}
                    onChange={(e) => updateDialogData('change', parseFloat(e.target.value))}
                  />
                </div>
              </>
            )}

            {editDialog.type === 'satisfaction' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="rating">Customer Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editDialog.data.rating || ''}
                    onChange={(e) => updateDialogData('rating', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviews">Number of Reviews</Label>
                  <Input
                    id="reviews"
                    type="number"
                    value={editDialog.data.reviews || ''}
                    onChange={(e) => updateDialogData('reviews', parseInt(e.target.value))}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, type: null, data: {} })}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}