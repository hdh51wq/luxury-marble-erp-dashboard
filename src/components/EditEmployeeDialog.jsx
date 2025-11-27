"use client"

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Loader2, Pencil } from 'lucide-react'
import { toast } from 'sonner'

export default function EditEmployeeDialog({ employee, onEmployeeUpdated, open, setOpen }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    workingHours: 0,
    performanceScore: 90
  })

  // Populate form when employee changes
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        password: '', // Never pre-fill password
        role: employee.role || '',
        workingHours: employee.workingHours || 0,
        performanceScore: employee.performanceScore || 90
      })
    }
  }, [employee])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Le nom, l\'email et le rôle sont obligatoires')
      return
    }

    if (formData.password && formData.password.length < 6) {
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
        role: formData.role,
        department: departmentMap[formData.role] || 'General',
        workingHours: parseInt(formData.workingHours) || 0,
        performanceScore: parseInt(formData.performanceScore) || 90
      }

      // Only include password if it's been changed
      if (formData.password) {
        requestBody.password = formData.password
      }

      const response = await fetch(`/api/employees?id=${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update employee')
      }

      toast.success('Employé mis à jour avec succès')
      setOpen(false)
      
      // Notify parent component
      if (onEmployeeUpdated) {
        onEmployeeUpdated(data)
      }
    } catch (error) {
      console.error('Error updating employee:', error)
      toast.error(error.message || 'Erreur lors de la mise à jour')
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
      <DialogContent className="sm:max-w-[500px] glass-panel">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Modifier l'Employé</DialogTitle>
          <DialogDescription>
            Mettre à jour les informations de l'employé
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nom complet</Label>
            <Input
              id="edit-name"
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
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
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
            <Label htmlFor="edit-password">Nouveau mot de passe (optionnel)</Label>
            <Input
              id="edit-password"
              type="password"
              placeholder="Laisser vide pour ne pas changer"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
              className="h-11"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">Minimum 6 caractères si modifié</p>
          </div>

          {/* Role Field */}
          <div className="space-y-2">
            <Label htmlFor="edit-role">Rôle</Label>
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

          {/* Working Hours */}
          <div className="space-y-2">
            <Label htmlFor="edit-hours">Heures de travail (mois)</Label>
            <Input
              id="edit-hours"
              type="number"
              min="0"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              disabled={loading}
              className="h-11"
            />
          </div>

          {/* Performance Score */}
          <div className="space-y-2">
            <Label htmlFor="edit-performance">Score de performance (%)</Label>
            <Input
              id="edit-performance"
              type="number"
              min="0"
              max="100"
              value={formData.performanceScore}
              onChange={(e) => setFormData({ ...formData, performanceScore: e.target.value })}
              disabled={loading}
              className="h-11"
            />
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
                  Mise à jour...
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4 mr-2" />
                  Mettre à jour
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
