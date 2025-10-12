"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, Plus, Edit, Trash2, Download } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const inventoryData = [
  { id: 'MAR-001', name: 'Carrara White', type: 'Carrara', size: '300x300x20mm', quality: 'A+', quantity: 1250, unit: 'm²', location: 'Warehouse A', supplier: 'Italian Marble Co.', price: '€85/m²', image: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=200' },
  { id: 'MAR-002', name: 'Calacatta Gold', type: 'Calacatta', size: '600x600x30mm', quality: 'Premium', quantity: 890, unit: 'm²', location: 'Warehouse A', supplier: 'Luxury Stone Ltd.', price: '€145/m²', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200' },
  { id: 'MAR-003', name: 'Nero Marquina', type: 'Nero Marquina', size: '300x600x20mm', quality: 'A', quantity: 2150, unit: 'm²', location: 'Warehouse B', supplier: 'Spanish Stones', price: '€95/m²', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=200' },
  { id: 'MAR-004', name: 'Statuario Venato', type: 'Statuario', size: '600x300x30mm', quality: 'Premium', quantity: 720, unit: 'm²', location: 'Warehouse A', supplier: 'Italian Marble Co.', price: '€165/m²', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=200' },
  { id: 'MAR-005', name: 'Emperador Dark', type: 'Emperador', size: '400x400x20mm', quality: 'A+', quantity: 1450, unit: 'm²', location: 'Warehouse C', supplier: 'Global Marble', price: '€78/m²', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200' },
  { id: 'MAR-006', name: 'Travertino Romano', type: 'Travertine', size: '600x600x20mm', quality: 'A', quantity: 980, unit: 'm²', location: 'Warehouse B', supplier: 'Rome Stone', price: '€68/m²', image: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=200' },
  { id: 'MAR-007', name: 'Bianco Lasa', type: 'Lasa', size: '300x300x30mm', quality: 'Premium', quantity: 650, unit: 'm²', location: 'Warehouse A', supplier: 'Italian Marble Co.', price: '€125/m²', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=200' },
  { id: 'MAR-008', name: 'Rosso Verona', type: 'Verona', size: '600x300x20mm', quality: 'A+', quantity: 1120, unit: 'm²', location: 'Warehouse C', supplier: 'Verona Marble', price: '€92/m²', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=200' },
]

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterQuality, setFilterQuality] = useState('all')

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.type === filterType
    const matchesQuality = filterQuality === 'all' || item.quality === filterQuality
    return matchesSearch && matchesType && matchesQuality
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your marble stock and materials</p>
        </div>
        <Button className="gradient-orange text-white premium-shadow">
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
              placeholder="Search by name or ID..."
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

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredData.map((item) => (
          <Card key={item.id} className="group overflow-hidden glass-panel premium-shadow hover:scale-105 transition-transform duration-300">
            <div className="aspect-video relative overflow-hidden bg-muted">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                {item.quality}
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <span className="text-xs text-muted-foreground">{item.id}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.type}</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium">{item.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock:</span>
                  <span className="font-medium text-orange-500">{item.quantity} {item.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{item.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold">{item.price}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary */}
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
            <div className="text-3xl font-bold text-orange-500 mb-1">5</div>
            <div className="text-sm text-muted-foreground">Warehouses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-1">12</div>
            <div className="text-sm text-muted-foreground">Suppliers</div>
          </div>
        </div>
      </Card>
    </div>
  )
}