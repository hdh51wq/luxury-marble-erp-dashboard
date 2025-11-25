"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Gem, Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from '@/lib/auth-client'

export default function EmployeeLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && session?.user) {
      router.push('/')
    }
  }, [session, isPending, router])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error('Tous les champs sont obligatoires')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/employees/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store employee data in localStorage
      localStorage.setItem('employee_role', data.employee.role)
      localStorage.setItem('employee_data', JSON.stringify(data.employee))

      toast.success('Connexion réussie!')
      router.push('/')
    } catch (error) {
      console.error('Error during login:', error)
      toast.error(error.message || 'Identifiants invalides')
    } finally {
      setLoading(false)
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center marble-texture relative">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <Card className="relative z-10 w-full max-w-md mx-4 p-8 glass-panel premium-shadow">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-orange flex items-center justify-center premium-shadow mb-4">
            <Gem className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Marbrerie Carthage</h1>
          <p className="text-sm text-muted-foreground mt-1">Connexion Employé</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre.email@marbrerie.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              className="h-11"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
                className="h-11 pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 gradient-orange text-white premium-shadow"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>

        {/* Link to Admin Login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Vous êtes administrateur?{' '}
            <button
              onClick={() => router.push('/sign-in')}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Connexion Admin
            </button>
          </p>
        </div>
      </Card>
    </div>
  )
}
