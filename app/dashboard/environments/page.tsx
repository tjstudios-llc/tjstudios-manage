'use client'

import * as React from 'react'
import {
  Code2,
  RefreshCw,
  Play,
  Square,
  ExternalLink,
  Settings,
  AlertCircle,
  Cpu,
  MemoryStick,
  Globe,
  Terminal,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

// Types
interface EnvironmentTemplate {
  id: string
  name: string
  description: string
  image: string
  icon: React.ElementType
  color: string
  defaultPort: number
  tags: string[]
}

interface RunningEnvironment {
  id: string
  templateId: string
  name: string
  status: 'running' | 'stopped' | 'starting'
  port: number
  cpu: number
  memory: { used: number; limit: number }
  created: string
}

// Environment templates
const templates: EnvironmentTemplate[] = [
  {
    id: 'vscode-server',
    name: 'VS Code Server',
    description: 'Full VS Code experience in your browser with extensions support',
    image: 'codercom/code-server:latest',
    icon: Code2,
    color: 'bg-blue-500',
    defaultPort: 8080,
    tags: ['IDE', 'Development'],
  },
  {
    id: 'nodejs',
    name: 'Node.js Development',
    description: 'Node.js environment with npm, yarn, and common development tools',
    image: 'node:20-slim',
    icon: Terminal,
    color: 'bg-emerald-500',
    defaultPort: 3000,
    tags: ['JavaScript', 'Backend'],
  },
  {
    id: 'python',
    name: 'Python Development',
    description: 'Python environment with pip, virtualenv, and Jupyter support',
    image: 'python:3.12-slim',
    icon: Terminal,
    color: 'bg-amber-500',
    defaultPort: 8000,
    tags: ['Python', 'Data Science'],
  },
  {
    id: 'golang',
    name: 'Go Development',
    description: 'Go environment with go modules and common development tools',
    image: 'golang:1.22-alpine',
    icon: Terminal,
    color: 'bg-cyan-500',
    defaultPort: 8080,
    tags: ['Go', 'Backend'],
  },
  {
    id: 'rust',
    name: 'Rust Development',
    description: 'Rust environment with cargo and common development tools',
    image: 'rust:1.75-slim',
    icon: Terminal,
    color: 'bg-orange-500',
    defaultPort: 8080,
    tags: ['Rust', 'Systems'],
  },
  {
    id: 'jupyter',
    name: 'Jupyter Notebook',
    description: 'Jupyter Lab with Python, R, and Julia kernels for data science',
    image: 'jupyter/datascience-notebook:latest',
    icon: Globe,
    color: 'bg-purple-500',
    defaultPort: 8888,
    tags: ['Data Science', 'ML'],
  },
]

// Empty state component
function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  )
}

function TemplateCard({
  template,
  onLaunch,
}: {
  template: EnvironmentTemplate
  onLaunch: (template: EnvironmentTemplate) => void
}) {
  const Icon = template.icon

  return (
    <Card className="group relative overflow-hidden transition-all hover:border-primary hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`rounded-lg p-2 ${template.color}/10`}>
            <Icon className={`h-5 w-5 ${template.color.replace('bg-', 'text-')}`} />
          </div>
          <div className="flex gap-1">
            {template.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <CardDescription className="line-clamp-2">{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {template.image.split(':')[0]}
          </code>
          <Button
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onLaunch(template)}
          >
            <Play className="mr-1 h-3 w-3" />
            Launch
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function RunningEnvironmentCard({
  environment,
  template,
  onStop,
  onOpen,
}: {
  environment: RunningEnvironment
  template: EnvironmentTemplate | undefined
  onStop: (env: RunningEnvironment) => void
  onOpen: (env: RunningEnvironment) => void
}) {
  const Icon = template?.icon || Code2
  const memoryPercent = environment.memory.limit > 0
    ? (environment.memory.used / environment.memory.limit) * 100
    : 0

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${template?.color || 'bg-primary'}/10`}>
              <Icon className={`h-5 w-5 ${template?.color?.replace('bg-', 'text-') || 'text-primary'}`} />
            </div>
            <div>
              <CardTitle className="text-base">{environment.name}</CardTitle>
              <p className="text-xs text-muted-foreground font-mono">
                {environment.id.slice(0, 12)}
              </p>
            </div>
          </div>
          <Badge
            variant={environment.status === 'running' ? 'default' : 'secondary'}
            className="gap-1"
          >
            <span className={`h-2 w-2 rounded-full ${
              environment.status === 'running' ? 'bg-emerald-500' :
              environment.status === 'starting' ? 'bg-amber-500 animate-pulse' :
              'bg-slate-500'
            }`} />
            {environment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resource Usage */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Cpu className="h-3 w-3" />
                CPU
              </div>
              <span className="font-medium">{environment.cpu}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${Math.min(environment.cpu, 100)}%` }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MemoryStick className="h-3 w-3" />
                Memory
              </div>
              <span className="font-medium">{environment.memory.used}MB</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${memoryPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" />
            <a
              href={`http://localhost:${environment.port}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              localhost:{environment.port}
            </a>
          </div>
          <div className="flex items-center gap-1">
            {environment.status === 'running' && (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => onOpen(environment)}
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                Open
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onStop(environment)}
            >
              <Square className="h-4 w-4" />
              <span className="sr-only">Stop</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LaunchDialog({
  template,
  open,
  onOpenChange,
  onLaunch,
}: {
  template: EnvironmentTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onLaunch: (config: { name: string; port: number; cpuLimit: number; memoryLimit: number }) => void
}) {
  const [name, setName] = React.useState('')
  const [port, setPort] = React.useState(template?.defaultPort || 8080)
  const [cpuLimit, setCpuLimit] = React.useState([50])
  const [memoryLimit, setMemoryLimit] = React.useState([512])
  const [isLaunching, setIsLaunching] = React.useState(false)

  React.useEffect(() => {
    if (template) {
      setName(`${template.id}-${Date.now().toString(36).slice(-4)}`)
      setPort(template.defaultPort)
    }
  }, [template])

  const handleLaunch = async () => {
    setIsLaunching(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onLaunch({
        name,
        port,
        cpuLimit: cpuLimit[0],
        memoryLimit: memoryLimit[0],
      })
      onOpenChange(false)
    } finally {
      setIsLaunching(false)
    }
  }

  if (!template) return null
  const Icon = template.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`rounded-lg p-2 ${template.color}/10`}>
              <Icon className={`h-5 w-5 ${template.color.replace('bg-', 'text-')}`} />
            </div>
            Launch {template.name}
          </DialogTitle>
          <DialogDescription>
            Configure and launch a new coding environment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="envName">Environment Name</Label>
            <Input
              id="envName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-dev-environment"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              type="number"
              value={port}
              onChange={(e) => setPort(parseInt(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Host port to expose the environment
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>CPU Limit</Label>
                <span className="text-sm text-muted-foreground">{cpuLimit[0]}%</span>
              </div>
              <Slider
                value={cpuLimit}
                onValueChange={setCpuLimit}
                max={100}
                min={10}
                step={10}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Memory Limit</Label>
                <span className="text-sm text-muted-foreground">{memoryLimit[0]} MB</span>
              </div>
              <Slider
                value={memoryLimit}
                onValueChange={setMemoryLimit}
                max={4096}
                min={256}
                step={256}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLaunching}>
            Cancel
          </Button>
          <Button onClick={handleLaunch} disabled={isLaunching}>
            {isLaunching ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Launching...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Launch Environment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function CodingEnvironmentsPage() {
  const [environments, setEnvironments] = React.useState<RunningEnvironment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState<EnvironmentTemplate | null>(null)
  const [launchDialogOpen, setLaunchDialogOpen] = React.useState(false)

  const fetchEnvironments = React.useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/docker/environments')
      // if (!response.ok) throw new Error('Failed to fetch environments')
      // const data = await response.json()
      // setEnvironments(data.environments)

      await new Promise((resolve) => setTimeout(resolve, 500))
      setEnvironments([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  React.useEffect(() => {
    fetchEnvironments()
  }, [fetchEnvironments])

  const handleLaunchTemplate = (template: EnvironmentTemplate) => {
    setSelectedTemplate(template)
    setLaunchDialogOpen(true)
  }

  const handleLaunch = async (config: { name: string; port: number; cpuLimit: number; memoryLimit: number }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/docker/environments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     templateId: selectedTemplate?.id,
      //     ...config,
      //   }),
      // })
      // if (!response.ok) throw new Error('Failed to launch environment')

      await fetchEnvironments(true)
    } catch (error) {
      console.error('Failed to launch environment:', error)
    }
  }

  const handleStopEnvironment = async (env: RunningEnvironment) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/docker/environments/${env.id}/stop`, {
      //   method: 'POST',
      // })
      // if (!response.ok) throw new Error('Failed to stop environment')

      await new Promise((resolve) => setTimeout(resolve, 1000))
      await fetchEnvironments(true)
    } catch (error) {
      console.error('Failed to stop environment:', error)
    }
  }

  const handleOpenEnvironment = (env: RunningEnvironment) => {
    window.open(`http://localhost:${env.port}`, '_blank')
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Coding Environments
          </h1>
          <p className="text-muted-foreground">
            Launch pre-configured development environments
          </p>
        </div>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Failed to load environments
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => fetchEnvironments()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Coding Environments
          </h1>
          <p className="text-muted-foreground">
            Launch pre-configured development environments
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchEnvironments(true)}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Running Environments */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : environments.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Play className="h-5 w-5 text-emerald-500" />
            Running Environments ({environments.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {environments.map((env) => (
              <RunningEnvironmentCard
                key={env.id}
                environment={env}
                template={templates.find((t) => t.id === env.templateId)}
                onStop={handleStopEnvironment}
                onOpen={handleOpenEnvironment}
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* Templates */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          Available Templates
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onLaunch={handleLaunchTemplate}
            />
          ))}
        </div>
      </div>

      {/* Launch Dialog */}
      <LaunchDialog
        template={selectedTemplate}
        open={launchDialogOpen}
        onOpenChange={setLaunchDialogOpen}
        onLaunch={handleLaunch}
      />
    </div>
  )
}
