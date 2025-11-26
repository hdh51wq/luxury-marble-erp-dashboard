"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Scissors, Sparkles, Package, Truck, Clock, CheckCircle2, Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const stages = [
  { id: 'Cutting', name: 'Cutting', icon: Scissors, color: 'bg-blue-500' },
  { id: 'Polishing', name: 'Polishing', icon: Sparkles, color: 'bg-purple-500' },
  { id: 'Packaging', name: 'Packaging', icon: Package, color: 'bg-orange-500' },
  { id: 'Delivery', name: 'Delivery', icon: Truck, color: 'bg-green-500' },
]

const priorityLevels = [
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  { value: 'medium', label: 'Medium', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
]

const marbleTypes = [
  'Carrara White',
  'Nero Marquina',
  'Statuario',
  'Calacatta Gold',
  'Emperador Dark',
  'Travertino',
  'Bianco Lasa',
  'Rosso Verona',
  'Crema Marfil'
]

const getInitials = (name) => name.charAt(0).toUpperCase()

export default function Production() {
  const [tasks, setTasks] = useState([])
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deletingTask, setDeletingTask] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    orderName: '',
    marbleType: '',
    size: '',
    stage: 'Cutting',
    priority: 'medium',
    selectedEmployees: [],
    progress: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  })

  // Fetch production orders and employees
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [ordersRes, employeesRes] = await Promise.all([
        fetch('/api/production'),
        fetch('/api/employees')
      ])
      
      const ordersData = await ordersRes.json()
      const employeesData = await employeesRes.json()
      
      setTasks(ordersData)
      setEmployees(employeesData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDialog = (task = null) => {
    if (task) {
      // Parse the order info from orderId (format: "Type - Size - OrderID")
      const orderIdParts = task.orderId.split(' - ')
      const marbleType = orderIdParts[0] || ''
      const size = orderIdParts[1] || ''
      const orderName = orderIdParts[2] || task.orderId
      
      setEditingTask(task)
      setFormData({
        orderName: orderName,
        marbleType: marbleType,
        size: size,
        stage: task.stage,
        priority: task.status,
        selectedEmployees: task.assignedEmployee ? task.assignedEmployee.split(', ') : [],
        progress: task.progress,
        startDate: task.startDate,
        endDate: task.endDate || ''
      })
    } else {
      setEditingTask(null)
      setFormData({
        orderName: '',
        marbleType: '',
        size: '',
        stage: 'Cutting',
        priority: 'medium',
        selectedEmployees: [],
        progress: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.orderName || !formData.marbleType || !formData.size || !formData.stage) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Create orderId by combining marble type, size, and order name
      const orderId = `${formData.marbleType} - ${formData.size} - ${formData.orderName}`
      
      const payload = {
        orderId: orderId,
        stage: formData.stage,
        progress: parseInt(formData.progress),
        assignedEmployee: formData.selectedEmployees.join(', '),
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        status: formData.priority
      }

      let response
      if (editingTask) {
        // Update existing order
        response = await fetch(`/api/production?id=${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        // Create new order
        response = await fetch('/api/production', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save production order')
      }

      toast.success(editingTask ? 'Production order updated successfully' : 'Production order created successfully')
      setIsDialogOpen(false)
      fetchData() // Refresh the list
    } catch (error) {
      console.error('Error saving production order:', error)
      toast.error(error.message || 'Failed to save production order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingTask) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/production?id=${deletingTask.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete production order')
      }

      toast.success('Production order deleted successfully')
      setIsDeleteDialogOpen(false)
      setDeletingTask(null)
      fetchData() // Refresh the list
    } catch (error) {
      console.error('Error deleting production order:', error)
      toast.error(error.message || 'Failed to delete production order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleEmployeeSelection = (employeeName) => {
    setFormData(prev => ({
      ...prev,
      selectedEmployees: prev.selectedEmployees.includes(employeeName)
        ? prev.selectedEmployees.filter(e => e !== employeeName)
        : [...prev.selectedEmployees, employeeName]
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Production Tracking</h1>
          <p className="text-muted-foreground">Monitor your production workflow from quarry to delivery</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gradient-orange text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Production Order
        </Button>
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
                {stageTasks.map((task) => {
                  const priorityConfig = priorityLevels.find(p => p.value === task.status) || priorityLevels[1]
                  const orderIdParts = task.orderId.split(' - ')
                  const marbleType = orderIdParts[0] || task.orderId
                  const size = orderIdParts[1] || ''
                  const orderName = orderIdParts[2] || ''
                  
                  return (
                    <Card key={task.id} className="p-4 glass-panel premium-shadow hover:scale-105 transition-transform duration-200">
                      {/* Priority Badge & Actions */}
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color}`}>
                          {priorityConfig.label.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1">
                          {task.progress === 100 && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleOpenDialog(task)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => {
                              setDeletingTask(task)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Task Info */}
                      <div className="space-y-2 mb-3">
                        <h4 className="font-semibold text-sm text-foreground">{marbleType}</h4>
                        <p className="text-xs text-muted-foreground">{orderName}</p>
                        {size && <p className="text-xs text-muted-foreground">Size: {size}</p>}
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
                          {task.assignedEmployee && task.assignedEmployee.split(', ').map((member, idx) => (
                            <Avatar key={idx} className="w-7 h-7 ring-2 ring-card">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member}`} />
                              <AvatarFallback className="text-xs">{getInitials(member)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {task.startDate}
                        </div>
                      </div>
                    </Card>
                  )
                })}
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
              {tasks.length > 0 ? Math.round(tasks.reduce((acc, t) => acc + t.progress, 0) / tasks.length) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Average Progress</div>
          </div>
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Production Order' : 'Add Production Order'}</DialogTitle>
            <DialogDescription>
              {editingTask ? 'Update the production order details' : 'Create a new production order with all necessary information'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Order Name */}
              <div className="space-y-2">
                <Label htmlFor="orderName">Order Name *</Label>
                <Input
                  id="orderName"
                  placeholder="e.g., #ORD-1250"
                  value={formData.orderName}
                  onChange={(e) => setFormData({ ...formData, orderName: e.target.value })}
                  required
                />
              </div>

              {/* Marble Type */}
              <div className="space-y-2">
                <Label htmlFor="marbleType">Marble Type *</Label>
                <Select value={formData.marbleType} onValueChange={(value) => setFormData({ ...formData, marbleType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marble type" />
                  </SelectTrigger>
                  <SelectContent>
                    {marbleTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <Label htmlFor="size">Size/Quantity *</Label>
                <Input
                  id="size"
                  placeholder="e.g., 250 m²"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  required
                />
              </div>

              {/* Stage */}
              <div className="space-y-2">
                <Label htmlFor="stage">Stage *</Label>
                <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level *</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityLevels.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            {/* Assigned Employees */}
            <div className="space-y-2">
              <Label>Assigned Employees</Label>
              <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                {employees.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No employees available</p>
                ) : (
                  employees.map((employee) => (
                    <label key={employee.id} className="flex items-center space-x-2 cursor-pointer hover:bg-muted p-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.selectedEmployees.includes(employee.name)}
                        onChange={() => toggleEmployeeSelection(employee.name)}
                        className="w-4 h-4"
                      />
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={employee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`} />
                        <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.department} - {employee.role}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-orange text-white" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingTask ? 'Update Order' : 'Create Order'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Production Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this production order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}