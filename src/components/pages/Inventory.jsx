"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, Edit, Trash2, Download, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterQuality, setFilterQuality] = useState('all')
  const [inventoryData, setInventoryData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    marbleType: '',
    size: '',
    quality: '',
    quantity: '',
    pricePerUnit: '',
    location: ''
  })

  // Fetch inventory data
  const fetchInventory = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/inventory')
      if (!response.ok) throw new Error('Failed to fetch inventory')
      const data = await response.json()
      setInventoryData(data)
    } catch (error) {
      toast.error('Failed to load inventory data')
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  // Filter data
  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.marbleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.marbleType === filterType
    const matchesQuality = filterQuality === 'all' || item.quality === filterQuality
    return matchesSearch && matchesType && matchesQuality
  })

  // Open dialog for adding new item
  const handleAddNew = () => {
    setEditingItem(null)
    setFormData({
      marbleType: '',
      size: '',
      quality: '',
      quantity: '',
      pricePerUnit: '',
      location: ''
    })
    setIsDialogOpen(true)
  }

  // Open dialog for editing existing item
  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      marbleType: item.marbleType,
      size: item.size,
      quality: item.quality,
      quantity: item.quantity.toString(),
      pricePerUnit: item.pricePerUnit.toString(),
      location: item.location
    })
    setIsDialogOpen(true)
  }

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.marbleType || !formData.size || !formData.quality || 
        !formData.quantity || !formData.pricePerUnit || !formData.location) {
      toast.error('All fields are required')
      return
    }

    if (parseInt(formData.quantity) <= 0) {
      toast.error('Quantity must be greater than 0')
      return
    }

    if (parseInt(formData.pricePerUnit) <= 0) {
      toast.error('Price must be greater than 0')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        marbleType: formData.marbleType,
        size: formData.size,
        quality: formData.quality,
        quantity: parseInt(formData.quantity),
        pricePerUnit: parseInt(formData.pricePerUnit),
        location: formData.location
      }

      let response
      if (editingItem) {
        // Update existing item
        response = await fetch(`/api/inventory?id=${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        // Create new item
        response = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save item')
      }

      toast.success(editingItem ? 'Item updated successfully' : 'Item added successfully')
      setIsDialogOpen(false)
      fetchInventory() // Refresh data
    } catch (error) {
      toast.error(error.message)
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open delete confirmation dialog
  const handleDeleteClick = (item) => {
    setItemToDelete(item)
    setIsDeleteDialogOpen(true)
  }

  // Delete item
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return

    try {
      const response = await fetch(`/api/inventory?id=${itemToDelete.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete item')

      toast.success('Item deleted successfully')
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
      fetchInventory() // Refresh data
    } catch (error) {
      toast.error('Failed to delete item')
      console.error('Delete error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your marble stock and materials</p>
        </div>
        <Button onClick={handleAddNew} className="gradient-orange text-white premium-shadow">
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 glass-panel premium-shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by marble type or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Marble Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Carrara">Carrara</SelectItem>
              <SelectItem value="Calacatta">Calacatta</SelectItem>
              <SelectItem value="Nero Marquina">Nero Marquina</SelectItem>
              <SelectItem value="Statuario">Statuario</SelectItem>
              <SelectItem value="Emperador">Emperador</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterQuality} onValueChange={setFilterQuality}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Qualities</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A">A</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full md:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      )}

      {/* Inventory Grid */}
      {!isLoading && filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredData.map((item) => (
            <Card key={item.id} className="group overflow-hidden glass-panel premium-shadow hover:scale-105 transition-transform duration-300">
              <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/10">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-6xl font-bold text-orange-500/20">{item.marbleType.substring(0, 2).toUpperCase()}</div>
                </div>
                <div className="absolute top-2 right-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                  {item.quality}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{item.marbleType}</h3>
                    <span className="text-xs text-muted-foreground">#{item.id}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">{item.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock:</span>
                    <span className="font-medium text-orange-500">{item.quantity} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{item.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-semibold">€{item.pricePerUnit}/m²</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex gap-2">
                  <Button onClick={() => handleEdit(item)} variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button onClick={() => handleDeleteClick(item)} variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredData.length === 0 && (
        <Card className="p-12 text-center glass-panel">
          <p className="text-muted-foreground">No inventory items found</p>
        </Card>
      )}

      {/* Summary */}
      {!isLoading && filteredData.length > 0 && (
        <Card className="p-6 glass-panel premium-shadow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">{filteredData.length}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {filteredData.reduce((acc, item) => acc + item.quantity, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Stock (m²)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-1">
                {new Set(filteredData.map(item => item.location)).size}
              </div>
              <div className="text-sm text-muted-foreground">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                €{filteredData.reduce((acc, item) => acc + (item.quantity * item.pricePerUnit), 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
          </div>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the details of this marble inventory item.' : 'Enter the details to add a new marble item to inventory.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="marbleType">Marble Type *</Label>
                <Input
                  id="marbleType"
                  placeholder="e.g., Carrara, Calacatta, Nero Marquina"
                  value={formData.marbleType}
                  onChange={(e) => handleInputChange('marbleType', e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="size">Size *</Label>
                <Input
                  id="size"
                  placeholder="e.g., 300x300x20mm"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quality">Quality *</Label>
                <Select value={formData.quality} onValueChange={(value) => handleInputChange('quality', value)}>
                  <SelectTrigger id="quality">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Stock Quantity (m²) *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="e.g., 1000"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pricePerUnit">Price (€/m²) *</Label>
                  <Input
                    id="pricePerUnit"
                    type="number"
                    min="1"
                    placeholder="e.g., 85"
                    value={formData.pricePerUnit}
                    onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Warehouse A"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                />
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
                  editingItem ? 'Update Item' : 'Add Item'
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <span className="font-semibold">{itemToDelete?.marbleType}</span> from your inventory. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}