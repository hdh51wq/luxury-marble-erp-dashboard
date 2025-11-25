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
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Check for employee login
    const role = localStorage.getItem('employee_role')
    const employeeData = localStorage.getItem('employee_data')
    
    if (role) {
      setEmployeeRole(role)
      // Set default page based on role
      if (role === 'stock') {
        setActiveTab('inventory')
      } else if (role === 'production') {
        setActiveTab('production')
      } else if (role === 'ventes') {
        setActiveTab('sales')
      } else if (role === 'admin') {
        setActiveTab('dashboard')
      }
    } else if (!isPending && !session?.user) {
      // No admin session and no employee login - redirect to login
      router.push('/sign-in')
    }
  }, [session, isPending, router])

  // Check if user has access to the current tab
  const hasAccess = (tabId) => {
    if (!employeeRole) {
      // Admin has access to everything
      return true
    }

    const rolePermissions = {
      admin: ['dashboard', 'inventory', 'production', 'employees', 'sales', 'analytics', 'settings'],
      stock: ['inventory'],
      production: ['production'],
      ventes: ['sales'],
      employe: []
    }

    return rolePermissions[employeeRole]?.includes(tabId) || false
  }

  // Handle tab change with access control
  const handleTabChange = (tabId) => {
    if (hasAccess(tabId)) {
      setActiveTab(tabId)
    } else {
      // User doesn't have access - stay on current page
      return
    }
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session?.user && !employeeRole) {
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
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderPage()}
    </DashboardLayout>
  )
}