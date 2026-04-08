'use client'

import * as React from 'react'
import {
  Shield,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  Download,
  Key,
  RefreshCw,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// Mock secret for demo
const MOCK_SECRET = 'JBSWY3DPEHPK3PXP'

// Mock recovery codes
const MOCK_RECOVERY_CODES = [
  'A1B2C-3D4E5',
  'F6G7H-8I9J0',
  'K1L2M-3N4O5',
  'P6Q7R-8S9T0',
  'U1V2W-3X4Y5',
  'Z6A7B-8C9D0',
  'E1F2G-3H4I5',
  'J6K7L-8M9N0',
]

type TwoFAState = 'disabled' | 'setup' | 'verify' | 'success' | 'enabled'

export default function SecuritySettingsPage() {
  const [twoFAState, setTwoFAState] = React.useState<TwoFAState>('disabled')
  const [otpValue, setOtpValue] = React.useState('')
  const [secretCopied, setSecretCopied] = React.useState(false)
  const [showRecoveryCodes, setShowRecoveryCodes] = React.useState(false)
  const [recoveryCodesCopied, setRecoveryCodesCopied] = React.useState(false)
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [showDisableDialog, setShowDisableDialog] = React.useState(false)
  const [showConfetti, setShowConfetti] = React.useState(false)

  const handleToggle2FA = (enabled: boolean) => {
    if (enabled) {
      setTwoFAState('setup')
    } else {
      setShowDisableDialog(true)
    }
  }

  const handleDisable2FA = () => {
    setTwoFAState('disabled')
    setOtpValue('')
    setShowRecoveryCodes(false)
    setShowDisableDialog(false)
  }

  const handleCopySecret = async () => {
    await navigator.clipboard.writeText(MOCK_SECRET)
    setSecretCopied(true)
    setTimeout(() => setSecretCopied(false), 2000)
  }

  const handleCopyRecoveryCodes = async () => {
    await navigator.clipboard.writeText(MOCK_RECOVERY_CODES.join('\n'))
    setRecoveryCodesCopied(true)
    setTimeout(() => setRecoveryCodesCopied(false), 2000)
  }

  const handleDownloadRecoveryCodes = () => {
    const content = `tjstudios-manage Recovery Codes\n${'='.repeat(35)}\n\nStore these codes in a safe place. Each code can only be used once.\n\n${MOCK_RECOVERY_CODES.map((code, i) => `${i + 1}. ${code}`).join('\n')}\n\nGenerated: ${new Date().toLocaleString()}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tjstudios-manage-recovery-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleVerifyCode = async () => {
    if (otpValue.length !== 6) return
    
    setIsVerifying(true)
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsVerifying(false)
    setTwoFAState('success')
    setShowConfetti(true)
    
    // Move to enabled state after showing success
    setTimeout(() => {
      setShowConfetti(false)
      setTwoFAState('enabled')
    }, 3000)
  }

  const is2FAActive = twoFAState === 'enabled' || twoFAState === 'success'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Security Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account security and two-factor authentication</p>
          </div>
        </div>
      </div>

      {/* 2FA Status Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {is2FAActive ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              )}
              <div>
                <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={is2FAActive ? 'default' : 'secondary'}
              className={is2FAActive ? 'bg-emerald-500 hover:bg-emerald-500 text-white' : ''}
            >
              {is2FAActive ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Authenticator App</p>
                <p className="text-sm text-muted-foreground">
                  Use Google Authenticator, Authy, or similar apps
                </p>
              </div>
            </div>
            <Switch
              checked={twoFAState !== 'disabled'}
              onCheckedChange={handleToggle2FA}
              disabled={twoFAState === 'verify' || twoFAState === 'success'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Setup Flow */}
      {(twoFAState === 'setup' || twoFAState === 'verify') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </span>
              Scan QR Code
            </CardTitle>
            <CardDescription>
              Open your authenticator app and scan this QR code to add your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Card */}
            <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-8">
              <div className="relative">
                {/* Simulated QR Code */}
                <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-white p-4 shadow-lg ring-1 ring-border">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    {/* QR Code Pattern - Simplified representation */}
                    <rect fill="#0ea5e9" x="0" y="0" width="30" height="30" rx="4" />
                    <rect fill="white" x="5" y="5" width="20" height="20" rx="2" />
                    <rect fill="#0ea5e9" x="8" y="8" width="14" height="14" rx="1" />
                    
                    <rect fill="#0ea5e9" x="70" y="0" width="30" height="30" rx="4" />
                    <rect fill="white" x="75" y="5" width="20" height="20" rx="2" />
                    <rect fill="#0ea5e9" x="78" y="8" width="14" height="14" rx="1" />
                    
                    <rect fill="#0ea5e9" x="0" y="70" width="30" height="30" rx="4" />
                    <rect fill="white" x="5" y="75" width="20" height="20" rx="2" />
                    <rect fill="#0ea5e9" x="8" y="78" width="14" height="14" rx="1" />
                    
                    {/* Pattern squares */}
                    <rect fill="#1e293b" x="35" y="5" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="45" y="5" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="55" y="5" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="35" y="15" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="55" y="15" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="45" y="25" width="6" height="6" rx="1" />
                    
                    <rect fill="#1e293b" x="5" y="35" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="15" y="35" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="5" y="45" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="25" y="45" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="15" y="55" width="6" height="6" rx="1" />
                    
                    <rect fill="#1e293b" x="35" y="35" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="45" y="45" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="55" y="35" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="35" y="55" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="55" y="55" width="6" height="6" rx="1" />
                    
                    <rect fill="#1e293b" x="75" y="35" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="85" y="45" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="75" y="55" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="85" y="55" width="6" height="6" rx="1" />
                    
                    <rect fill="#1e293b" x="35" y="75" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="45" y="85" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="55" y="75" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="65" y="85" width="6" height="6" rx="1" />
                    
                    <rect fill="#1e293b" x="75" y="75" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="85" y="75" width="6" height="6" rx="1" />
                    <rect fill="#1e293b" x="85" y="85" width="6" height="6" rx="1" />
                  </svg>
                </div>
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg">
                  <Smartphone className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Scan with your authenticator app
              </p>
            </div>

            {/* Manual Entry */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">
                {"Can't scan? Enter this code manually:"}
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border bg-muted/50 px-4 py-3">
                  <code className="font-mono text-sm tracking-widest text-foreground">
                    {MOCK_SECRET}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopySecret}
                  className="h-12 w-12 shrink-0"
                >
                  {secretCopied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Verification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </span>
                <Label className="text-base font-medium text-foreground">
                  Enter verification code
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code from your authenticator app to verify setup
              </p>
              
              <div className="flex flex-col items-center gap-4 py-4">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={setOtpValue}
                  disabled={isVerifying}
                >
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
                
                <Button
                  onClick={handleVerifyCode}
                  disabled={otpValue.length !== 6 || isVerifying}
                  className="w-full max-w-xs"
                  size="lg"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Verify & Enable 2FA
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {twoFAState === 'success' && (
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white dark:border-emerald-800 dark:from-emerald-900/20 dark:to-card">
          <CardContent className="flex flex-col items-center gap-4 py-10">
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <Sparkles
                    key={i}
                    className="absolute text-primary animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 0.5}s`,
                      animationDuration: `${0.5 + Math.random() * 0.5}s`,
                      opacity: Math.random() * 0.7 + 0.3,
                    }}
                  />
                ))}
              </div>
            )}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
              <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground">2FA Successfully Enabled!</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your account is now protected with two-factor authentication
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recovery Codes Section - Only show when 2FA is enabled */}
      {(twoFAState === 'enabled' || twoFAState === 'success') && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Key className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <CardTitle>Recovery Codes</CardTitle>
                  <CardDescription>
                    Use these codes to access your account if you lose your authenticator
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
              >
                {showRecoveryCodes ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Show
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {showRecoveryCodes && (
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {MOCK_RECOVERY_CODES.map((code, index) => (
                    <div
                      key={index}
                      className="rounded-md border bg-background px-3 py-2 text-center"
                    >
                      <code className="font-mono text-sm tracking-wider text-foreground">
                        {code}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Store these codes securely. Each code can only be used once.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={handleCopyRecoveryCodes}
                  className="flex-1"
                >
                  {recoveryCodesCopied ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy All Codes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadRecoveryCodes}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download as TXT
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Disable 2FA Confirmation Dialog */}
      <AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Disable Two-Factor Authentication?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the extra layer of security from your account. You will only need your password to sign in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisable2FA}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Disable 2FA
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
