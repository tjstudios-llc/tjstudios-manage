'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Settings,
  User,
  Shield,
  Key,
  Palette,
  Save,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  AlertTriangle,
  Download,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

// Types
interface APIKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string | null
  permissions: string[]
}

// Profile Settings Tab
function ProfileSettings() {
  const [isSaving, setIsSaving] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    company: '',
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/users/profile', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account profile and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company / Organization</Label>
            <Input
              id="company"
              placeholder="Enter company name (optional)"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" placeholder="Enter current password" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" placeholder="Enter new password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline">Update Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Security Settings Tab (2FA)
function SecuritySettings() {
  const [twoFAState, setTwoFAState] = React.useState<'disabled' | 'setup' | 'verify' | 'enabled'>('disabled')
  const [otpValue, setOtpValue] = React.useState('')
  const [secretCopied, setSecretCopied] = React.useState(false)
  const [showRecoveryCodes, setShowRecoveryCodes] = React.useState(false)
  const [isVerifying, setIsVerifying] = React.useState(false)

  // Mock secret and recovery codes - in production these come from the API
  const mockSecret = 'JBSWY3DPEHPK3PXP'
  const mockRecoveryCodes = [
    'A1B2C-3D4E5', 'F6G7H-8I9J0', 'K1L2M-3N4O5', 'P6Q7R-8S9T0',
    'U1V2W-3X4Y5', 'Z6A7B-8C9D0', 'E1F2G-3H4I5', 'J6K7L-8M9N0',
  ]

  const handleCopySecret = async () => {
    await navigator.clipboard.writeText(mockSecret)
    setSecretCopied(true)
    setTimeout(() => setSecretCopied(false), 2000)
  }

  const handleVerify = async () => {
    if (otpValue.length !== 6) return
    setIsVerifying(true)
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/users/2fa/verify', {
      //   method: 'POST',
      //   body: JSON.stringify({ code: otpValue }),
      // })
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setTwoFAState('enabled')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDisable2FA = async () => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setTwoFAState('disabled')
    setOtpValue('')
  }

  const handleDownloadRecoveryCodes = () => {
    const content = `tjstudios-manage Recovery Codes\n${'='.repeat(35)}\n\n${mockRecoveryCodes.join('\n')}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'recovery-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* 2FA Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {twoFAState === 'enabled' ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              )}
              <div>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security</CardDescription>
              </div>
            </div>
            <Badge variant={twoFAState === 'enabled' ? 'default' : 'secondary'}>
              {twoFAState === 'enabled' ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Authenticator App</p>
                <p className="text-sm text-muted-foreground">Use an authenticator app for verification</p>
              </div>
            </div>
            <Switch
              checked={twoFAState !== 'disabled'}
              onCheckedChange={(checked) => setTwoFAState(checked ? 'setup' : 'disabled')}
              disabled={twoFAState === 'verify'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Setup Flow */}
      {(twoFAState === 'setup' || twoFAState === 'verify') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
              Scan QR Code
            </CardTitle>
            <CardDescription>Scan with your authenticator app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Placeholder */}
            <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 p-8">
              <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-white p-4 shadow-lg">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <rect fill="#0ea5e9" x="0" y="0" width="30" height="30" rx="4" />
                  <rect fill="white" x="5" y="5" width="20" height="20" rx="2" />
                  <rect fill="#0ea5e9" x="8" y="8" width="14" height="14" rx="1" />
                  <rect fill="#0ea5e9" x="70" y="0" width="30" height="30" rx="4" />
                  <rect fill="white" x="75" y="5" width="20" height="20" rx="2" />
                  <rect fill="#0ea5e9" x="78" y="8" width="14" height="14" rx="1" />
                  <rect fill="#0ea5e9" x="0" y="70" width="30" height="30" rx="4" />
                  <rect fill="white" x="5" y="75" width="20" height="20" rx="2" />
                  <rect fill="#0ea5e9" x="8" y="78" width="14" height="14" rx="1" />
                  <rect fill="#1e293b" x="35" y="5" width="6" height="6" rx="1" />
                  <rect fill="#1e293b" x="45" y="5" width="6" height="6" rx="1" />
                  <rect fill="#1e293b" x="55" y="5" width="6" height="6" rx="1" />
                  <rect fill="#1e293b" x="35" y="35" width="6" height="6" rx="1" />
                  <rect fill="#1e293b" x="45" y="45" width="6" height="6" rx="1" />
                  <rect fill="#1e293b" x="55" y="55" width="6" height="6" rx="1" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">Scan with your authenticator app</p>
            </div>

            {/* Manual Secret */}
            <div className="space-y-2">
              <Label>{"Can't scan? Enter manually:"}</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border bg-muted/50 px-4 py-3">
                  <code className="font-mono text-sm tracking-widest">{mockSecret}</code>
                </div>
                <Button variant="outline" size="icon" onClick={handleCopySecret} className="h-12 w-12">
                  {secretCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Verification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
                <Label className="text-base font-medium">Enter verification code</Label>
              </div>
              <div className="flex flex-col items-center gap-4 py-4">
                <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue} disabled={isVerifying}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="h-14 w-12 text-lg" />
                    <InputOTPSlot index={1} className="h-14 w-12 text-lg" />
                    <InputOTPSlot index={2} className="h-14 w-12 text-lg" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="h-14 w-12 text-lg" />
                    <InputOTPSlot index={4} className="h-14 w-12 text-lg" />
                    <InputOTPSlot index={5} className="h-14 w-12 text-lg" />
                  </InputOTPGroup>
                </InputOTP>
                <Button onClick={handleVerify} disabled={otpValue.length !== 6 || isVerifying} size="lg" className="w-full max-w-xs">
                  {isVerifying ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Verify & Enable
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recovery Codes */}
      {twoFAState === 'enabled' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Key className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <CardTitle>Recovery Codes</CardTitle>
                  <CardDescription>Use if you lose your authenticator</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}>
                {showRecoveryCodes ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {showRecoveryCodes ? 'Hide' : 'Show'}
              </Button>
            </div>
          </CardHeader>
          {showRecoveryCodes && (
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {mockRecoveryCodes.map((code, i) => (
                    <div key={i} className="rounded-md border bg-background px-3 py-2 text-center">
                      <code className="font-mono text-sm">{code}</code>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">Store these codes securely</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleDownloadRecoveryCodes} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Codes
              </Button>
            </CardContent>
          )}
        </Card>
      )}

      {twoFAState === 'enabled' && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Disable 2FA</CardTitle>
            <CardDescription>Remove two-factor authentication from your account</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Disable Two-Factor Authentication</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Disable 2FA?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove the extra security layer from your account. You can re-enable it at any time.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDisable2FA}
                  >
                    Disable
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// API Keys Tab
function APIKeysSettings() {
  const [apiKeys, setApiKeys] = React.useState<APIKey[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [newKeyName, setNewKeyName] = React.useState('')
  const [createdKey, setCreatedKey] = React.useState<string | null>(null)
  const [copiedKeyId, setCopiedKeyId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchKeys = async () => {
      setLoading(true)
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/api-keys')
        // const data = await response.json()
        // setApiKeys(data.keys)
        await new Promise((resolve) => setTimeout(resolve, 500))
        setApiKeys([])
      } finally {
        setLoading(false)
      }
    }
    fetchKeys()
  }, [])

  const handleCreateKey = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/api-keys', {
    //   method: 'POST',
    //   body: JSON.stringify({ name: newKeyName }),
    // })
    // const data = await response.json()
    // setCreatedKey(data.key)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setCreatedKey('sk_live_' + Math.random().toString(36).slice(2, 34))
  }

  const handleCopyKey = async (key: string, id: string) => {
    await navigator.clipboard.writeText(key)
    setCopiedKeyId(id)
    setTimeout(() => setCopiedKeyId(null), 2000)
  }

  const handleDeleteKey = async (id: string) => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setApiKeys((prev) => prev.filter((k) => k.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for programmatic access</CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-48 animate-pulse rounded bg-muted ml-auto" />
                </div>
              ))}
            </div>
          ) : apiKeys.length > 0 ? (
            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">{apiKey.name}</p>
                    <code className="text-xs text-muted-foreground">
                      {apiKey.key.slice(0, 8)}...{apiKey.key.slice(-4)}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                    >
                      {copiedKeyId === apiKey.id ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure? This will revoke access for any applications using this key.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleDeleteKey(apiKey.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Key className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold">No API Keys</h3>
              <p className="mt-2 text-sm text-muted-foreground">Create your first API key to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Key Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>Create a new API key for programmatic access</DialogDescription>
          </DialogHeader>
          {createdKey ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  Your API key has been created. Copy it now - you will not be able to see it again.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                <code className="flex-1 text-sm font-mono break-all">{createdKey}</code>
                <Button variant="outline" size="icon" onClick={() => handleCopyKey(createdKey, 'new')}>
                  {copiedKeyId === 'new' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <DialogFooter>
                <Button onClick={() => { setShowCreateDialog(false); setCreatedKey(null); setNewKeyName('') }}>
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Production API"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                <Button onClick={handleCreateKey} disabled={!newKeyName}>Create Key</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Preferences Tab
function PreferencesSettings() {
  const [theme, setTheme] = React.useState('system')
  const [notifications, setNotifications] = React.useState({
    email: true,
    containerEvents: true,
    systemAlerts: true,
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive important updates via email</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Container Events</p>
              <p className="text-sm text-muted-foreground">Notify on container start, stop, errors</p>
            </div>
            <Switch
              checked={notifications.containerEvents}
              onCheckedChange={(checked) => setNotifications({ ...notifications, containerEvents: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">System Alerts</p>
              <p className="text-sm text-muted-foreground">Resource usage and health warnings</p>
            </div>
            <Switch
              checked={notifications.systemAlerts}
              onCheckedChange={(checked) => setNotifications({ ...notifications, systemAlerts: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'profile'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        <TabsContent value="api-keys">
          <APIKeysSettings />
        </TabsContent>
        <TabsContent value="preferences">
          <PreferencesSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
