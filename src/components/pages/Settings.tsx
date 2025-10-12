"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Phone, MapPin, Bell, Lock, Palette, Globe, Save } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [productionAlerts, setProductionAlerts] = useState(true)

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
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Button variant="outline">Change Photo</Button>
            <p className="text-xs text-muted-foreground">Recommended: Square image, at least 400x400px</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" defaultValue="Admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" defaultValue="User" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="email" type="email" defaultValue="admin@marbrerie.com" className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="phone" defaultValue="+1 234 567 8900" className="pl-10" />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input id="address" defaultValue="123 Marble Street, Carthage, Tunisia" className="pl-10" />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button className="gradient-orange text-white premium-shadow">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
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
            <Input id="currentPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" />
          </div>
          <Button className="gradient-orange text-white premium-shadow">
            Update Password
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