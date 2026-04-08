'use client'

import * as React from 'react'
import {
  Box,
  Search,
  RefreshCw,
  Plus,
  Play,
  Square,
  RotateCcw,
  FileText,
  Terminal,
  Trash2,
  ExternalLink,
  MoreHorizontal,
  Filter,
  Cpu,
  MemoryStick,
  X,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

// Types
interface Container {
  id: string
  name: string
  image: string
  status: 'running' | 'stopped' | 'restarting' | 'paused'
  ports: { host: number; container: number; protocol: string }[]
  cpu: number
  memory: { used: number; limit: number }
  created: string
  uptime: string
}

// Sample container data
const containersData: Container[] = [
  {
    id: 'abc123def456',
    name: 'nginx-proxy',
    image: 'nginx:1.25-alpine',
    status: 'running',
    ports: [
      { host: 80, container: 80, protocol: 'tcp' },
      { host: 443, container: 443, protocol: 'tcp' },
    ],
    cpu: 2.3,
    memory: { used: 128, limit: 512 },
    created: '2024-01-15T10:30:00Z',
    uptime: '5d 12h 34m',
  },
  {
    id: 'xyz789ghi012',
    name: 'postgres-db',
    image: 'postgres:16-alpine',
    status: 'running',
    ports: [{ host: 5432, container: 5432, protocol: 'tcp' }],
    cpu: 5.1,
    memory: { used: 512, limit: 1024 },
    created: '2024-01-15T10:30:00Z',
    uptime: '5d 12h 34m',
  },
  {
    id: 'mno345pqr678',
    name: 'redis-cache',
    image: 'redis:7-alpine',
    status: 'running',
    ports: [{ host: 6379, container: 6379, protocol: 'tcp' }],
    cpu: 0.8,
    memory: { used: 64, limit: 256 },
    created: '2024-01-17T08:15:00Z',
    uptime: '3d 8h 12m',
  },
  {
    id: 'stu901vwx234',
    name: 'app-backend',
    image: 'node:20-slim',
    status: 'restarting',
    ports: [{ host: 3000, container: 3000, protocol: 'tcp' }],
    cpu: 12.5,
    memory: { used: 384, limit: 512 },
    created: '2024-01-18T14:22:00Z',
    uptime: '1d 4h 55m',
  },
  {
    id: 'yza567bcd890',
    name: 'monitoring-grafana',
    image: 'grafana/grafana:10.2.3',
    status: 'stopped',
    ports: [{ host: 3001, container: 3000, protocol: 'tcp' }],
    cpu: 0,
    memory: { used: 0, limit: 512 },
    created: '2024-01-10T09:00:00Z',
    uptime: '-',
  },
  {
    id: 'efg123hij456',
    name: 'rabbitmq-broker',
    image: 'rabbitmq:3.12-management',
    status: 'running',
    ports: [
      { host: 5672, container: 5672, protocol: 'tcp' },
      { host: 15672, container: 15672, protocol: 'tcp' },
    ],
    cpu: 3.2,
    memory: { used: 256, limit: 512 },
    created: '2024-01-16T11:45:00Z',
    uptime: '4d 6h 22m',
  },
  {
    id: 'klm789nop012',
    name: 'elasticsearch',
    image: 'elasticsearch:8.11.3',
    status: 'stopped',
    ports: [
      { host: 9200, container: 9200, protocol: 'tcp' },
      { host: 9300, container: 9300, protocol: 'tcp' },
    ],
    cpu: 0,
    memory: { used: 0, limit: 2048 },
    created: '2024-01-12T16:30:00Z',
    uptime: '-',
  },
  {
    id: 'qrs345tuv678',
    name: 'prometheus',
    image: 'prom/prometheus:v2.48.1',
    status: 'running',
    ports: [{ host: 9090, container: 9090, protocol: 'tcp' }],
    cpu: 1.5,
    memory: { used: 192, limit: 512 },
    created: '2024-01-14T13:20:00Z',
    uptime: '6d 2h 47m',
  },
]

function StatusBadge({ status }: { status: Container['status'] }) {
  const config = {
    running: {
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      dot: 'bg-emerald-500',
    },
    stopped: {
      className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800',
      dot: 'bg-red-500',
    },
    restarting: {
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      dot: 'bg-amber-500 animate-pulse',
    },
    paused: {
      className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
      dot: 'bg-slate-500',
    },
  }

  const { className, dot } = config[status]

  return (
    <Badge variant="outline" className={`gap-1.5 font-medium capitalize ${className}`}>
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {status}
    </Badge>
  )
}

function PortLinks({ ports }: { ports: Container['ports'] }) {
  if (ports.length === 0) return <span className="text-muted-foreground">-</span>

  return (
    <div className="flex flex-wrap gap-1">
      {ports.map((port, i) => (
        <a
          key={i}
          href={`http://localhost:${port.host}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          {port.host}:{port.container}
          <ExternalLink className="h-3 w-3" />
        </a>
      ))}
    </div>
  )
}

function ResourceUsage({ cpu, memory }: { cpu: number; memory: Container['memory'] }) {
  const memoryPercent = memory.limit > 0 ? (memory.used / memory.limit) * 100 : 0

  return (
    <div className="flex flex-col gap-2 min-w-[120px]">
      <div className="flex items-center gap-2">
        <Cpu className="h-3 w-3 text-muted-foreground" />
        <div className="flex-1">
          <Progress value={cpu} className="h-1.5" />
        </div>
        <span className="text-xs text-muted-foreground w-10 text-right">{cpu}%</span>
      </div>
      <div className="flex items-center gap-2">
        <MemoryStick className="h-3 w-3 text-muted-foreground" />
        <div className="flex-1">
          <Progress value={memoryPercent} className="h-1.5" />
        </div>
        <span className="text-xs text-muted-foreground w-10 text-right">{memory.used}MB</span>
      </div>
    </div>
  )
}

function ContainerActions({ container, onAction }: { container: Container; onAction: (action: string, container: Container) => void }) {
  const isRunning = container.status === 'running'
  const isStopped = container.status === 'stopped'

  return (
    <div className="flex items-center justify-end gap-1">
      {/* Quick actions for desktop */}
      <div className="hidden lg:flex items-center gap-1">
        {isStopped ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950"
            onClick={() => onAction('start', container)}
          >
            <Play className="h-4 w-4" />
            <span className="sr-only">Start</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950"
            onClick={() => onAction('stop', container)}
          >
            <Square className="h-4 w-4" />
            <span className="sr-only">Stop</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary hover:bg-primary/10"
          onClick={() => onAction('restart', container)}
        >
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">Restart</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => onAction('logs', container)}
        >
          <FileText className="h-4 w-4" />
          <span className="sr-only">Logs</span>
        </Button>
        {isRunning && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onAction('terminal', container)}
          >
            <Terminal className="h-4 w-4" />
            <span className="sr-only">Terminal</span>
          </Button>
        )}
      </div>

      {/* Dropdown for all screen sizes */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {isStopped ? (
            <DropdownMenuItem onClick={() => onAction('start', container)} className="text-emerald-600">
              <Play className="mr-2 h-4 w-4" />
              Start
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onAction('stop', container)} className="text-amber-600">
              <Square className="mr-2 h-4 w-4" />
              Stop
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => onAction('restart', container)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onAction('logs', container)}>
            <FileText className="mr-2 h-4 w-4" />
            View Logs
          </DropdownMenuItem>
          {isRunning && (
            <DropdownMenuItem onClick={() => onAction('terminal', container)}>
              <Terminal className="mr-2 h-4 w-4" />
              Open Terminal
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Container</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <span className="font-semibold">{container.name}</span>?
                  This action cannot be undone. All data stored in this container will be permanently lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => onAction('delete', container)}
                >
                  Delete Container
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function NewContainerDialog() {
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    image: '',
    ports: '',
    envVars: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle the container creation
    setOpen(false)
    setFormData({ name: '', image: '', ports: '', envVars: '' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">New Container</span>
          <span className="sm:hidden">New</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Box className="h-5 w-5 text-primary" />
            Create New Container
          </DialogTitle>
          <DialogDescription>
            Configure and deploy a new Docker container. Fill in the required fields below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image <span className="text-destructive">*</span></Label>
            <Input
              id="image"
              placeholder="e.g., nginx:latest, postgres:16"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Docker image name with optional tag
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Container Name</Label>
            <Input
              id="name"
              placeholder="e.g., my-nginx-server"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for auto-generated name
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ports">Port Mappings</Label>
            <Input
              id="ports"
              placeholder="e.g., 8080:80, 443:443"
              value={formData.ports}
              onChange={(e) => setFormData({ ...formData, ports: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated host:container port pairs
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="envVars">Environment Variables</Label>
            <Textarea
              id="envVars"
              placeholder="KEY1=value1&#10;KEY2=value2"
              value={formData.envVars}
              onChange={(e) => setFormData({ ...formData, envVars: e.target.value })}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              One variable per line in KEY=value format
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Create Container
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function ContainersPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Filter containers based on search and status
  const filteredContainers = React.useMemo(() => {
    return containersData.filter((container) => {
      const matchesSearch =
        container.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        container.image.toLowerCase().includes(searchQuery.toLowerCase()) ||
        container.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'running' && container.status === 'running') ||
        (statusFilter === 'stopped' && (container.status === 'stopped' || container.status === 'paused'))

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleContainerAction = (action: string, container: Container) => {
    // Here you would handle the actual container actions
    console.log(`Action: ${action} on container: ${container.name}`)
  }

  // Stats
  const runningCount = containersData.filter((c) => c.status === 'running').length
  const stoppedCount = containersData.filter((c) => c.status === 'stopped' || c.status === 'paused').length
  const restartingCount = containersData.filter((c) => c.status === 'restarting').length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Containers
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor your Docker containers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
          <NewContainerDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-3">
        <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Running</p>
                <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">{runningCount}</p>
              </div>
              <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900">
                <Play className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">Stopped</p>
                <p className="text-2xl font-bold text-red-800 dark:text-red-300">{stoppedCount}</p>
              </div>
              <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
                <Square className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Restarting</p>
                <p className="text-2xl font-bold text-amber-800 dark:text-amber-300">{restartingCount}</p>
              </div>
              <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                <RotateCcw className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Box className="h-5 w-5 text-primary" />
              All Containers
              <Badge variant="secondary" className="ml-1">
                {filteredContainers.length}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, image, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all" className="flex-1 sm:flex-none gap-1.5">
                  <Filter className="h-3.5 w-3.5" />
                  All
                </TabsTrigger>
                <TabsTrigger value="running" className="flex-1 sm:flex-none gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Running
                </TabsTrigger>
                <TabsTrigger value="stopped" className="flex-1 sm:flex-none gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Stopped
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="hidden md:table-cell font-semibold">Image</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="hidden lg:table-cell font-semibold">Ports</TableHead>
                  <TableHead className="hidden xl:table-cell font-semibold">Resources</TableHead>
                  <TableHead className="hidden sm:table-cell font-semibold">Created</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContainers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Box className="h-8 w-8" />
                        <p>No containers found</p>
                        {searchQuery && (
                          <Button variant="link" onClick={() => setSearchQuery('')}>
                            Clear search
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContainers.map((container) => (
                    <TableRow key={container.id} className="group">
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-foreground">{container.name}</span>
                          <code className="text-xs text-muted-foreground">{container.id.slice(0, 12)}</code>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">
                          {container.image}
                        </code>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={container.status} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <PortLinks ports={container.ports} />
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <ResourceUsage cpu={container.cpu} memory={container.memory} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm">
                            {new Date(container.created).toLocaleDateString()}
                          </span>
                          {container.status === 'running' && (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400">
                              Up {container.uptime}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <ContainerActions container={container} onAction={handleContainerAction} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer info */}
          {filteredContainers.length > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>
                Showing {filteredContainers.length} of {containersData.length} containers
              </p>
              <p className="hidden sm:block">
                Last refreshed: {new Date().toLocaleTimeString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
