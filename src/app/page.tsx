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

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/sign-in')
    }
  }, [session, isPending, router])

  if (isPending) {
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
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderPage()}
    </DashboardLayout>
  )
}