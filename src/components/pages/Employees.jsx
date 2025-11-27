"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Mail, Phone, MapPin, Loader2, Pencil, Trash2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import AddEmployeeDialog from '@/components/AddEmployeeDialog'
import EditEmployeeDialog from '@/components/EditEmployeeDialog'
import DeleteEmployeeDialog from '@/components/DeleteEmployeeDialog'
import { toast } from 'sonner'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [editEmployee, setEditEmployee] = useState(null)
  const [deleteEmployee, setDeleteEmployee] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/employees')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch employees')
      }
      
      setEmployees(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast.error('Erreur lors du chargement des employés')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleEmployeeAdded = (newEmployee) => {
    setEmployees([...employees, newEmployee])
  }

  const handleEmployeeUpdated = (updatedEmployee) => {
    setEmployees(employees.map(emp => 
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    ))
  }

  const handleEmployeeDeleted = (deletedId) => {
    setEmployees(employees.filter(emp => emp.id !== deletedId))
  }

  const openEditDialog = (employee) => {
    setEditEmployee(employee)
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (employee) => {
    setDeleteEmployee(employee)
    setDeleteDialogOpen(true)
  }

  const filteredEmployees = employees.filter(emp => {
    if (!emp) return false
    
    const name = (emp.name || '').toLowerCase()
    const email = (emp.email || '').toLowerCase()
    const role = (emp.role || '').toLowerCase()
    const query = (searchQuery || '').toLowerCase()
    
    return name.includes(query) || email.includes(query) || role.includes(query)
  })

  const performanceData = filteredEmployees
    .slice(0, 6)
    .map(emp => ({
      name: emp.name?.split(' ')[0] || 'N/A',
      value: emp.performanceScore || 90
    }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Employee Management</h1>
          <p className="text-muted-foreground">Manage your team and track performance</p>
        </div>
        <AddEmployeeDialog onEmployeeAdded={handleEmployeeAdded} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 glass-panel premium-shadow">
          <div className="text-3xl font-bold text-foreground mb-1">{employees.length}</div>
          <div className="text-sm text-muted-foreground">Total Employees</div>
        </Card>
        <Card className="p-6 glass-panel premium-shadow">
          <div className="text-3xl font-bold text-green-500 mb-1">
            {employees.length}
          </div>
          <div className="text-sm text-muted-foreground">Active</div>
        </Card>
        <Card className="p-6 glass-panel premium-shadow">
          <div className="text-3xl font-bold text-orange-500 mb-1">
            {employees.length > 0 ? Math.round(employees.filter(e => e).reduce((acc, e) => acc + (e.workingHours || 0), 0) / employees.length) : 0}
          </div>
          <div className="text-sm text-muted-foreground">Avg. Hours/Month</div>
        </Card>
        <Card className="p-6 glass-panel premium-shadow">
          <div className="text-3xl font-bold text-foreground mb-1">
            {employees.length > 0 ? Math.round(employees.filter(e => e).reduce((acc, e) => acc + (e.performanceScore || 90), 0) / employees.length) : 0}%
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* Employee Grid */}
      {filteredEmployees.length === 0 ? (
        <Card className="p-12 glass-panel premium-shadow text-center">
          <p className="text-muted-foreground">Aucun employé trouvé</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="p-6 glass-panel premium-shadow hover:scale-105 transition-transform duration-300">
              <div className="flex items-start space-x-4 mb-4">
                <Avatar className="w-16 h-16 ring-2 ring-orange-500">
                  <AvatarImage src={employee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.email}`} />
                  <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{employee.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2 capitalize">{employee.role}</p>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    active
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => openEditDialog(employee)}
                    className="h-8 w-8"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => openDeleteDialog(employee)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  N/A
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  {employee.department || 'N/A'}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Performance</span>
                    <span className="font-semibold text-foreground">{employee.performanceScore || 90}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full gradient-orange transition-all duration-500"
                      style={{ width: `${employee.performanceScore || 90}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hours This Month</span>
                  <span className="font-semibold text-foreground">{employee.workingHours || 0}h</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Performance Chart */}
      {performanceData.length > 0 && (
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
      )}

      {/* Edit Dialog */}
      {editEmployee && (
        <EditEmployeeDialog
          employee={editEmployee}
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          onEmployeeUpdated={handleEmployeeUpdated}
        />
      )}

      {/* Delete Dialog */}
      {deleteEmployee && (
        <DeleteEmployeeDialog
          employee={deleteEmployee}
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          onEmployeeDeleted={handleEmployeeDeleted}
        />
      )}
    </div>
  )
}