"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, FileText, DollarSign, TrendingUp, Users, Pencil, Trash2, Eye, MessageSquare, Clock, Quote } from 'lucide-react'
import { toast } from 'sonner'

export default function Sales() {
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Dialog states
  const [clientDialogOpen, setClientDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [projectsDialogOpen, setProjectsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  // Form states
  const [editingClient, setEditingClient] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientNotes, setClientNotes] = useState([])
  const [clientProjects, setClientProjects] = useState([])
  const [deletingItem, setDeletingItem] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  })
  
  const [noteFormData, setNoteFormData] = useState({
    content: '',
    type: 'note'
  })
  
  const [projectFormData, setProjectFormData] = useState({
    name: '',
    budget: '',
    dueDate: '',
    status: 'pending',
    progress: 0
  })

  useEffect(() => {
    fetchClients()
    fetchProjects()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (!response.ok) throw new Error('Failed to fetch clients')
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Failed to fetch projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchClientDetails = async (clientId) => {
    try {
      const [notesRes, projectsRes] = await Promise.all([
        fetch(`/api/client-notes?clientId=${clientId}`),
        fetch(`/api/projects?clientId=${clientId}`)
      ])
      
      if (notesRes.ok) setClientNotes(await notesRes.json())
      if (projectsRes.ok) setClientProjects(await projectsRes.json())
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmitClient = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingClient 
        ? `/api/clients?id=${editingClient.id}` 
        : '/api/clients'
      
      const method = editingClient ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save client')
      }

      toast.success(editingClient ? 'Client updated successfully' : 'Client created successfully')
      setClientDialogOpen(false)
      resetForm()
      fetchClients()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitNote = async (e) => {
    e.preventDefault()
    if (!selectedClient) return

    try {
      const response = await fetch('/api/client-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClient.id,
          content: noteFormData.content,
          type: noteFormData.type
        })
      })

      if (!response.ok) throw new Error('Failed to create note')

      toast.success('Note added successfully')
      setNoteFormData({ content: '', type: 'note' })
      fetchClientDetails(selectedClient.id)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSubmitProject = async (e) => {
    e.preventDefault()
    if (!selectedClient) return

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectFormData.name,
          clientId: selectedClient.id,
          budget: parseInt(projectFormData.budget) * 100,
          dueDate: new Date(projectFormData.dueDate).toISOString(),
          status: projectFormData.status,
          progress: parseInt(projectFormData.progress)
        })
      })

      if (!response.ok) throw new Error('Failed to create project')

      toast.success('Project created successfully')
      setProjectFormData({ name: '', budget: '', dueDate: '', status: 'pending', progress: 0 })
      fetchClientDetails(selectedClient.id)
      fetchProjects()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleUpdateProject = async (projectId, updates) => {
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) throw new Error('Failed to update project')

      toast.success('Project updated successfully')
      fetchProjects()
      if (selectedClient) fetchClientDetails(selectedClient.id)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteClient = async () => {
    if (!deletingItem) return

    try {
      const response = await fetch(`/api/clients?id=${deletingItem.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete client')

      toast.success('Client deleted successfully')
      setDeleteDialogOpen(false)
      setDeletingItem(null)
      fetchClients()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete project')

      toast.success('Project deleted successfully')
      fetchProjects()
      if (selectedClient) fetchClientDetails(selectedClient.id)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const openEditDialog = (client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      address: client.address || '',
      status: client.status
    })
    setClientDialogOpen(true)
  }

  const openDetailsDialog = (client) => {
    setSelectedClient(client)
    fetchClientDetails(client.id)
    setDetailsDialogOpen(true)
  }

  const openProjectsDialog = () => {
    setProjectsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      status: 'active'
    })
    setEditingClient(null)
  }

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'active').length,
    totalProjects: projects.length,
    ongoingProjects: projects.filter(p => p.status === 'ongoing').length,
    totalRevenue: clients.reduce((sum, c) => sum + (c.totalRevenue || 0), 0),
    completedProjects: projects.filter(p => p.status === 'completed').length
  }

  if (loading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Sales & Client Management</h1>
          <p className="text-muted-foreground">Manage clients, projects, and generate quotations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={openProjectsDialog}>
            <FileText className="w-4 h-4 mr-2" />
            All Projects
          </Button>
          <Button 
            className="gradient-orange text-white premium-shadow"
            onClick={() => {
              resetForm()
              setClientDialogOpen(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 glass-panel premium-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center premium-shadow">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{stats.activeClients}</div>
          <div className="text-sm text-muted-foreground">Active Clients</div>
        </Card>
        <Card className="p-6 glass-panel premium-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center premium-shadow">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{stats.ongoingProjects}</div>
          <div className="text-sm text-muted-foreground">Ongoing Projects</div>
        </Card>
        <Card className="p-6 glass-panel premium-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center premium-shadow">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">€{(stats.totalRevenue / 100).toLocaleString()}K</div>
          <div className="text-sm text-muted-foreground">Total Revenue</div>
        </Card>
        <Card className="p-6 glass-panel premium-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center premium-shadow">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{stats.completedProjects}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Client List</h3>
        <Card className="p-2 glass-panel">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="pl-9 h-9 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const clientProjectCount = projects.filter(p => p.clientId === client.id).length
          const clientRevenue = (client.totalRevenue || 0) / 100

          return (
            <Card key={client.id} className="p-6 glass-panel premium-shadow hover:scale-105 transition-transform duration-300">
              <div className="flex items-start space-x-4 mb-4">
                <Avatar className="w-14 h-14 ring-2 ring-orange-500">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${client.name}`} />
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
                  <span className="text-muted-foreground">Total Projects:</span>
                  <span className="font-medium">{clientProjectCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Revenue:</span>
                  <span className="font-bold text-orange-500">€{clientRevenue.toLocaleString()}K</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
                <div className="truncate">{client.email}</div>
                <div>{client.phone}</div>
                {client.address && <div className="truncate">{client.address}</div>}
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => openDetailsDialog(client)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openEditDialog(client)}
                >
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setDeletingItem(client)
                    setDeleteDialogOpen(true)
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* New/Edit Client Dialog */}
      <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Edit Client' : 'New Client'}</DialogTitle>
            <DialogDescription>
              {editingClient ? 'Update client information' : 'Add a new client to your system'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitClient} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Client Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setClientDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-orange text-white" disabled={loading}>
                {loading ? 'Saving...' : editingClient ? 'Update Client' : 'Create Client'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Client Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Client Details - {selectedClient?.name}</DialogTitle>
            <DialogDescription>{selectedClient?.company}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="notes">Notes & Quotes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Contact Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{selectedClient?.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{selectedClient?.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Address:</span>
                    <p className="font-medium">{selectedClient?.address || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="font-medium capitalize">{selectedClient?.status}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Revenue:</span>
                    <p className="font-bold text-orange-500">€{((selectedClient?.totalRevenue || 0) / 100).toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Client Projects</h4>
                <Button size="sm" onClick={() => setProjectFormData({...projectFormData})}>
                  <Plus className="w-3 h-3 mr-1" />
                  New Project
                </Button>
              </div>

              <form onSubmit={handleSubmitProject} className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name *</Label>
                    <Input
                      id="projectName"
                      value={projectFormData.name}
                      onChange={(e) => setProjectFormData({...projectFormData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (€) *</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={projectFormData.budget}
                      onChange={(e) => setProjectFormData({...projectFormData, budget: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={projectFormData.dueDate}
                      onChange={(e) => setProjectFormData({...projectFormData, dueDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectStatus">Status *</Label>
                    <Select 
                      value={projectFormData.status} 
                      onValueChange={(value) => setProjectFormData({...projectFormData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" size="sm" className="gradient-orange text-white">
                  Add Project
                </Button>
              </form>

              <div className="space-y-3">
                {clientProjects.map((project) => (
                  <Card key={project.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-semibold">{project.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          Budget: €{(project.budget / 100).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          project.status === 'ongoing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                          project.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {project.status}
                        </span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="h-full gradient-orange rounded-full transition-all"
                          style={{width: `${project.progress}%`}}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(project.dueDate).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={project.progress}
                            onChange={(e) => handleUpdateProject(project.id, { progress: parseInt(e.target.value) })}
                            className="w-16 h-7 text-xs"
                          />
                          <Select 
                            value={project.status}
                            onValueChange={(value) => handleUpdateProject(project.id, { status: value })}
                          >
                            <SelectTrigger className="w-24 h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="ongoing">Ongoing</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <form onSubmit={handleSubmitNote} className="p-4 border rounded-lg space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="noteType">Type</Label>
                  <Select 
                    value={noteFormData.type} 
                    onValueChange={(value) => setNoteFormData({...noteFormData, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="note">Note</SelectItem>
                      <SelectItem value="quote">Quote</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noteContent">Message</Label>
                  <Textarea
                    id="noteContent"
                    value={noteFormData.content}
                    onChange={(e) => setNoteFormData({...noteFormData, content: e.target.value})}
                    rows={3}
                    required
                  />
                </div>
                <Button type="submit" size="sm" className="gradient-orange text-white">
                  Add Note
                </Button>
              </form>

              <div className="space-y-3">
                {clientNotes.map((note) => (
                  <Card key={note.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        note.type === 'quote' ? 'bg-blue-100 dark:bg-blue-900' :
                        note.type === 'reminder' ? 'bg-yellow-100 dark:bg-yellow-900' :
                        'bg-gray-100 dark:bg-gray-900'
                      }`}>
                        {note.type === 'quote' ? <Quote className="w-5 h-5" /> :
                         note.type === 'reminder' ? <Clock className="w-5 h-5" /> :
                         <MessageSquare className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-medium capitalize px-2 py-1 rounded bg-muted">
                            {note.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* All Projects Dialog */}
      <Dialog open={projectsDialogOpen} onOpenChange={setProjectsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Projects</DialogTitle>
            <DialogDescription>View and manage all ongoing and completed projects</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {['ongoing', 'pending', 'completed', 'cancelled'].map((status) => {
              const statusProjects = projects.filter(p => p.status === status)
              if (statusProjects.length === 0) return null

              return (
                <div key={status}>
                  <h4 className="font-semibold capitalize mb-3 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      status === 'completed' ? 'bg-green-500' :
                      status === 'ongoing' ? 'bg-blue-500' :
                      status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    {status} ({statusProjects.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {statusProjects.map((project) => {
                      const client = clients.find(c => c.id === project.clientId)
                      return (
                        <Card key={project.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-semibold text-sm">{project.name}</h5>
                              <p className="text-xs text-muted-foreground">{client?.company || 'Unknown Client'}</p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Budget:</span>
                              <span className="font-semibold">€{(project.budget / 100).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Progress:</span>
                              <span className="font-semibold">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div 
                                className="h-full gradient-orange rounded-full transition-all"
                                style={{width: `${project.progress}%`}}
                              />
                            </div>
                            <div className="flex justify-between items-center pt-1">
                              <p className="text-xs text-muted-foreground">
                                Due: {new Date(project.dueDate).toLocaleDateString()}
                              </p>
                              <div className="flex gap-1">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={project.progress}
                                  onChange={(e) => handleUpdateProject(project.id, { progress: parseInt(e.target.value) })}
                                  className="w-14 h-6 text-xs"
                                />
                                <Select 
                                  value={project.status}
                                  onValueChange={(value) => handleUpdateProject(project.id, { status: value })}
                                >
                                  <SelectTrigger className="w-20 h-6 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="ongoing">Ongoing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
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
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deletingItem?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}