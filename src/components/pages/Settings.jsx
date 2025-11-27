"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Lock, Bell, Palette, Globe, Save, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSession } from '@/lib/auth-client'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Predefined avatar options
const AVATAR_OPTIONS = [
  { id: 1, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" },
  { id: 2, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
  { id: 3, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" },
  { id: 4, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna" },
  { id: 5, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max" },
  { id: 6, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie" },
  { id: 7, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver" },
  { id: 8, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
  { id: 9, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack" },
  { id: 10, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia" },
  { id: 11, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah" },
  { id: 12, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava" },
]

export default function Settings() {
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()
  
  // Profile state
  const [userProfile, setUserProfile] = useState(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  
  // Notification state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [productionAlerts, setProductionAlerts] = useState(true)
  
  // Avatar picker dialog
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/sign-in')
    }
  }, [session, isPending, router])

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return
      
      setIsLoadingProfile(true)
      try {
        const token = localStorage.getItem('bearer_token')
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }
        
        const data = await response.json()
        setUserProfile(data)
        
        // Split name into first and last name
        const nameParts = data.name?.split(' ') || ['', '']
        setFirstName(nameParts[0] || '')
        setLastName(nameParts.slice(1).join(' ') || '')
        setEmail(data.email || '')
        setSelectedAvatar(data.image || AVATAR_OPTIONS[0].url)
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile')
      } finally {
        setIsLoadingProfile(false)
      }
    }
    
    fetchProfile()
  }, [session])

  const handleSaveProfile = async () => {
    if (!firstName.trim()) {
      toast.error('First name is required')
      return
    }
    
    if (!email.trim()) {
      toast.error('Email is required')
      return
    }
    
    setIsSavingProfile(true)
    try {
      const token = localStorage.getItem('bearer_token')
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
      
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: fullName,
          email: email.trim(),
          image: selectedAvatar
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }
      
      const updatedProfile = await response.json()
      setUserProfile(updatedProfile)
      await refetch() // Refresh session
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      toast.error('Current password is required')
      return
    }
    
    if (!newPassword) {
      toast.error('New password is required')
      return
    }
    
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    setIsSavingPassword(true)
    try {
      const token = localStorage.getItem('bearer_token')
      const response = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update password')
      }
      
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password updated successfully!')
    } catch (error) {
      console.error('Error updating password:', error)
      toast.error(error.message || 'Failed to update password')
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleSelectAvatar = (avatarUrl) => {
    setSelectedAvatar(avatarUrl)
    setIsAvatarDialogOpen(false)
  }

  if (isPending || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const getInitials = () => {
    const name = userProfile?.name || 'User'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings & Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Section */}
      <Card className="p-6 glass-panel premium-shadow">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center premium-shadow">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <p className="text-sm text-muted-foreground">Update your personal details</p>
          </div>
        </div>

        <div className="flex items-start space-x-6 mb-6">
          <Avatar className="w-24 h-24 ring-4 ring-orange-500">
            <AvatarImage src={selectedAvatar} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Change Photo</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Choose Your Avatar</DialogTitle>
                  <DialogDescription>
                    Select one of the predefined avatars below
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-4 gap-4 py-4">
                  {AVATAR_OPTIONS.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => handleSelectAvatar(avatar.url)}
                      className={`relative rounded-lg p-2 transition-all hover:bg-accent ${
                        selectedAvatar === avatar.url
                          ? 'ring-2 ring-orange-500 bg-accent'
                          : 'hover:ring-1 hover:ring-border'
                      }`}
                    >
                      <Avatar className="w-full h-auto aspect-square">
                        <AvatarImage src={avatar.url} />
                        <AvatarFallback>A{avatar.id}</AvatarFallback>
                      </Avatar>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <p className="text-xs text-muted-foreground">Choose from our collection of avatars</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="your.email@example.com"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleSaveProfile}
            disabled={isSavingProfile}
            className="gradient-orange text-white premium-shadow"
          >
            {isSavingProfile ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Password Section */}
      <Card className="p-6 glass-panel premium-shadow">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center premium-shadow">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Password Management</h2>
            <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input 
              id="currentPassword" 
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="off"
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input 
              id="newPassword" 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="off"
              placeholder="Enter new password (min 8 characters)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input 
              id="confirmPassword" 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="off"
              placeholder="Confirm new password"
            />
          </div>
          <Button 
            onClick={handleUpdatePassword}
            disabled={isSavingPassword}
            className="gradient-orange text-white premium-shadow"
          >
            {isSavingPassword ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 glass-panel premium-shadow">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center premium-shadow">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Notification Preferences</h2>
            <p className="text-sm text-muted-foreground">Manage how you receive notifications</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-muted-foreground">Receive notifications via email</div>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Push Notifications</div>
              <div className="text-sm text-muted-foreground">Receive push notifications in browser</div>
            </div>
            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Order Updates</div>
              <div className="text-sm text-muted-foreground">Get notified about order status changes</div>
            </div>
            <Switch checked={orderUpdates} onCheckedChange={setOrderUpdates} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Production Alerts</div>
              <div className="text-sm text-muted-foreground">Alerts about production milestones</div>
            </div>
            <Switch checked={productionAlerts} onCheckedChange={setProductionAlerts} />
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-6 glass-panel premium-shadow">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center premium-shadow">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Appearance</h2>
            <p className="text-sm text-muted-foreground">Customize the look and feel</p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select defaultValue="light">
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* System */}
      <Card className="p-6 glass-panel premium-shadow">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center premium-shadow">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">System Information</h2>
            <p className="text-sm text-muted-foreground">Application details and version</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Version</div>
            <div className="font-medium">v2.4.1</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Last Updated</div>
            <div className="font-medium">January 15, 2024</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">License</div>
            <div className="font-medium">Enterprise</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Support</div>
            <div className="font-medium">Premium 24/7</div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 glass-panel premium-shadow border-red-200 dark:border-red-900">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Export Data</div>
              <div className="text-sm text-muted-foreground">Download all your data</div>
            </div>
            <Button variant="outline">Export</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-red-600 dark:text-red-400">Delete Account</div>
              <div className="text-sm text-muted-foreground">Permanently delete your account</div>
            </div>
            <Button variant="destructive">Delete</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}