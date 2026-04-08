'use client'

import * as React from 'react'
import {
  Network,
  Search,
  RefreshCw,
  Plus,
  Eye,
  Link2,
  Unlink2,
  Trash2,
  MoreHorizontal,
  X,
  Box,
  Check,
  Globe,
  Server,
  Layers,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

// Types
interface ConnectedContainer {
  id: string
  name: string
  ipAddress: string
  macAddress: string
}

interface DockerNetwork {
  id: string
  name: string
  driver: 'bridge' | 'overlay' | 'host' | 'none' | 'macvlan'
  scope: 'local' | 'swarm' | 'global'
  attachable: boolean
  internal: boolean
  ipam: {
    subnet: string
    gateway: string
  }
  containers: ConnectedContainer[]
  created: string
  labels: Record<string, string>
}

// Sample network data
const networksData: DockerNetwork[] = [
  {
    id: 'net_abc123def456',
    name: 'bridge',
    driver: 'bridge',
    scope: 'local',
    attachable: false,
    internal: false,
    ipam: {
      subnet: '172.17.0.0/16',
      gateway: '172.17.0.1',
    },
    containers: [
      { id: 'cnt_1', name: 'nginx-proxy', ipAddress: '172.17.0.2', macAddress: '02:42:ac:11:00:02' },
      { id: 'cnt_2', name: 'redis-cache', ipAddress: '172.17.0.3', macAddress: '02:42:ac:11:00:03' },
    ],
    created: '2024-01-10T08:00:00Z',
    labels: {},
  },
  {
    id: 'net_xyz789ghi012',
    name: 'app-network',
    driver: 'bridge',
    scope: 'local',
    attachable: true,
    internal: false,
    ipam: {
      subnet: '172.18.0.0/16',
      gateway: '172.18.0.1',
    },
    containers: [
      { id: 'cnt_3', name: 'app-backend', ipAddress: '172.18.0.2', macAddress: '02:42:ac:12:00:02' },
      { id: 'cnt_4', name: 'postgres-db', ipAddress: '172.18.0.3', macAddress: '02:42:ac:12:00:03' },
      { id: 'cnt_5', name: 'rabbitmq-broker', ipAddress: '172.18.0.4', macAddress: '02:42:ac:12:00:04' },
    ],
    created: '2024-01-12T10:30:00Z',
    labels: { 'com.docker.compose.project': 'myapp' },
  },
  {
    id: 'net_mno345pqr678',
    name: 'monitoring-net',
    driver: 'bridge',
    scope: 'local',
    attachable: true,
    internal: false,
    ipam: {
      subnet: '172.19.0.0/16',
      gateway: '172.19.0.1',
    },
    containers: [
      { id: 'cnt_6', name: 'prometheus', ipAddress: '172.19.0.2', macAddress: '02:42:ac:13:00:02' },
      { id: 'cnt_7', name: 'grafana', ipAddress: '172.19.0.3', macAddress: '02:42:ac:13:00:03' },
    ],
    created: '2024-01-14T14:15:00Z',
    labels: { 'purpose': 'monitoring' },
  },
  {
    id: 'net_stu901vwx234',
    name: 'host',
    driver: 'host',
    scope: 'local',
    attachable: false,
    internal: false,
    ipam: {
      subnet: '-',
      gateway: '-',
    },
    containers: [],
    created: '2024-01-01T00:00:00Z',
    labels: {},
  },
  {
    id: 'net_yza567bcd890',
    name: 'none',
    driver: 'none',
    scope: 'local',
    attachable: false,
    internal: false,
    ipam: {
      subnet: '-',
      gateway: '-',
    },
    containers: [],
    created: '2024-01-01T00:00:00Z',
    labels: {},
  },
  {
    id: 'net_efg123hij456',
    name: 'internal-services',
    driver: 'bridge',
    scope: 'local',
    attachable: true,
    internal: true,
    ipam: {
      subnet: '172.20.0.0/16',
      gateway: '172.20.0.1',
    },
    containers: [
      { id: 'cnt_8', name: 'elasticsearch', ipAddress: '172.20.0.2', macAddress: '02:42:ac:14:00:02' },
    ],
    created: '2024-01-16T09:45:00Z',
    labels: { 'access': 'internal-only' },
  },
  {
    id: 'net_klm789nop012',
    name: 'swarm-overlay',
    driver: 'overlay',
    scope: 'swarm',
    attachable: true,
    internal: false,
    ipam: {
      subnet: '10.0.0.0/24',
      gateway: '10.0.0.1',
    },
    containers: [],
    created: '2024-01-18T11:20:00Z',
    labels: { 'com.docker.swarm.service': 'web' },
  },
]

// Available containers for connect dialog
const availableContainers = [
  { id: 'cnt_9', name: 'nginx-proxy' },
  { id: 'cnt_10', name: 'postgres-db' },
  { id: 'cnt_11', name: 'redis-cache' },
  { id: 'cnt_12', name: 'app-backend' },
  { id: 'cnt_13', name: 'monitoring-grafana' },
]

function DriverBadge({ driver }: { driver: DockerNetwork['driver'] }) {
  const config: Record<string, { className: string; icon: React.ReactNode }> = {
    bridge: {
      className: 'bg-primary/10 text-primary border-primary/20',
      icon: <Layers className="h-3 w-3" />,
    },
    overlay: {
      className: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      icon: <Globe className="h-3 w-3" />,
    },
    host: {
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      icon: <Server className="h-3 w-3" />,
    },
    none: {
      className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
      icon: <X className="h-3 w-3" />,
    },
    macvlan: {
      className: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400 border-teal-200 dark:border-teal-800',
      icon: <Network className="h-3 w-3" />,
    },
  }

  const { className, icon } = config[driver] || config.bridge

  return (
    <Badge variant="outline" className={`gap-1 font-medium ${className}`}>
      {icon}
      {driver}
    </Badge>
  )
}

function ScopeBadge({ scope }: { scope: DockerNetwork['scope'] }) {
  const config: Record<string, string> = {
    local: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    swarm: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    global: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  }

  return (
    <Badge variant="outline" className={`font-medium capitalize ${config[scope]}`}>
      {scope}
    </Badge>
  )
}

function ContainerCount({ count }: { count: number }) {
  if (count === 0) {
    return <span className="text-muted-foreground">No containers</span>
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center justify-center rounded bg-primary/10 px-2 py-0.5">
        <Box className="mr-1 h-3 w-3 text-primary" />
        <span className="text-sm font-medium text-primary">{count}</span>
      </div>
      <span className="text-xs text-muted-foreground">
        container{count !== 1 ? 's' : ''}
      </span>
    </div>
  )
}

function NetworkInspectSheet({
  network,
  open,
  onOpenChange,
}: {
  network: DockerNetwork | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!network) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            {network.name}
          </SheetTitle>
          <SheetDescription>
            Network details and connected containers
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-6 py-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Network Information</h4>
              <div className="grid gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ID</span>
                  <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                    {network.id.slice(0, 12)}
                  </code>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Driver</span>
                  <DriverBadge driver={network.driver} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Scope</span>
                  <ScopeBadge scope={network.scope} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Attachable</span>
                  <Badge variant={network.attachable ? 'default' : 'secondary'} className="text-xs">
                    {network.attachable ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Internal</span>
                  <Badge variant={network.internal ? 'default' : 'secondary'} className="text-xs">
                    {network.internal ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* IPAM Configuration */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">IPAM Configuration</h4>
              <div className="grid gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subnet</span>
                  <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                    {network.ipam.subnet}
                  </code>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gateway</span>
                  <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                    {network.ipam.gateway}
                  </code>
                </div>
              </div>
            </div>

            <Separator />

            {/* Connected Containers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">
                  Connected Containers ({network.containers.length})
                </h4>
              </div>
              {network.containers.length > 0 ? (
                <div className="space-y-2">
                  {network.containers.map((container) => (
                    <Card key={container.id} className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Box className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{container.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Unlink2 className="mr-1 h-3 w-3" />
                          Disconnect
                        </Button>
                      </div>
                      <div className="mt-2 grid gap-1 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>IP Address</span>
                          <code className="font-mono">{container.ipAddress}</code>
                        </div>
                        <div className="flex justify-between">
                          <span>MAC Address</span>
                          <code className="font-mono">{container.macAddress}</code>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <Box className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No containers connected to this network
                  </p>
                </div>
              )}
            </div>

            {/* Labels */}
            {Object.keys(network.labels).length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground">Labels</h4>
                  <div className="space-y-2">
                    {Object.entries(network.labels).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <code className="text-xs text-muted-foreground">{key}</code>
                        <code className="rounded bg-muted px-2 py-0.5 text-xs">{value}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

function ConnectContainerDialog({ network }: { network: DockerNetwork }) {
  const [open, setOpen] = React.useState(false)
  const [selectedContainer, setSelectedContainer] = React.useState('')

  const handleConnect = () => {
    // Here you would handle the container connection
    setOpen(false)
    setSelectedContainer('')
  }

  // Filter out already connected containers
  const connectableContainers = availableContainers.filter(
    (c) => !network.containers.some((nc) => nc.name === c.name)
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Link2 className="mr-2 h-4 w-4" />
          Connect Container
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Connect Container
          </DialogTitle>
          <DialogDescription>
            Connect a container to the <span className="font-semibold">{network.name}</span> network.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="container">Select Container</Label>
            <Select value={selectedContainer} onValueChange={setSelectedContainer}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a container..." />
              </SelectTrigger>
              <SelectContent>
                {connectableContainers.length > 0 ? (
                  connectableContainers.map((container) => (
                    <SelectItem key={container.id} value={container.id}>
                      <div className="flex items-center gap-2">
                        <Box className="h-4 w-4" />
                        {container.name}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    All containers are already connected
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConnect}
            disabled={!selectedContainer}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CreateNetworkDialog() {
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    driver: 'bridge',
    attachable: true,
    internal: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle the network creation
    setOpen(false)
    setFormData({ name: '', driver: 'bridge', attachable: true, internal: false })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Create Network</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Create New Network
          </DialogTitle>
          <DialogDescription>
            Configure and create a new Docker network for container communication.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Network Name <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              placeholder="e.g., my-app-network"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Unique name for the network (alphanumeric and hyphens only)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="driver">Driver</Label>
            <Select
              value={formData.driver}
              onValueChange={(value) => setFormData({ ...formData, driver: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bridge">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    bridge
                  </div>
                </SelectItem>
                <SelectItem value="overlay">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    overlay
                  </div>
                </SelectItem>
                <SelectItem value="host">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    host
                  </div>
                </SelectItem>
                <SelectItem value="none">
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    none
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Network driver to use (bridge is recommended for most cases)
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="attachable"
                checked={formData.attachable}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, attachable: checked === true })
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="attachable" className="font-normal cursor-pointer">
                  Attachable
                </Label>
                <p className="text-xs text-muted-foreground">
                  Allow manual container attachment to this network
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="internal"
                checked={formData.internal}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, internal: checked === true })
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="internal" className="font-normal cursor-pointer">
                  Internal Only
                </Label>
                <p className="text-xs text-muted-foreground">
                  Restrict external access to this network
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Create Network
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function NetworkActions({
  network,
  onInspect,
}: {
  network: DockerNetwork
  onInspect: () => void
}) {
  const isSystemNetwork = ['bridge', 'host', 'none'].includes(network.name)

  return (
    <div className="flex items-center justify-end gap-1">
      {/* Quick actions for desktop */}
      <div className="hidden lg:flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary hover:bg-primary/10"
          onClick={onInspect}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">Inspect</span>
        </Button>
      </div>

      {/* Dropdown for all actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onInspect}>
            <Eye className="mr-2 h-4 w-4" />
            Inspect
          </DropdownMenuItem>
          {network.attachable && <ConnectContainerDialog network={network} />}
          {!isSystemNetwork && (
            <>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={(e) => e.preventDefault()}
                    disabled={network.containers.length > 0}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Network</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete <span className="font-semibold">{network.name}</span>?
                      This action cannot be undone.
                      {network.containers.length > 0 && (
                        <span className="block mt-2 text-amber-600 dark:text-amber-400">
                          Warning: Disconnect all containers before deleting.
                        </span>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete Network
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function NetworksPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [inspectNetwork, setInspectNetwork] = React.useState<DockerNetwork | null>(null)
  const [inspectOpen, setInspectOpen] = React.useState(false)

  // Filter networks based on search
  const filteredNetworks = React.useMemo(() => {
    return networksData.filter((network) => {
      return (
        network.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        network.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
        network.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [searchQuery])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleInspect = (network: DockerNetwork) => {
    setInspectNetwork(network)
    setInspectOpen(true)
  }

  // Stats
  const bridgeCount = networksData.filter((n) => n.driver === 'bridge').length
  const overlayCount = networksData.filter((n) => n.driver === 'overlay').length
  const customCount = networksData.filter((n) => !['bridge', 'host', 'none'].includes(n.name)).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Networks
          </h1>
          <p className="text-muted-foreground">
            Manage Docker networks and container connectivity
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
          <CreateNetworkDialog />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Bridge</p>
                <p className="text-2xl font-bold text-primary">{bridgeCount}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <Layers className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Overlay</p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">{overlayCount}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Custom</p>
                <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">{customCount}</p>
              </div>
              <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900">
                <Network className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search networks by name, driver, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9"
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
        </CardContent>
      </Card>

      {/* Networks Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Network className="h-5 w-5 text-primary" />
            All Networks
          </CardTitle>
          <CardDescription>
            {filteredNetworks.length} network{filteredNetworks.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Driver</TableHead>
                  <TableHead className="hidden md:table-cell">Scope</TableHead>
                  <TableHead className="hidden lg:table-cell">Containers</TableHead>
                  <TableHead className="hidden xl:table-cell">Created</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNetworks.length > 0 ? (
                  filteredNetworks.map((network) => (
                    <TableRow key={network.id} className="group">
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {network.name}
                            </span>
                            {network.internal && (
                              <Badge variant="outline" className="text-xs py-0 h-5 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
                                Internal
                              </Badge>
                            )}
                          </div>
                          <code className="text-xs text-muted-foreground font-mono">
                            {network.id.slice(0, 12)}
                          </code>
                          {/* Mobile badges */}
                          <div className="flex flex-wrap gap-1 mt-1 sm:hidden">
                            <DriverBadge driver={network.driver} />
                            <ScopeBadge scope={network.scope} />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <DriverBadge driver={network.driver} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <ScopeBadge scope={network.scope} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <ContainerCount count={network.containers.length} />
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm text-foreground">
                            {new Date(network.created).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(network.created).toLocaleTimeString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <NetworkActions
                          network={network}
                          onInspect={() => handleInspect(network)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Network className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No networks found</p>
                        {searchQuery && (
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => setSearchQuery('')}
                            className="text-primary"
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Inspect Sheet */}
      <NetworkInspectSheet
        network={inspectNetwork}
        open={inspectOpen}
        onOpenChange={setInspectOpen}
      />
    </div>
  )
}
