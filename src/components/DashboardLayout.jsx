"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Menu,
  X,
  Bell,
  Search,
  Gem,
  Moon,
  Sun,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { authClient, useSession } from '@/lib/auth-client'
import { toast } from 'sonner'

const allNavigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, allowedRoles: ['admin', 'ventes', 'production', 'employe'] },
  { id: 'inventory', name: 'Inventory', icon: Package, allowedRoles: ['admin', 'stock'] },
  { id: 'production', name: 'Production', icon: Activity, allowedRoles: ['admin', 'production'] },
  { id: 'employees', name: 'Employees', icon: Users, allowedRoles: ['admin'] },
  { id: 'sales', name: 'Sales & Clients', icon: DollarSign, allowedRoles: ['admin', 'ventes'] },
  { id: 'analytics', name: 'Analytics', icon: TrendingUp, allowedRoles: ['admin', 'ventes', 'production', 'employe'] },
  { id: 'settings', name: 'Settings', icon: Settings, allowedRoles: ['admin'] },
]

export default function DashboardLayout({ children, activeTab, onTabChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [employeeRole, setEmployeeRole] = useState(null)
  const { data: session, refetch } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in as employee
    const role = localStorage.getItem('employee_role')
    setEmployeeRole(role)
    
    // If employee has specific role, redirect to their default page if needed
    if (role && role !== 'admin') {
      const defaultPage = role === 'stock' ? 'inventory' 
                        : role === 'production' ? 'production'
                        : role === 'ventes' ? 'sales'
                        : 'dashboard' // For 'employe' role
      
      // Check if current page is accessible for this role
      const currentNavItem = allNavigation.find(item => item.id === activeTab)
      if (currentNavItem && !currentNavItem.allowedRoles.includes(role)) {
        onTabChange(defaultPage)
      }
    }
  }, [activeTab])

  // Filter navigation based on role
  const navigation = employeeRole 
    ? allNavigation.filter(item => item.allowedRoles.includes(employeeRole))
    : allNavigation.filter(item => item.allowedRoles.includes('admin'))

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleSignOut = async () => {
    // Check if employee is logged in
    const employeeData = localStorage.getItem('employee_data')
    
    if (employeeData) {
      // Employee logout
      localStorage.removeItem('employee_role')
      localStorage.removeItem('employee_data')
      router.push('/employee-login')
      toast.success("Déconnexion réussie")
    } else {
      // Admin logout
      const { error } = await authClient.signOut()
      if (error?.code) {
        toast.error(error.code)
      } else {
        localStorage.removeItem("bearer_token")
        refetch()
        router.push("/sign-in")
        toast.success("Signed out successfully")
      }
    }
  }

  // Get user data (admin or employee)
  const employeeData = employeeRole ? JSON.parse(localStorage.getItem('employee_data') || '{}') : null
  const currentUser = employeeData || session?.user

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } flex-shrink-0 bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out relative z-20`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center premium-shadow">
                <Gem className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-sidebar-foreground">Marbrerie</span>
                  <span className="text-xs text-muted-foreground">Carthage ERP</span>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
              >
                <X className="w-5 h-5 text-sidebar-foreground" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground premium-shadow'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                </button>
              )
            })}
          </nav>

          {/* Role Badge (for employees) */}
          {sidebarOpen && employeeRole && employeeRole !== 'admin' && (
            <div className="px-3 py-2 border-t border-sidebar-border">
              <div className="px-3 py-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <p className="text-xs text-muted-foreground">Rôle</p>
                <p className="text-sm font-semibold text-foreground capitalize">{employeeRole}</p>
              </div>
            </div>
          )}

          {/* Collapse Button */}
          {!sidebarOpen && (
            <div className="p-3 border-t border-sidebar-border">
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-full p-3 rounded-xl hover:bg-sidebar-accent transition-colors"
              >
                <Menu className="w-5 h-5 text-sidebar-foreground mx-auto" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 premium-shadow z-10">
          <div className="flex items-center space-x-4 flex-1">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            {/* Search */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 h-10 bg-muted/50 border-border"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 pl-3 border-l border-border">
              <div className="text-right">
                <div className="text-sm font-medium">{currentUser?.name || 'User'}</div>
                <div className="text-xs text-muted-foreground">{currentUser?.email || ''}</div>
              </div>
              <Avatar className="w-10 h-10 ring-2 ring-orange-500">
                <AvatarImage src={currentUser?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email}`} />
                <AvatarFallback>{currentUser?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              
              {/* Logout Button */}
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}