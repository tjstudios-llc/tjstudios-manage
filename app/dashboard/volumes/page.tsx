'use client'

import * as React from 'react'
import {
  HardDrive,
  Search,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  MoreHorizontal,
  X,
  AlertCircle,
  Box,
  Calendar,
  Database,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

// Types
interface Volume {
  name: string
  driver: string
  mountpoint: string
  size: string
  created: string
  labels: Record<string, string>
  usedBy: { id: string; name: string }[]
}

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

// Table skeleton
function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24 ml-auto" />
        </div>
      ))}
    </div>
  )
}

function VolumeInspectSheet({
  volume,
  open,
  onOpenChange,
}: {
  volume: Volume | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!volume) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            {volume.name}
          </SheetTitle>
          <SheetDescription>
            Volume details and usage information
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="space-y-6 py-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Volume Information</h4>
              <div className="grid gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Driver</span>
                  <Badge variant="outline">{volume.driver}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-medium text-foreground">{volume.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">
                    {new Date(volume.created).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Mountpoint */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Mountpoint</h4>
              <code className="block rounded-lg bg-muted p-3 text-xs font-mono break-all">
                {volume.mountpoint}
              </code>
            </div>

            <Separator />

            {/* Used By */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">
                Used by Containers ({volume.usedBy.length})
              </h4>
              {volume.usedBy.length > 0 ? (
                <div className="space-y-2">
                  {volume.usedBy.map((container) => (
                    <Card key={container.id} className="p-3">
                      <div className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{container.name}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground font-mono">
                        {container.id.slice(0, 12)}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <Box className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No containers are using this volume
                  </p>
                </div>
              )}
            </div>

            {/* Labels */}
            {Object.keys(volume.labels).length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-foreground">Labels</h4>
                  <div className="space-y-2">
                    {Object.entries(volume.labels).map(([key, value]) => (
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

function CreateVolumeDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    driver: 'local',
    labels: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/docker/volumes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     driver: formData.driver,
      //     labels: Object.fromEntries(
      //       formData.labels.split('\n').filter(Boolean).map(l => l.split('='))
      //     ),
      //   }),
      // })
      // if (!response.ok) throw new Error('Failed to create volume')

      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setOpen(false)
      setFormData({ name: '', driver: 'local', labels: '' })
      onSuccess()
    } catch (error) {
      console.error('Failed to create volume:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Create Volume</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            Create New Volume
          </DialogTitle>
          <DialogDescription>
            Create a new Docker volume for persistent data storage.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Volume Name <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              placeholder="e.g., postgres-data, app-uploads"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isCreating}
            />
            <p className="text-xs text-muted-foreground">
              Unique name for the volume (alphanumeric and hyphens only)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="driver">Driver</Label>
            <Input
              id="driver"
              placeholder="local"
              value={formData.driver}
              onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
              disabled={isCreating}
            />
            <p className="text-xs text-muted-foreground">
              Volume driver (default: local)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="labels">Labels</Label>
            <Input
              id="labels"
              placeholder="key=value"
              value={formData.labels}
              onChange={(e) => setFormData({ ...formData, labels: e.target.value })}
              disabled={isCreating}
            />
            <p className="text-xs text-muted-foreground">
              Optional labels (comma-separated key=value pairs)
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Volume'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function VolumesPage() {
  const [volumes, setVolumes] = React.useState<Volume[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [selectedVolume, setSelectedVolume] = React.useState<Volume | null>(null)
  const [inspectOpen, setInspectOpen] = React.useState(false)

  const fetchVolumes = React.useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/docker/volumes')
      // if (!response.ok) throw new Error('Failed to fetch volumes')
      // const data = await response.json()
      // setVolumes(data.volumes)

      await new Promise((resolve) => setTimeout(resolve, 500))
      setVolumes([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  React.useEffect(() => {
    fetchVolumes()
  }, [fetchVolumes])

  const filteredVolumes = React.useMemo(() => {
    return volumes.filter((volume) =>
      volume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volume.driver.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [volumes, searchQuery])

  const handleDeleteVolume = async (volume: Volume) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/docker/volumes/${volume.name}`, {
      //   method: 'DELETE',
      // })
      // if (!response.ok) throw new Error('Failed to delete volume')

      await new Promise((resolve) => setTimeout(resolve, 1000))
      await fetchVolumes(true)
    } catch (error) {
      console.error('Failed to delete volume:', error)
    }
  }

  const handleInspect = (volume: Volume) => {
    setSelectedVolume(volume)
    setInspectOpen(true)
  }

  // Calculate stats
  const totalSize = volumes.reduce((acc, v) => {
    const sizeMatch = v.size.match(/^([\d.]+)/)
    return acc + (sizeMatch ? parseFloat(sizeMatch[1]) : 0)
  }, 0)
  const inUseCount = volumes.filter((v) => v.usedBy.length > 0).length

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Volumes
          </h1>
          <p className="text-muted-foreground">
            Manage persistent storage volumes
          </p>
        </div>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Failed to load volumes
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => fetchVolumes()}
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Volumes
          </h1>
          <p className="text-muted-foreground">
            Manage persistent storage volumes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchVolumes(true)}
            disabled={isRefreshing}
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
          <CreateVolumeDialog onSuccess={() => fetchVolumes(true)} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Volumes</p>
                {loading ? (
                  <Skeleton className="h-8 w-8 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{volumes.length}</p>
                )}
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <HardDrive className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Use</p>
                {loading ? (
                  <Skeleton className="h-8 w-8 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{inUseCount}</p>
                )}
              </div>
              <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900">
                <Box className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                {loading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{totalSize.toFixed(1)} GB</p>
                )}
              </div>
              <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                <Database className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search volumes by name or driver..."
              className="pl-9 pr-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Volumes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            Volume List
          </CardTitle>
          <CardDescription>
            {loading
              ? 'Loading volumes...'
              : `${filteredVolumes.length} volume${filteredVolumes.length !== 1 ? 's' : ''} found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton />
          ) : filteredVolumes.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead className="hidden sm:table-cell">Size</TableHead>
                    <TableHead className="hidden md:table-cell">Used By</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVolumes.map((volume) => (
                    <TableRow key={volume.name}>
                      <TableCell>
                        <span className="font-medium text-foreground">{volume.name}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{volume.driver}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {volume.size}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {volume.usedBy.length > 0 ? (
                          <Badge variant="secondary" className="gap-1">
                            <Box className="h-3 w-3" />
                            {volume.usedBy.length} container{volume.usedBy.length !== 1 ? 's' : ''}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Unused</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(volume.created).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleInspect(volume)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Inspect</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => handleInspect(volume)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Inspect
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                    disabled={volume.usedBy.length > 0}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Volume</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete <span className="font-semibold">{volume.name}</span>?
                                      This action cannot be undone. All data stored in this volume will be permanently lost.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => handleDeleteVolume(volume)}
                                    >
                                      Delete Volume
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : volumes.length === 0 ? (
            <EmptyState
              icon={HardDrive}
              title="No volumes found"
              description="Create your first volume to store persistent data for your containers."
            />
          ) : (
            <EmptyState
              icon={Search}
              title="No matching volumes"
              description="Try adjusting your search criteria."
            />
          )}
        </CardContent>
      </Card>

      {/* Inspect Sheet */}
      <VolumeInspectSheet
        volume={selectedVolume}
        open={inspectOpen}
        onOpenChange={setInspectOpen}
      />
    </div>
  )
}
