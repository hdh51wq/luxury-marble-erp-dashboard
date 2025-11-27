"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import Dashboard from '@/components/pages/Dashboard'
import Inventory from '@/components/pages/Inventory'
import Production from '@/components/pages/Production'
import Employees from '@/components/pages/Employees'
import Sales from '@/components/pages/Sales'
import Analytics from '@/components/pages/Analytics'
import Settings from '@/components/pages/Settings'
import { useSession } from '@/lib/auth-client'
import { Card } from '@/components/ui/card'
import { ShieldAlert } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [employeeRole, setEmployeeRole] = useState(null)
  const [isLoadingRole, setIsLoadingRole] = useState(true)
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Wait for session to load completely
    if (isPending) {
      return
    }

    // If no session after loading, redirect to login
    if (!session?.user) {
      console.log('No session found, redirecting to sign-in')
      router.push('/sign-in')
      return
    }

    console.log('Session found:', session.user.email)

    // Fetch employee role from database using session email
    const fetchEmployeeRole = async () => {
      if (!session?.user?.email) {
        setIsLoadingRole(false)
        return
      }

      try {
        const token = localStorage.getItem('bearer_token')
        console.log('Fetching employee role with token:', token ? 'exists' : 'missing')
        
        const response = await fetch(`/api/employees?search=${encodeURIComponent(session.user.email)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const employees = await response.json()
          console.log('Employee data:', employees)
          
          if (employees.length > 0) {
            const userRole = employees[0].role
            console.log('User role:', userRole)
            setEmployeeRole(userRole)
            
            // Set default page based on role
            if (userRole === 'stock') {
              setActiveTab('inventory')
            } else if (userRole === 'production') {
              setActiveTab('production')
            } else if (userRole === 'ventes') {
              setActiveTab('sales')
            } else if (userRole === 'admin') {
              setActiveTab('dashboard')
            } else {
              setActiveTab('dashboard')
            }
          } else {
            // User exists in auth but not in employees table - treat as admin
            console.log('User not in employees table, treating as admin')
            setEmployeeRole('admin')
          }
        } else {
          console.error('Failed to fetch employee data:', response.status)
          // Default to admin if error
          setEmployeeRole('admin')
        }
      } catch (error) {
        console.error('Error fetching employee role:', error)
        // Default to admin if error
        setEmployeeRole('admin')
      } finally {
        setIsLoadingRole(false)
      }
    }

    fetchEmployeeRole()
  }, [session, isPending, router])

  // Check if user has access to the current tab
  const hasAccess = (tabId) => {
    if (!employeeRole) {
      return true
    }

    const rolePermissions = {
      admin: ['dashboard', 'inventory', 'production', 'employees', 'sales', 'analytics', 'settings'],
      stock: ['inventory'],
      production: ['production', 'dashboard', 'analytics'],
      ventes: ['sales', 'dashboard', 'analytics'],
      employe: ['dashboard', 'analytics']
    }

    return rolePermissions[employeeRole]?.includes(tabId) || false
  }

  // Handle tab change with access control
  const handleTabChange = (tabId) => {
    if (hasAccess(tabId)) {
      setActiveTab(tabId)
    }
  }

  if (isPending || isLoadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const renderPage = () => {
    // Check access before rendering
    if (!hasAccess(activeTab)) {
      return (
        <div className="flex items-center justify-center h-96">
          <Card className="p-8 glass-panel premium-shadow text-center max-w-md">
            <ShieldAlert className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Accès Refusé</h2>
            <p className="text-muted-foreground">
              Vous n'avez pas l'autorisation d'accéder à cette page.
            </p>
          </Card>
        </div>
      )
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'inventory':
        return <Inventory />
      case 'production':
        return <Production />
      case 'employees':
        return <Employees />
      case 'sales':
        return <Sales />
      case 'analytics':
        return <Analytics />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange} employeeRole={employeeRole}>
      {renderPage()}
    </DashboardLayout>
  )
}