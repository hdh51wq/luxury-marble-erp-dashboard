"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AddEmployeeDialog({ onEmployeeAdded }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast.error('Tous les champs sont obligatoires')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)

    try {
      // Map role to department
      const departmentMap = {
        stock: 'Stock',
        production: 'Production',
        ventes: 'Sales',
        employe: 'General',
        admin: 'Administration'
      }

      const requestBody = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: departmentMap[formData.role] || 'General'
      }

      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create employee')
      }

      toast.success('Employé ajouté avec succès')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: ''
      })
      
      setOpen(false)
      
      // Notify parent component - API returns employee directly, not wrapped
      if (onEmployeeAdded) {
        onEmployeeAdded(data)
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      toast.error(error.message || 'Erreur lors de l\'ajout de l\'employé')
    } finally {
      setLoading(false)
    }
  }

  const getRoleDescription = (role) => {
    switch(role) {
      case 'stock':
        return '→ Accès uniquement à la page Stock/Inventory'
      case 'production':
        return '→ Accès à Production, Dashboard et Analytics'
      case 'ventes':
        return '→ Accès à Sales & Clients, Dashboard et Analytics'
      case 'employe':
        return '→ Accès à Dashboard et Analytics'
      case 'admin':
        return '→ Accès complet à toutes les sections'
      default:
        return ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-orange text-white premium-shadow">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-panel">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Ajouter un Employé</DialogTitle>
          <DialogDescription>
            Créez un nouveau compte employé avec ses informations d'accès
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              type="text"
              placeholder="Jean Dupont"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={loading}
              className="h-11"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jean.dupont@marbrerie.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              className="h-11"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
              className="h-11"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">Minimum 6 caractères</p>
          </div>

          {/* Role Field */}
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              disabled={loading}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stock">Responsable Stock</SelectItem>
                <SelectItem value="production">Responsable Production</SelectItem>
                <SelectItem value="ventes">Responsable Ventes</SelectItem>
                <SelectItem value="employe">Employé</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {formData.role && (
              <p className="text-xs text-muted-foreground">
                {getRoleDescription(formData.role)}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="gradient-orange text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer l'employé
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}